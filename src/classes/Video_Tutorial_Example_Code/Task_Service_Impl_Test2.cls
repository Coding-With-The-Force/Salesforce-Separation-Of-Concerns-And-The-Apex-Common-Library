/**
 * Created by gerry on 5/2/2021.
 */
@IsTest
public with sharing class Task_Service_Impl_Test2
{
	@IsTest
	private static void createTasks_CaseTaskSuccess_UnitTest(){
		Id mockCaseId = fflib_IDGenerator.generate(Case.SObjectType);

		Set<Id> caseIds = new Set<Id>{mockCaseId};
		List<Case> caseList = new List<Case>{new Case(Id=mockCaseId, Subject='Hi', Status='New', Origin='Email')};

		fflib_ApexMocks mocks = new fflib_ApexMocks();
		fflib_SObjectUnitOfWork mockUOW = (fflib_SObjectUnitOfWork) mocks.mock(fflib_SObjectUnitOfWork.class);
		Cases mockCaseDomain = (Cases)mocks.mock(Cases.class);
		Case_Selector mockCaseSelector = (Case_Selector)mocks.mock(Case_Selector.class);

		mocks.startStubbing();
			mocks.when(mockCaseSelector.sObjectType()).thenReturn(Case.SObjectType);
			mocks.when(mockCaseSelector.selectSObjectsById(caseIds)).thenReturn(caseList);
			mocks.when(mockCaseDomain.sObjectType()).thenReturn(Case.SObjectType);
			mocks.when(mockCaseSelector.selectRecordsForTasks()).thenReturn(caseList);
			((fflib_SObjectUnitOfWork)mocks.doThrowWhen(new DmlException(), mockUOW)).commitWork();
			//mocks.when(mockCaseSelector.selectRecordsForTasks()).thenThrow(new DmlException());
		mocks.stopStubbing();

		Application.UOW.setMock(mockUOW);
		Application.selector.setMock(mockCaseSelector);
		Application.domain.setMock(mockCaseDomain);

		try{
			Test.startTest();
			new Task_Service_Impl().createTasks(caseIds, Case.SObjectType);
			Test.stopTest();
		}
		catch(Exception e){
			System.debug('Were catching an exception');
			System.assert(e instanceof DmlException);
		}

		List<Case> caseMatchingList = (List<Case>)fflib_Match.sObjectsWith(new List<Map<Schema.SObjectField, Object>>{new Map<SObjectField, Object>{
				Case.Id => mockCaseId,
				Case.Subject => 'Hi',
				Case.Status => 'New',
				Case.Origin => 'Email'

		}});


		//((Cases)mocks.verify(mockCaseDomain, mocks.never().description('Hey you werent supposed to call this method bruh.'))).handleAfterInsert();
		((fflib_ISObjectUnitOfWork)mocks.verify(mockUOW, mocks.times(1))).registerDirty(caseMatchingList);
		//((Cases)mocks.verify(mockCaseDomain, 1)).createTasks(caseList, mockUOW);
	}
}