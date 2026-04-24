---
layout: default
title: "14) Implementing the Selector Layer with the Apex Common Library"
nav_order: 15
---

# Implementing the Selector Layer with the Apex Common Library

### Video Tutorial 

[![Implementing the Selector Layer with the Apex Common Library](https://yt-embed.herokuapp.com/embed?v=-ZZbRA2-Gew)](https://youtu.be/-ZZbRA2-Gew "Implementing the Selector Layer with the Apex Common Library")

--- 

### The Template for every Selector Class you create

Every Selector layer class you create should at least implement the following methods for it to work as anticipated.

```
//Selector layer classes should all use the inherited sharing keyword so that the caller determines to context it operates in.
//It should also always extend the fflib_SObjectSelector so it can inherit that classes methods and functionality.
public inherited sharing class Contact_Selector extends fflib_SObjectSelector
{
        //This constructor is COMPLETELY OPTIONAL!! YOU DO NOT NEED IT! But I wanted to show the default parameters you can change
        //via the constructor if you want to change them.
	public Contact_Selector(){
                /*This is calling the fflib_SObjectSelector classes constructor and setting the following booleans:
                  1) If the selector queries should use field sets
                  2) If you would like to enforce CRUD security
                  3) If you would like to enforce FLS
                  4) If you would like to sort selected fields
                */
		super(false, true, true, false);
	}

        //Add the base fields for the object that should just be used in absolutely every query done by this class
	public List<Schema.SObjectField> getSObjectFieldList(){
		return new List<Schema.SObjectField>{
				Contact.Id,
				Contact.Name,
				Contact.FirstName,
				Contact.LastName
		};
	}

        //Allows you to easily get the object type for the object being queried by this class
	public Schema.SObjectType getSObjectType(){
		return Contact.SObjectType;
	}

        //Allows you to create a query that selects records by a set of ids (basically adds the WHERE Id IN :ContactIds to the query)
	public List<Contact> selectById(Set<Id> contactIds){
		return (List<Contact>) selectSObjectsById(contactIds);
	}
}

```

---

### The fflib_SObjectSelector Constructor Parameters and what each of them mean

When you create a Selector class that extends the fflib_SObjectSelector class you have the option to send some parameters to its constructor that determine how to the selector class functions. They are the following (in order of parameters passed to the constructor):

1) Would you like to allow your class to use field sets when building the initial query fields for your selector layer class? By default this parameter is set to false.
2) Would you like to enforce CRUD (Object level create, read, update, delete) security on your selector layer class? By default this parameter is set to true.
3) Would you like to enforce FLS (Field level security) on your selector layer class? By default this parameter is set to false.
4) Would you like your selected fields in your query to be sorted alphabetically when your query is created (this is literally just a [sort call on a list of strings in the code](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L651))? By default this parameter is set to true.

If you would like to alter any of these settings for your selector class you can do the following:

```
public inherited sharing class Contact_Selector extends fflib_SObjectSelector
{
        //In our selector classes constructor we are calling the fflib_SObjectSelector using the super() call
        //and setting out parameters.
	public Contact_Selector(){
                //This is completely optional. If you like the defaults listed above you do not have to call the super class constructor at all.  
		super(false, true, true, false);
	}
}

```

Note that this is completely optional, if you like the default behavior listed above, just don't bother calling the super method and overriding them!

---

### How to set the default field selection for your Selector Class

One of the biggest benefits of the selector layer is selected field consistency in your queries. If 99% of the time you are querying for the subject field on your Case object, why not just query for it by default without ever thinking about it again right?? Well the getSObjectFieldList method that you implement in your Selector classes does just that. Here's how to implement that method in your selector:

```
public List<Schema.SObjectField> getSObjectFieldList(){
        //Note that this is using concrete references to the fields, not dynamic soql (here at least). This is to ensure the system knows
        //your code is dependent on these fields so you don't accidentally delete them some day.
	return new List<Schema.SObjectField>{
                        //In this list, place every field you would like to be queried for by default when creating a query
                        //with your selector class.
			Contact.Id,
			Contact.Name,
			Contact.FirstName,
			Contact.LastName
	};
}

```

If you choose to enable field sets to allow for default field selection for your selector class, you can implement the following method to select fields from the field set to be included in your queries:

