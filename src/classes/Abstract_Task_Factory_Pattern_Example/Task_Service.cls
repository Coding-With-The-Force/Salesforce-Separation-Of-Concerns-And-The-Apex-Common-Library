/**
 * Created by gerry on 3/29/2021.
 */

global with sharing class Task_Service
{
	global static void createTasks(Set<Id> recordIds, Schema.SObjectType objectType){
		service().createTasks(recordIds, objectType);
	}

	private static Task_Service_Interface service(){
		return (Task_Service_Interface) Application.service.newInstance(Task_Service_Interface.class);
	}
}