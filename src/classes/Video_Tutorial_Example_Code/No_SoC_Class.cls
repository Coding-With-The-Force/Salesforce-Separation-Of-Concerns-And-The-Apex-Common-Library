/**
 * Created by gerry on 4/18/2021.
 */

public with sharing class No_SoC_Class
{
	public List<Account> updateAccounts(Set<Id> objectIds){
		//Because of our dependency injection in the private constructor above we can mock the results of these class calls.
		List<Account> objList = [SELECT Id, Name FROM Account WHERE Id IN: objectIds];
		if(!objList.isEmpty()){
			for(Account acct: objList){
				acct.Type = 'Prospect';
			}

			update objList;
			return objList;
		}
		else{
			throw new DmlException();
		}
	}
}