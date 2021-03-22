/**
 * Created by gerry on 3/16/2021.
 */

import {LightningElement} from 'lwc';
import createTasksForCasesInController from '@salesforce/apex/Helpdesk_CreateTasksForCases_Controller.createTasksForCaseRecords';

export default class HdCreateTasksForCases extends LightningElement {

	displayMessage;

	createTasksForCases(){
		createTasksForCasesInController().then(()=>{
			this.displayMessage = 'Success';
		}).catch(error =>{
			this.displayMessage = JSON.stringify(error);
		});
	}

}