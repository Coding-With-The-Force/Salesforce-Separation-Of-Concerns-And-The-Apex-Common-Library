/**
 * The Application class, as one file, for chapter 04's annotated walkthrough.
 *
 * Kept as a string rather than a .cls import because Docusaurus has no raw
 * loader configured, and Apex contains no backticks so a template literal is
 * safe. If this ever drifts from src/classes/.../Application.cls, that file
 * is the one that's right.
 */
export const APPLICATION_CLS = `public with sharing class Application
{
    // The Unit of Work factory. The list below is the DEPENDENCY ORDER:
    //   Accounts insert before Contacts, Contacts before Cases.
    public static final fflib_Application.UnitOfWorkFactory UOW =
        new fflib_Application.UnitOfWorkFactory(
            new List<SObjectType>{
                Account.SObjectType,
                Contact.SObjectType,
                Case.SObjectType,
                Task.SObjectType
            }
        );

    // The Service factory. Maps an interface to its implementation,
    //   which is the seam Apex Mocks needs to substitute a stub.
    public static final fflib_Application.ServiceFactory service =
        new fflib_Application.ServiceFactory(
            new Map<Type, Type>{
                Task_Service_Interface.class => Task_Service_Impl.class
            }
        );

    // The Selector factory. Maps an SObjectType to the selector that
    //   queries it, so other factories can requery records by id.
    public static final fflib_Application.SelectorFactory selector =
        new fflib_Application.SelectorFactory(
            new Map<SObjectType, Type>{
                Account.SObjectType => AccountsSelector.class,
                Case.SObjectType    => CasesSelector.class
            }
        );

    // The Domain factory. It takes the SELECTOR factory, because
    //   newInstance(Set<Id>) must query the records before it can
    //   decide which domain class to construct.
    public static final fflib_Application.DomainFactory domain =
        new fflib_Application.DomainFactory(
            Application.selector,
            new Map<SObjectType, Type>{
                Account.SObjectType => Accounts.Constructor.class,
                Case.SObjectType    => Cases.Constructor.class
            }
        );
}`;
