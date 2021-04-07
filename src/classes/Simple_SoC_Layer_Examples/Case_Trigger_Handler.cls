public with sharing class Case_Trigger_Handler extends TriggerHandler 
{
    public override void beforeInsert()
    {
        Case_Utility.updateCaseSubject(trigger.new);
        Case_Utility.createCase();
    }    
}