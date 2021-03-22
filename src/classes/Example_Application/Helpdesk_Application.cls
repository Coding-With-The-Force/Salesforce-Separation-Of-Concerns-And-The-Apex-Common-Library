/**
 * Created by gerry on 3/16/2021.
 */

public with sharing class Helpdesk_Application
{
	public static final fflib_Application.UnitOfWorkFactory helpDeskUOW =
			new fflib_Application.UnitOfWorkFactory(
					new List<SObjectType>{
						Case.SObjectType,
						Contact.SObjectType,
						Account.SObjectType,
						Task.SObjectType}
			);

	public static final fflib_Application.ServiceFactory helpDeskService =
			new fflib_Application.ServiceFactory(
					new Map<Type, Type>{
					Helpdesk_Service_Interface.class => Helpdesk_Service_Impl.class}
			);

	public static final fflib_Application.SelectorFactory helpDeskSelector =
			new fflib_Application.SelectorFactory(
					new Map<SObjectType, Type>{
							Case.SObjectType => Case_Selector.class}
			);

	public static final fflib_Application.DomainFactory helpDeskDomain =
			new fflib_Application.DomainFactory(
					Helpdesk_Application.helpDeskSelector,
					new Map<SObjectType, Type>{Case.SObjectType => Cases.Constructor.class}
			);

}