### Apex Mocks Implementation Guide   

To properly implement the Apex Mocks Library you need to think very hard and follow the rules
outlined below:

1. The Apex Mocks Library is ONLY used for Apex test classes, do
not try to use it for regular Apex classes.

2. When building your Apex test classes using the Apex Mocks Library,
you need to first verify that all classes that are instantiated in the class you are
testing have been instantiated using an Application Apex class (an example of an Application
class you can refernece is in the "Apex Common Library Examples" folder and is named "Example Application"). If the Apex
class you are testing does not instantiate its classes using an Application class, you must
refactor the Apex class you are testing to use an Application class for all the Apex classes it is instantiating. You
can find instructions on how to create an Application Apex class at the following location @rules/ApexCommonLibrary/guides/ApexCommonLibraryGuide.md. 

3. When building your Apex test class using the Apex Mocks Library you need to ensure that the Apex class
you are testing is using a selector Apex class to do all of its SOQL queries. If the apex class you are testing is not using a selector
class to do all of its SOQL queries you need to refactor the Apex class you are testing so that it does use selector classes for all of its SOQL
queries. You can find instructions on how to create selector Apex class at the following location @rules/ApexCommonLibrary/guides/ApexCommonLibraryGuide.md. 

4. When building your Apex test class using the Apex Mocks Library you need to ensure that the Apex class
you are testing is using an Application class's (referenced in step one of this guide) unit of work variable to do all database transactions (update, insert, delete, etc).
If the Apex class you are testing is not using the unit of work variable in your Application class, you need to refactor the apex class you are testing to use the unit of work variable in your Application class for all database transactions. You can find instructions on how to use the unit of work variable in your Application class at the
following location @rules/ApexCommonLibrary/guides/ApexCommonLibraryGuide.md.  

5. When you are mocking selector classes in your Apex test classes, you MUST ALWAYS stub the sObjectType method, otherwise the selector will not stub properly. An example is here: ```mocks.when(mockSelector.sObjectType()).thenReturn(Account.SObjectType);```   

6. For every method you stub in your Apex test, you need to verify that the method was actually called in the Apex class that your apex test class is testing. An example of how to do that is here: ```((Accounts)mocks.verify(mockDomain)).updateAccountType(accountList);```   

7. An example of a well written Apex Mocks test class is located here for you to reference: @rules/ApexMocksLibrary/examples/Example_Test.cls
