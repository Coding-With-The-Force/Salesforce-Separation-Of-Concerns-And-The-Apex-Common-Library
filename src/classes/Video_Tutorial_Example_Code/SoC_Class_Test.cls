/**
 * Created by gerry on 4/18/2021.
 */
@IsTest
public with sharing class SoC_Class_Test
{
	@IsTest
	private static void updateCases_OppListResults_UnitTest(){
		//Creating a new fake case id using the IdGenerator class. We do this
		//to avoid unnecessary dml insert statements. Note how the same id is used everywhere.
		Id mockAccountId = fflib_IDGenerator.generate(Account.SObjectType);
		//Creating a set of ids that we pass to our methods.
		Set<Id> accountIds = new Set<Id>{mockAccountId};
		//Creating the list of cases we'll return from our selector method
		List<Account> accountList = new List<Account>{new Account(Id = mockAccountId, Name='Pork')};
		List<Account> updatedAccountList = new List<Account>{new Account(Id = mockAccountId, Name='Pork', Type='Prospect')};

		//Creating our mock class representations by using the ApexMocks class's mock method
		//and passing it the appropriate class type.
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		Accounts mockDomain = (Accounts) mocks.mock(Accounts.class);
		Account_Selector mockSelector = (Account_Selector) mocks.mock(Account_Selector.class);

		//After you've setup your mocks above, we need to stub (or setup the expected
		//method calls and what they would return.
		mocks.startStubbing();

		//This is the actual selectByIds method that we call in the
		//createNewOpportunities method that we are testing
		//Here we are setting up the fake return result it will return.
		mocks.when(mockSelector.selectById(accountIds)).thenReturn(accountList);

		mocks.when(mockDomain.updateAccountType(accountList)).thenReturn(updatedAccountList);

		//When you are done setting these up, DO NOT FORGET to call the stopStubbing method
		//or you're gonna waste hours of your life confused
		mocks.stopStubbing();

		Test.startTest();
		//Passing our mock classes into our private constructor
		List<Account> updatedAccounts = new SoC_Class(mockDomain, mockSelector).updateAccounts(accountIds);
		Test.stopTest();

		System.assertEquals('Prospect', updatedAccounts[0].Type, 'Account type not updated');
		//Verifying this method was never called, we didn't intend to call it, so
		//just checking we didn't
		((Accounts)mocks.verify(mockDomain, mocks.never().description('This method was called but it shouldn\'t have been'))).onValidate();
		//Checking that we did indeed call the createTasks method as expected.
		((Accounts)mocks.verify(mockDomain)).updateAccountType(accountList);
	}
}