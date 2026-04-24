---
layout: default
title: "5) The Unit of Work Pattern"
nav_order: 6
---

# The Unit of Work Pattern

### Video Tutorial 

[![The Unit of Work Pattern](https://yt-embed.herokuapp.com/embed?v=ugr7OCZ3ZOM)](https://youtu.be/ugr7OCZ3ZOM "The Unit of Work Pattern")

---

### What is the Unit of Work Pattern (UOW) 

A [Unit of Work](https://martinfowler.com/eaaCatalog/unitOfWork.html), "Maintains a list of objects affected by a business transaction and coordinates the writing out of changes and the resolution of concurrency problems".

The goal of the unit of work pattern is to simplify DML in your code and only commit changes to the database/objects when it's truly time to commit. Considering the many limits around DML in Salesforce, it's important to employ this pattern in your org in some way. It's also important to note that this, "maintains a list of objects affected by a business transaction", which indicates that the UOW pattern should be prevalent in your service layer (The service layer houses business logic). 

The UOW pattern also ensures we don't have data inconsistencies in our Salesforce instance. It does this by only committing work when all the DML operations complete successfully. It rolls back our transactions when any DML fails in our unit of work.


---

### Benefits of the using the Unit of Work Pattern in Salesforce

There are several, but here are the biggest of them all... massive amounts of code reduction, having consistency with your DML transactions, doing the minimal DML statements feasible (bulkification) and DML mocking in unit tests. Let's figure out how we reduce the code and make it more consistent first.


**_The Code Reduction and Consistency_**

Think about all the places in your codebase where you insert records, error handle the inserting of your records and manage the transactional state of your records (Savepoints). Maybe if your org is new there's not a ton happening yet, but as it grows the amount of code dealing with that can become enormous and, even worse, inconsistent. I've worked in 12 year old orgs that had 8000+ lines of code just dedicated to inserting records throughout the system and with every dev who wrote the code a new variety of transaction management took place, different error handling (or none at all), etc. 

**_Code Bulkification_**

The unit of work pattern also helps a great deal with code bulkification. It encourages you to to finish creating and modifying 100% of your records in your transaction prior to actually committing them (doing the dml transactions) to the database (objects). It makes sure that you are doing that absolute minimal transactions necessary to be successful. For instance, maybe for some reason in your code you are updating cases in one method, and when you're done you call another method and it updates those same cases... why do that? You could register all those updates and update all those cases at once with one DML statement. Whether you realize it at the time or not, even dml statement counts... use them sparingly.

**_DML Mocking for Unit Tests_**

If you're not sure what mocking and unit test are, then definitely check out [my section on that in the wiki here](./15-The-Difference-Between-Unit-Tests-and-Integration-Tests). Basically, in an ideal scenario you would like to do unit testing, but unit testing depends on you having the ability to mock classes for you tests (basically creating fake versions of your class you have complete control over in your tests). Creating this layer that handles your dml transactions allows you to mock that layer in your classes when doing unit tests... If this is confusing, no worries, we'll discuss it a bunch more later in the last three sections of this wiki.

---

### Next Section

[Part 6: The fflib\_SObjectUnitOfWork Class](./06-The-fflib_SObjectUnitOfWork-Class)
