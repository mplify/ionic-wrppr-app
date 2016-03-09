angular.module('App.controllers', [])

    .controller('AppCtrl', function ($scope, $rootScope, $state, $window, $log, $ionicPlatform, $ionicModal, $ionicPopup, $ionicLoading, $ionicHistory, $timeout, $q, $ionicActionSheet, $templateCache, BasicAuthorizationService, UserService, $cordovaOauth,  api, $http, LocalDataService, NetworkService) {

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
                        $scope.userCorrect();
                    }
                    else if(index === 1){
                        $scope.mailSupport();
                    }
                    else if(index === 2){
                        $scope.mailFeedback();
                    }



                    return true;
                }
            });
        };


        $scope.mailFeedback = function () {
            $window.location = 'mailto:feedback@mplify.nl' + '?subject=Feedback about wrapper app';
        };

        $scope.mailSupport = function () {
            $window.location = 'mailto:support@mplify.nl' + '?subject=Feedback about wrapper app';
        };

        $scope.userCorrect = function () {
            $scope.modal = $ionicModal.fromTemplate($templateCache.get('user-correct.html'), {
                scope: $scope
            });
            $scope.modal.show();
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove();
        };



        $scope.submitUserCorrect = function (comment) {
            $log.info(comment);
            $scope.closeModal();
        };






    });

