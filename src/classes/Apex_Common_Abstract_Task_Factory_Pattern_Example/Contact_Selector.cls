/**
 * Created by gerry on 3/29/2021.
 */

public inherited sharing class Contact_Selector extends fflib_SObjectSelector
{
	public Contact_Selector(){
		super(false, true, true, false);
	}

	public List<Schema.SObjectField> getSObjectFieldList(){
		return new List<Schema.SObjectField>{
				Contact.Id,
				Contact.Name,
				Contact.FirstName,
				Contact.LastName
		};
	}

	public Schema.SObjectType getSObjectType(){
		return Contact.SObjectType;
	}

	public List<Contact> selectById(Set<Id> contactIds){
		return (List<Contact>) selectSObjectsById(contactIds);
	}
}