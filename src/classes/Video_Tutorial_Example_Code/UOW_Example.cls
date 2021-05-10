/**
 * Created by gerry on 4/19/2021.
 */

public with sharing class UOW_Example
{
	public void objectCreator(){
		fflib_ISObjectUnitOfWork unitOfWork =  Application.UOW.newInstance();
		List<Contact> newContacts  = new List<Contact>{new Contact(LastName='Tacoz', FirstName='Chocolate')};
		unitOfWork.registerNew(newContacts);
		List<Case> newCases = new List<Case>{new Case(Subject = 'Hi', Status = 'New')};
		unitOfWork.registerNew(newCases);
		unitOfWork.registerRelationship(newCases[0], Case.ContactId, newContacts[0]);
		try{
			unitOfWork.commitWork();
			System.debug('This is the new case ::: ' + newCases[0].Id);
		}
		catch(Exception e){
			throw e;
		}
	}
}