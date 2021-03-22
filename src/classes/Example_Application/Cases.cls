/**
 * Created by gerry on 3/21/2021.
 */

public inherited sharing class Cases extends fflib_SObjectDomain implements Cases_Interface
{
	public static Cases_Interface newInstance(List<Case> recordList)
	{
		return (Cases_Interface) Helpdesk_Application.helpDeskDomain.newInstance(recordList);
	}

	public static Cases_Interface newInstance(Set<Id> recordIdSet)
	{
		return (Cases_Interface) Helpdesk_Application.helpDeskDomain.newInstance(recordIdSet);
	}

	//This sets up the super class (fflib_SObjectDomain) to have the records variable filled out
	public Cases(List<Case> cases){
		super(cases);
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
	public override void onValidate(){
		for(Case newCase: (List<Case>) records){
			if(newCase.ContactId == null){
				newCase.addError('All cases must have contacts associated with them');
			}
		}
	}

	//This helps allow for the fflib_SObjectDomain class to run its triggerHandler method
	//using the correct Domain class. This must be implemented in all domain classes.
	public class Constructor implements fflib_SObjectDomain.IConstructable{
		public fflib_SObjectDomain construct(List<SObject> sObjectList){
			return new Cases(sObjectList);
		}
	}
}