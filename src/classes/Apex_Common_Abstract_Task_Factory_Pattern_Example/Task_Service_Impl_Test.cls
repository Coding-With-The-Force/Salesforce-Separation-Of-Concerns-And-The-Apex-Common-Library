/**
 * Created by gerry on 4/14/2021.
 */
@IsTest
public with sharing class Task_Service_Impl_Test
{
	@TestSetup
	private static void setupTestData(){

	}

	@IsTest
	private static void createTasks_CasesSuccess_UnitTest(){
		Set<Id> caseIds = new Set<Id>{fflib_IDGenerator.generate(Case.SObjectType)};
		List<Case> caseList = new List<Case>{new Case(Id = fflib_IDGenerator.generate(Case.SObjectType), Subject = 'Hi', Status = 'New', Origin = 'Email')};

		fflib_ApexMocks mocks = new fflib_ApexMocks();
		Cases mockCases = (Cases) mocks.mock(Cases.class);
		Application.domain.setMock(mockCases);

		Case_Selector caseSelector = (Case_Selector) mocks.mock(Case_Selector.class);
		mocks.startStubbing();
		mocks.when(caseSelector.getSObjectType()).thenReturn(Case.SObjectType);
		mocks.when(caseSelector.selectRecordsForTasks()).thenReturn(caseList);
		mocks.stopStubbing();
		Application.selector.setMock(caseSelector);

		fflib_SObjectUnitOfWork uow = (fflib_SObjectUnitOfWork) mocks.mock(fflib_SObjectUnitOfWork.class);
		Application.UOW.setMock(uow);

		Test.startTest();
			Task_Service.createTasks(caseIds, Case.SObjectType);
		Test.stopTest();
		((Cases)mocks.verify(mockCases, mocks.never().description('This method was called but it shouldn\'t have been'))).handleAfterInsert();
		//((Case_Selector)mocks.verify(caseSelector, mocks.times(1).description('This was never called'))).getSObjectType();
		//((Cases)mockDomain.verify(mockCases)).createTasks(caseList, uow);
	}
}