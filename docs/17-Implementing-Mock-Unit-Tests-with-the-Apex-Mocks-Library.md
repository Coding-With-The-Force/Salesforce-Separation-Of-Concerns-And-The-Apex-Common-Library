---
layout: default
title: "17) Implementing Mock Unit Tests with the Apex Mocks Library"
nav_order: 18
---

# Implementing Mock Unit Testing with Apex Mocks

### Video Tutorial 

[![Implementing Unit Testing with Apex Mocks](https://yt-embed.herokuapp.com/embed?v=PLSrLc6jjwQ)](https://youtu.be/PLSrLc6jjwQ "Implementing Unit Testing with Apex Mocks")

---

### What is Apex Mocks?

[Apex Mocks](https://github.com/apex-enterprise-patterns/fflib-apex-mocks) is unit test mocking framework for Apex that was inspired by the very popular [Java Mockito framework](https://site.mockito.org/). The Apex Mocks framework is also built using [Salesforce's Stub API](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_testing_stub_api.htm) which is a good thing, there are mocking frameworks in existence that do not leverage the Stub API... you shouldn't use them as they are considerably less performant. In fact, as a remnant of the past, Apex Mocks still has an option to not use the Stub API, don't use it.

To make this super simple, Apex Mocks is an excellent framework that allows you to not only create mock (fake) versions of your classes for tests, but also allows you to do a number of other things like create mock (fake) records, verify the amount of times a method was called, verify method call order and lots more. There is not another mocking framework for the Apex language that is anywhere near as robust.  

---

### Do you have to use the Apex Common Library to use Apex Mocks?

While you don't have to use the Apex Common Library to use Apex Mocks, they are built to work extremely well together. Without the use of the Apex Common Library you will need to ensure that all of your classes utilize [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection). While this isn't a massive feat, it's something you have to be cognizant of. If you decide to use the Apex Common library and leverage [the fflib\_Application class factory](./04-The-fflib_Application-Class) you can leverage the [setMock methods](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L114) to avoid needing to setup all your classes using dependency injection. It's pretty convenient and makes the whole situation a bit easier. We'll take a look at both methods below: 

_**Using Apex Mocks without Apex Common Example**_

```
//Class we're testing
public with sharing class SoC_Class
{
	private DomainClass domainLayerClass;
	private SelectorClass selectorLayerClass;

	public SoC_Class(){
		//This is calling our private constructor below
		this(new domainLayerClass(), new selectorLayerClass());
	}

	//THE MAJOR DIFFERENCE IS HERE! We're using a private constructor here so our test class can pass in dependencies we would
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
```
```
//Test class
@IsTest
public with sharing class SoC_Class_Test
{
	@IsTest
	private static void updateCases_OppListResults_UnitTest(){
		Id mockCaseId = fflib_IDGenerator.generate(Case.SObjectType);
		Set<Id> caseIds = new Set<Id>{mockCaseId};
		List<Case> caseList = new List<Case>{new Case(Id = mockCaseId, Subject = 'Hi', Status = 'New', Origin = 'Email')};
		List<Case> updatedCaseList = new List<Case>{new Case(Id = mockCaseId, Subject = 'Panther', Status = 'Chocolate', Origin = 'Email')};

		fflib_ApexMocks mocks = new fflib_ApexMocks();
		DomainClass mockDomain = (DomainClass) mocks.mock(DomainClass.class);
		SelectorClass mockSelector = (SelectorClass) mocks.mock(SelectorClass.class);
		mocks.startStubbing();
		mocks.when(mockSelector.selectByIds(caseIds)).thenReturn(caseList);
		mocks.when(mockDomain.updateCases(caseList)).thenReturn(updatedCaseList);
		mocks.stopStubbing();

		Test.startTest();
		//THE MAJOR DIFFERENCE IS HERE! We are passing in our mock classes we created above to the private constructor that is only
                //visible to tests to leverage dependency injection for mocking.
		List<Case> updatedCases = new SoC_Class(mockDomain, mockSelector).updateCases(caseIds);
		Test.stopTest();

		System.assertEquals('Panther', updatedCases[0].Subject, 'Case subject not updated');
		((Cases)mocks.verify(mockDomain, mocks.never().description('This method was called but it shouldn\'t have been'))).createOpportunities();
		((Cases)mocks.verify(mockDomain)).updateCases(caseList);
	}
}
```

If you take a look at the above SoC_Class class you can see that we are leveraging the concept of dependency injection to allow our SoC_Class_Test test class the ability to inject the mock classes during our unit test. This is the key difference. All of your classes MUST LEVERAGE DEPENDENCY INJECTION to be able to incorporate unit test mocking into your codebase. Now let's take a look at how to do the same thing using the Apex Common Library and the fflib_Application class.

---

_**Using Apex Mocks with Apex Common Example**_

```
//Example Application factory class. This is only here because it is referenced in the classes below.
public with sharing class Application
{
	public static final fflib_Application.UnitOfWorkFactory UOW =
		new fflib_Application.UnitOfWorkFactory(
			new List<SObjectType>{
			Case.SObjectType,
			Contact.SObjectType,
			Account.SObjectType,
			Task.SObjectType}
	);

	public static final fflib_Application.ServiceFactory service =
			new fflib_Application.ServiceFactory(
					new Map<Type, Type>{
							Task_Service_Interface.class => Task_Service_Impl.class}
			);

	public static final fflib_Application.SelectorFactory selector =
			new fflib_Application.SelectorFactory(
					new Map<SObjectType, Type>{
							Case.SObjectType => Case_Selector.class,
							Contact.SObjectType => Contact_Selector.class,
							Task.SObjectType => Task_Selector.class}
			);

	public static final fflib_Application.DomainFactory domain =
			new fflib_Application.DomainFactory(
					Application.selector,
					new Map<SObjectType, Type>{Case.SObjectType => Cases.Constructor.class,
					Contact.SObjectType => Contacts.Constructor.class}
			);


}
```
```
//Class we're testing
public with sharing class Task_Service_Impl implements Task_Service_Interface
{
	public void createTasks(Set<Id> recordIds, Schema.SObjectType objectType)
	{
                //THE MAJOR DIFFERENCE IS HERE! Instead of using constructors to do dependency injection
                //we are initializing our classes using the fflib_Application factory class. 
		fflib_ISObjectDomain objectDomain = Application.domain.newInstance(recordIds);
		fflib_ISObjectSelector objectSelector = Application.selector.newInstance(objectType);
		fflib_ISObjectUnitOfWork unitOfWork = Application.UOW.newInstance();
		List<SObject> objectsThatNeedTasks = new List<SObject>();
		if(objectSelector instanceof  Task_Selector_Interface){
			System.debug('Selector an instance of tsi');
			Task_Selector_Interface taskFieldSelector = (Task_Selector_Interface)objectSelector;
			objectsThatNeedTasks = taskFieldSelector.selectRecordsForTasks();
		}
		else{
			System.debug('Selector not an instance of tsi');
			objectsThatNeedTasks = objectSelector.selectSObjectsById(recordIds);
		}
		if(objectDomain instanceof Task_Creator_Interface){
			System.debug('Domain an instance of tci');
			Task_Creator_Interface taskCreator = (Task_Creator_Interface)objectDomain;
			taskCreator.createTasks(objectsThatNeedTasks, unitOfWork);
		}
		try{
			unitOfWork.commitWork();
		}
		catch(Exception e){
			throw e;
		}
	}
}
```
```
public with sharing class Task_Service_Impl_Test
{
	@IsTest
	private static void createTasks_CasesSuccess_UnitTest(){

		Id mockCaseId = fflib_IDGenerator.generate(Case.SObjectType);

		Set<Id> caseIds = new Set<Id>{mockCaseId};
		List<Case> caseList = new List<Case>{new Case(Id = mockCaseId, Subject = 'Hi', Status = 'New', Origin = 'Email')};

		fflib_ApexMocks mocks = new fflib_ApexMocks();
		fflib_SObjectUnitOfWork mockUOW = (fflib_SObjectUnitOfWork) mocks.mock(fflib_SObjectUnitOfWork.class);
		Cases mockCaseDomain = (Cases) mocks.mock(Cases.class);
		Case_Selector mockCaseSelector = (Case_Selector) mocks.mock(Case_Selector.class);


		mocks.startStubbing();
		mocks.when(mockCaseSelector.sObjectType()).thenReturn(Case.SObjectType);
		mocks.when(mockCaseSelector.selectSObjectsById(caseIds)).thenReturn(caseList);
		mocks.when(mockCaseSelector.selectRecordsForTasks()).thenReturn(caseList);
		mocks.when(mockCaseDomain.sObjectType()).thenReturn(Case.SObjectType);
		((fflib_SObjectUnitOfWork)mocks.doThrowWhen(new DmlException(), mockUOW)).commitWork();
		mocks.stopStubbing();

		//THE MAJOR DIFFERENCE IS HERE! Instead of dependency injection we are using our
                //the setMock method in the fflib_Application class to set our mock class for unit tests.
		Application.UOW.setMock(mockUOW);
		Application.domain.setMock(mockCaseDomain);
		Application.selector.setMock(mockCaseSelector);


		try{
			Test.startTest();
			Task_Service.createTasks(caseIds, Case.SObjectType);
			Test.stopTest();
		}
		catch(Exception e){
			System.assert(e instanceof DmlException);
		}


		((Cases)mocks.verify(mockCaseDomain, mocks.never().description('This method was called but it shouldn\'t have been'))).handleAfterInsert();
		((Cases)mocks.verify(mockCaseDomain)).createTasks(caseList, mockUOW);
	}
}
```
As you can see, in this example we no longer leverage dependency injection to get our mock unit tests up and running. Instead we use the setMock method available on all of the inner factory classes in [the fflib\_Application class](./04-The-fflib_Application-Class) to setup our mock class for our unit test. It makes things a bit easier in the long run.

Now that we've seen how to setup a mock class with or without Apex Common, let's figure out all the cool things Apex Mocks has to allow you to assert your logic operated in the way you anticipated it would! We'll start with a section on what stubbing is below!

---
### What is Stubbing and how to Stub

Soooooo, what exactly is stubbing? Basically it's the act of providing fake return responses for a mocked class's methods and it's super extra important when setting up your unit tests because without them, well frankly nothing is gonna work. So let's check out how to do stubbing below:

```
Id mockCaseId = fflib_IDGenerator.generate(Case.SObjectType);
List<Case> caseList = new List<Case>{new Case(Id = mockCaseId, Subject = 'Hi', Status = 'New', Origin = 'Email')};

//Creating the mock/fake version of our case selector class
fflib_ApexMocks mocks = new fflib_ApexMocks();
Case_Selector mockCaseSelector = (Case_Selector) mocks.mock(Case_Selector.class);

//Here is where we start stubbing our fake return values from our methods that will be called by the actual class we are testing.
//You need to initialize our mock stubbing by using the mocks.startStubbing method.
mocks.startStubbing();
mocks.when(mockCaseSelector.sObjectType()).thenReturn(Case.SObjectType);
mocks.when(mockCaseSelector.selectSObjectsById(caseIds)).thenReturn(caseList);
//This is basically saying, "hey, when the method we're testing calls the selectRecordsForTasks method on our mocked case selector
//please always return this caseList."
mocks.when(mockCaseSelector.selectRecordsForTasks()).thenReturn(caseList);
mocks.stopStubbing();
//Don't forget to stop stubbing!! Very importante!

//Make sure to do your stubbing before sending your mock class to your application factory class!!!
Application.selector.setMock(mockCaseSelector);

//Doing the test of the actual method that will call those mocked class's stubbed methods above. Make sure to create the mock classes and the stubbed
//method responses for your classes before doing this test!
Test.startTest();
Task_Service.createTasks(caseIds, Case.SObjectType);
Test.stopTest();
```

Alright, let's go over this a bit (and if you didn't read the comments in the code outlined above please do!). The first thing you should know is that you should only be creating stubbed methods for methods that are actually called by the real method you are actually testing (in our case, the Task_Service.createTasks method). Now that we've clarified that, let's break down one of our stubs that we built out for the methods in our mocked class. Take this stub `mocks.when(mockCaseSelector.selectRecordsForTasks()).thenReturn(caseList);`, what we are efficitively saying here is, when our mockCaseSelector's selectRecordsForTasks method is called, let's always return the caseList value. Not too complicated but maybe confusing if you've never seen the syntax before. 

Hopefully this has helped explain the basic concept of stubbing alright, there's more we can do with stubbing in regards to throwing fake errors, so be sure to check out the, "How to mock exceptions being thrown" section below for more information on that subject.

---

### How to verify the class you're actually testing appropriately called your mock class methods

If you've never done mocking before this might seem super weird, instead of using asserts, we need another way to verify that our code functioned as anticipated with our fake classes and return values. So what exactly do you verify/assert in your test? What we're gonna end up doing is verify that we did indeed call the fake methods with the parameters we anticipated (or that we didn't call them at all). So let's take a look at how to use the [verify method in the fflib_ApexMocks class](https://github.com/apex-enterprise-patterns/fflib-apex-mocks/blob/master/sfdx-source/apex-mocks/main/classes/fflib_ApexMocks.cls#L121) to verify a method we intended to call, did indeed get called:

```
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

mocks.startStubbing();
mocks.when(mockCaseDomain.sObjectType()).thenReturn(Case.SObjectType);
mocks.stopStubbing();

Application.UOW.setMock(mockUOW);
Application.domain.setMock(mockCaseDomain);

Test.startTest();
//Calling the method we're actually testing (this is a real method call)
Task_Service.createTasks(caseIds, Case.SObjectType);
Test.stopTest();

//THIS IS IT!!! HERE IS WHERE WE ARE VERIFYING THAT WE ARE CALLING THE CASE DOMAIN CREATE TASKS CLASS ONCE!!!
((Cases)mocks.verify(mockCaseDomain, 1)).createTasks(caseList, mockUOW);
``` 

On the very last line of the above code we are using the verify method to ensure that the createTasks method in the Cases class was called exactly one time with the caseList and mockUOW values passed to it. You might be looking at this and thinking, "But why Matt? Why would I actually care to this?". The answer is pretty simple. Even though your code in those classes isn't running, you still want to (really need to) verify that your code still decided to call it (or not call it), that you code didn't call the method more times than you were anticipating, etc. Remember, the major purpose of a unit test is to test that the logic in your class is working how you anticipate it to. Verifying that methods were called correctly is extremely important. If your class calls the wrong methods at the wrong time, super ultra terrible consequences could end up taking place.

---
### How to verify your data was altered by your class when it was sent to a mocked class (Matchers)

Whoooo that's a long title, lol. Here's the dealio, at least half the time the data you pass into the class you are actually testing (the one class we aren't mocking) it will altered and then sent in to another mocked class's method to be further processed. Chances are you'd like to verify that data was altered prior to sending it to your mocked classes method. Never fear my good ole pals, the [fflib_Match class](https://github.com/apex-enterprise-patterns/fflib-apex-mocks/blob/master/sfdx-source/apex-mocks/main/classes/fflib_Match.cls) is here to help you do just that! Let's take a look at how we can use matchers to identify what exactly was passed into our mocked class's methods!

```
Id mockCaseId = fflib_IDGenerator.generate(Case.SObjectType);
List<Case> caseList = new List<Case>{new Case(
                                     Id = mockCaseId, 
                                     Subject = 'Hi', 
                                     Status = 'New', 
                                     Origin = 'Email')};

fflib_ApexMocks mocks = new fflib_ApexMocks();
fflib_SObjectUnitOfWork mockUOW = (fflib_SObjectUnitOfWork) mocks.mock(fflib_SObjectUnitOfWork.class);
Application.UOW.setMock(mockUOW);

Test.startTest();
//Calling the method we're actually testing (this is a real method call). IN THIS METHOD WE ARE CHANGING THE CASE SUBJECTS FROM 'Hi' to 'Bye'
new Cases().changeSubject(caseList);
Test.stopTest();

//Here we are using the fflib_Match class to create a new sobject to match against to verify the subject field was actually changed in the above method //call.
List<Case> caseMatchingList = (List<Case>)fflib_Match.sObjectsWith(new List<Map<Schema.SObjectField, Object>>{new Map<SObjectField, Object>{
				Case.Id => mockCaseId,
				Case.Subject => 'Bye',
				Case.Status => 'New',
				Case.Origin => 'Email'}
});

//Here we are verifying that our unit of works registerDirty method was indeed called with the updated data we expected by using a matcher. This should //return true pending your code actually did update the cases prior to calling this method as you intended. 
((fflib_ISObjectUnitOfWork)mocks.verify(mockUOW)).registerDirty(caseMatchingList);

//This also works (confusing right)... but it proves a lot less, it simply proves your method was called with that list of cases, but it doesn't prove it //updated those cases prior to calling it.
((fflib_ISObjectUnitOfWork)mocks.verify(mockUOW,1)).registerDirty(caseList);
```

Alright alright alright, you might be looking at this and being like, "But bruh why make a matcher at all to get this done? Why not just keep it simple and make another list of cases to represent the changes". Fair enough question hombre, here's the simple answer... it's not gonna work, trust me, lol. Basically ApexMocks needs a way to internally check these events actually occurred and that matcher we setup is the key to doing that. If you wanna dive deep into how it works feel free, but that is a whole different subject we're not gonna get into the weeds of. 

So we can see, I think, that this is extremely useful in terms of verifying our logic occurred in the right order and updated our data as anticipated before calling the method in one of our mocked classes. Pretty cool, makes our unit testing that much more accurate.

There are a ton more methods in the fflib_Match class that you can leverage to do virtually whatever you can think of, there's a list of those near the bottom of this page. Definitely check them out.

---
### How to mock exceptions being thrown (this is THA BEST!!)

If you don't care about time savings for test runs to get your code into production, you should pick up mocking to allow for easier exception testing at the very least. IT IS SO MUCH EASIER TO VERIFY EXCEPTIONS!!!! A magical thing that honestly can't be beat. Tons of errors that you should rightfully handle in a ton of situations (like record locking errors) are borderline impossible to test with real data... this makes it possible. Some people out there might be like, "Hah, but I don't even catch my exceptions why should I care?". To that I say, time to change my guy, lol, you need to catch those bad boiz, trust me. Anywhooo, let's get right to it! How do we mock our exceptions to make testing exceptions so simple and so glorious? Let's checkout the code below:

Here's an example of mocking an error when the method returns nothing:
```
fflib_ApexMocks mocks = new fflib_ApexMocks();
fflib_SObjectUnitOfWork mockUOW = (fflib_SObjectUnitOfWork) mocks.mock(fflib_SObjectUnitOfWork.class);

mocks.startStubbing();
//This right here is what's doing the mock error throwing!! Basically we're saying, when the commitWork method in our
//mockUOW class is called by the method we are truly testing, please throw a new DMLException. 
((fflib_SObjectUnitOfWork)mocks.doThrowWhen(new DmlException(), mockUOW)).commitWork();
mocks.stopStubbing();

Application.UOW.setMock(mockUOW);

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
```

Here's a similar example but with a method that returns data:

```
fflib_ApexMocks mocks = new fflib_ApexMocks();
Case_Selector mockCaseSelector = (Case_Selector) mocks.mock(Case_Selector.class);

mocks.startStubbing();
//These two methods must be stubbed for selectors if using apex common library
mocks.when(mockCaseSelector.sObjectType()).thenReturn(Case.SObjectType);
mocks.when(mockCaseSelector.selectSObjectsById(caseIds)).thenReturn(caseList);

//This right here is what's doing the mock error throwing!! Basically we're saying, when the selectRecordsForTasks method in our
//mockCaseSelector class is called by the method we are truly testing, please throw a new DMLException. 
mocks.when(mockCaseSelector.selectRecordsForTasks()).thenThrow(new DmlException());
mocks.stopStubbing();

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
```

You can see that there's a small difference between the two. For the method that actually returns data the chain of events is a bit easier to follow `mocks.when(mockCaseSelector.selectRecordsForTasks()).thenThrow(new DmlException());`. This basically is just saying, when we call the mock selector class's selectRecordsForTasks class then we need to throw a new DMLException.

For the method that doesn't return any data (a void method) the syntax is a little different `((fflib_SObjectUnitOfWork)mocks.doThrowWhen(new DmlException(), mockUOW)).commitWork()`. You can see that instead of using the `mocks.when(method).thenThrow(exception)` setup we are now using the doThrowWhen method, which kinda combines the `when(method).thenThrow(exception)` into a single statement. You can also see it takes two parameters, the first is the exception you want to throw and the second is the mocked class you are attaching this exception throwing event to. Then you have to cast this `mocks.doThrowWhen(exception, mockedClass)` to the class type it will end up representing, wrap it in parenthesis and call the method you intend it to throw an error on. Weird setup, awesomely simple exception testing though. 

Also worth noting, don't forget to wrap methods you are truly testing (that will now throw an error) in a try catch in your test and in the catch block, assert that you are getting your exceptions throw. 

---
### How to test important method side-effects truly occured (Answering)

It is not at all uncommon to have parameters passed into a method by reference and for that method to update those parameters but not pass them back. Some people refer to this as method side effects. To truly do good unit tests however we should mock those side effects as well. That is where the [fflib_Answer interface](https://github.com/apex-enterprise-patterns/fflib-apex-mocks/blob/master/sfdx-source/apex-mocks/main/classes/fflib_Answer.cls) comes into play! Now, unlike most things I've written about in this series, there is a blog post by Eric Kintzer that already exists for this apex mocks topic that is excellent and well... frankly I don't need to re-invent the wheel here. Please go check out how to do [Answering with Apex Mocks here.](https://cropredysfdc.com/2019/05/03/apexmocks-answers-and-void-no-argument-domain-methods/) .

---
### How to check method call order 

Sometimes when you are doing unit tests it's extremely important to verify the order in which your methods were called. Maybe, depending on what data your method receives your mock class's methods could be called in varying orders. It's best to check that the code is actually doing that! If you do need to check for that in your code, no worries, that is why the [fflib_InOrder class](https://github.com/apex-enterprise-patterns/fflib-apex-mocks/blob/master/sfdx-source/apex-mocks/main/classes/fflib_InOrder.cls) exists! Thankfully this is yet another area I really don't need to cover again in this guide as a good blog post exists covering this topic as well! If you need to check method ordering in your unit testing, [please check out the blog post here!](https://xonoxforce.wordpress.com/2017/03/26/inorder-verify/)

---

### Apex Mocks Counters (Counting method calls and adding descriptions)

Counters counters counters... they're one of the simplest things to learn thankfully and also very useful! Basically you might want to know how many times a method in a mock class was called by the class you are currently unit testing. It helps to verify the logic in your code is only calling classes in the way you intended for it to call it. The syntax is pretty simple so lets get to learninnnnnnnn.

When we are verifying method calls (as discussed in one of the above sections) we do the following:

`((fflib_ISObjectUnitOfWork)mocks.verify(mockUOW)).registerDirty(caseMatchingList);`

What if we wanna check whether the code operated only once though? We can check pretty easy by passing a second parameter to the verify method like so:

`((fflib_ISObjectUnitOfWork)mocks.verify(mockUOW, mocks.times(1))).registerDirty(caseMatchingList);`

The above code will verify that our method was not just called, but only called once. Pretty kewl right? But wait! There's more! Let's check out a bunch of different counter scenarios below.

How to verify a method was called at least x times:

`((fflib_ISObjectUnitOfWork)mocks.verify(mockUOW, mocks.atLeast(3))).registerDirty(caseMatchingList);`  

How to verify a method was called at most x times:

`((fflib_ISObjectUnitOfWork)mocks.verify(mockUOW, mocks.atMost(3))).registerDirty(caseMatchingList);`

How to verify a method was called never:

`((fflib_ISObjectUnitOfWork)mocks.verify(mockUOW, mocks.never())).registerDirty(caseMatchingList);`

How to verify a method was called between x amount of times:

`((fflib_ISObjectUnitOfWork)mocks.verify(mockUOW, mocks.between(1,5))).registerDirty(caseMatchingList);`

Wow wow wow, so many options for so many scenarios, however I would be remiss if I didn't also should you the description method call you can chain to basically give you useful verification failure statements. Let's check that out right quick:

`((fflib_ISObjectUnitOfWork)mocks.verify(mockUOW, mocks.times(2).description('Whoa champ, you didnt call this dirty method twice, try again broseph'))).registerDirty(caseMatchingList);`

If your verification fails (and in turn your test class fails) you will now get that wonderful description to help you pinpoint the cause of your test failure a bit easier. That's pretty awesome opposum.

[Additional Info on Counters](https://xonoxforce.wordpress.com/2017/04/01/counters-in-apex-mocks-verifications/)

---

### How to generate fake data with Apex Mocks

If we couldn't produce fake records to pass to our mocked class methods to handle, honestly this whole setup would only be kinda good because we'd always be forced to do real DML transactions in our tests to create data, and if you didn't know the reason tests can take sooooooooooooo long is because of DML transactions. They take a crazy amount of time in comparison to everything else in your code (unless you've got quadruple inner for loops in your codebase somewhere... which you should address like right now, please stop reading this and fix it). So let's figure out how to make fake data using the Apex Mocks Library.

**The first class on our list in the Apex Mocks library to check out is the [fflib_IDGenerator class](https://github.com/apex-enterprise-patterns/fflib-apex-mocks/blob/master/sfdx-source/apex-mocks/main/classes/fflib_IDGenerator.cls)**. Inside this class there is a single method, [generate(Schema.SObjectType sobjectType)](https://github.com/apex-enterprise-patterns/fflib-apex-mocks/blob/master/sfdx-source/apex-mocks/main/classes/fflib_IDGenerator.cls#L34) and its purpose is to take an SObjectType and return an appropriate Id for it. This is super useful because if you need to fake that a record already exists in the system, or that a record is parented to another record, you need an Id. You'll likely use this method a ton.

_**Example method call to get a fake (but legal) Id:**_

`Id mockCaseId = fflib_IDGenerator.generate(Case.SObjectType);`

That will return to you a legal caseId! Pretty useful.

**The next class on our list to cover here is the [fflib_ApexMocksUtils class](https://github.com/apex-enterprise-patterns/fflib-apex-mocks/blob/master/sfdx-source/apex-mocks/main/classes/fflib_ApexMocksUtils.cls)**. This class has three accessible methods and they allow you to make in memory relationships between fake records and to setup formula field values for a fake record. Let's take a look at some examples below.

**[makeRelationship(Type parentsType, List&lt;SObject> parents, SObjectField relationshipField, List&lt;List&lt;SObject>> children)](https://github.com/apex-enterprise-patterns/fflib-apex-mocks/blob/master/sfdx-source/apex-mocks/main/classes/fflib_ApexMocksUtils.cls#L67) Example method call**:
```
//Example from: https://salesforce.stackexchange.com/questions/315832/mocking-related-objects-using-fflib
Opportunity opportunityMock1 = new Opportunity(Id = fflib_IDGenerator.generate(Opportunity.SObjectType));

//This basically creates a list of opportunities with child opportunity line items in the list in the OpportunityLineItems field
List<Opportunity> opportunitiesWithProductsMock = (List<Opportunity>) fflib_ApexMocksUtils.makeRelationship(
        List<Opportunity>.class,
        new List<Opportunity>{
                opportunityMock1
        },
        OpportunityLineItem.OpportunityId,
        new List<List<OpportunityLineItem>>{
                new List<OpportunityLineItem>{
                        new OpportunityLineItem(Id = fflib_IDGenerator.generate(OpportunityLineItem.SObjectType)),
                        new OpportunityLineItem(Id = fflib_IDGenerator.generate(OpportunityLineItem.SObjectType))
                }
        }
);

```

**[makeRelationship(String parentTypeName, String childTypeName, List&lt;SObject> parents, String relationshipFieldName, List&lt;List&lt;SObject>> children)](https://github.com/apex-enterprise-patterns/fflib-apex-mocks/blob/master/sfdx-source/apex-mocks/main/classes/fflib_ApexMocksUtils.cls#L79) Example method call**:

```
//This is basically the same method as above, but you can pass in String to determine the object and relationship instead of types. I would
//use the method above unless this one was 110% necessary.
List<Opportunity> opportunitiesWithProductsMock = (List<Opportunity>) fflib_ApexMocksUtils.makeRelationship(
        'Opportunity',
        'OpportunityLineItem',
        new List<Opportunity>{
                opportunityMock1
        },
        'OpportunityId',
        new List<List<OpportunityLineItem>>{
                new List<OpportunityLineItem>{
                        new OpportunityLineItem(Id = fflib_IDGenerator.generate(OpportunityLineItem.SObjectType)),
                        new OpportunityLineItem(Id = fflib_IDGenerator.generate(OpportunityLineItem.SObjectType))
                }
        }
);
```

**[setReadOnlyFields(SObject objInstance, Type deserializeType, Map<SObjectField, Object> properties)](https://github.com/apex-enterprise-patterns/fflib-apex-mocks/blob/master/sfdx-source/apex-mocks/main/classes/fflib_ApexMocksUtils.cls#L98) Example method call**:

```
//Code from: https://github.com/apex-enterprise-patterns/fflib-apex-mocks
Account acc = new Account();
Integer mockFormulaResult = 10;
//This will allow you to set read only fields on your objects, such as the formula field below. Pretty useful!
acc = (Account)fflib_ApexMocksUtils.setReadOnlyFields(
		acc,
		Account.class,
		new Map<SObjectField, Object> {Account.Your_Formula_Field__c => mockFormulaResult}
);
```

---

### Example Apex Mocks Classes

[Task_Service_Impl_Test](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Task_Service_Impl_Test.cls) - Apex Mocks test class example that uses the Apex Common library.

---

### You've reached the end!

That's it! You're done! Thank god... I'm tired of writing this thing. You can go back to the [home page here.](./index)
