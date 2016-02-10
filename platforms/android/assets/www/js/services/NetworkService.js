var services = angular.module('App.services');

services.service('NetworkService', function($ionicPlatform, $rootScope, $log, $ionicPopup, $cordovaNetwork, LocalDataService) {
    $ionicPlatform.ready(function () {


        var type = $cordovaNetwork.getNetwork();
        var isOnline = $cordovaNetwork.isOnline();
        $log.info('network type: ' + type);

        LocalDataService.setNetworkState(isOnline);
        LocalDataService.setNetworkType(type);



        // listen for Online event
        $rootScope.$on('networkOnline', function(event, networkState){
            var onlineState = networkState;
            LocalDataService.setNetworkState(onlineState);
        })

        // listen for Offline event
        $rootScope.$on('networkOffline', function(event, networkState){
            LocalDataService.setNetworkState(networkState);
        })


    }, false);
});