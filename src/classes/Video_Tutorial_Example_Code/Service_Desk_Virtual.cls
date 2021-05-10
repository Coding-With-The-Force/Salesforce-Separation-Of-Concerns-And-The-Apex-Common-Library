/**
 * Created by gerry on 4/22/2021.
 */

public with sharing virtual class Service_Desk_Virtual
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