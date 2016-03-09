angular.module('App.controllers', [])

    .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$log', '$ionicPlatform', '$ionicModal', '$ionicPopup', '$ionicLoading', '$ionicHistory', '$timeout', '$q', 'BasicAuthorizationService', 'UserService', '$cordovaOauth', 'api', '$http', 'LocalDataService', 'NetworkService', function ($scope, $rootScope, $state, $log, $ionicPlatform, $ionicModal, $ionicPopup, $ionicLoading, $ionicHistory, $timeout, $q, BasicAuthorizationService, UserService, $cordovaOauth,  api, $http, LocalDataService, NetworkService) {

        $rootScope.debugMode = true;


        $rootScope.sessionData = {};

        // company styling
        $scope.$on('$ionicView.beforeEnter', function() {
            if($rootScope.sessionData.organization){
                if($rootScope.sessionData.organization.BrandingColor1 !== null){
                    $rootScope.brandingColor = $rootScope.sessionData.organization.BrandingColor1;
                }
                else {
                    $rootScope.brandingColor = '#ff5642';
                }

                if($rootScope.sessionData.organization.BrandingColor2 !== null){
                    $rootScope.brandingColor2 = $rootScope.sessionData.organization.BrandingColor2;
                }
                else {
                    $rootScope.brandingColor2 = '#ff5642';
                }

            }

        });


        $scope.logout = function(){
            BasicAuthorizationService.clearCredentials();

            if(window.cordova){
                facebookConnectPlugin.logout();
            }
            LocalDataService.saveUser({});

            var url =  api.byName('base-url') + api.byName('logout-url');


            $http.get(url,
                {

                })
                .success(function (resp) {
                    $log.debug('logout done');
                })
                .error(function (err) {

                });

            $state.go('root');

        };

        $scope.$on('serverdown', function(){
            $ionicPopup.alert({
                title: 'Service is temporarily not available',
                template: 'BUT we are working hard to fix it'
            });
        });

        $scope.$on('unauthorized', function(){
            $log.info('unauthorized, redirect to root');
            if($state.current.name.indexOf('app') > -1){
                $state.go('root');
            }
        });


        $scope.refreshNetworkState = function(){
            NetworkService.checkNetworkState();
        };


        $scope.openSupport = function(){
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text : "User correct"},
                    { text : "Support"},
                    { text : "Feedback"}

                ],
                titleText: 'Feedback',
                cancelText: 'Cancel',
                buttonClicked: function (index) {
                    if(index === 0){

                    }
                    else if(index === 1){
                        $window.location = 'mailto:support@mplify.nl' + '?subject=Feedback about wrapper app';
                    }
                    else if(index === 2){
                        $window.location = 'mailto:feedback@mplify.nl' + '?subject=Feedback about wrapper app';
                    }



                    return true;
                }
            });
        }






    }]);

