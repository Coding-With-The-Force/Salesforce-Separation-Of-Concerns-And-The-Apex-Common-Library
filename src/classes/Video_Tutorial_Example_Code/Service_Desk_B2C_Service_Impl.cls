/**
 * Created by gerry on 4/21/2021.
 */

public with sharing class Service_Desk_B2C_Service_Impl implements Service_Desk_Interface
{
	public List<Case> startEntitlementProcess(Case cs){
		System.debug('I called the B2C start entitlement process ::: ' + cs.RecordTypeId);
		return new List<Case>();
	}
	public List<Case> stopEntitlementProcess(Case cs){
		System.debug('I called the B2C stop entitlement process ::: ' + cs.RecordTypeId);
		return new List<Case>();
	}
}