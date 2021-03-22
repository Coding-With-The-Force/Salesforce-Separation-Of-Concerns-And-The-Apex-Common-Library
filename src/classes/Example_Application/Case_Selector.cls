/**
 * Created by gerry on 3/17/2021.
 */

public inherited sharing class Case_Selector extends fflib_SObjectSelector implements Case_Selector_Interface
{
	public Case_Selector(){
		super(false, true, true, false);
	}

	public static Case_Selector_Interface newInstance(){
		return (Case_Selector_Interface) Helpdesk_Application.helpDeskSelector.newInstance(Case.SObjectType);
	}

	public List<Schema.SObjectField> getSObjectFieldList(){
		return new List<Schema.SObjectField>{
			Case.Id,
			Case.Subject,
			Case.Status,
			Case.ContactId,
			Case.Contact.AccountId
		};
	}

	public Schema.SObjectType getSObjectType(){
		return Case.SObjectType;
	}

	public List<Case> selectById(Set<Id> caseIds){
		return (List<Case>) selectSObjectsById(caseIds);
	}

	public List<Case> selectCaseByAccount(Set<Id> acctIds){
		return (List<Case>) Database.query(
			newQueryFactory().
					selectField(Case.AccountId).
					setCondition('AccountId IN :acctIds').
					toSOQL()
		);
	}

	public List<Case> selectNewCases(){
		return (List<Case>) Database.query(newQueryFactory().
				setCondition('Status = \'New\'').
				toSOQL());
	}
}