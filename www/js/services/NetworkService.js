var services = angular.module('App.services');

services.service('NetworkService', function($ionicPlatform, $rootScope, $log, $ionicPopup, $cordovaNetwork, localStorageService) {
    $ionicPlatform.ready(function () {


        var type = $cordovaNetwork.getNetwork();
        var isOnline = $cordovaNetwork.isOnline();
        $log.info('network type: ' + type);

        localStorageService.set('networkOnline', isOnline);
        localStorageService.set('networkType', type);



        // listen for Online event
        $rootScope.$on('networkOnline', function(event, networkState){
            var onlineState = networkState;
            localStorageService.set('networkOnline', onlineState);
        })

        // listen for Offline event
        $rootScope.$on('networkOffline', function(event, networkState){
            var offlineState = networkState;
            localStorageService.set('networkOnline', !offlineState);
        })


    }, false);
});