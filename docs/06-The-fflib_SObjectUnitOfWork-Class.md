---
layout: default
title: "6) The fflib_SObjectUnitOfWork Class"
nav_order: 7
---

# The fflib_SObjectUnitOfWork Class

### Video Tutorial 

[![The fflib_SObjectUnitOfWork Class](https://img.youtube.com/vi/T14iEOcy_Kg/hqdefault.jpg)](https://youtu.be/T14iEOcy_Kg "The fflib_SObjectUnitOfWork Class")

---

### What is the fflib_SObjectUnitOfWork class?

It is a foundation built to allow you to leverage the unit of work design pattern from within Salesforce. Basically this class is designed to hold your database operations (insert, update, etc) in memory until you are ready to do all of your database transactions in one big transaction. It also handles savepoint rollbacks to ensure data consistentcy. For instance, if you are inserting Opportunities with Quotes in the same database (DML) transaction, chances are you don't wanna insert those Opportunities if your Quotes fail to insert. The unit of work class is setup to automatically handle that transaction management and roll back if anything fails.

If also follows bulkification best practices to make your life even easier dealing with DML transactions.

---

### Why is this class used?

This class is utilized so that you can have super fine control over your database transactions and so that you only do DML transactions when every single record is prepped and ready to be inserted, updated, etc.

Additionally there are two reasons it is important to leverage this class (or a class like it):
1) To allow for DML mocking in your test classes.
2) To massively reduce duplicate code for DML transactions in your org.
3) To make DML transaction management consistent

Think about those last two for a second... how many lines of code in your org insert, update, upsert (etc) records in your org? Then think about how much code also error handles those transaction and (if you're doing things right) how much code goes into savepoint rollbacks. That all adds up over time to a ton of code. This class houses it all in one centralized apex class. You'll never have to re-write all that logic again.

---
### How to Register a Callback method for an Apex Commons UOW

The following code example shows you how to setup a callback method for your units of work using the [fflib_SObjectUnitOfWork.IDoWork interface](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L82), should you need them.

```
public inherited sharing class HelpDeskAppPostCommitLogic implements fflib_SObjectUnitOfWork.IDoWork{
    List<Task> taskList;
    
    public HelpDeskAppPostCommitLogic(List<Task> taskList){
        this.taskList = taskList; 
    }
    
    public void doWork(){
        //write callback code here
    }
}
```

The code below shows you how to actually make sure your unit of work calls your callback method.

```
fflib_ISObjectUnitOfWork uow = Helpdesk_Application.helpDeskUOW.newInstance();
//code to create some tasks
uow.registerNew(newTasks);
uow.registerWork(new HelpDeskAppPostCommitLogic(newTasks));
uow.commitWork();    
```
---

### Apex Commons Unit of Work Limitations

1) Records within the same object that have lookups to each other are currently not supported. For example, if the Account object has a Lookup to itself, that relationship cannot be registered.

2) You cannot do all or none false database transactions without creating a custom IDML implementation.

```
Database.insert(acctList, false);
```  
3) To send emails with the Apex Commons UOW you must utilize the special registerEmail method.

4) It does not manage FLS and CRUD without implementing a custom class that implements the IDML interface and does that for you. 

