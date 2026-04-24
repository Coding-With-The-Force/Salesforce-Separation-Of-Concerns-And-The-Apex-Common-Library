---
layout: default
title: "11) Implementing The Domain Layer with the Apex Common Library"
nav_order: 12
---

# Implementing The Domain Layer with the Apex Common Library

### Video Tutorial 

[![Implementing the Domain Layer with The Apex Common Library](https://yt-embed.herokuapp.com/embed?v=9kbUvY1uMIE)](https://youtu.be/9kbUvY1uMIE "Implementing the Domain Layer with The Apex Common Library")

---

### The template for every Domain Class you create

Every Domain layer class you create for an object should at minimum have the following logic in it for it to work as expected.

```
//All domain classes should utilize inherited sharing so that the caller determines whether it should operate in system context or not. The should
//also extend the fflib_SObjectDomain class
public inherited sharing class Cases extends fflib_SObjectDomain{
    
    //The constructor should always accept a list of the SObject type we're creating the domain class for
    //It should then pass this list to the fflib_SObjectDomain class's constructor which is what super(cases) does.
    //This sets the records value in the fflib_SObjectDomain class which is very important 
    public Cases(List<Case> cases){
        super(cases);
    }

    //The name of this inner class must always be Constructor to work appropriately. This acts as a way to use the concept of reflection when initializing
    //this class, despite the fact apex still does not support it.
    public class Constructor implements fflib_SObjectDomain.IConstructable {
        public fflib_SObjectDomain construct(List<SObject> sObjectList) {
            return new Cases(sObjectList);
        }
    }
}
```
To understand why the Constructor inner class is necessary in these classes check out the triggerHandler method in the fflib_SObjectDomain class here: [fflib_SObjectDomain triggerHandler method](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L421)

---
### Trigger Implementations using the Apex Common Library's Domain Layer

If you didn't know already, triggers should ideally have no logic in them... ever. Thankfully this concept has also been built into the Apex Common Library. To call the Domain Layer class you have built for your object in your trigger, just do the following:

```
//Note that I like to use the _Trigger in my trigger names, this is just personal preference as it makes it easier to discern it's a trigger
trigger NameOfDomainLayerClass_Trigger on YourObject (before insert, before update, after insert, after update)
{
    //This trigger handler method eventually calls the Construct inner class of your Domain class to construct a version of your class
    //and implement the logic in it
    fflib_SObjectDomain.triggerHandler(NameOfDomainLayerClass.class);
}
```

---

### How to Access the Trigger variables in your Domain Class

Technically, you could leverage trigger.new, trigger.oldMap etc in your domain class... however you shouldn't for two reasons. The first reason is you will likely (at some point) want to call some aspects of your Domain class from outside a trigger context. If your Domain relies on the trigger context to operate, that's less than ideal. The second reason is you can't mock the trigger context, so a ton of benefit of setting up these separation of concerns will be lost. Short story, never access trigger context variables directly in your domain class. 

Now you might be wondering, "This Domain class is supposed to be able to run in trigger context... I need to access those variables!!". No worries, you can still access them when you need them. If you've worked in SF long enough, with time you start to learn the only trigger context variables you need access to are trigger.new and trigger.oldMap. The rest typically really shouldn't be used. Trust me... you don't need them.

So how do you actually get access to trigger.oldMap and trigger.new? Well that requires us to take a closer look at [the triggerHandler method](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L392) in the fflib_SObjectDomain class that our actual triggers call (example just above this section).

Basically when our trigger calls that triggerHandler method, it eventually runs the code below ([source code here](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L430)):

```
 if(isInsert) domainObject = domainConstructor.construct(newRecords);
 else if(isUpdate) domainObject = domainConstructor.construct(newRecords);
 else if(isDelete) domainObject = domainConstructor.construct(oldRecordsMap.values());
 else if(isUndelete) domainObject = domainConstructor.construct(newRecords);
```

The code above essentially passes trigger.new to the [Records variable](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#47) in the fflib_SObjectDomain class you Domain class extends when you are doing and insert, update or undelete operation; and it passes in trigger.oldMap.values to the Records variable if you are doing a delete operation.

Ok that's cool, but how do you access trigger.oldMap when you need it?? Well, the only time you need trigger.oldMap are in update operations, so that's the only time it's accessible. When you setup your onBeforeUpdate or onAfterUpdate methods in your Domain class you'll set them up like what you see below:

```
public override void onBeforeUpdate(Map<Id, SObject> existingRecords){
    //existingRecords is trigger.oldMap
} 
```

In trigger context when onBeforeUpdate gets called, trigger.oldMap is passed in to the existingRecords variable and you're free to use it as you please. 

There you have it! That's it! Simpler than you maybe thought... maybe, lol.

---

### The fflib_SObject Domain Class methods Cheat Sheet

While there are many other accessible methods in the [fflib_SObjectDomain class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls) below are the methods most commonly utilized in implementations. 

1)  **[onApplyDefaults()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L150) -** This method is called in the handleBeforeInsert method and exists so that you can apply default logic that is applicable to all new records that are created in the system.  
2)  **[onValidate()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L155) -** This method is called in the handleAfterInsert method and exists so that you can apply validation logic to your inserted records before commiting them to the database.  
3)  **[onValidate(Map<Id, SObject> existingRecords)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L160) -** This method is called in the handleAfterUpdate method and exists so that you can apply validation logic to your updated records before commiting them to the database.  
4)  **[onBeforeInsert()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L165) -** This method is called in the handleBeforeInsert method and exists so that you can override it to place logic that should occur during a before insert action in a trigger.  
5)  **[onBeforeUpdate(Map<Id, SObject>)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L170) -** This method is called in the handleBeforeUpdate method and exists so that you can override it to place logic that should occur during a before update action in a trigger.  
6)  **[onBeforeDelete()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L175) -** This method is called in the handleBeforeDelete method and exists so that you can override it to place logic that should occur during a before delete action in a trigger.  
7)  **[onAfterInsert()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#180) -** This method is called in the handleAfterInsert method and exists so that you can override it to place logic that should occur during an after insert action in a trigger.  
8)  **[onAfterUpdate(Map<Id, SObject>)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L185) -** This method is called in the handleAfterUpdate method and exists so that you can override it to place logic that should occur during an after update action in a trigger.
9)  **[onAfterDelete()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L190) -** This method is called in the handleAfterDelete method and exists so that you can override it to place logic that should occur during an after delete action in a trigger.  
10)  **[onAfterUndelete()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L195) -** This method is called in the handleAfterUndelete method and exists so that you can override it to place logic that should occur during an after undelete action in a trigger.   
11)  **[handleBeforeInsert()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L200) -** This method is called in the triggerHandler method when a beforeInsert is happening in the trigger. By default it calls the onApplyDefaults method and the onBeforeInsert method but it can be overridden and implemented in a different way if desired.     
12)  **[handleBeforeUpdate(Map<Id, SObject>)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L209) -** This method is called in the triggerHandler method when a beforeUpdate is happening in the trigger. By default it calls the onBeforeUpdate method but it can be overridden and implemented in a different way if desired.  
13)  **[handleBeforeDelete()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L217) -** This method is called in the triggerHandler method when a beforeDelete is happening in the trigger. By default it calls the onBeforeDelete method but it can be overridden and implemented in a different way if desired.
14)  **[handleAfterInsert()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L227) -** This method is called in the triggerHandler method when an afterInsert is happening in the trigger. By default it calls the onValidate and onAfterInsert method but it can be overridden and implemented in a different way if desired.  
15)  **[handleAfterUpdate()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L241) -** This method is called in the triggerHandler method when an afterUpdate is happening in the trigger. By default it calls the onValidate and onAfterUpdate method but it can be overridden and implemented in a different way if desired.
16)  **[handleAfterDelete()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L257) -** This method is called in the triggerHandler method when an afterDelete is happening in the trigger. By default it calls the onAfterDelete method but it can be overridden and implemented in a different way if desired.
17)  **[handleAfterUndelete()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L270) -** This method is called in the triggerHandler method when an afterUndelete is happening in the trigger. By default it calls the onUndelete method but it can be overridden and implemented in a different way if desired.  
18) **[getChangedRecords(Set&lt;String> fieldNames)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L306) -** This method will return a list of records that have had their fields changed (the fields specificied in the method parameter passed in).  
19) **[getChangedRecords(Set<Schema.SObjectField> fieldTokens)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L334) -** This method will return a list of records that have had their fields changed (the fields specificied in the method parameter passed in). I would suggest using this method over the one above. Strongly typed field names are a better choice in my opinion so the system knows your code depends on that field.


