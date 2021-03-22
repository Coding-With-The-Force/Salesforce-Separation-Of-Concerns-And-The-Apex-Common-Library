/**
 * Created by gerry on 3/21/2021.
 */

trigger Cases on Case (before insert, before update, after insert, after update)
{
	fflib_SObjectDomain.triggerHandler(Cases.class);
}