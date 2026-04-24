---
layout: default
title: "1) Introduction to the Separation of Concerns Design Principle"
nav_order: 2
---

# Introduction to the Separation of Concerns Design Principle


### Video Tutorial 

<iframe width="100%" height="400" src="https://www.youtube.com/embed/nU4TKRFzdx4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

### What is the Separation of Concerns Design Principle?

Basically separation of concerns is the practice of putting logical boundaries on your code. Putting these logical boundaries on your code helps make your code easier to understand, easier to maintain and much more flexible when it needs to be altered (and every code base ever has to be altered all the time). 

In the Salesforce Ecosystem there are three major areas of concern we ideally should separate our code into. They are the following:

_**The Service Layer:**_

[The Service Layer](./07-The-Service-Layer) should house 100% of your non-object specific business logic (object specific logic is most often handled by the domain layer). This is, the logic that is specific to your organizations specific business rules. Say for instance you have a part of your Salesforce App that focuses on Opportunity Sales Projections and the Opportunity Sales Projection App looks at the Oppotunity, Quote, Product and Account objects. You might make an OpportunitySalesProjection_Service apex class that houses methods that have business logic that is specific to your Opportunity Sales Projection App. More information on the [Service Layer here.](./07-The-Service-Layer)

_**The Domain Layer:**_

[The Domain Layer](./10-The-Domain-Layer) houses your individual objects (database tables) trigger logic. It also houses object specific validation logic, logic that should always be applied on the insert of every record for an object and object specific business logic (like how a task my be created for a specific object type, etc). If you used the Account object in your org you should create a Domain class equivalent for the Account object through the use of a trigger handler class of some sort. More information on the [Domain Layer here](./10-The-Domain-Layer). 

_**The Selector Layer:**_

[The Selector Layer](./13-The-Selector-Layer) is responsible for querying your objects (database tables) in Salesforce. Selector layer classes should be made for each individual object (or grouping of objects) that you intend to write queries for in your code. The goal of the selector layer is to maintain query consistency (consistency in ordering, common fields queried for, etc) and to be able to reuse common queries easily and not re-write them over and over again everywhere. 

---

### Why is it Useful?

There are many benefits to implementing SoC, most of which were outlined above, but here are the highlights:

1) Modularizes your code into easy to understand packages of code making it easier to know what code controls what, why and when.  

2) Massively reduces the amount of code in your org by centralizing your logic into different containers. For instance, maybe you currently have 13 different apex controllers that house similar case business logic. If you placed that business logic into a service class and had all 13 apex controllers call that service class instead your life would be a whole lot simpler. This can get a lot more abstract and turn into absolutely unprecedented code reduction, but we have to start somewhere a bit simpler.  

3) Separation of Concerns lends itself to writing extremely well done and comprehensive Unit Tests. It allows for easy [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection) which allows you to, in test classes, mock a classes dependent classes. We'll go over this more when we get to the Unit testing and Apex Mocks section of this tutuorial, but if you want a quick and easy explanation, please feel free to check out my video covering [dependency injection and mocking in apex](https://youtu.be/-esf8Q_Vp7U).

---

### How does the Apex Common Library help with SoC?

The Apex Common Library was quite literally built upon the three layers outlined above. It provides an unrivaled foundation to implement SoC in your Salesforce org. When I started this tutorial series I was not convinced it was the absolute best choice out there, but after hundreds of hours of practice, documentation, experimentation with other similar groupings of libraries, etc I feel I can confidently say (as of today) that this is something the community is lucky even exists and needs to be leveraged much more than it is today.

---

### Example Code

All of the code examples in this repo are examples of SoC in action. You can check the [whole repo out here](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/tree/main/src/classes). For layer specific examples check out the layer specific pages of this wiki.

---

### Next Section

[Part 2: Introduction to the Apex Common Library](./02-Introduction-to-the-Apex-Common-Library)
