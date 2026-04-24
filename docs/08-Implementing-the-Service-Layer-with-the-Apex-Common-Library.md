---
layout: default
title: "8) Implementing the Service Layer with the Apex Common Library"
nav_order: 9
---

# Implementing the Service Layer with the Apex Common Library

### Video Tutorial 

<iframe width="100%" height="400" src="https://www.youtube.com/embed/nj9O-qWEeXg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

### Preparation for the rest of this article

There is NO FRAMEWORK that can be made for service layer classes. This is a business logic layer and it will differ everywhere. No two businesses are identical. That being said, if you would like to leverage all of the other benefits of the Apex Common Library (primarily Apex Mocks) and you would like your service classes to be able to leverage the fflib_Application class to allow for dynamic runtime logic generation, you'll need to structure your classes as outlined below. If you don't want to leverage these things, then don't worry about doing what is listed below... but trust me, in the long run it will likely be worth it as your org grows in size. 

---

### The Service Interface

For every service layer class you create you will create an interface (or potentially a virtual class you can extend) that your service layer implementation class will implement (more on that below). This interface will have every method in your class represented in it. An example of a service interface is below. Some people like to prefix their interfaces with the letter I (example: ICaseService), however I prefer to postfix it with _I or _Interface as it's a bit clearer in my opinion.

This methods in this interface should represent all of the public methods you plan to create for this service class. Private methods should not be represented here.

```
public interface Task_Service_Interface
{
	void createTasks(Set<Id> recordIds, Schema.SObjectType objectType);
}
```

---

### The Service Layer Class

This class is where things get a little confusing in my opinion, but here's the gist of it. This is the class you will actually call in your apex controllers (or occasionally domain classes) to actually execute the code... however there are no real implementation details in it (that exists in the implementation class outlined below). The reason this class sits in as a kind of middle man is because we want, no matter what business logic is actually called at run time, for our controller classes, batch classes, domain classes, etc to not need to alter the class they call to get the work done. In the Service Factory section below we'll see how that becomes a huge factor. Below is an example of the Service Layer class setup.

```
//This class is what every calling class will actually call to. For more information on the Application class check out the fflib_Application class
//part of this wiki.
public with sharing class Task_Service
{
	//This literally just calls the Task_Service_Impl class's createTasks method
	global static void createTasks(Set<Id> recordIds, Schema.SObjectType objectType){
		service().createTasks(recordIds, objectType);
	}

	//This gets an instance of the Task_Service_Impl class from our Application class. This method exists for ease of use in the other methods 
        //in this class
	private static Task_Service_Interface service(){
		return (Task_Service_Interface) Application.service.newInstance(Task_Service_Interface.class);
	}
}
```

---

### The Service Implementation Class

This is the concrete business logic implementation. This is effectively the code that isn't super abstract, but is the more custom built business logic specific to the specific business (or business unit) that needs it to be executed. Basically, this is where your actual business logic should reside. Now, again, you may be asking, but Matt... why not just create a new instance of this class and just use it? Why create some silly interface and some middle man class to call this class. This isn't gonna be superrrrrrr simple to wrap your head around, but bear with me. In the next section we tie all these classes together and paint the bigger picture. An example of a Service Implementation class is below.

