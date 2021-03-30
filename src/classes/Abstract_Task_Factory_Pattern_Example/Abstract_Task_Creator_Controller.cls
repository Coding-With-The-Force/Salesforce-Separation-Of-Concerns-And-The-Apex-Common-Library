/**
 * Created by gerry on 3/29/2021.
 */

public with sharing class Abstract_Task_Creator_Controller
{
	@AuraEnabled
	public static List<Task> createTasks(Id recordId){
		Set<Id> recordIds = new Set<Id>{recordId};
		Schema.SObjectType objectType = recordId.getSobjectType();
		try{
			Task_Service.createTasks(recordIds, objectType);
			Task_Selector taskSelector = (Task_Selector)Application.selector.newInstance(Task.SObjectType);
			return taskSelector.selectTodaysTasks();
		}
		catch(Exception e){
			throw new AuraHandledException(e.getMessage());
		}
	}
}