/**
 * @author Matt Gerry
 * @date 03/30/2021
 * @description This is the true implementation of your business logic for your service layer. These impl classes
 * are where all the magic happens. In this case this is a service class that executes the business logic for Abstract
 * Task creation on any theoretical object.
 */

public with sharing class Task_Service_Impl implements Task_Service_Interface
{
	//This method creates tasks and MUST BE IMPLEMENTED since we are implementing the Task_Service_Interface
	public void createTasks(Set<Id> recordIds, Schema.SObjectType objectType)
	{
		//Getting a new instance of a domain class based purely on the ids of our records, if these were case
		//ids it would return a Case object domain class, if they were contacts it would return a contact
		//object domain class
		fflib_ISObjectDomain objectDomain = Application.domain.newInstance(recordIds);

		//Getting a new instance of our selector class based purely on the object type passed. If we passed in a case
		//object type we would get a case selector, a contact object type a contact selector, etc.
		fflib_ISObjectSelector objectSelector = Application.selector.newInstance(objectType);

		//We're creating a new unit of work instance from our Application class.
		fflib_ISObjectUnitOfWork unitOfWork = Application.UOW.newInstance();

		//List to hold our records that need tasks created for them
		List<SObject> objectsThatNeedTasks = new List<SObject>();

		//If our selector class is an instance of Task_Selector_Interface (if it implement the Task_Selector_Interface
		//interface) call the selectRecordsForTasks() method in the class. Otherwise just call the selectSObjectsById method
		if(objectSelector instanceof  Task_Selector_Interface){
			System.debug('Selector an instance of tsi');
			Task_Selector_Interface taskFieldSelector = (Task_Selector_Interface)objectSelector;
			objectsThatNeedTasks = taskFieldSelector.selectRecordsForTasks();
		}
		else{
			System.debug('Selector not an instance of tsi');
			objectsThatNeedTasks = objectSelector.selectSObjectsById(recordIds);
		}

		//If our domain class is an instance of the Task_Creator_Interface (or implements the Task_Creator_Interface class)
		//call the createTasks method
		if(objectDomain instanceof Task_Creator_Interface){
			System.debug('Domain an instance of tci');
			Task_Creator_Interface taskCreator = (Task_Creator_Interface)objectDomain;
			taskCreator.createTasks(objectsThatNeedTasks, unitOfWork);
		}

		//Try commiting the records we've created and/or updated in our unit of work (we're basically doing all our DML at
		//once here), else throw an exception.
		try{
			unitOfWork.commitWork();
		}
		catch(Exception e){
			throw e;
		}
	}
}