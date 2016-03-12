var services = angular.module('App.services');

services.service('DTMFService', ['$log', '$cordovaContacts', function ($log, $cordovaContacts) {
    return {
        'createNumber': function (organization, routings) {
            $log.info('convert selected routing to DTMF number');

            var baseNumber = organization.TelephoneNumber;

            var pause = null;

            var lastRouting = routings[routings.length - 1];
            if (routings.length > 0 && lastRouting.AltInitialPause !== null) {
                pause = lastRouting.AltInitialPause;
            }
            else {
                pause = organization.initialpause;
            }


            if (pause !== null) {
                $log.info('add initial pause ' + pause);
                for (i = 0; i < pause; i++) {
                    baseNumber = baseNumber + ",";
                }
            }


            for (var routing in routings) {
                baseNumber = baseNumber + "," + routings[0].DTMFID;
            }
            return baseNumber;
        }


    };
}]);