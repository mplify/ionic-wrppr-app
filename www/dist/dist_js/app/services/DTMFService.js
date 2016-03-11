var services = angular.module('App.services');

services.service('DTMFService', ['$log', '$cordovaContacts', function ($log, $cordovaContacts) {
    return {
        'createNumber': function (organization, routings) {
            $log.info('convert selected routing to DTMF number');

            var baseNumber = organization.TelephoneNumber;

            if (organization.initialpause && organization.initialpause !== null) {
                $log.info('add initial pause ' + organization.initialpause);
                for (i = 0; i < organization.initialpause; i++) {
                    baseNumber = baseNumber + ",";
                }
            }

            var lastRouting = routings[routings.length - 1];
            alert(lastRouting.AltInitialPause);

            for (var routing in routings) {
                baseNumber = baseNumber + "," + routings[0].DTMFID;
            }
            return baseNumber;
        }


    };
}]);