### What Is This Wiki?

This wiki hopes to simplify the concept of [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns#:~:text=In%20computer%20science%2C%20separation%20of,code%20of%20a%20computer%20program.) in Salesforce and leveraging the [Apex Common Library](https://github.com/apex-enterprise-patterns/fflib-apex-common) to implement it. While this wiki hopes to make this easier, if you finish everything here and want even more information about this topic I would suggest reading [Andy Fawcett's Salesforce Lightning Platform Enterprise Architecture Book](https://amzn.to/2R0D4BQ). Specifically pages 159-268 for Separation of Concerns and how to use Apex Commons to implement it and pages 477-520 for information on Unit Testing and Apex Mocks. It's a lot harder to consume (in my opinion) than the wiki below, but it is loaded with valuable information. It's how I learned most of what I'm presenting to you in the repo.

If you enjoy this wiki and would like to say thank you, feel free to [send a donation here](https://www.paypal.com/donate?business=RNHEF8ZWKKLDG&currency_code=USD)! But no pressure, I really just do this for fun!

***


### Table of Contents:

1) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/01)-Introduction-to-the-Separation-of-Concerns-Design-Principle" target="_blank">Introduction to the Separation of Concerns Design Principle</a>   
2) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/02)-Introduction-to-the-Apex-Common-Library" target="_blank">Introduction to the Apex Common Library</a> 
3) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/03)-The-Factory-Method-Pattern" target="_blank">The Factory Pattern</a>
4) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/04)-The-fflib_Application-Class" target="_blank">The fflib_Application Class</a>
5) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/05)-The-Unit-of-Work-Pattern " target="_blank">The Unit of Work Pattern</a>
6) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/06)-The-fflib_SObjectUnitOfWork-Class" target="_blank">The fflib_SObjectUnitOfWork Class</a>    
7) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/07)-The-Service-Layer" target="_blank">The Service Layer</a>  
8) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/08)-Implementing-the-Service-Layer-with-the-Apex-Common-Library" target="_blank">Implementing the Service Layer with the Apex Common Library </a>
9) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/09)-The-Template-Method-Pattern" target="_blank">The Template Method Pattern</a>  
10) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/10)-The-Domain-Layer" target="_blank">The Domain Layer</a>  
11) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/11)-Implementing-The-Domain-Layer--with-the-Apex-Common-Library" target="_blank">Implementing the Domain Layer with the Apex Common Library</a> 
12) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/12)-The-Builder-Pattern" target="_blank">The Builder Pattern</a>  
13) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/13)-The-Selector-Layer " target="_blank">The Selector Layer</a> 
14) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/14)-Implementing-the-Selector-Layer-with-the-Apex-Common-Library" target="_blank">Implementing the Selector Layer with the Apex Common Library </a>
15) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/15)-The-Difference-Between-Unit-Tests-and-Integration-Tests" target="_blank">The Difference Between Unit Tests and Integration Tests</a>
16) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/16)-Unit-Test-Mocks-with-Separation-of-Concerns" target="_blank">Unit Testing and Separation of Concerns</a>  
17) <a href="https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/wiki/17)-Implementing-Mock-Unit-Tests-with-the-Apex-Mocks-Library" target="_blank">Implementing Unit Testing with Apex Mocks</a>

***

### Submitting Wiki Feedback

If you believe there is any information missing from this guide or that it needs more info in certain places, please submit an [issue on this repo here](https://github.com/Coding-With-The-Force/Salesforce-Separation-Of-Concerns-And-The-Apex-Common-Library/issues) and I'll add it ASAP!