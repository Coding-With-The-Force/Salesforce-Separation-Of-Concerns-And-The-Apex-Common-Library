/**
 * Created by gerry on 4/21/2021.
 */

public with sharing class Help_Desk_B2C_Service_Impl implements Help_Desk_Interface
{
	public List<Case> setupMilestones(){
		System.debug('Ran the B2C Milestone setup');
		return new List<Case>();
	}

	public List<Case> stopMilestones(){
		System.debug('Ran the B2C Milestone stopper');
		return new List<Case>();
	}
}