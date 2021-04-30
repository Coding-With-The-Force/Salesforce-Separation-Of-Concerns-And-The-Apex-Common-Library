/**
 * @description this is a test class for the Task_Service_Impl class. It is
 * an example showing how to leverage apex mocks with the apex common library.
 * @author Matt Gerry
 * @date 04/18/2021
 */
@IsTest
public with sharing class Task_Service_Impl_Test
{
	@IsTest
	private static void createTasks_CasesSuccess_UnitTest(){
		//Creating a new fake case id using the IdGenerator class. We do this
		//to avoid unnecessary dml insert statements. Note how the same id is used everywhere.
		//make sure this id is consistent between your lists and sets you're passing
		//back and forth or you may run into some problems.
		Id mockCaseId = fflib_IDGenerator.generate(Case.SObjectType);

		//Creating a set of ids that we pass to our methods.
		Set<Id> caseIds = new Set<Id>{mockCaseId};
		//Creating the list of cases we'll return from our selector method
		List<Case> caseList = new List<Case>{new Case(Id = mockCaseId, Subject = 'Hi', Status = 'New', Origin = 'Email')};

		//Creating our mock class representations by using the ApexMocks class's mock method
		//and passing it the appropriate class type.
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		fflib_SObjectUnitOfWork mockUOW = (fflib_SObjectUnitOfWork) mocks.mock(fflib_SObjectUnitOfWork.class);
		Cases mockCaseDomain = (Cases) mocks.mock(Cases.class);
		Case_Selector mockCaseSelector = (Case_Selector) mocks.mock(Case_Selector.class);

		//After you've setup your mocks above, we need to stub (or setup the expected
		//method calls and what they would return.
		mocks.startStubbing();
		//The sObjectType method in selector and domain classes is always called so it must
		//always be stubbed.
		mocks.when(mockCaseSelector.sObjectType()).thenReturn(Case.SObjectType);
		//If you are dynamically generating domain class instances by passing in a set of ids
		//the selectSObjectsById method is called so it must be stubbed.
		mocks.when(mockCaseSelector.selectSObjectsById(caseIds)).thenReturn(caseList);
		//This is the actual method in my select that gets called, so we definitely need
		//to stub it.
		mocks.when(mockCaseSelector.selectRecordsForTasks()).thenReturn(caseList);
		//The sObjectType method in selector and domain classes is always called so it must
		//always be stubbed.
		mocks.when(mockCaseDomain.sObjectType()).thenReturn(Case.SObjectType);
		//If you want to mock exceptions, this is the way to do it. Basically it works like this.
		//call the mocks.doThrownWhen method and pass it the exception you would like to throw and
		//the mock class that should throw it. Then wrap cast the whole mocks.doThrownWhen
		//method as the class type it should be (in this cass fflibSObjectUnitOfWork) and
		//call the method that should throw the error (in this case commitWork).
		((fflib_SObjectUnitOfWork)mocks.doThrowWhen(new DmlException(), mockUOW)).commitWork();
		//When you are done setting these up, DO NOT FORGET to call the stopStubbing method
		//or you're gonna waste hours of your life confused
		mocks.stopStubbing();

		//AFTER you do your stubbing, and ONLY AFTER, you set your mocks in your
		//application class (whatever you've named it). Then your code will leverage
		//the mock classes as opposed to the real classes
		Application.UOW.setMock(mockUOW);
		Application.domain.setMock(mockCaseDomain);
		Application.selector.setMock(mockCaseSelector);


		try{
			Test.startTest();
			//Calling the method we're actually testing (this is a real method call)
			Task_Service.createTasks(caseIds, Case.SObjectType);
			Test.stopTest();
		}
		catch(Exception e){
			//Because we are throwing an exception in our stubs we need to wrap our real
			//method call in a try catch and figure out whether or not it actually threw the
			//exception we anticipated it throwing.
			System.assert(e instanceof DmlException);
		}

		//Verifying this method was never called, we didn't intend to call it, so
		//just checking we didn't
		((Cases)mocks.verify(mockCaseDomain, mocks.never().description('This method was called but it shouldn\'t have been'))).handleAfterInsert();
		List<Case> caseMatchingList = (List<Case>)fflib_Match.sObjectsWith(new List<Map<Schema.SObjectField, Object>>{new Map<SObjectField, Object>{
				Case.Id => mockCaseId,
				Case.Subject => 'Bye',
				Case.Status => 'New',
				Case.Origin => 'Email'
		}});

		((fflib_ISObjectUnitOfWork)mocks.verify(mockUOW, 1)).registerDirty(caseMatchingList);
		((fflib_ISObjectUnitOfWork)mocks.verify(mockUOW,1)).registerDirty(caseList);
		((Cases)mocks.verify(mockCaseDomain, 1)).createTasks(caseList, mockUOW);
		//Checking that we did indeed call the createTasks method as expected.
		//((Cases)mocks.verify(mockCaseDomain)).createTasks(caseMatchingList, (fflib_ISObjectUnitOfWork)fflib_Match.anyObject());
	}
}