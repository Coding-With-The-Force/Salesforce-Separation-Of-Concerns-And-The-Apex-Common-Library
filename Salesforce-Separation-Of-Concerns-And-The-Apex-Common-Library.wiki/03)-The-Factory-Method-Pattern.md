# The Factory Method Pattern

### Video Tutorial 

[![The Factory Pattern](https://yt-embed.herokuapp.com/embed?v=TAegJdt_z7c)](https://youtu.be/TAegJdt_z7c "The Factory Pattern")

***

### What is the Factory Method Pattern?

The [factory method pattern](https://www.youtube.com/watch?v=EcFVTgRHJLM) allows you to create objects (or instantiate classes) without having to specify the exact class that is being created. Say for instance you have a service class that can be called by multiple object types and those object types each have their own object specific implementation for creating tasks for them. Instead of writing a ton of if else's in the service class to determine which class should be constructed, you could leverage the factory method pattern and massively reduce your code. 

***

### Why is it Useful?

It's useful because if used appropriately it can massively reduce the amount of code in your codebase and will allow for a much more dynamic and flexible implementation. The amount of flexibility when used appropriately can be absolutely astounding. Let's take a look at two different examples. One not using the factory pattern and another that does!

_**Creating Tasks for Different Objects (No Factory Pattern):**_

```
public with sharing class Task_Service_Impl
{
	//This method calls the task creators for each object type
	public void createTasks(Set<Id> recordIds, Schema.SObjectType objectType)
	{
            if(objectType == Account.getSObjectType()){

                //Accounts (and the other object types below) is not the same as the regular Account object. 
                //This is further explained in the domain layer section of this wiki. Basically you name your domain class
                //the plural version of the object the domain represents
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

_**Creating Tasks for Different Objects (Factory Pattern):**_

```
//The task service that anywhere can call and it will operate as expected with super minimal logic
public with sharing class Task_Service_Impl implements Task_Service_Interface
{
        //This method calls the task creators for each object type
	public void createTasks(Set<Id> recordIds)
	{
                //Using our Application class we are able to instantiate new instances of domain classes based on the recordIds we pass 
                //the newInstance method.
                //We cover the fflib_Application class and how it uses the factory pattern a ton more in the next section.
		fflib_ISObjectDomain objectDomain = Application.domain.newInstance(recordIds);

		if(objectDomain instanceof Task_Creator_Interface){
			Task_Creator_Interface taskCreator = (Task_Creator_Interface)objectDomain;
			taskCreator.createTasks(recordIds);
		}
	}
}
```

Right now you might be kinda shook... at least I know I was the first time I implemented it, lol. How on Earth is this possible?? How can so much code be reduced to so little? The first thing we do is instantiate a new <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/10)-The-Domain-Layer" target="_blank">domain class</a> (domain classes are basically just kinda fancy trigger handlers, but more on that later) using our Application class (our factory class) simply by sending it record ids. The Application factory class generates the object specific Domain class by determining the set of recordIds object type using the Id.getSObjectType() method that Salesforce makes available in Apex. Then by implementing the `Task_Creator_Interface` interface on each of the objects domain classes I'm guaranteeing that if something is an instance of the `Task_Creator_Interface` they will have a method called createTasks! Depending on the use case this can take hundreds of lines of code and reduce it to almost nothing. It also helps in the Separation of Concerns area by making our services much more abstract. It delegates logic more to their respective services or domains instead of somewhere the logic probably doesn't belong.    

***

### Where does it fit into Separation of Concerns?

Basically it reduces your need to declare concreate class/object types in your code in many places and it allows you to create extremely flexible and abstract services (more on this in the implementing the service layer with apex common section). Again take the example of task creation, maybe you have 15 controller classes (classes connected to a UI) in your org making tasks for 15 different objects and each object has a different task implementation, but you want to move all that task creation logic into a singular service class that anywhere can call for any object at any time. The factory method pattern is quite literally built for this scenario. In fact I have two examples below demonstrating it! One using a simple factory class to create tasks and one using the fflib_Application class to do the same thing. 

***

### Where is it used in the Apex Common Library

It's leveraged heavily by the fflib_Application class, which you can <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/04)-The-fflib_Application-Class" target="_blank">find out more about here.</a>

***

### Example Code (Abstract Task Creation App)

The following code example in the repo is an example of how the factory pattern could work in a real world Salesforce implementation to allow for tasks to be created on multiple objects using a different implementation for each object.

[Apex Common Abstract Task Creation App](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/tree/main/src/classes/Abstract_Task_Factory_Pattern_Example)

***

### Next Section

<a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/04)-The-fflib_Application-Class" target="_blank">Part 4: The fflib_Application Class</a>
