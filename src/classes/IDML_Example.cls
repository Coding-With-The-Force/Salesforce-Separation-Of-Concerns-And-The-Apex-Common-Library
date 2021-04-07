/**
 * Created by gerry on 4/2/2021.
 */
//Implementing this class allows you to overcome to limitations of the regular unit of work class.
public with sharing class IDML_Example implements fflib_SObjectUnitOfWork.IDML
{
    void dmlInsert(List<SObject> objList){
        //custom insert logic here
    }
    void dmlUpdate(List<SObject> objList){
        //custom update logic here
    }
    void dmlDelete(List<SObject> objList){
        //custom delete logic here
    }
    void eventPublish(List<SObject> objList){
        //custom event publishing logic here
    }
    void emptyRecycleBin(List<SObject> objList){
        //custom empty recycle bin logic here
    }
}