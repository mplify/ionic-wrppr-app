var services = angular.module('App.services');

services.service('NetworkService', ['$ionicPlatform', '$rootScope', '$log', '$ionicPopup', '$cordovaNetwork', '$state', 'LocalDataService', function( $ionicPlatform, $rootScope, $log, $ionicPopup, $cordovaNetwork, $state, LocalDataService)
{
    var modal ;
    var showOfflineView = function(){
        modal = $ionicModal.fromTemplate($templateCache.get('user-correct.html'), {
            scope: $scope
        });
        modal.show();
    };

    var closeOffline = function() {
        if(modal){
            modal.hide();
            modal.remove();
        }
    };


    return {
        'checkNetworkState' : function(){
            var type = $cordovaNetwork.getNetwork();
            var isOnline = $cordovaNetwork.isOnline();
            $log.info('network type: ' + type);

            LocalDataService.setNetworkState(isOnline);
            LocalDataService.setNetworkType(type);

            if(!isOnline){
                showOfflineView();
            }
            else {
                closeOffline();
            }


            // listen for Online event
            $rootScope.$on('networkOnline', function(event, networkState){
                var onlineState = networkState;
                LocalDataService.setNetworkState(onlineState);

                showOfflineView();
            });

            // listen for Offline event
            $rootScope.$on('networkOffline', function(event, networkState){
                LocalDataService.setNetworkState(networkState);

                closeOffline();

            });

        }
    };


}]);