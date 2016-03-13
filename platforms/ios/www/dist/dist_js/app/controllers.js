angular.module('App.controllers', [])

    .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$window', '$log', '$ionicPlatform', '$ionicModal', '$ionicPopup', '$ionicLoading', '$ionicHistory', '$timeout', '$q', '$ionicActionSheet', '$templateCache', '$translate', 'BasicAuthorizationService', 'UserService', '$cordovaOauth', 'api', '$http', 'LocalDataService', 'NetworkService', 'SupportService', function ($scope, $rootScope, $state, $window, $log, $ionicPlatform, $ionicModal, $ionicPopup, $ionicLoading, $ionicHistory, $timeout, $q, $ionicActionSheet, $templateCache, $translate, BasicAuthorizationService, UserService, $cordovaOauth,  api, $http, LocalDataService, NetworkService, SupportService) {

        $rootScope.debugMode = false;


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
                title: $translate.instant("GENERIC.SERVER_ERROR_TITLE"),
                template: $translate.instant("GENERIC.SERVER_ERROR_TEXT")
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
                        $scope.showUserCorrect();
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
            $scope.modal = $ionicModal.fromTemplate($templateCache.get('user-feedback.html'), {
                scope: $scope
            });
            $scope.modal.show();
        };

        $scope.mailSupport = function () {
            $scope.modal = $ionicModal.fromTemplate($templateCache.get('user-support.html'), {
                scope: $scope
            });
            $scope.modal.show();
        };

        $scope.showUserCorrect = function () {
            $scope.modal = $ionicModal.fromTemplate($templateCache.get('user-correct.html'), {
                scope: $scope
            });
            $scope.modal.show();
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove();
        };



        $scope.submitUserCorrect = function (action, comment) {
            $log.info(comment);
            $log.debug('support message details', $rootScope.supportMessage);

            $ionicLoading.show({
                template: "Submitting"
            });

            var user = LocalDataService.loadUser();

            SupportService.submitSupport(action, user.UserName, comment).then(
                function(success){
                    $ionicLoading.hide();

                    $ionicPopup.alert({
                        title: "Support",
                        template : "Thanks, you message send. We will contact you soon."
                    });
                    $scope.closeModal();

                },
                function(err){
                    $ionicLoading.hide();

                    $log.error("failed to submit user correct", err);
                    $ionicPopup.alert({
                        title: "Failed",
                        template: err
                    });
                }
            );

        };






    }]);

