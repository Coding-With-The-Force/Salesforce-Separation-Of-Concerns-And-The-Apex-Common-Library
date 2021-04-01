/**
 * @author Matt Gerry
 * @date 03/30/2021
 * @description This task service class is implemented this way for two reasons, potential abstraction and for unit
 * test mocking. Basically for every method in your service class (in this case Task_Service_Impl) you
 * should have an equivalent method in here that calls that method in your true service class implementation.
 */

global with sharing class Task_Service
{
	//This literally just calls the Task_Service_Impl class's createTasks method
	global static void createTasks(Set<Id> recordIds, Schema.SObjectType objectType){
		service().createTasks(recordIds, objectType);
	}

	//This gets an instance of the Task_Service_Impl class from our Application class
	private static Task_Service_Interface service(){
		return (Task_Service_Interface) Application.service.newInstance(Task_Service_Interface.class);
	}
}