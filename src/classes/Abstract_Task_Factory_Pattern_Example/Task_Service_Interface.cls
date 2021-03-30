/**
 * Created by gerry on 3/29/2021.
 */

public interface Task_Service_Interface
{
	void createTasks(Set<Id> recordIds, Schema.SObjectType objectType);
}