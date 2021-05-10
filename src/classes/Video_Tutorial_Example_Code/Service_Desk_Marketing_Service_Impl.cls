/**
 * Created by gerry on 4/21/2021.
 */

public with sharing class Service_Desk_Marketing_Service_Impl implements Service_Desk_Interface
{
	public List<Case> startEntitlementProcess(Case cs){
		System.debug('I called the marketing start entitlement process ::: ' + cs.RecordTypeId);
		return new List<Case>();
	}
	public List<Case> stopEntitlementProcess(Case cs){

		System.debug('I called the marketing stop entitlement process ::: ' + cs.RecordTypeId);
		return new List<Case>();
	}
}