/**
 * Created by gerry on 4/19/2021.
 */

public with sharing class No_UOW_Class
{
	public void insertCases(List<Case> casesToInsert){
		try{
			insert casesToInsert;
		}
		catch(Exception e){
			//log an error
			throw e;
		}
	}

	public void updateCases(List<Case> casesToUpdate){
		//created Contacts for these cases
		database.insert(contactsForCases);
		database.update(casesToUpdate, false);

	}
}