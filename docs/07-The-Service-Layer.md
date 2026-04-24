---
layout: default
title: "7) The Service Layer"
nav_order: 8
---

# The Service Layer

### Video Tutorial 

[![The Service Layer](https://img.youtube.com/vi/5tM_MHV1ypY/hqdefault.jpg)](https://youtu.be/5tM_MHV1ypY "The Service Layer")

---

### What is the Service Layer?

The Service Layer, "Defines an application's boundaries with a layer of services that establishes a set of available operations and coordinates the application's response in each operation". - Martin Fowler

This essentially just means that the service layer should house your business logic. It should be a centralized place that holds code that represents business logic for each object (database table) or the service layer logic for a custom built app in your org (more common when building managed packages).

_Difference between the Service Layer and Domain Layer -_ People seem to often confuse this layer with the Domain layer. The Domain layer is only for object specific default operations (triggers, validations, updates that should always execute on a database transaction, etc). The Service layer is for business logic for major modules/applications in your org. Sometimes that module is represented by an object, sometimes it is represented by a grouping of objects. Domain layer logic is specific to each individual object whereas services often are not.

---


### Service Layer Naming Conventions

**_Class Names -_**  Your service classes should be named after the area of the application your services represent. Typically services classes are created for important objects or applications within your org.

_Service Class Name Examples (Note that I prefer underscores in class names, this is just personal preference):_

```
Account_Service 
DocumentGenerationApp_Service
```
_**Method Names -**_ The public method names should be the names of the business operations they represent. The method names should reflect what the end users of your system would refer to the business operation as. Service layer methods should also ideally always be static.

**_Method Parameter Types and Naming -_** The method parameters in public methods for the service layer should typically only accept collections (Map, Set, List) as the majority of service layer methods should be bulkified (there are some scenarios however that warrant non-collection types). The parameters should be named something that reflects the data they represent. 

_Service Class Method Names and Parameter Examples:_

```
public static void calculateOpportunityProfits(List<Account> accountsToCalculate)
public static void generateWordDocument(Map<String, SObject> sObjectByName)
```

---

### Service Layer Security

**_Service Layer Security Enforcement -_** Service layers hold business logic so by default they should at minimum use `inherited sharing` when declaring the classes, however I would suggest always using `with sharing` and allowing developers to elevate the code to run `without sharing` when necessary by using a private inner class. 

_Example Security for a Service Layer Class:_

```
public with sharing class Account_Service{
    public static void calculateOpportunityProfits(List<Account> accountsToCalculate){
        //code here
        new Account_Service_WithoutSharing().calculateOpportunityProfits_WithoutSharing(accountsToCalculate);
    }

    private without sharing class Account_Service_WithoutSharing{
        public void calculateOpportunityProfits_WithoutSharing(List<Account> accountsToCalculate){
            //code here
        }
    }
}
```



---

### Service Layer Code Best Practices

**_Keeping the code as flexible as possible_**

You should make sure that the code in the service layer does not expect the data passed to it to be in any particular format. For instance, if the service layer code is expecting a List of Accounts that has a certain set of fields filled out, your service method has just become very fragile. What if the service needs an additional field on that list of accounts to be filled out in the future to do its job? Then you have to refactor all the places building lists of data to send to that service layer method.  

Instead you could pass in a set of Account Ids, have the service method query for all the fields it actually requires itself, and then return the appropriate data. This will make your service layer methods much more flexible.


**_Transaction Management_**

Your service layer method should handle transaction management (either with the unit of work pattern or otherwise) by making sure to leverage Database.setSavePoint() and using try catch blocks to rollback when the execution fails. 

_Transaction management example_
```
public static void calculateOpportunityProfits(Set<Id> accountIdsToCalculate){
        List<Account> accountsToCalculate = [SELECT Id FROM Account WHERE Id IN : accountIdsToCalculate];
        System.Savepoint savePoint = Database.setSavePoint();
        try{
            database.insert(accountsToCalculate);
        }
        catch(Exception e){
            Database.rollback(savePoint);
            throw e;
        }
}
```


**_Compound Services_**

Sometimes code needs to call more than one method in the service layer of your code. In this case instead of calling both service layer methods from your calling code like in the below example, you would ideally want to create a compound service method in your service layer.

_Example calling both methods (not ideal)_
```
try{
    Account_Service.calculateOpportunityProfits(accountIds);
    Account_Service.calculateProjectedOpportunityProfits(accountIds);
}
catch(Exception e){
    throw e;
}

```
The reason the above code is detrimental is that you would either have one of two side effects. The transaction management would only be separately by each method and one could fail and the other could complete successfully, despite the fact we don't actually want that to happen. Alternatively you could handle transaction management in the class calling the service layer, which isn't ideal either.  

Instead we should create a new method in the service layer that combines those methods and handles the transaction management in a cleaner manner.

_Example calling the compound method_

```
try{
    Account_Service.calculateRealAndProjectedOpportunityProfits(accountIds);
}
catch(Exception e){
    throw e;
}
```

---

### Implementing the Service Layer

To find out how to implement the Service Layer using the Apex Common Library, continue reading here: [Implementing the Service Layer with the Apex Common Library](./08-Implementing-the-Service-Layer-with-the-Apex-Common-Library). If you're not interested in utilizing the Apex Common Library, no worries, there are really no frameworks to implement a Service Layer (to my knowledge) because this is literally just a business logic layer so every single orgs service layer will be different. The only thing Apex Common assists with here is abstracting the service layer to assist with Unit Test mocking and to make your service class instantiations more dynamic.

**_Libraries That Could Be Used for the Service Layer_**

None to my knowledge although the [Apex Common Library](https://github.com/apex-enterprise-patterns/fflib-apex-common) provides a good foundation for abstracting your service layers to assist with mocking and more dynamic class instantiations.

---

### Service Layer Examples

**_Apex Common Example (Suggested)_**

All three of the below classes are tied together. We'll go over how this works in the next section.

[Task Service Interface](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Task_Service_Interface.cls)

[Task Service Class](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Task_Service.cls)

[Task Service Implementation Class](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Task_Service_Impl.cls)  

---

### Next Section

[Part 8: Implementing the Service Layer with the Apex Common Library](./08-Implementing-the-Service-Layer-with-the-Apex-Common-Library)
