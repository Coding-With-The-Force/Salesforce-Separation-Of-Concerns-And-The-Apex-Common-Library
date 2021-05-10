/**
 * Created by gerry on 4/18/2021.
 */

@IsTest
public with sharing class No_SoC_Class_Test
{
	@TestSetup
	private static void setupData(){
		Account newAccount = new Account(Name = 'Kewl');
		insert newAccount;
	}

	@IsTest
	private static void updateCases_CaseListResults_IntegrationTest(){
		Set<Id> accountIds = new Map<Id, SObject>([SELECT Id FROM Account]).keySet();
		List<Account> updatedAccounts = new No_SoC_Class().updateAccounts(accountIds);
		System.assertEquals('Prospect', updatedAccounts[0].Type, 'Account Type not updated');
	}
}