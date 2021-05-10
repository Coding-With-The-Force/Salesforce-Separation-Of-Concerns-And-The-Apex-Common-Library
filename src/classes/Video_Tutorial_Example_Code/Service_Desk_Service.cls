/**
 * Created by gerry on 4/21/2021.
 */

public with sharing class Service_Desk_Service
{
	public static List<Case> startEntitlementProcess(List<Case> cases){
		List<Case> caseList = new List<Case>();

		for(Case cs: cases){
			String recordType = Schema.SObjectType.Case.getRecordTypeInfosById().get(cs.RecordTypeId).getName();
			caseList.addAll(service(recordType).startEntitlementProcess(cs));
		}
		return caseList;
	}

	public static List<Case> stopEntitlementProcess(List<Case> cases){
		List<Case> caseList = new List<Case>();
		for(Case cs: cases){
			String recordType = Schema.SObjectType.Case.getRecordTypeInfosById().get(cs.RecordTypeId).getName();
			caseList.addAll(service(recordType).stopEntitlementProcess(cs));
		}
		return caseList;
	}

	private static Service_Desk_Interface service(String recordType){
		return (Service_Desk_Interface) Service_Desk_Application.service.newInstanceByRecordType(recordType);
	}
}