```
/**
 * @description This is the true implementation of your business logic for your service layer. These impl classes
 * are where all the magic happens. In this case this is a service class that executes the business logic for Abstract
 * Task creation on any theoretical object.
 */

public with sharing class Task_Service_Impl implements Task_Service_Interface
{
	//This method creates tasks and MUST BE IMPLEMENTED since we are implementing the Task_Service_Interface
	public void createTasks(Set<Id> recordIds, Schema.SObjectType objectType)
	{
		//Getting a new instance of a domain class based purely on the ids of our records, if these were case
		//ids it would return a Case object domain class, if they were contacts it would return a contact
		//object domain class
		fflib_ISObjectDomain objectDomain = Application.domain.newInstance(recordIds);

		//Getting a new instance of our selector class based purely on the object type passed. If we passed in a case
		//object type we would get a case selector, a contact object type a contact selector, etc.
		fflib_ISObjectSelector objectSelector = Application.selector.newInstance(objectType);

		//We're creating a new unit of work instance from our Application class.
		fflib_ISObjectUnitOfWork unitOfWork = Application.UOW.newInstance();

		//List to hold our records that need tasks created for them
		List<SObject> objectsThatNeedTasks = new List<SObject>();

		//If our selector class is an instance of Task_Selector_Interface (if it implement the Task_Selector_Interface
		//interface) call the selectRecordsForTasks() method in the class. Otherwise just call the selectSObjectsById method
		if(objectSelector instanceof  Task_Selector_Interface){
			Task_Selector_Interface taskFieldSelector = (Task_Selector_Interface)objectSelector;
			objectsThatNeedTasks = taskFieldSelector.selectRecordsForTasks();
		}
		else{
			objectsThatNeedTasks = objectSelector.selectSObjectsById(recordIds);
		}

		//If our domain class is an instance of the Task_Creator_Interface (or implements the Task_Creator_Interface class)
		//call the createTasks method
		if(objectDomain instanceof Task_Creator_Interface){
			Task_Creator_Interface taskCreator = (Task_Creator_Interface)objectDomain;
			taskCreator.createTasks(objectsThatNeedTasks, unitOfWork);
		}

		//Try commiting the records we've created and/or updated in our unit of work (we're basically doing all our DML at
		//once here), else throw an exception.
		try{
			unitOfWork.commitWork();
		}
		catch(Exception e){
			throw e;
		}
	}
}

```

---

### The fflib_Application.ServiceFactory class

The fflib_Application.ServiceFactory class... what is it and how does it fit in here. Well, if you read through all of [Part 4: The fflib\_Application Class](./04-The-fflib_Application-Class) then you hopefully have some solid background on what it's used for and why, but it's a little trickier to conceptualize for the service class so let's go over it a bit again. Basically it leverages [The Factory Pattern](./03-The-Factory-Method-Pattern) to dynamically generate the correct code implementations at run time (when your code is actually running).  

This is awesome for tons of stuff, but it's especially awesome for the service layer. Why? You'll notice as your Salesforce instance grows so do the amount of interested parties. All of the sudden you've gone from one or two business units to 25 different business units and what happens when those businesses need the same type of functionality with differing logic? You could make tons of if else statements determining what the user type is and then calling different methods based on that users type... but maybe there's an easier way. If you are an ISV (a managed package provider) what I'm about to show you is likely 1000 times more important for you. If your product grows and people start adopting it, you absolutely need a way to allow flexibility in your applications business logic, maybe even allow them to write their own logic and have a way for your code to execute it??

Let's check out how allllllllllll these pieces come together below. 

---

### Tying all the classes together

