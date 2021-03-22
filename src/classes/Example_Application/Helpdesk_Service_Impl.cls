/**
 * Created by gerry on 3/16/2021.
 */

public with sharing class Helpdesk_Service_Impl implements Helpdesk_Service_Interface
{
	public void createTasksForCaseRecords(Set<Id> caseIds){
		fflib_ISObjectUnitOfWork uow = Helpdesk_Application.helpDeskUOW.newInstance();
		List<Case> newCases = [SELECT Id, ContactId, OwnerId FROM Case WHERE Id IN: caseIds AND Status = 'New'];
		List<Task> newTasks = new List<Task>();

		for(Case newCase: newCases){
			Task newTask = new Task();
			newTask.OwnerId = newCase.OwnerId;
			newTask.Subject = 'Follow up on Case';
			newTask.WhatId = newCase.Id;
			newTask.ActivityDate = Date.today();

			Task newContactTask = new Task();
			newContactTask.OwnerId = newCase.OwnerId;
			newContactTask.Subject = 'Fill out Contact info';
			newContactTask.WhoId = newCase.ContactId;
			newContactTask.ActivityDate = Date.today();

			newTasks.add(newTask);
			newTasks.add(newContactTask);
		}

		uow.registerNew(newTasks);
		uow.commitWork();
	}
}