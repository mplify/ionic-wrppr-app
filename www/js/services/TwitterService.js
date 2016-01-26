var services = angular.module('App.services');

services.service('TwitterService', function($ionicPlatform, $log, localStorageService) {
    return {
        'checkTwitterApp' : function(){
            $log.info('check Twitter App availability');

            var urlSchema = "twitter://";
            if(ionic.Platform.isAndroid()){
                urlSchema = 'com.twitter.android';
            }

            appAvailability.checkBool(urlSchema, function(availability) {
                $log.info('check Twitter App is available: ' + availability);
                localStorageService.set('twitterApp', availability);
            });
        }


    }

});