---
layout: default
title: "9) The Template Method Pattern"
nav_order: 10
---

# The Template Method Pattern

<iframe width="100%" height="400" src="https://www.youtube.com/embed/czTH_cGNNvI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

### What is the Template Method Pattern?

The [Template Method Pattern](https://youtu.be/7ocpwK9uesw) is one of the more popular [Behavioral Design Pattern](https://sourcemaking.com/design_patterns/behavioral_patterns). The Template Design Pattern basically is creating a genericized skeleton class that a sub class can  extend and add functionality to. The genericized skeleton class has some core functionality pre-built, but expects you to fill out (although not explicitly) other overridable methods in your sub class, to actually get much benefit out of it. Most trigger frameworks in existence leverage the Template Method Pattern. In fact there are a lot of frameworks in existence out there that leverage this pattern and I'm not even sure the creators know they leveraged it.

---

### Why is it Useful?

This pattern is extremely useful because it allows you to define the core, generic parts of a class implementation (so it doesn't need to be re-built over and over), while also allowing different developers the ability to implement their unique logic for their specific implementation. Take for instance a simple trigger handler framework. Most of these use the template method pattern. The core functionality is there (when to run a before insert method or how to handle certain trigger context variables, etc) but the object specific logic methods are overridable. For instance, the methods that determine what to do on the insert of a record, that would be overridden in an extended sub class and then on an object by object basis that logic would be able to differ.

---

### Where does it fit into Separation of Concerns?

This fits into the concept of SoC because this pattern makes sure that you don't repeat yourself ([the DRY principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)) and you write the minimal amount of code. Basically it allows you to separate out the generic code from the object specific code that has to be executed. You only write the generic code once and then allow subclasses to extend your template class and implement logic for those empty methods in your template class that need to have object or service specific logic. 

---

### Where is it used in the Apex Common Library

This design pattern is leveraged heavily by the [fflib_SObjectDomain](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls) class in the Apex Common Library. 

---

### Example Code (Abstract Task Creation App)
[fflib_SObjectDomain class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectDomain.cls) - This class in the Apex Common library uses the template method pattern. Observe the many empty overridable methods (onBeforeInsert, onValidate, onBeforeUpdate, etc). It is expecting that a subclass will extend it and override one or more of those methods to make any true functionality occur.

[Cases domain class that extends the fflib_SObjectDomain Template Class](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/blob/main/src/classes/Apex_Common_Abstract_Task_Factory_Pattern_Example/Cases.cls) - The methods onApplyDefaults and onValidate are empty methods in the template class (the fflib_SObjectDomain class) that you need to implement in your subclasses to have any functionality happen.

---

### Next Section

[Part 10: The Domain Layer](./10-The-Domain-Layer)
