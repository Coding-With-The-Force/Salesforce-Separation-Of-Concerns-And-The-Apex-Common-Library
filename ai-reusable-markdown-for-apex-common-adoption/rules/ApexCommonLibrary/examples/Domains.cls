/**
 * Created by gerry on 5/1/2021.
 */

public inherited sharing class Domains extends fflib_SObjectDomain
{
	public Domains(List<Account> acctRecords){
		super(acctRecords);
	}

	public class Constructor implements fflib_SObjectDomain.IConstructable{
		public fflib_SObjectDomain construct(List<SObject> sObjectList){
			return new Domains(sObjectList);
		}
	}

	public override void onBeforeUpdate(Map<Id, SObject> oldRecords){
		
	}
}