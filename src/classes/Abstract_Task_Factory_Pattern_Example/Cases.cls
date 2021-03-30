 /**
 * Created by gerry on 3/21/2021.
 */

public inherited sharing class Cases extends fflib_SObjectDomain implements Task_Creator_Interface
{
	//This sets up the super class (fflib_SObjectDomain) to have the records variable filled out
	public Cases(List<Case> caseRecords){
		super(caseRecords);
		Cases.getTriggerEvent(Cases.class).disableBeforeInsert();
	}

	//This helps allow for the fflib_SObjectDomain class to run its triggerHandler method
	//using the correct Domain class. This must be implemented in all domain classes.
	public class Constructor implements fflib_SObjectDomain.IConstructable{
		public fflib_SObjectDomain construct(List<SObject> sObjectList){
			return new Cases(sObjectList);
		}
	}

	//This method is called on a beforeInsert transaction to set defaults on a record
	public override void onApplyDefaults(){
		//The records variable comes from the super class
		for(Case newCase: (List<Case>) records){
			if(newCase.Status == 'New'){
				newCase.Status = 'Open';
			}
		}
	}

	//This method is called on an afterInsert transaction to make sure all validations are being checked
	//before the record is officially committed to the database.
	public override void onValidate()
	{
		for(Case newCase : (List<Case>) records)
		{
			if(newCase.ContactId == null)
			{
				throw new Cases_Exception();
			}
		}
	}

	public fflib_ISObjectUnitOfWork createTasks(List<SObject> recordsToCreateTasksFor, fflib_ISObjectUnitOfWork unitOfWork)
	{
		List<Case> caseList = (List<Case>) recordsToCreateTasksFor;
		List<Task> taskList = new List<Task>();
		for(Case cs: caseList){
			Task tsk = new Task();
			tsk.Status = 'New';
			tsk.Subject = cs.Origin + cs.Subject;
			tsk.WhoId = cs.ContactId;
			tsk.ActivityDate = Date.today();
			taskList.add(tsk);
		}
		unitOfWork.registerNew(taskList);
		return unitOfWork;
	}
}