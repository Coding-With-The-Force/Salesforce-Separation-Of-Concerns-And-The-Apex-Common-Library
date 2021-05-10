/**
 * Created by gerry on 4/21/2021.
 */

public with sharing class Service_Desk_B2B_Service_Impl implements Service_Desk_Interface
{
	public List<Case> startEntitlementProcess(Case cs){
		System.debug('I called the B2B start entitlement process ::: ' + cs.RecordTypeId);
		return new List<Case>();
	}
	public List<Case> stopEntitlementProcess(Case cs){
		System.debug('I called the B2B stop entitlement process ::: ' + cs.RecordTypeId);
		return new List<Case>();
	}
}