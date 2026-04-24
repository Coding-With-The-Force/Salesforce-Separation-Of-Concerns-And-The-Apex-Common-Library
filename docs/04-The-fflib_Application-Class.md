---
layout: default
title: "4) The fflib_Application Class"
nav_order: 5
---

# The fflib_Application Class

### Video Tutorial 

[![The fflib_Application Class](https://yt-embed.herokuapp.com/embed?v=pUvDyNXNFNs)](https://youtu.be/pUvDyNXNFNs "The fflib_Application Class")

---
### What is the fflib_Application class?

Quality question... I mean honestly wtf is this thing? Lol, sorry, let's figure it out together. The fflib_Application class is around for two primary purposes. The first is to allow you an extremely abstract way of creating new instances of your [unit of work](./05-The-Unit-of-Work-Pattern), [service layer](./08-Implementing-the-Service-Layer-with-the-Apex-Common-Library), [domain layer](./11-Implementing-The-Domain-Layer-with-the-Apex-Common-Library) and [selector layer](./14-Implementing-the-Selector-Layer-with-the-Apex-Common-Library) in the [Apex Common Library](./02-Introduction-to-the-Apex-Common-Library) through the use of [the factory pattern](./03-The-Factory-Method-Pattern). The second is that implementing this application class is imperative if you want to leverage the Apex Mocks unit testing library. It depends on this Application Factory being implemented.

Most importantly though, if you understand how interfaces, inheritance and polymorphism work implementing this class allows you to write extremely abstract Salesforce implementations, which we'll discuss more in sections below

---

### Why is this class used?

Ok, if we ignore the fact that this is required for us to use the Apex Mocks library, understanding the power behind this class requires us to take a step back and formulate a real world Salesforce use case for implementing it... hopefully the following one will be easy for everyone to understand.

Say for instance I have a decent sized Salesforce instance and our business has a use case to create tasks across multiple objects and the logic for creating those tasks are unique to every single object. Maybe on the Account object we create three new tasks every single time we create an account and on the Contact object we create two tasks every single time a record is created or updated in a particular way and we ideally want to call this logic on the fly from anywhere in our system. 

No matter what we should probably place the task creation logic in our domain layer because it's relevant to each individual object, but pretend for a second that we have like 20 different objects we need this kind of functionality on. Maybe we need the executed logic in an abstract "task creator" button that can be placed on any lightning app builder page and maybe some overnight batch jobs need to execute the logic too. 

Well... what do we do? Let's just take the abstract "Task Creator" button we might want to place on any object in our system. We could call each individual domain layer class's task creation logic in the code based on the object we were on (code example below), but that logic tree could get massive and it's not super ideal. 

_Task Service example with object logic tree_
```
public with sharing class Task_Service_Impl
{
	//This method calls the task creators for each object type
	public void createTasks(Set<Id> recordIds, Schema.SObjectType objectType)
	{
            if(objectType == Account.getSObjectType()){
                new Accounts().createTasks(recordIds);
            }
            else if(objectType == Case.getSObjectType()){
                new Cases().createTasks(recordIds);
            }
            else if(objectType == Opportunity.getSObjectType()){
                new Opportunities().createTasks(recordIds);
            }
            else if(objectType == Taco__c.getSObjectType()){
                new Tacos().createTasks(recordIds);
            }
            else if(objectType == Chocolate__c.getSObjectType()){
                new Chocolates().createTasks(recordIds);
            }
            //etc etc for each object could go on for decades
        }
}
```

Maybe... just maybe there's an easier way. This is where the factory pattern and the fflib_Application class come in handy. Through the use of the factory pattern we can create an abstract Task Service that can (based on a set of records we pass to it) select the right business logic to execute in each domain layer dynamically.

_Task Service example with the factory pattern ([example with a ton of comments explaining this here](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Task_Service_Impl.cls))_
```
//Creation of the Application factory class
public with sharing class Application
{
	public static final fflib_Application.ServiceFactory service =
			new fflib_Application.ServiceFactory(
					new Map<Type, Type>{
							Task_Service_Interface.class => Task_Service_Impl.class}
			);

	public static final fflib_Application.DomainFactory domain =
			new fflib_Application.DomainFactory(
					Application.selector,
					new Map<SObjectType, Type>{Case.SObjectType => Cases.Constructor.class,
					Opportunity.SObjectType => Opportunities.Constructor.class,
                                        Account.SObjectType => Accounts.Constructor.class,
                                        Taco__c.SObjectType => Tacos.Constructor.class,
                                        Chocolate__c.SObjectType => Chocolates.Constructor.class}
			);
}
```
```
//The task service that anywhere can call and it will operate as expected with super minimal logic
public with sharing class Task_Service_Impl implements Task_Service_Interface
{
        //This method calls the task creators for each object type
	public void createTasks(Set<Id> recordIds, Schema.SObjectType objectType)
	{
		fflib_ISObjectDomain objectDomain = Application.domain.newInstance(recordIds);

		if(objectDomain instanceof Task_Creator_Interface){
			Task_Creator_Interface taskCreator = (Task_Creator_Interface)objectDomain;
			taskCreator.createTasks(recordIds);
		}
	}
}

```

You might be lookin at the two code examples right now like wuttttttttt how thooooo?? And I just wanna say, I fully understand that. The first time I saw this implemented I thought the same thing, but it's a pretty magical thing. Thanks to the `newInstance()` methods on the fflib_Application class and the `Task_Creator_Interface` we've implemented on the domain classes, you can dynamically generate the correct domain when the code runs and call the create tasks method. Pretty wyld right? Also if you're thinkin, "Yea that's kinda nifty Matt, but you had to create this Application class and that's a bunch of extra code." you need to step back even farther. This Application factory can be leveraged ANYWHERE IN YOUR ENTIRE CODEBASE! Not just locally in your service class. If you need to implement something similar to automatically generate opportunities or Accounts or something from tons of different objects you can leverage this exact same Application class there. In the long run, this ends up being wayyyyyyyyy less code. 

If you want a ton more in depth explanation on this, please watch the tutorial video. We code a live example together so I can explain this concept. It's certainly not easy to grasp at first glance.    

---

### fflib_Application inner classes and methods cheat sheet

Inside the [fflib_Application](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls) class there are four classes that represent factories for the your unit of work, service layer, domain layer and selector layer.

Let's go over them and how they work:

**_The Unit of Work Factory_**

Inside the [fflib_Application](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls) class there is the [UnitOfWorkFactory class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L37). Let's first figure out how to instantiate this class:

```
//The constructor for this class requires you to pass a list of SObject types in the dependency order. So in this instance Accounts would always be inserted before your Contacts and Contacts before Cases, etc.
public static final fflib_Application.UnitOfWorkFactory UOW =
		new fflib_Application.UnitOfWorkFactory(
			new List<SObjectType>{
                        Account.SObjectType,
                        Contact.SObjectType,
			Case.SObjectType,
			Task.SObjectType}
	);
```
---

After creating this unit of work variable above ^ in your Application class [example here](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Application.cls) there are four important new instance methods you can leverage to generate a new unit of work:
 

1) _**[newInstance()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L57)**_ - This creates a new instance of the unit of work using the SObjectType list passed in the constructor.

_**newInstance() Example Method Call**_
```
public with sharing class Application
{
    public static final fflib_Application.UnitOfWorkFactory UOW =
		new fflib_Application.UnitOfWorkFactory(
			new List<SObjectType>{
                        Account.SObjectType,
                        Contact.SObjectType,
			Case.SObjectType,
			Task.SObjectType}
    );
}

public with sharing class SomeClass{
    public void someClassMethod(){
         fflib_ISObjectUnitOfWork unitOfWork = Application.UOW.newInstance();
    }
}
```
---
2) [newInstance(fflib_SObjectUnitOfWork.IDML dml)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L71) - This creates a new instance of the unit of work using the SObjectType list passed in the constructor and a new IDML implementation to do custom DML work not inherently supported by the [fflib_SObjectUnitOfWork class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls). More info on the [IDML interface here](./06-The-fflib_SObjectUnitOfWork-Class)

