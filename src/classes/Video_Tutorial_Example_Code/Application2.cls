/**
 * Created by gerry on 4/19/2021.
 */

public with sharing class Application2
{
	public static final fflib_Application.UnitOfWorkFactory uow = new fflib_Application.UnitOfWorkFactory(new List<SObjectType>{
			Account.SObjectType,
			Contact.SObjectType,
			Case.SObjectType,
			Task.SObjectType,
			Opportunity.SObjectType
	});

	public static final fflib_Application.ServiceFactory service = new fflib_Application.ServiceFactory(new Map<Type, Type>{
			Task_Service_Interface.class => Task_Service_Impl.class
	});

	public static final fflib_Application.SelectorFactory selector = new fflib_Application.SelectorFactory(new Map<SObjectType, Type>{
			Case.SObjectType => Case_Selector.class,
			Contact.SObjectType =>Contact_Selector.class
	});

	public static final fflib_Application.DomainFactory domain = new fflib_Application.DomainFactory(Application2.selector, new Map<SObjectType, Type>{
			Case.SObjectType => Cases.Constructor.class,
			Contact.SObjectType => Contacts.Constructor.class
	});
}