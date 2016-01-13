angular.module('App.controllers', [])

    .controller('AppCtrl', function ($scope, $rootScope, $state,  $ionicPlatform, $ionicModal, $ionicPopup, $ionicLoading, $timeout, $q, Auth, UserService, $cordovaOauth, localStorageService, api, $http, AuthorizationService) {






        $rootScope.sessionData = {};

        // company styling
        $scope.$on('$ionicView.beforeEnter', function() {
            if($rootScope.sessionData.organization){
                if($rootScope.sessionData.organization.BrandingColor1 !== undefined){
                    $rootScope.brandingColor = $rootScope.sessionData.organization.BrandingColor1;
                }

                if($rootScope.sessionData.organization.BrandingColor2 !== undefined){
                    $rootScope.brandingColor2 = $rootScope.sessionData.organization.BrandingColor2;
                }
            }
            else {
               // delete($rootScope.brandingColor);
            }
        });

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
                $scope.modal = modal;
            });


        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            alert('remove it is never used, all this modal stuff');

            $scope.modal.show();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.logout = function(){
            Auth.clearCredentials();

            var url =  api.byName('base-url') + api.byName('logout-url');


            $http.get(url,
                {

                })
                .success(function (resp) {
                    console.log('logout done');
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

    })






;