```
public override List<Schema.FieldSet> getSObjectFieldSetList(){
    return new List<Schema.FieldSet>{SObjectType.Case.FieldSets.CaseFieldSetForSelector};
}

```

The major benefit of using the field sets for query fields is you can add new fields on the fly without adding extra code. This becomes super important if you're building a managed package.

---

### How to set your default OrderBy clause in your Selector Class

By default all Selector Layer Classes that extend the fflib_SObjectSelctor are ordered by the Name field (if the name field isn't available on the queried object it defaults to CreatedDate). If that's kewl with you, no need to override it, but if you'd prefer the default sort order for your select class be different then you just need to override the following method like so:

```
public override String getOrderBy(){
    return 'Subject';
}
```

If you wanted to order by multiple fields you would just do the following (basically just create a comma separated list in the form of a string):

```
public override String getOrderBy(){
    return 'Subject, Name, CustomField__c, CustomLookup__r.Name';
}
```

---

### The fflib_QueryFactory class and Custom Queries

Chances are you're gonna wanna query something that's not immediately available via the fflib_SObjectSelect class, well lucky for you the fflib_QueryFactory class is here just for that! Here is an example of a custom query via the use of the fflib_QueryFactory class (a list of all available query factory methods are at the bottom of this wiki article).

```
//This allows us to select all new cases in the system using the QueryFactory in fflib_SObjectSelector
public List<Case> selectNewCases(){
    return (List<Case>) Database.query(newQueryFactory().
    selectField(Case.Origin).
    setCondition('Status = \'New\'').
    setLimit(1000).
    toSOQL());
}
```
There are also tons of other methods that allow you to add offsets, subselects, set ordering and more (outlined in the method cheat sheet section).

---

### How to Do Sub-Select Queries (Inner Queries)

There's a kinda handy way to do sub-select queries by using the fflib_QueryFactory class. You can use it in your selector class's methods as outlined below:

```
//Pretend this method exists in a Case_Selector class
public List<Case> innerQueryExample(){
    //Using this Case_Selectors newQueryFactory method that it inherits from the fflib_SObjectSelector class it extends
    fflib_QueryFactory caseQueryFactory = newQueryFactory();

    //Creating a new instance of our Task_Selector class and using the addQueryFactorySubselect method to add the task query as a 
    //inner query for the caseQueryFacorty
    fflib_QueryFactory taskSubSelectQuery = new Task_Selector().addQueryFactorySubselect(caseQueryFactory);
  
    //Querying for our data and returning it.
    return (List<Case>) Database.query(caseQueryFactory.toSOQL());
}
```

For more information on the [QueryFactory method you can take a look at the code here](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls#L367)

For more information on the [addQueryFactorySubselect method you can take a look at the code here](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls)

---

### How to do Aggregate Queries

There's not really a built-in method in either the fflib_SObjectSelector or the QueryFactory class to deal with this. So you just deal with aggregate queries by building a method in your Selector Class in the following way:

```
public List<AggregateResult> selectAverageTacosPerTacoBell(){
    List<AggregateResult> tacoData = new List<AggregateResult>();
    for(AggregateResult result: [SELECT Id, AVG(Tacos_Sold__c) avgTacos FROM Taco_Bell__c GROUP BY Taco_Type__c]){
        tacoData.add(result);
    }
    return tacoData;
}

``` 

---
 
### The fflib_SObjectSelector Class methods Cheat Sheet

While there are many other methods within the [fflib_SObjectSelector class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls) below are the methods most commonly utilized in implementations.

1) _**[getSObjectName()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls#L286)**_ - Returns the name of the object that your select was built for.

2) _**[enforceFLS()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls#L183)**_ - Turns on field level security for your queries you perform in your selector class.

3) _**[includeFieldSetFields()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls#L192)**_ - Turns on the ability to use field sets to select fields in your selector class.

4) _**[ignoreCRUD()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls#L202)**_ - Turns off the CRUD (Create Read Update Delete) checks to make sure a user has CRUD access to an object before performing a query.

5) _**[unsortedSelectFields()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls#L192)**_ - Turns of sorting the selected fields for the query. THIS DOES NOT TURN OFF SORTING! This just means in the select statement of your query, the fields will not be selected in alphabetical order.

6) _**[selectSObjectsById(Set&lt;Id> idSet)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls#L299)**_ - Returns a query that selects all the records in your id set. It constructs a query based on the fields you declare in your selector class's getSObjectFieldsList method and orders them by whatever is represented in the [m_orderBy variable](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls#L65).

7) **_[queryLocatorById(Set&lt;Id> idSet)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls#L312)_** - This method is basically the same as the selectSObjectsById method except that it returns a query locator instead. This should be leveraged for batch classes that need query locators.

8) **_[newQueryFactory](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls#L350)_** - This method returns a new instance of the fflib_QueryFactory class and uses your selector classes fields listed in the getSObjectFieldsList method and orders them by whatever you set the default orderby to in your selector class.

9) **_[addQueryFactorySubselect(fflib_QueryFactory parentQueryFactory)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_SObjectSelector.cls#L393)_** - This method basically just creates a subselect query (an inner query) for the "parentQueryFactory" and then returns the parent query with a subselect query that represents the query for your objects selector class (more info on how this method works in the sub-select query section in this wiki article).


---

### The fflib_QueryFactory Class methods Cheat Sheet

While there are many other methods within the [fflib_QueryFactory class](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls) below are the methods most commonly utilized in implementations.

1) **_[assertIsAccessible()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L174)_** - This method checks to see if the running user can actually read to object this selector was built for.

2) **_[setEnforceFLS(Boolean enforce)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L185)_** - This method determines whether or not to enforce field level security on the query you are running.

