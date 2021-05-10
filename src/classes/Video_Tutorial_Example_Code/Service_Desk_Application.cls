/**
 * Created by gerry on 4/21/2021.
 */

public with sharing class Service_Desk_Application
{
	public static final fflib_Application.ServiceFactory service = new fflib_Application.ServiceFactory(new Map<String, Type>{
			'B2B Sales Case' => Service_Desk_B2B_Service_Impl.class,
			'B2C Sales Case' => Service_Desk_B2C_Service_Impl.class,
			'Marketing Case' => Service_Desk_Marketing_Service_Impl.class
	});
}