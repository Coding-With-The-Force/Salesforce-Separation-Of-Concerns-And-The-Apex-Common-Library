/**
 * Created by gerry on 5/2/2021.
 */

public with sharing class Account_Selector extends fflib_SObjectSelector
{
	public List<Schema.SObjectField> getSObjectFieldList(){
		return new List<Schema.SObjectField>{
				Account.Id,
				Account.Name,
				Account.Description
		};
	}

	public Schema.SObjectType getSObjectType(){
		return Account.SObjectType;
	}

	public override String getOrderBy(){
		return 'Description';
	}

	public List<Account> selectById(Set<Id> accountIds){
		return (List<Account>) selectSObjectsById(accountIds);
	}

	public List<Account> selectAccountsByName(Set<String> accNames){

		String query = newQueryFactory().
				selectField(Account.LastModifiedById).
				selectField('Owner.Username').
				setCondition('Name IN: accNames').
				setOrdering(Account.LastModifiedById, fflib_QueryFactory.SortOrder.ASCENDING)
				.setLimit(100).toSOQL();
		System.debug('This is the query ::: ' + query);

		return (List<Account>) Database.query(newQueryFactory().
				selectField(Account.LastModifiedById).
				selectField('Owner.Username').
				setCondition('Name IN: accNames').
				setOrdering(Account.LastModifiedById, fflib_QueryFactory.SortOrder.ASCENDING)
				.setLimit(100).toSOQL());
	}
}