Alright, let's tie everything together piece by piece. Pretend we've got a custom metadata type that maps our service interfaces to a service class implementation and a custom user permission (or if you don't wanna pretend you can [check it out here](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/objects/Service_By_User_Type__mdt.object)). Let's first start by creating our new class that extends the [fflibApplication.ServiceFactory class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls) and overrides its [newInstance method](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls). 

```
/*
   @description: This class is an override for the prebuilt fflib_Application.ServiceFactory that allows
   us to dynamically call service classes based on the running users custom permissions.
 */

public with sharing class ServiceFactory extends fflib_Application.ServiceFactory
{
	Map<String, Service_By_User_Type__mdt> servicesByUserPermAndInterface = new Map<String, Service_By_User_Type__mdt>();

	public ServiceFactory(Map<Type, Type> serviceInterfaceByServiceImpl){
		super(serviceInterfaceByServiceImpl);
		this.servicesByUserPermAndInterface = getServicesByUserPermAndInterface();
	}

	//Overriding the fflib_Application.ServiceFactory newInstance method to allow us to initialize a new service implementation type based on the 
        //running users custom permissions and the interface name passed in.
	public override Object newInstance(Type serviceInterfaceType){
		for(Service_By_User_Type__mdt serviceByUser: servicesByUserPermAndInterface.values()){
			if(servicesByUserPermAndInterface.containsKey(serviceByUser.User_Permission__c + serviceInterfaceType)){
				Service_By_User_Type__mdt overrideClass = servicesByUserPermAndInterface.get(serviceByUser.User_Permission__c + 
                                serviceInterfaceType.getName());
				return Type.forName(overrideClass.Service_Implementation_Class__c).newInstance();
			}
		}
		return super.newInstance(serviceInterfaceType);
	}

	//Creating our map of overrides by our user custom permissions
	private Map<String, Service_By_User_Type__mdt> getServicesByUserPermAndInterface(){
		Map<String, Service_By_User_Type__mdt> servicesByUserType = new Map<String, Service_By_User_Type__mdt>();
		for(Service_By_User_Type__mdt serviceByUser: Service_By_User_Type__mdt.getAll().values()){
			//Checking to see if running user has any of the permissions for our overrides, if so we put the overrides in a map
			if(FeatureManagement.checkPermission(serviceByUser.User_Permission__c)){
				servicesByUserType.put(serviceByUser.User_Permission__c + serviceByUser.Service_Interface__c, serviceByUser);
			}
		}
		return servicesByUserType;
	}
}

```

Cool kewl cool, now that we have our custom ServiceFactory built to manage our overrides based on the running users custom permissions, we can leverage it in the Application Factory class we've hopefully built by now like so:

```
public with sharing class Application
{
       //Domain, Selector and UOW factories have been omitted for brevity, but should be added to this class

	//This allows us to create a factory for instantiating service classes. You send it the interface for your service class
	//and it will return the correct service layer class
	//Exmaple initialization: Object objectService = Application.service.newInstance(Task_Service_Interface.class);
	public static final fflib_Application.ServiceFactory service =
			new ServiceFactory(new Map<Type, Type>{Task_Service_Interface.class => Task_Service_Impl.class});

}

```


Ok we've done the hardest parts now. Next we need to pretend that we are using the service class interface, service implementation class and service class that we already built earlier (just above you, scroll up to those sections and review them if you forgot), because we've about to see how a controller would call this task service we've built.

```
public with sharing class Abstract_Task_Creator_Controller
{
	@AuraEnabled
	public static void createTasks(Id recordId){
		Set<Id> recordIds = new Set<Id>{recordId};
		Schema.SObjectType objectType = recordId.getSobjectType();
		try{
			Task_Service.createTasks(recordIds, objectType);
		}
		catch(Exception e){
			throw new AuraHandledException(e.getMessage());
		}
	}
}

```

Now you might be wracking your brain right now and being like... ok, so what... but look closer Simba. This controller will literally never grow, neither will your Application class or your ServiceFactory class we've built above (well the Application class might, but very little). This Task_Service middle man layer is so abstract you can swap out service implementations on the fly whenever you want and this controller will NEVER NEED TO BE UPDATED (at least not for task service logic)! Basically the only thing that will change at this point is your custom metadata type (object), the custom permissions you map to users and you'll add more variations of the Task Service Implementation classes throughout time for your various business units that get onboarded and want to use it. However, your controllers (and other places in the code that call the service) will never know the difference. Wyld right. If you're lost right now lets follow the chain of events step by step in order to clarify some things:

1) Controller calls the Task_Service class's (the middleman) createTasks() method.
2) Task_Service's createTasks() method calls its service() method.
3) The service() method uses the Application classes "service" variable, which is an instance of our custom ServiceFactory class (shown above) to create a new instance of our whatever Task Implementation class (which inherits from the Task_Service_Interface class making it of type Task_Service_Interface) is relevant for our users assigned custom permissions by using the newInstance() method the ServiceFactory class overrode.
4) The service variable returns the correct Task Service Implementation for the running user.
5) The createTasks() method is called for whatever Task Service Implementation was determined to be correct for the running user.
6) Tasks are created!

If you're still shook by all this, please, watch the video where we build all this together step by step and walk through everything. I promise, even if it's a bit confusing, it's worth the time to learn.

---

### Next Section

[Part 9: The Template Method Pattern](./09-The-Template-Method-Pattern) 