---
### The Configuration Inner Class for fflib_SObjectDomain (Setting trigger state and trigger security)

Inside the fflib_SObjectDomain class you'll find an inner class called [Configuration](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L586). This inner class allows you to enable and disable Trigger State as well as enable and disable CRUD security in your trigger. By default trigger state is disabled and CRUD security is enabled.

**Trigger State**  

The trigger state parameter allows you to choose to use the same instance of your Domain class between the before and after portion of the trigger. It needs to be used carefully as this could cause trigger recursion if not implemented properly.

How to turn trigger state on and off using the Configuration inner class:  
``` 
//Turn on
Configuration.enableTriggerState();
//Turn off
Configuration.disableTriggerState();
```

**Enforcing CRUD**

The enforcing trigger CRUD (Create, Read, Update, Delete) ensures that a users has the appropriate object CRUD permissions before performing any actual DML actions. By default in the fflib_SObjectDomain class this is enforced. Ideally you should leave this as enforced unless you have a really excellent business reason to not enforce it.

How to turn CRUD enforcement on and off using the Configuration inner class:

```
//Enable CRUD
Configuration.enforceTriggerCRUDSecurity();
//Disable CRUD
Configuration.disableTriggerCRUDSecurity();
``` 

---
### The Trigger Event Inner Class (Turning trigger events on and off)