3) **_[setSortSelectFields(Boolean doSort)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L196)_** - If you would like the list of fields selected to be selected in alphabetical order, you can use this method to make your selected fields be selected in alphabetical order.

4) **_[selectField(Schema.SObjectField field)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L216)_** - Use this method to select a field for your query.

5) **_[selectFields(Set<Schema.SObjectField> fields)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L248)_** - Use this method to select multiple fields for your query at the same time.

6) _**[selectFieldSet(Schema.FieldSet fieldSet)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L276)**_ - Use this method to select fields for your query from a field set.

7) _**[setCondition(String conditionExpression)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L298)**_ - Use this method to set the conditions for your query (basically you are setting the WHERE clause in your query. Do NOT add the WHERE to the string you pass into to this method).

8) _**[setLimit(Integer limitCount)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L311)**_ - Sets a limit for your query.

9) _**[setOffset(Integer offsetCount)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L324)**_ - Sets an offset for your query.

10) **_[addOrdering(String fieldName, SortOrder direction, Boolean nullsLast)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L512)_** - Add to the default ORDER BY clause for your query with the parameters you pass in.

11) **_[addOrdering(String fieldName, SortOrder direction)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L459)_** - Add to the default ORDER BY clause for your query with the parameters you pass in.

12) **_[addOrdering(Ordering o)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L337)_** - Add to the default ORDER BY clause for your query. You need to build an [fflib_QueryFactory.Ordering object](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L710) to pass to this method. There are a ton of ordering method permutations in this class, so definitely check them all out.

13) **_[setOrdering(String fieldName, SortOrder direction, Boolean nullsLast)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L586)_** - replaces the default ORDER BY clause for your query with the new orderby parameters that you pass it.

14) **_[setOrdering(String fieldName, SortOrder direction)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L617)_** - replaces the default ORDER BY clause for your query with the new orderby parameters that you pass it.

15) **_[setOrdering(Ordering o)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L345)_** - replaces the default ORDER BY clause for your query with the new orderby that you pass it. You need to build an [fflib_QueryFactory.Ordering object](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L710) to pass to this method. There are a ton of ordering method permutations in this class, so definitely check them all out.

16) **_[subselectQuery(String relationshipName)](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L394)_** - Sets up a subquery for the query. You need to pass in a string representation of the relationship fields developer name to this method.  

17) **_[toSOQL()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L641)_** - Takes the fflib_QueryFactory you've just built and turns it into an actual string representation of the query that you can use in a Database.query() call.

18) **_[deepClone()](https://github.com/apex-enterprise-patterns/fflib-apex-common/blob/master/sfdx-source/apex-common/main/classes/fflib_QueryFactory.cls#L686)_** - Creates a clone of your fflib_QueryBuilder query in case you'd like an easy way to generate another permutation of this query without rebuilding the whole thing.

---

### Next Section

[Part 15: The Difference Between Unit Tests and Integration Tests](./15-The-Difference-Between-Unit-Tests-and-Integration-Tests)
