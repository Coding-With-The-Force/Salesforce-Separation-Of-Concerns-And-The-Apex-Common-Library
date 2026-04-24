---
layout: default
title: "10) The Domain Layer"
nav_order: 11
---

# The Domain Layer

### Video Tutorial 

[![The Domain Layer](https://yt-embed.herokuapp.com/embed?v=ZUDwBW2PftA)](https://youtu.be/ZUDwBW2PftA "The Domain Layer")

---

### What is the Domain Layer?

The Domain Layer is, ["An object model of the domain that incorporates both behavior and data"](https://martinfowler.com/eaaCatalog/domainModel.html). - Martin Fowler  

In most coding languages you need to connect to the database, query for the data and then you create wrapper classes to represent each underlying table in your database(s) to allow you to define how that particular table (object) should behave. Salesforce, however, already does a lot of this for you, for instance there is no need to connect to a Database, declarative behavior for you tables (objects) are already represented and your tables (objects) already have wrapper classes pre-defined for them (Ex: `Contact cont = new Contact()`).  

However the logic represented in a trigger is an exception to this rule. Apex triggers represent a unique scenario on the Salesforce platform, they are necessary for complex logic, but inherently they do not abide by any object oriented principles. You can't create public methods in them, you can't unit test them, you can't re-use logic placed directly in a trigger anywhere else in your system, etc. Which is a massive detriment we need to overcome. That's where the domain layer comes in to play.

The Domain Layer will allow you on an object by object basis have an object oriented approach to centralize your logic. Basically, logic specific to a single object will be located in one place and only one place by using the domain layer. This ensures your logic specific to a single object isn't split into a ton of different places across your org.

---

### When to make a new Domain Layer Class

Basically, at the very least, anytime you need to make a trigger on an object you should implement a Domain Class. However this is a bit generalized, sometimes you don't actually need a trigger on an object, but you have object specific behavior that should be implemented in a Domain class. For instance, if you have an object that doesn't need a trigger, but it has a very specific way it should have its tasks created, you should probably create a Domain Layer class for that object and put that task creation behavior there. 

A domain layer class is essentially a mixture of a trigger handler class and a class that represents object specific behaviors. 

--- 


### Where should you leverage the domain layer in your code?

You should only ever call to the domain layer code from service class methods or from other domain class methods. Controller, Batch Classes, etc should never call out to the domain directly.

---


### Domain Class Naming Conventions

**_Class Names -_** Domain classes should be named as the plural of whatever object you are creating a domain layer for. For instance if you were creating a domain layer class for the Case object, the class would be declared as follows: `public inherited sharing class Cases`. This indicates that the class should be bulkified and handles multiple records, not a single object record.

**_Class Constructor -_** The constructor of these classes should always accept a list of records. This list of records will be leveraged by all of the methods within the domain class. This will be further explained below.

**_Method Names -_** Method names for database transaction should use the onTransactionName naming convention (Example: `onAfterInsert`). If the method is not related to a database transaction it should descriptive to indicate what domain logic is being executed within it (Example: `determineCaseStatus`).  

**_Parameter Names and Types -_** You do not typically need to pass anything into your domain layer methods. They should primarily operate on the list of records passed in the constructor in the majority of situations. However some behavior based (non-trigger invoked) methods may need other domain objects and/or units of work passed to them. This will be further explained in the sections below.  

---

### Domain Layer Best Practices

**_Trasnaction Management_**  

In the event you are actually performing DML operations in your Domain class, you should either create a [Unit of Work](./05-The-Unit-of-Work-Pattern) or have one passed into the method doing the DML to appropriately manage your transaction. In the event you are not wanting to leverage the unit of work pattern you should make sure to at the very least set your `System.Savepoint savePoint = Database.setSavePoint();` prior to doing your DML statement and use a try catch block to rollback if the DML fails.  


---

### Implementing the Domain Layer

To find out how to implement the Domain Layer using Apex Common, continue reading here: [Implementing the Domain Layer with the Apex Common Library](./11-Implementing-The-Domain-Layer-with-the-Apex-Common-Library). If you're not interested in utilizing the Apex Common library for this layer you can implement really any trigger framework and the core of the domain layer will be covered.

**_Libraries That Could Be Used for the Domain Layer_**

[Apex Common (Contains a framework for all layers)](https://github.com/apex-enterprise-patterns/fflib-apex-common)  

[Apex Trigger Actions Framework](https://github.com/mitchspano/apex-trigger-actions-framework)

[SFDC Trigger Framework](https://github.com/kevinohara80/sfdc-trigger-framework)

[MyTriggers](https://github.com/appero-com/MyTriggers)

---

### Domain Layer Examples

**_Apex Common Examples (Suggested)_**

[Case Object Domain Layer Example](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Cases.cls)

[Contact Object Domain Layer Example](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Contacts.cls)

**_SFDC Trigger Framework Example_**

[Case Object Domain Layer Example](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Simple_SoC_Layer_Examples/Case_Trigger_Handler.cls)

---

### Next Section

[Part 11: Implementing the Domain Layer with the Apex Common Library](./11-Implementing-The-Domain-Layer-with-the-Apex-Common-Library)     