Inside the fflib_SObjectDomain class is an inner class called [TriggerEvent](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L497) that allows you to turn on and off the various trigger events at will. By default all trigger events are turned on.

**_Example Code for shutting down and re-enabling a portion of a domain trigger_**
```
//Disables to before insert portion of the trigger
DomainClassName.getTriggerEvent(DomainClassName.class).disableBeforeInsert();
//Code to execute
//Enables the before insert portion of the trigger
DomainClassName.getTriggerEvent(DomainClassName.class).enableBeforeInsert();
```

The following is a list of trigger event methods a what they do:

1) **[TriggerEvent.enableBeforeInsert()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L514) -** This method enables the before insert portion of the trigger.  

2) **[TriggerEvent.enableBeforeUpdate()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L515) -** This method enables the before update portion of the trigger.

3) **[TriggerEvent.enableBeforeDelete()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L516) -** This method enables the before delete portion of the trigger.

4) **[TriggerEvent.disableBeforeInsert()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L518) -** This method disables the before insert portion of the trigger.

5) **[TriggerEvent.disableBeforeUpdate()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L519) -** This method disables the before update portion of the trigger.

6) **[TriggerEvent.disableBeforeDelete()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L520) -** This method disables the before delete portion of the trigger.

7) **[TriggerEvent.enableAfterInsert()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L523) -** This method enables the after insert portion of the trigger.  

8) **[TriggerEvent.enableAfterUpdate()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L524) -** This method enables the after update portion of the trigger.

9) **[TriggerEvent.enableAfterDelete()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L525) -** This method enables the after delete portion of the trigger.

10) **[TriggerEvent.enableAfterUndelete()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L526) -** This method enables the after undelete portion of the trigger.

11) **[TriggerEvent.disableAfterInsert()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L529) -** This method disables the after insert portion of the trigger.

12) **[TriggerEvent.disableAfterUpdate()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L530) -** This method disables the after update portion of the trigger.

13) **[TriggerEvent.disableAfterDelete()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L531) -** This method disables the after delete portion of the trigger.

14) **[TriggerEvent.disableAfterUndelete()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L532) -** This method disables the after undelete portion of the trigger.

14) **[TriggerEvent.enableAll()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L534) -** This method enables all portions of the trigger.

14) **[TriggerEvent.disableAll()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L539) -** This method disables all portions of the trigger.

14) **[TriggerEvent.enableAllBefore()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L544) -** This method enables all before portions of the trigger.

14) **[TriggerEvent.disableAllBefore()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L549) -** This method disables all before portions of the trigger.

14) **[TriggerEvent.enableAllAfter()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L554) -** This method enables all after portions of the trigger.

14) **[TriggerEvent.disableAllAfter()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls#L559) -** This method disables all after portions of the trigger.


---

### Example Apex Common Implementation of a Domain Class

[Cases Domain Layer Example](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Cases.cls)

[Contacts Domain Layer Example](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Contacts.cls)

---

### Next Section

[Part 12: The Builder Pattern](./12-The-Builder-Pattern)
