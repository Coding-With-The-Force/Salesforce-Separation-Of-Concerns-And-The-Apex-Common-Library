/**
 * Created by gerry on 5/1/2021.
 */

public inherited sharing class Accounts extends fflib_SObjectDomain
{
	public Accounts(List<Account> acctRecords){
		super(acctRecords);
	}

	public class Constructor implements fflib_SObjectDomain.IConstructable{
		public fflib_SObjectDomain construct(List<SObject> sObjectList){
			return new Accounts(sObjectList);
		}
	}

	public override void onApplyDefaults(){
		for(Account acct: (List<Account>)Records){
			acct.Description = 'Kewl Account';
		}
	}

	public override void onValidate(){
		for(Account acct: (List<Account>)Records){
			if(acct.Type == null){
				acct.addError('Type must be filled out');
			}
		}
	}

	public override void onBeforeUpdate(Map<Id, SObject> oldRecords){
		for(Account acct: (List<Account>)Records){
			Account oldAcct = (Account)oldRecords.get(acct.Id);
			if(oldAcct.Type != acct.Type){
				acct.Description = 'Type Changed';
			}
		}
	}

	public List<Account> updateAccountType(List<Account> acctList){
		for(Account acct: acctList){
			acct.Type = 'Prospect';
		}
		return acctList;
	}
}