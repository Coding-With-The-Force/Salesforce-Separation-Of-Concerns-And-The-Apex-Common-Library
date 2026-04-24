---
layout: default
title: "16) Unit Test Mocks with Separation of Concerns"
nav_order: 17
---

# Unit Test Mocks with Separation of Concerns

### Video Tutorial 

[![Unit Test Mocks and Separation of Concerns](https://img.youtube.com/vi/TzRohBbp8dw/hqdefault.jpg)](https://youtu.be/TzRohBbp8dw "Unit Test Mocks and Separation of Concerns")

---

### How does Unit Testing fit into Separation of Concerns?

The answer to this is simple, without Separation of Concerns, there is no unit testing, it just simply isn't possible. To unit test you need to be able to [create stub (mock) classes](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_testing_stub_api.htm) to send into your class you are testing via [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) (or through the use of a factory, more on this in the next section). If all of your concerns are in one class (DML transactions, SOQL queries, service method, domain methods, etc) you cannot fake anything. Let's take a look at a couple examples to illustrate this problem:

**_Unit Testing a class with SoC Implemented_**

```
//This is the class we would be testing
public with sharing class SoC_Class
{
	private DomainClass domainLayerClass;
	private SelectorClass selectorLayerClass;

	public SoC_Class(){
		//This is calling our private constructor below
		this(new domainLayerClass(), new selectorLayerClass());
	}

	//Using a private constructor here so our test class can pass in dependencies we would
	//like to mock in our unit tests
	@TestVisible
	private SoC_Class(DomainClass domainLayerClass, SelectorClass selectorLayerClass){
		this.domainLayerClass = domainLayerClass;
		this.selectorLayerClass = selectorLayerClass;
	}

	public List<Case> updateCases(Set<Id> objectIds){
		//Because of our dependency injection in the private constructor above we can mock the results of these class calls.
		List<Case> objList = selectorLayerClass.selectByIds(objectIds);
		if(!objList.isEmpty()){
			List<Case> objList = domainLayerClass.updateCases(objList);
			return objList;
		}
		else{
			throw new Custom_Exception();
		}
	}
}

//This is the class that we build to unit test the class above
@IsTest
public with sharing class SoC_Class_Test
{
	@IsTest
	private static void updateCases_OppListResults_UnitTest(){
		//Creating a new fake case id using the IdGenerator class. We do this
		//to avoid unnecessary dml insert statements. Note how the same id is used everywhere.
		Id mockCaseId = fflib_IDGenerator.generate(Case.SObjectType);
		//Creating a set of ids that we pass to our methods.
		Set<Id> caseIds = new Set<Id>{mockCaseId};
		//Creating the list of cases we'll return from our selector method
		List<Case> caseList = new List<Case>{new Case(Id = mockCaseId, Subject = 'Hi', Status = 'New', Origin = 'Email')};
		List<Case> updatedCaseList = new List<Case>{new Case(Id = mockCaseId, Subject = 'Panther', Status = 'Chocolate', Origin = 'Email')};

		//Creating our mock class representations by using the ApexMocks class's mock method
		//and passing it the appropriate class type.
		fflib_ApexMocks mocks = new fflib_ApexMocks();
		DomainClass mockDomain = (DomainClass) mocks.mock(DomainClass.class);
		SelectorClass mockSelector = (SelectorClass) mocks.mock(SelectorClass.class);

		//After you've setup your mocks above, we need to stub (or setup the expected
		//method calls and what they would return.
		mocks.startStubbing();

		//This is the actual selectByIds method that we call in the
		//createNewOpportunities method that we are testing
		//Here we are setting up the fake return result it will return.
		mocks.when(mockSelector.selectByIds(caseIds)).thenReturn(caseList);

		mocks.when(mockDomain.updateCases(caseList)).thenReturn(updatedCaseList);

		//When you are done setting these up, DO NOT FORGET to call the stopStubbing method
		//or you're gonna waste hours of your life confused
		mocks.stopStubbing();

		Test.startTest();
		//Passing our mock classes into our private constructor
		List<Case> updatedCases = new SoC_Class(mockDomain, mockSelector).updateCases(caseIds);
		Test.stopTest();

		System.assertEquals('Panther', updatedCases[0].Subject, 'Case subject not updated');
		//Verifying this method was never called, we didn't intend to call it, so
		//just checking we didn't
		((Cases)mocks.verify(mockDomain, mocks.never().description('This method was called but it shouldn\'t have been'))).createOpportunities();
		//Checking that we did indeed call the createTasks method as expected.
		((Cases)mocks.verify(mockDomain)).updateCases(caseList);
	}
}

```

Above you can see we are passing in fake/mock classes to the class we are testing and staging fake return results for the class methods we are calling. Thanks to separating out our concerns this is possible. Let's take a look at how impossible this is without SoC in place.

**_Unit Testing a class without SoC Implemented_**

```
//This is the class we would be testing
public with sharing class No_SoC_Class
{
	public List<Case> updateCases(Set<Id> objectIds){
		//Because of our dependency injection in the private constructor above we can mock the results of these class calls.
		List<Case> objList = [SELECT Id, Name FROM Case WHERE Id IN: objectIds]
		if(!objList.isEmpty()){
			for(Case cs: objList){
				cs.Subject = 'Panther';
				cs.Status = 'Chocolate';
			}

			update objList;
			return objList;
		}
		else{
			throw new Custom_Exception();
		}
	}
}

@IsTest
public with sharing class No_SoC_Class_Test
{
	@TestSetup
	private static void setupData(){
		Case newCase = new Case(Subject = 'Hi', Status = 'New', Origin = 'Email');
		insert newCase;
	}

	@IsTest
	private static void updateCases_CaseListResults_IntegrationTest(){
		Set<Id> caseIds = new Map<Id, SObject>([SELECT Id FROM Case]).keySet();
		List<Case> updatedCases = new No_SoC_Class().updateCases(caseIds);
		System.assertEquals('Panther', updatedCases[0].Subject, 'Case subject not updated');
	}
}

```

You can see above we did no mocking... it wasn't possible, we had no way of passing in fake/mock classes to this class at all so we had to do an integration test where we create real data and update real data. This test will run considerably slower. 

---

### How do I transition my Existing Code to start leveraging SoC so I can use Unit Test Mocking?

It's not a simple path unfortunately, there is a lot of work ahead of you to start this transition, but it is possible. The key is to start small, if you are a tech lead the first thing you need to do is find the time to train your devs on what SoC and mocking is and why you would use it. It's critical they understand the concepts before trying to roll something like this out. You cannot do everything as a lead even if you'd like to, you need to build your team's skillset first. If you aren't a lead, you first need to convince your lead why it's critical you start taking steps in that direction and work to get them onboard with it. If they ignore you, you need a new lead... After accomplishing either the above you should do the following:

1) Frame your situation in a way that the business arm of your operation understands the importance of altering your code architecture to leverage SoC and unit testing. This is typically pretty easy, just inform them that by spending a few extra points per story to transition the code you are going to gain more robust testing (resulting in less manual tests) and that the code will become more flexible over time, allowing for easier feature additions to your org. Boom, done, product owner buy in has been solidified. Ok, lol, sometimes it's not quite this easy, but you know your business people, give them something they won't ignore, just be careful to not make yourself or your team sound incompetent, don't overcommit and make promises you can't keep and frame it in words business people understand (mostly dollar signs).

2) Start small, take this on a story by story basis. Say you have a new story to update some UI in your org, with business owner buy-in, tack on a few extra points to the story to switch it to start using SoC and Unit Testing. Then, MAKE SURE YOUR TESTS ARE INCREDIBLE AND YOU TRUST THEM! I say this because, if your tests are incredible you never have to ask for permission again... I mean think about it, wtf does the average business person know about code. As long as I don't introduce any new bugs I could change half the code base and they'd never even know. If your tests are golden, your ability to change on a whim is as well. Make those test classes more trustworthy than your dog (or cat I guess... but I wouldn't trust a cat).

3) Over time, your transition will be done... it might take a year, it might take 5 years, depends on how busted your codebase was to begin with. Hopefully, by the time you are done, you have an extremely extensible codebase with tests you can trust and you never have to ask for permission to do a damn thing again.  

---

### Additional Information

If the above didn't make how to implement mocking via separation of concerns any clearer, [I also have a video covering the subject here.](https://youtu.be/-esf8Q_Vp7U)

---

### Next Section

[Part 17: Implementing Mock Unit Testing with Apex Mocks](./17-Implementing-Mock-Unit-Tests-with-the-Apex-Mocks-Library) 
