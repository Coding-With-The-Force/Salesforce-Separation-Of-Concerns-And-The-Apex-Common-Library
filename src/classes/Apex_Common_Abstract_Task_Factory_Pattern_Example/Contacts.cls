/**
 * @author Matt Gerry
 * @date 3/29/2021
 * @description This is the Domain Layer class for the Contact object. It extends the fflib_SObjectDomain so that we can
 * inherit the many useful pre-built functionality in it. It extends the Task_Creator_Interface to force this class into a
 * contract and make it implement the methods in that contract. It helps with abstraction in the Task_Service_Impl class
 */

public inherited sharing class Contacts extends fflib_SObjectDomain implements Task_Creator_Interface
{
	//This sets up the super class (fflib_SObjectDomain) to have the records variable filled out
	public Contacts(List<Contact> contactRecords){
		super(contactRecords);
	}

	//This helps allow for the fflib_SObjectDomain class to run its triggerHandler method
	//using the correct Domain class. This must be implemented in all domain classes.
	public class Constructor implements fflib_SObjectDomain.IConstructable{
		public fflib_SObjectDomain construct(List<SObject> sObjectList){
			return new Contacts(sObjectList);
		}
	}

	//This method MUST BE IMPLEMENTED due to this class implementing the Task_Selector_Interface interface. It creates new tasks
	//and registers them in a new unit of work to be committed to the database at a later time.
	public fflib_ISObjectUnitOfWork createTasks(List<SObject> recordsToCreateTasksFor, fflib_ISObjectUnitOfWork unitOfWork)
	{
		List<Contact> contList = (List<Contact>) recordsToCreateTasksFor;
		List<Task> taskList = new List<Task>();
		for(Contact cont: contList){
			Task tsk = new Task();
			tsk.Status = 'New';
			tsk.Subject = cont.Name;
			tsk.WhoId = cont.Id;
			tsk.ActivityDate = Date.today();
			taskList.add(tsk);
		}
		unitOfWork.registerNew(taskList);
		return unitOfWork;
	}
}