_**newInstance(fflib_SObjectUnitOfWork.IDML dml) Example Method Call**_
```
public with sharing class Application
{
    public static final fflib_Application.UnitOfWorkFactory UOW =
		new fflib_Application.UnitOfWorkFactory(
			new List<SObjectType>{
                        Account.SObjectType,
                        Contact.SObjectType,
			Case.SObjectType,
			Task.SObjectType}
    );
}

//Custom IDML implementation
public with sharing class IDML_Example implements fflib_SObjectUnitOfWork.IDML
{
    void dmlInsert(List<SObject> objList){
        //custom insert logic here
    }
    void dmlUpdate(List<SObject> objList){
        //custom update logic here
    }
    void dmlDelete(List<SObject> objList){
        //custom delete logic here
    }
    void eventPublish(List<SObject> objList){
        //custom event publishing logic here
    }
    void emptyRecycleBin(List<SObject> objList){
        //custom empty recycle bin logic here
    }
}

public with sharing class SomeClass{
    public void someClassMethod(){
         fflib_ISObjectUnitOfWork unitOfWork = Application.UOW.newInstance(new IDML_Example());
    }
}
```
---
3) **_[newInstance(List&lt;SObjectType> objectTypes)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L88)_** - This creates a new instance of the unit of work and overwrites the SObject type list passed in the constructor so you can have a custom order if you need it.

