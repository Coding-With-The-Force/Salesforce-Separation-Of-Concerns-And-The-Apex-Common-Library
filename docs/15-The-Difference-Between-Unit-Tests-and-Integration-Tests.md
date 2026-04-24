---
layout: default
title: "15) The Difference Between Unit Tests and Integration Tests"
nav_order: 16
---

# The Difference Between Unit Tests and Integration Tests

### Video Tutorial 

[![The Difference between Unit Tests and Integration Tests](https://yt-embed.herokuapp.com/embed?v=SSJ1E31F6ek)](https://youtu.be/SSJ1E31F6ek "The Difference between Unit Tests and Integration Tests")

---

### What is Unit Testing?

Unit Testing, is a way to test the logic in one class and ONLY one class at a time. Most classes in your system at some point do one of the following:

1) Call to another class to get some work done.
2) Query the database directly in the class.
3) Do DML transactions directly in the class.

However, in unit testing, we ideally don't want to do any of those things, we don't care if the querying or the DML transactions or the calls to those other classes work, because what we want to test is that the logic of our class works in every theoretical permutation we can think of AND THAT'S IT! We just want to know if our logic, that we designed for this one class actually works as we anticipate it to work. 

You might be thinking, "How is that possible? We need those queries and those dml statements and those classes to successfully run our code!". Well that my friends is simply not true. With the implementation of separation of concerns and by leveraging one of the many available mocking frameworks we can fake all of those things to build true unit tests. 

---

### When Should I use Unit Testing?

Just because you are leveraging unit testing doesn't mean there still isn't a need for integration tests (more on that below), so when should you do Unit Tests in favor of Integration tests? It's a pretty simple answer. The logic in your class's code could have 40+ paths it could take... maybe even 100... The code in your class could have logic that runs when your code fails, logic that runs when your codes successful, logic that runs when someone creates a $200,000,000 opportunity as opposed to a $2,000 opportunity. There could be so many paths. We DO NOT need an integration test for every single one of those paths. It could take 20+ minutes to run integration tests for all those paths whereas unit testing them could take just seconds. As your codebase grows, if you didn't make these unit tests your test class runs to deploy to prod could take hours... maybe days... we don't want that homie. So when do you unit test? You unit test to test the bajillions of permutations of your class's logic. When do we choose integration tests?? Keep reading. You'll find out below.

An additional benefit to unit testing/mocking responses is testing hard to test or impossible to test error catching scenarios. One common scenario that I find myself frequently building error catching around is record locking... but how on earth can you test that with real data at run time? It's borderline impossible, however unit testing makes testing for errors a breeze. It's so easy you'll cry, lol, the dream of 100% code coverage can go from just a dream to a very real and easily obtainable thing with unit tests and mocking.

---

### What is Integration Testing?

Integration testing is when you test your code from point A all the way to point Z. What I mean by that is, you actually have your code in your test classes doing SOQL statements, DML transactions, calling the other classes it depends on, etc. Basically your code is truly calling all the real logic from beginning to end, no mocking or fake return results anywhere. Integration testing is what 90%+ of Salesforce orgs seem to do 100% of the time and that is one dangerous game to play. The majority of your tests should not be integration tests... maybe like 20% of them or so. If 100% of your test classes are integration tests, over time you'll suffer from long test execution and deployment times (or alternatively poorly tested code to reduce those times). If you've ever been stuck in a 6+ hour deployment, I think you know what I mean... and what if one test fails during that deploy?... it really hurts, lol. Please, don't get me wrong though, you can not replace integration tests with unit tests, they are of equal importance, it's just important that you only use integration tests when needed.

---

### When Should I use Integration Testing?

All apex classes should have some level of integration testing. I like to write somewhere around 20% of my tests as integration tests and 80% of my tests for a class as unit tests. Typically I will, for each class that has dependencies (classes that the class I'm currently testing calls) write two integration tests for each dependency. One integration test that tests a successful path through my classes code and its dependencies and another that tests failures. This may be, in some peoples opinion, overkill, but I personally feel that it's not an enormous amount of overhead (typically) and it gives me some piece of mind that all of the classes my class I'm testing depends on still operate well with it. So, when to use integration testing? In my opinion, in every test class, but use them sparingly, use them to check that your transactions between classes still work, don't use them to test every logical path in your class's code. That will spiral out of control.

---

### Next Section

[Part 16: Unit Test Mocks with Separation of Concerns](./16-Unit-Test-Mocks-with-Separation-of-Concerns)  
