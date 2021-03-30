/**
 * Created by gerry on 3/29/2021.
 */

public with sharing class Task_Service_Impl implements Task_Service_Interface
{
	public void createTasks(Set<Id> recordIds, Schema.SObjectType objectType)
	{
		fflib_ISObjectDomain objectDomain = Application.domain.newInstance(recordIds);
		fflib_ISObjectSelector objectSelector = Application.selector.newInstance(objectType);
		fflib_ISObjectUnitOfWork unitOfWork = Application.UOW.newInstance();
		List<SObject> objectsThatNeedTasks = new List<SObject>();

		if(objectSelector instanceof  Task_Selector_Interface){
			Task_Selector_Interface taskFieldSelector = (Task_Selector_Interface)objectSelector;
			objectsThatNeedTasks = taskFieldSelector.selectRecordsForTasks();
		}
		else{
			objectsThatNeedTasks = objectSelector.selectSObjectsById(recordIds);
		}

		if(objectDomain instanceof Task_Creator_Interface){
			Task_Creator_Interface taskCreator = (Task_Creator_Interface)objectDomain;
			taskCreator.createTasks(objectsThatNeedTasks, unitOfWork);
		}

		try{
			unitOfWork.commitWork();
		}
		catch(Exception e){
			throw e;
		}
	}
}