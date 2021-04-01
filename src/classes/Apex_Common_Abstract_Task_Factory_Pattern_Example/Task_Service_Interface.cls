/**
 * @author Matt Gerry
 * @date 03/30/2021
 * @description To help with unit test mocking and with abstraction we need to produce this interface. For every single
 * public method that you create in your Task_Service_Impl class you need to represent it here.
 */

public interface Task_Service_Interface
{
	void createTasks(Set<Id> recordIds, Schema.SObjectType objectType);
}