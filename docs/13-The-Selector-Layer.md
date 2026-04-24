---
layout: default
title: "13) The Selector Layer"
nav_order: 14
---

# The Selector Layer

<iframe width="100%" height="400" src="https://www.youtube.com/embed/cPU6D-TpLvs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

### What is the Selector Layer

The Selector Layer is Salesforce is based off [Martin Fowler's Data Mapper Layer concept](https://martinfowler.com/eaaCatalog/dataMapper.html). It's, "a layer of Mappers that moves data between objects and a database while keeping them independent of each other and the Mapper itself".

In most tech stacks when you want to represent records in a database table you create classes in your code base to represent them to hold them in memory and prep them for transit to the actual database. These are what Martin references as "objects" in the above quote. Salesforce already creates these classes for you in the background to represent your Custom and Standard Objects. It's why you can just inherently write `Case cs = new Case();` in Apex and it creates a brand new Case record for you.  

Since Salesforce already does that work for you, the Data Mapper Layer, just turns into the Selector Layer and within the Selector Layer we are basically just concerned with housing and performing queries for our respective objects. You will ideally call upon the Selector Layer every single time you need to make a query in Apex. The largest goal with this layer is to avoid having repetitive queries everywhere within the system and to have some overall consistency with your object queries (the fields always queried, limits, order by clause, etc).

---

### When to make a new Selector Layer Class

Whenever you need to create queries on an object you've never done queries on before, you would create a new Selector Layer Class. So for instance if you needed to create some queries for the case object to use in your service or domain layer classes, you would create a Case Selector class. There should typically be one selector class per object you intend to query on. 

--- 

### Selector Layer Naming Conventions

**_Class Names_** - Your classes should ideally follow the naming conventions of the domain layer just with Selector appended to the end of them, unless you have common cross object queries then it's a bit different.

_Selector Class Naming Examples (Note that I prefer underscores in names, this is personal preference):_  

```
Accounts_Selector
Opportunities_Selector
OpportunityQuotes_Selector
```

**_Method Naming and Signatures_** - The names of the methods in a selector class should all start with the word "select". They should also only return a list, map or QuerySelector and should only accept bulkified parameters (Sets, Lists, Maps, etc). A few good examples of method examples are below.

_Selector Method Examples_  

```
public List<sObject> selectById(Set<Id> sObjectIds)
public List<sObject> selectByAccountId(Set<Id> accountIds)
public Database.QueryLocator selectByLastModifiedDate(Date dateToFilterOn)
```

---

### Selector Layer Security

The Selector Layer classes should all ideally inherit their sharing from the classes calling them. So they should typically be declared as follows:

```
public inherited sharing class Account_Selector
```

If there are queries for your object that you absolutely must have run in system context (without sharing) you would want to elevate those permissions through the use of a private inner class like so:

```
public inherited sharing class Account_Selector 
{
    public List<Account> selectAccountsById(Set<Id> acctIds){
        return new Account_Selector_WithoutSharing().selectAccountsByIdElevated(acctIds);
    } 

    private without sharing Account_Selector_WithoutSharing{
        public List<Account> selectAccountsByIdElevated(Set<Id> acctIds){
            return [SELECT Id FROM Account WHERE Id IN : acctIds]; 
        }
    }
}

```

---

### Implementing the Selector Layer

To find out how to implement the Selector Layer using Apex Commons, continue reading here: [Implementing the Selector Layer with the Apex Common Library](./14-Implementing-the-Selector-Layer-with-the-Apex-Common-Library). If you're not interested in utilizing the Apex Common library for this layer there are pretty sparing options out there that are pre-built, the only other option I'm aware of at this time is Query.apex. Outside of that, you could certainly roll your own selector layer, but it is no small feat if done right.

**_Libraries That Could Be Used for the Domain Layer_**

[Apex Common (Contains a framework for all layers)](https://github.com/apex-enterprise-patterns/fflib-apex-common)  

[Query.apex](https://github.com/PropicSignifi/Query.apex)


---

### Selector Layer Examples

**_Apex Common Examples (Suggested)_**  

[Case Object Selector Example (Lots of comments)](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Case_Selector.cls)  

[Contact Object Selector Example](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Contact_Selector.cls)  

[Task Object Selector Example](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Task_Selector.cls)

**_Non Apex Common Examples_** 

[Case Object Selector Simple Example](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Simple_SoC_Layer_Examples/Case_Selector_Simple.cls) 

---

### Next Section

[Part 14: Implementing the Selector Layer with the Apex Common Library](./14-Implementing-the-Selector-Layer-with-the-Apex-Common-Library)
