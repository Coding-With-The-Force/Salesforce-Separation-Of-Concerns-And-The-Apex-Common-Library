/**
 * Created by gerry on 4/21/2021.
 */

public interface Service_Desk_Interface
{
	List<Case> startEntitlementProcess(Case cs);
	List<Case> stopEntitlementProcess(Case cs);
}