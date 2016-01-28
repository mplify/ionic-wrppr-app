var services = angular.module('App.services');

services.service('DTMFService',function ($log) {
    return {
        'createNumber' : function(organization, routings){
             $log.info('convert selected routing to DTMF number');

             var baseNumber = organization.TelephoneNumber;

             if(organization.initialpause){
                 $log.info('add initial pause ' + organization.initialpause);
                 for(i = 0 ; i < organization.initialpause; i++){
                     baseNumber = baseNumber + ",";
                 }
             }
             for(routing in routings){
                 baseNumber = baseNumber +  ","+ routings[0].DTMFID;
             }
             return baseNumber;
        }


    }
});