/**
 * Created by gerry on 4/18/2021.
 */

public with sharing class SoC_Class
{
	private Accounts domainLayerClass;
	private Account_Selector selectorLayerClass;

	public SoC_Class(){
		//This is calling our private constructor below
		this(new Accounts(new List<Account>{}), new Account_Selector());
	}

	//Using a private constructor here so our test class can pass in dependencies we would
	//like to mock in our unit tests
	@TestVisible
	private SoC_Class(Accounts domainLayerClass, Account_Selector selectorLayerClass){
		this.domainLayerClass = domainLayerClass;
		this.selectorLayerClass = selectorLayerClass;
	}

	public List<Account> updateAccounts(Set<Id> objectIds){
		//Because of our dependency injection in the private constructor above we can mock the results of these class calls.
		List<Account> objList = selectorLayerClass.selectById(objectIds);
		if(!objList.isEmpty()){
			objList = domainLayerClass.updateAccountType(objList);
			return objList;
		}
		else{
			throw new DMLException();
		}
	}
}