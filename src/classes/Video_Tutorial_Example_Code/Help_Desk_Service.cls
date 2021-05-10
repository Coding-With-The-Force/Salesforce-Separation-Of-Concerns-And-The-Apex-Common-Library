/**
 * Created by gerry on 4/21/2021.
 */

public with sharing class Help_Desk_Service
{
	public static List<Case> stopMilestones(List<Case> caseRecords){
		List<Case> caseList = new List<Case>();
		for(Case cs: caseRecords){
			String recordType = Schema.SObjectType.Case.getRecordTypeInfosById().get(cs.RecordTypeId).getName();
			caseList.addAll(service(recordType).stopMilestones());
		}
		return caseList;
	}

	public static List<Case> setupMilestones(List<Case> caseRecords){
		List<Case> caseList = new List<Case>();
		for(Case cs: caseRecords){
			String recordType = Schema.SObjectType.Case.getRecordTypeInfosById().get(cs.RecordTypeId).getName();
			caseList.addAll(service(recordType).setupMilestones());
		}
		return caseList;
	}

	private static Help_Desk_Interface service(String recordType){
		return (Help_Desk_Interface) Application.serviceByRecordType.newInstanceByRecordType(recordType);
	}
}