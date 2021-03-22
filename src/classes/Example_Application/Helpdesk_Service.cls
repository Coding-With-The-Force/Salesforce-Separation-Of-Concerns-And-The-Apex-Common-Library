/**
 * Created by gerry on 3/16/2021.
 */

global with sharing class Helpdesk_Service
{
	global static void createTasksForCaseRecords(Set<Id> caseIds){
		service().createTasksForCaseRecords(caseIds);
	}

	private static Helpdesk_Service_Interface service(){
		return (Helpdesk_Service_Interface) Helpdesk_Application.helpDeskService.newInstance(Helpdesk_Service_Interface.class);
	}
}