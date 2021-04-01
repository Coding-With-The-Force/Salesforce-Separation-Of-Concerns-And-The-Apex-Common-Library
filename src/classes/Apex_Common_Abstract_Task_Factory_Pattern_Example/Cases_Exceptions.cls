/**
 * Created by gerry on 3/29/2021.
 */

public with sharing class Cases_Exception extends Exception
{
	public override String getMessage(){
		return 'All cases must have contacts associated with them';
	}
}