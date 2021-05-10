/**
 * Created by gerry on 4/19/2021.
 */

public with sharing class Task_Service_No_Factory
{
	public void taskCreator(Schema.SObjectType objectType){
		if(objectType == Case.SObjectType){
			new Cases.createTasks();
		}
		else if(objectType == Contact.SObjectType){
			new Contacts.createTasks();
		}
		else if(objectType == Account.SObjectType){
			new Accounts.createTasks();
		}
		else if(objectType == Account.SObjectType){
			new Accounts.createTasks();
		}
	}
}