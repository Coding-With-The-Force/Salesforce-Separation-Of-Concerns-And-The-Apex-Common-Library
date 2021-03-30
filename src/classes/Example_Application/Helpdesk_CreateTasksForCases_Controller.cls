/**
 * Created by gerry on 3/16/2021.
 */

public with sharing class Helpdesk_CreateTasksForCases_Controller
{
	@AuraEnabled
	public static void createTasksForCaseRecords(){
		fflib_ISObjectSelector selector = Helpdesk_Application.helpDeskSelector.newInstance(Case.SObjectType);
		Case_Selector caseSelector = (Case_Selector)Case_Selector.newInstance();
		caseSelector.enforceFLS();
		List<Case> newCases = caseSelector.selectNewCases();
		Set<Id> caseIds = new Set<Id>();
		for(Case cs: newCases){
			caseIds.add(cs.Id);
		}
		try{
			Helpdesk_Service.createTasksForCaseRecords(caseIds);
		}
		catch(Exception e){
			throw new AuraHandledException('The code failed due to the following ' + e.getMessage());
		}
	}
}