To do these things in your own way you would need to make a new class that implements the [fflib_SObjectUnitOfWork's IDML interface](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L87) which we'll cover below

---

### How and When to use the fflib_SObjectUnitOfWork IDML Interface

If your unit of work needs a custom implementation for inserting, updating, deleting, etc that is not supported by the [SimpleDML inner class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L96) then you are gonna want to create a new class that implements the `fflib_SObjectUnitOfWork.IDML` interface. After you create that class if you were using the Application factory you would instantiate your unit of work like so `Application.uow.newInstance(new customIDMLClass());` otherwise you would initialize it using `public static fflib_SObjectUnitOfWork uow = new fflib_SObjectUnitOfWork(new List<SObjectType>{Case.SObjectType}, new customIDMLClass());`. A CUSTOM IDML CLASS IS SUPER IMPORTANT IF YOU WANT TO MANAGE CRUD AND FLS!!! THE fflib_SObjectUnitOfWork class does not do that for you! So let's check out an example of how to implement a custom IDML class together below.

_Example of an IDML Class_
```
//Implementing this class allows you to overcome to limitations of the regular unit of work class.
public with sharing class IDML_Example implements fflib_SObjectUnitOfWork.IDML
{
    public void dmlInsert(List<SObject> objList){
        //custom insert logic here
    }
    public void dmlUpdate(List<SObject> objList){
        //custom update logic here
    }
    public void dmlDelete(List<SObject> objList){
        //custom delete logic here
    }
    public void eventPublish(List<SObject> objList){
        //custom event publishing logic here
    }
    public void emptyRecycleBin(List<SObject> objList){
        //custom empty recycle bin logic here
    }
}
```

---

### fflib_SObjectUnitOfWork class method cheat sheet

This does not encompass all methods in the [fflib_SObjectUnitOfWork class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls), however it does cover the most commonly used methods. There are also methods in this class to publish platform events should you need them but they aren't covered below.

1) _**[registerNew(SObject record)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L243) -**_ Registers a single record as a new record that need to be inserted.  
2) **_[registerNew(List&lt;SObject> records)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L253) -_** Registers a list of records as new records that need to be inserted.  
3) _**[registerNew(SObject record, Schema.SObjectField relatedToParentField, SObject relatedToParentRecord)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L269) -**_ Registers a new record that needs to be inserted with a parent record relationship (this parent needs to have also been registered as a new record in your unit of work).  
4) _**[registerRelationship(SObject record, Schema.SObjectField relatedToField, SObject relatedTo)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L291) -**_ Registers a relationship between two records that have yet to be inserted into the database. Both records need to be registered in your unit of work.  
5) **_[registerRelationship( Messaging.SingleEmailMessage email, SObject relatedTo )](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L309) -_** This method will allow you to register a relationship between an email message and a record. Both the email message and the record need to be registered in your unit of work to allow this to work.  
6) **_[registerRelationship(SObject record, Schema.SObjectField relatedToField, Schema.SObjectField externalIdField, Object externalId)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L327) -_** This method can be used to register a relationship between one record and another using an external id field. There is an example of how to implement this in the comments for this method linked above.  
7) _**[registerDirty(SObject record)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L341) -**_ Registers a single record to be updated.
8) **_[registerDirty(List<SObject> records, List<SObjectField> dirtyFields)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L352) -_** This method should be used if you believe you've already registered a list of records to be updated by your unit of work and some of that records fields have been updated. This basically merges those new field updates into your already registered record.  
9) **_[registerDirty(SObject record, List<SObjectField> dirtyFields)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L366) -_** This method should be used if you believe you've already registered a record to be updated by your unit of work and some of that records fields have been updated. This basically merges those new field updates into your already registered record.  
10) **_[registerDirty(SObject record, Schema.SObjectField relatedToParentField, SObject relatedToParentRecord)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L402) -_** This method is used to register an update to a record while also registering a new relationship to another record that has been registered as a new record in the same unit of work.   
11) **_[registerDirty(List&lt;SObject> records)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L421) -_** This method is used to register a list of records to be updated.  
12) **_[registerUpsert(SObject record)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L434) -_** This method is used to register a single record to be upserted.
13) **_[registerUpsert(List&lt;SObject> records)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L451) -_** This method is used to register a list of records for an upsert.
14) _**[registerDeleted(SObject record)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L464) -**_ Registers a single record to be deleted.  
15) **_[registerDeleted(List&lt;SObject> records)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L481) -_** Registers a list of records to be deleted.  
16) **_[registerPermanentlyDeleted(List&lt;SObject> records)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L494) -_** Registers a list of records to be permanently deleted. Basically it deletes records and then removes them from the recycle bin as well.  
17) **_[registerPermanentlyDeleted(SObject record)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L505) -_** Registers a record to be permanently deleted from the org. Basically it deletes records and then removes them from the recycle bin as well.  
18) **_[registerEmptyRecycleBin(SObject record)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L217) -_** This registers a record to be permanently deleted from the system by both deleting it and emptying it from the recycle bin.
19) **_[public void registerEmptyRecycleBin(List&lt;SObject> records)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L230)-_** This takes a list of records and permanently deletes them from the system.
20) _**[registerEmail(Messaging.Email email)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L207) -**_ Registers an email message to be sent
21) _**[registerWork(IDoWork work)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L199) -**_ Registers a callback method to be called after your work has been committed to the database.
22) _**[commitWork()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls#L597) -**_ Commits your unit of work (records registered) to the database. This should always be called last.   

---

### Next Section

[Part 7: The Service Layer](./07-The-Service-Layer) 
