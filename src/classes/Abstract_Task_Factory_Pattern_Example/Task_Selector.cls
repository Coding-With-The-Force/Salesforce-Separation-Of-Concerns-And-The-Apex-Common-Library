/**
 * Created by gerry on 3/29/2021.
 */

public with sharing class Task_Selector extends fflib_SObjectSelector
{
	public Task_Selector(){
		super(false, true, true, false);
	}

	public List<Schema.SObjectField> getSObjectFieldList(){
		return new List<Schema.SObjectField>{
				Task.Id,
				Task.Subject,
				Task.WhatId,
				Task.WhoId
		};
	}

	public Schema.SObjectType getSObjectType(){
		return Task.SObjectType;
	}

	public List<Task> selectById(Set<Id> taskIds){
		return (List<Task>) selectSObjectsById(taskIds);
	}

	public List<Task> selectTodaysTasks(){
		Date todaysDate = Date.today();
		return (List<SObject>) Database.query(
				newQueryFactory().
						setCondition('ActivityDate = :todaysDate').
						toSOQL()
		);
	}
}