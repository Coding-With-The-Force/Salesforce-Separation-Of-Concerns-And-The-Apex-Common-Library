---
layout: default
title: "2) Introduction to the Apex Common Library"
nav_order: 3
---

# Introduction to the Apex Common Library

### Video Tutorial 

<iframe width="100%" height="400" src="https://www.youtube.com/embed/3JmWECi77zU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

### What is the Apex Common Library?

The [Apex Common Library](https://github.com/apex-enterprise-patterns/fflib-apex-common) is an [open source](https://en.wikipedia.org/wiki/Open_source) library originally created by [Andy Fawcett](https://www.linkedin.com/in/andyfawcett/) when he was the CTO of FinancialForce and currently upkept by many community members, but most notably [John Daniel](https://www.linkedin.com/in/imjohnmdaniel/). Aside from its origins and the fflib_ in the class names, it is no longer linked to FinancialForce in any way.  

The library was originally created because implementing the [Separation of Concerns Design Principle](https://en.wikipedia.org/wiki/Separation_of_concerns#:~:text=In%20computer%20science%2C%20separation%20of,code%20of%20a%20computer%20program.) is difficult no matter what tech stack you're working in. For Salesforce, the Apex Common Library was built to simplify the process of implementing Separation of Concerns as well as assist in managing DML transactions, creating high quality unit tests (you need the [Apex Mocks library](https://github.com/apex-enterprise-patterns/fflib-apex-mocks) to assist with this) and enforcing coding and security best practices. If you want an exceptionally clean, understandable and flexible code base, the Apex Common library will greatly assist you in those endeavors. 


---
 
### Does The Apex Common Library Implement Separation of Concerns for me Automatically?

Unfortunately it's not that simple. This library doesn't just automatically do this for you, no library could, but what it does is give you the tools to easily implement this design principle in your respective Salesforce Org or Managed Package. Though there are many more classes in the [Apex Common Library](https://github.com/apex-enterprise-patterns/fflib-apex-common/tree/master/sfdx-source/apex-common/main/classes), there are four major classes to familiarize yourself with to be able to implement this, four object oriented programming concepts and three major design patterns. Additionally it's beneficial if you understand the difference between a Unit Test and an Integration Test. We'll go over all of these things below.

---

###  The Four Major Classes
1) **[fflib_Application.cls](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls) -** This Application class acts as a way to easily implement the Factory pattern for building the different layers when running your respective applications within your org (or managed package). When I say "Application" for an org based implementation this could mean a lot of things, but think of it as a grouping of code that represents a specific section of your org. Maybe you have a service desk in your org, that service desk could be represented as an "Application". This class and the factory pattern are also what makes the Apex Mocks Library work, without implementing it, Apex Mocks will not work.  
2) **[fflib_SObjectDomain.cls](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls) -** This houses the base class that all Domain classes you create will extend. The many methods within this class serve to make your life considerably easier when building your domain classes, for each object that requires a trigger, out. You can check out my [Apex Common Domain Layer Implementation Guide](./11-Implementing-The-Domain-Layer-with-the-Apex-Common-Library) for more details.  
3) **[fflib_SObjectSelector.cls](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls) -** This houses the base class that all Selector classes you create will extend. The many methods within this class will serve to make your life a ton easier when implementing a selector classes for your various objects in your org. You can check out my [Apex Common Selector Layer Implementation Guide](./14-Implementing-the-Selector-Layer-with-the-Apex-Common-Library).  
4) **[fflib_SObjectUnitOfWork.cls](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls) -** This houses the logic to implement the [Unit of Work design pattern](https://www.codeproject.com/Articles/581487/Unit-of-Work-Design-Pattern) in your code. There a ton of useful methods within it that will make your life developing on the platform quite a bit simpler. For more information on the fflib_SObjectUnitOfWork class and the concept itself, please refer to my [guide on how to use the Unit of Work Pattern in Salesforce](./05-The-Unit-of-Work-Pattern).

---

### The Four Object Oriented Programming Concepts

1) [Inheritance](https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)) - When a class inherits (or extends) another class and the sub class gets access to all of its publicly accessible methods and variables.  
2) [Polymorphism](https://en.wikipedia.org/wiki/Polymorphism_(computer_science)) - When a class uses overloaded methods or overrides an inherited classes methods. 
3) [Encapsulation](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)) - Only publishing (or making public) methods and class variables that are needed for other classes to use it.
4) [Interfaces](https://en.wikipedia.org/wiki/Interface_(computing)) - An interface is a contract between it and a class that implements it to make sure the class has specific method signatures implemented.

[More information on the difference between Inheritance and Polymorphism](https://www.geeksforgeeks.org/difference-between-inheritance-and-polymorphism/) 

---

### The Four Design Patterns

1) [The Factory Design Pattern](https://www.tutorialspoint.com/design_pattern/factory_pattern.htm) - Used in the [fflib_Application](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_Application.cls) class 
2) [The Unit of Work Design Pattern](https://www.codeproject.com/Articles/581487/Unit-of-Work-Design-Pattern) - Used in the [fflib_SObjectUnitOfWork](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectUnitOfWork.cls) class
3) [The Template Method Design Pattern](https://en.wikipedia.org/wiki/Template_method_pattern) - Used in the [fflib_SObjectDomain](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls) class
4) [The Builder Pattern](https://en.wikipedia.org/wiki/Builder_pattern#:~:text=The%20builder%20pattern%20is%20a,Gang%20of%20Four%20design%20patterns.) - Used in the [fflib_QueryFactory](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls) class which is heavily leveraged by the [fflib_SObjectSelector](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls) class

---

### Next Section 
[Part 3: The Factory Pattern](./03-The-Factory-Method-Pattern)
