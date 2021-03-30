/**
 * Created by gerry on 3/29/2021.
 */

import {LightningElement, api} from 'lwc';
import createTasksController from '@salesforce/apex/Abstract_Task_Creator_Controller.createTasks';

export default class AbstractTaskCreator extends LightningElement {
	@api recordId;
	displayMessage;
	taskColumns =
		[
			{label: 'Id', fieldName: 'Id', editable: false},
			{label: 'Subject', fieldName: 'Subject', editable: false},
			{label: 'Related Contact', fieldName: 'WhoId', editable: false}
		];
	taskRows;

	createTasks(){
		createTasksController({"recordId": this.recordId}).then(result=>{
			this.taskRows = result;
		}).catch(error=>{
			this.displayMessage = JSON.stringify(error);
		});
	}
}