_**newInstance(List &lt;SObjectType> objectTypes) Example Method Call**_
```
public with sharing class Application
{
    public static final fflib_Application.UnitOfWorkFactory UOW =
		new fflib_Application.UnitOfWorkFactory(
			new List<SObjectType>{
                        Account.SObjectType,
                        Contact.SObjectType,
			Case.SObjectType,
			Task.SObjectType}
    );
}

public with sharing class SomeClass{
    public void someClassMethod(){
         fflib_ISObjectUnitOfWork unitOfWork = Application.UOW.newInstance(new List<SObjectType>{
                        Case.SObjectType,
                        Account.SObjectType,
                        Task.SObjectType,
                        Contact.SObjectType,
			});
    }
}
```
---
4) **_[newInstance(List &lt;SObjectType> objectTypes, fflib_SObjectUnitOfWork.IDML dml)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L104)_** - This creates a new instance of the unit of work and overwrites the SObject type list passed in the constructor so you can have a custom order if you need it and a new IDML implementation to do custom DML work not inherently supported by the [fflib_SObjectUnitOfWork class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls). More info on the [IDML interface here](./06-The-fflib_SObjectUnitOfWork-Class)

_**newInstance(List&lt;SObjectType> objectTypes, fflib_SObjectUnitOfWork.IDML dml) Example Method Call**_
```
public with sharing class Application
{
    public static final fflib_Application.UnitOfWorkFactory UOW =
		new fflib_Application.UnitOfWorkFactory(
			new List<SObjectType>{
                        Account.SObjectType,
                        Contact.SObjectType,
			Case.SObjectType,
			Task.SObjectType}
    );
}

//Custom IDML implementation
public with sharing class IDML_Example implements fflib_SObjectUnitOfWork.IDML
{
    void dmlInsert(List<SObject> objList){
        //custom insert logic here
    }
    void dmlUpdate(List<SObject> objList){
        //custom update logic here
    }
    void dmlDelete(List<SObject> objList){
        //custom delete logic here
    }
    void eventPublish(List<SObject> objList){
        //custom event publishing logic here
    }
    void emptyRecycleBin(List<SObject> objList){
        //custom empty recycle bin logic here
    }
}

public with sharing class SomeClass{
    public void someClassMethod(){
         fflib_ISObjectUnitOfWork unitOfWork = Application.UOW.newInstance(new List<SObjectType>{
                        Case.SObjectType,
                        Account.SObjectType,
                        Task.SObjectType,
                        Contact.SObjectType,
			}, new IDML_Example());
    }
}
```
---

**_The Service Factory_**

Inside the [fflib_Application](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls) class there is the [ServiceFactory class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L123). Let's first figure out how to instantiate this class:

```
//This allows us to create a factory for instantiating service classes. You send it the interface for your service class
//and it will return the correct service layer class
//Exmaple initialization: Object objectService = Application.service.newInstance(Task_Service_Interface.class);
public static final fflib_Application.ServiceFactory service =
	new fflib_Application.ServiceFactory(new Map<Type, Type>{
		SObject_SharingService_Interface.class => SObject_SharingService_Impl.class
	});

```
---

After creating this service variable above ^ in your Application class [example here](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Application.cls) there is one important new instance method you can leverage to generate a new service class instance:

1) _**[newInstance(Type serviceInterfaceType)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L151)**_ - This method sends back an instance of your service implementation class based on the interface you send in to it.

_**newInstance(Type serviceInterfaceType) Example method call:**_
```
//This is using the service variable above that we would've created in our Application class
Application.service.newInstance(Task_Service_Interface.class);
```

---

**_The Selector Factory_**  

Inside the [fflib_Application](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls) class there is the [SelectorFactory class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L174). Let's first figure out how to instantiate this class:

