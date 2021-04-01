/**
 * Created by gerry on 3/29/2021.
 */

public interface Task_Creator_Interface
{
	fflib_ISObjectUnitOfWork createTasks(List<SObject> recordsToCreateTasksFor, fflib_ISObjectUnitOfWork unitOfWork);
}
