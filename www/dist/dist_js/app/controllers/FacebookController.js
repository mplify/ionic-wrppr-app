var controllers = angular.module('App.controllers');

controllers.controller('FacebookCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicPlatform', '$q', '$log', '$ionicLoading', '$ionicPopup', '$http', '$cordovaOauth', '$translate', 'UserService', 'BasicAuthorizationService', 'LocalDataService', 'FacebookService', function ($scope, $rootScope, $state, $stateParams, $ionicPlatform, $q, $log, $ionicLoading, $ionicPopup, $http, $cordovaOauth, $translate, UserService, BasicAuthorizationService, LocalDataService, FacebookService) {
    $scope.facebookLoginEnabled = window.cordova;

    $scope.facebookManualLogin = function () {
        $ionicLoading.show({
            template: $translate.instant("FACEBOOK.LOADING")
        });

        FacebookService.getLoginStatus().then(
            function (success) {
                if (success.status === 'connected') {
                    var accessToken = success.authResponse.accessToken;

                    FacebookService.getProfileInfo(accessToken).then(function (profileSuccess) {

                        // sync with local user
                        FacebookService.saveUser(profileSuccess, accessToken).then(function (saveSuccess) {
                            var user = saveSuccess;
                            $scope.updateLocalStorage(user, profileSuccess, accessToken);
                            $ionicLoading.hide();

                        }, function (saveError) {
                            $log.error('failed to save profile info');
                            $ionicLoading.hide();

                            $ionicPopup.alert({
                                title: $translate.instant("FACEBOOK.FAILED")
                            });
                        });

                    }, function (error) {
                        $log.error('failed to get profile info');
                        $ionicLoading.hide();

                        $ionicPopup.alert({
                            title: $translate.instant("FACEBOOK.FAILED")
                        });
                    });
                }
                else {
                    // show native login dialog
                    $scope.openNativeLogin();
                }
            },
            function (error) {

            });
    };

    $scope.nativeLoginSuccess = function (response) {
        var accessToken = response.authResponse.accessToken;

        FacebookService.getProfileInfo(accessToken).then(function (profileSuccess) {
            // sync with local user
            FacebookService.saveUser(profileSuccess, accessToken).then(
                function (saveSuccess) {
                    $scope.updateLocalStorage(saveSuccess, profileSuccess, accessToken);
                    $ionicLoading.hide();
                },
                function (saveError) {
                    $log.error('failed to save user');
                    $ionicLoading.hide();

                    $ionicPopup.alert({
                        title: $translate.instant("FACEBOOK.FAILED"),
                        template: error
                    });
                });

        }, function (error) {
            $log.error('failed to get profile info');
            $ionicLoading.hide();

            $ionicPopup.alert({
                title: $translate.instant("FACEBOOK.FAILED"),
                template: error
            });
        });
    };

    $scope.nativeLoginError = function (error) {
        $ionicLoading.hide();
    };

    $scope.openNativeLogin = function () {
        facebookConnectPlugin.login(['email', 'public_profile'], $scope.nativeLoginSuccess, $scope.nativeLoginError);
    };

    $scope.updateLocalStorage = function (user, profileInfo, accessToken) {
        LocalDataService.saveUser(user);

        profileInfo.accessToken = accessToken;
        profileInfo.picture = "http://graph.facebook.com/" + profileInfo.userID + "/picture?type=large";

        $rootScope.profilePhoto = profileInfo.picture;
        LocalDataService.saveFacebookResponse(profileInfo);

        $log.info('logged in via facebook', user);
        var username = user.Emailaddress;
        var password = "facebook " + accessToken;
        BasicAuthorizationService.generateToken(username, password);

        $state.go('app.search');


    };


}]);
