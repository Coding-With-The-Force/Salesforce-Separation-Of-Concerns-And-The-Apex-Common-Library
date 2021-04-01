/**
 * @author Matt Gerry
 * @date 03/31/2021
 * @description This is an extremely simple example of how you might implement a selector class
 * there is still plenty to be desired here, but this, in a very very simplified manner is effectively what you are trying
 * to achieve with a selector layer.
 */

public with sharing class Case_Selector_Simple
{
	private String query;
	private String fromObject = ' FROM Case ';
	private String queryLimit = ' LIMIT 1000';

	//Constructor to setup the base query
	public Case_Selector_Simple(){
		buildBaseQuery();
	}

	//Put your fields you intend to almost always select with your case queries here
	private void buildBaseQuery(){
		this.query = 'SELECT Id, Subject, ContactId';
	}

	//Set the limit for your query you're building
	public void setQueryLimit(Integer passedLimit){
		this.queryLimit = 'LIMIT ' + passedLimit;
	}

	//Select your cases by a set of case ids
	public List<Case> selectCasesById(Set<Id> caseIds){
		this.query += this.query + fromObject + 'WHERE Id IN :caseIds' + this.queryLimit;
		return Database.query(this.query);
	}

	//Select all new cases in your system
	public List<Case> selectNewCases(Set<Id> caseIds){
		this.query += this.query + ', AccountId, Status' + fromObject + 'WHERE Status = \'New\'' + this.queryLimit;
		return Database.query(this.query);
	}

	//Would continue to build queries and setters for everything you theoretically need.
}