```
//This allows us to create a factory for instantiating selector classes. You send it an object type and it sends
//you the corresponding selectory layer class.
//Example initialization: fflib_ISObjectSelector objectSelector = Application.selector.newInstance(objectType);
public static final fflib_Application.SelectorFactory selector =
	new fflib_Application.SelectorFactory(
		new Map<SObjectType, Type>{
			Case.SObjectType => Case_Selector.class,
			Contact.SObjectType => Contact_Selector.class,
			Task.SObjectType => Task_Selector.class}
	);
```
---

After creating this selector variable above ^ in your Application class [example here](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Application.cls) there are three important methods you can leverage to generate a new selector class instance:

1) _**[newInstance(SObjectType sObjectType)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L198)**_ - This method will generate a new instance of the selector based on the object type passed to it. So for instance if you have an Opportunity_Selector class and pass Opportunity.SObjectType to the newInstance method you will get back your Opportunity_Selector class (pending you have configured it this way in your Application class map passed to the class.

_**newInstance(SObjectType sObjectType) Example method call:**_ 

```
//This is using the selector variable above that we would've created in our Application class
Application.selector.newInstance(Case.SObjectType);
```

---

2) _**[selectById(Set&lt;Id> recordIds)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L221)**_ - This method, based on the ids you pass will automatically call your registered selector layer class for the set of ids object type. It will then call the selectSObjectById method that all Selector classes must implement and return a list of sObjects to you.

_**selectById(Set&lt;Id> recordIds) Example method call:**_

```
//This is using the selector variable above that we would've created in our Application class
Application.selector.selectById(accountIdSet);
```

---

3) _**[selectByRelationship(List&lt;SObject> relatedRecords, SObjectField relationshipField)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L249)**_ - This method, based on the relatedRecords and the relationship field passed to it will generate a selector layer class for the object type in the relationship field. So say you were querying the Contact object and you wanted an Account Selector class, you could call this method it, pass the list of contacts you queried for and the AccountId field to have an Account Selector returned to you (pending that selector was configured in the Application show above in this wiki article).

_**selectByRelationship(List&lt;SObject> relatedRecords, SObjectField relationshipField) Example method call:**_

```
//This is using the selector variable above that we would've created in our Application class
Application.selector.selectByRelationship(contactList, Contact.AccountId);
```

---

**_The Domain Factory_**  

Inside the [fflib_Application](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls) class there is the [DomainFactory class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L271). Let's first figure out how to instantiate this class:

```
//This allows you to create a factory for instantiating domain classes. You can send it a set of record ids and
//you'll get the corresponding domain layer.
//Example initialization: fflib_ISObjectDomain objectDomain = Application.domain.newInstance(recordIds);
public static final fflib_Application.DomainFactory domain =
	new fflib_Application.DomainFactory(
		Application.selector,
		new Map<SObjectType, Type>{Case.SObjectType => Cases.Constructor.class,
		Contact.SObjectType => Contacts.Constructor.class}
	);
```
---

After creating this domain variable above ^ in your Application class [example here](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Application.cls) there are three important methods you can leverage to generate a new domain class instance:

1) _**[newInstance(Set&lt;Id> recordIds)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L304)**_ - This method creates a new instance of your domain class based off the object type in the set of ids you pass it.

_**newInstance(Set&lt;Id> recordIds) Example method call:**_

```
Application.domain.newInstance(accountIdSet);

```

---

2) _**[newInstance(List&lt;SObject> records)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L318)**_ - This method creates a new instance of your domain class based off the object type in the list of records you pass it.

_**newInstance(List&lt;SObject> records) Example method call:**_

```
Application.domain.newInstance(accountList);

```

---

3) _**[newInstance(List&lt;SObject> records, SObjectType domainSObjectType)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L350)**_ - This method will create a newInstance of the domain class based on the object type and record list passed to it.

_**newInstance(List&lt;SObject> records, SObjectType domainSObjectType) Example method call:**_

```
Application.domain.newInstance(accountList, Account.SObjectType);

```
---

### The setMock Methods

In every factory class inside the fflib_Application class there is a [setMock method](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls#L114). These methods are used to pass in mock/fake versions of your classes for [unit testing purposes](./15-The-Difference-Between-Unit-Tests-and-Integration-Tests). Make sure to leverage this method if you are planning to do unit testing. Leveraging this method eliminates the need to use [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) in your classes to allow for mocking. There are examples of how to leverage this method in the [Implementing Mock Unit Testing with Apex Mocks](./17-Implementing-Mock-Unit-Tests-with-the-Apex-Mocks-Library) section of this wiki.

---

### Next Section

[Part 5: The Unit of Work Pattern](./05-The-Unit-of-Work-Pattern)
