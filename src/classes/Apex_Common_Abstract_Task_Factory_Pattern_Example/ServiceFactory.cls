/*
   @author: Matt Gerry
   @date: 04/11/2021
   @description: This class is an override for the prebuilt fflib_Application.ServiceFactory that allows
   us to dynamically call service classes based on the running users custom permissions.
 */

public with sharing class ServiceFactory extends fflib_Application.ServiceFactory
{
	Map<String, Service_By_User_Type__mdt> servicesByUserPermAndInterface = new Map<String, Service_By_User_Type__mdt>();

	public ServiceFactory(Map<Type, Type> serviceInterfaceByServiceImpl){
		super(serviceInterfaceByServiceImpl);
		this.servicesByUserPermAndInterface = getServicesByUserPermAndInterface();
	}

	//Overriding the fflib_Application.ServiceFactory newInstance method to allow us to initialize a new service implementation type based on the running
	//users custom permissions and the interface name passed in.
	public override Object newInstance(Type serviceInterfaceType){
		for(Service_By_User_Type__mdt serviceByUser: servicesByUserPermAndInterface.values()){
			if(servicesByUserPermAndInterface.containsKey(serviceByUser.User_Permission__c + serviceInterfaceType)){
				Service_By_User_Type__mdt overrideClass = servicesByUserPermAndInterface.get(serviceByUser.User_Permission__c + serviceInterfaceType.getName());
				return Type.forName(overrideClass.Service_Implementation_Class__c).newInstance();
			}
		}
		return super.newInstance(serviceInterfaceType);
	}

	//Creating our map of overrides by our user custom permissions
	private Map<String, Service_By_User_Type__mdt> getServicesByUserPermAndInterface(){
		Map<String, Service_By_User_Type__mdt> servicesByUserType = new Map<String, Service_By_User_Type__mdt>();
		for(Service_By_User_Type__mdt serviceByUser: Service_By_User_Type__mdt.getAll().values()){
			//Checking to see if running user has any of the permissions for our overrides, if so we put the overrides in a map
			if(FeatureManagement.checkPermission(serviceByUser.User_Permission__c)){
				servicesByUserType.put(serviceByUser.User_Permission__c + serviceByUser.Service_Interface__c, serviceByUser);
			}
		}
		return servicesByUserType;
	}
}