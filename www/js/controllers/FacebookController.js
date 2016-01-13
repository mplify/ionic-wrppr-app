var controllers = angular.module('App.controllers');

controllers.controller('FacebookCtrl', function ($scope, $rootScope, $state, $stateParams, $q, $ionicLoading, $cordovaOauth, localStorageService, UserService) {
    $scope.facebookLoginEnabled = window.cordova;

    $scope.facebookProfileInfo = {};
    $scope.facebookLoginStatus = "";
    $scope.facebookKey = "";

    /* auth in browser, not used now !
    $scope.facebookLogin = function(){

        console.log(window.cordova);

        $cordovaOauth.facebook("1000113900051105", ["email", "public_profile"]).then(function(result){
            console.log(result.access_token);
            localStorageService.set('facebookToken', result.access_token);

        },  function(error){
            alert("Error: " + error);
        });
    }
    */

    // This is the success callback from the login method
    var fbLoginSuccess = function(response) {
        if (!response.authResponse){
            fbLoginError("Cannot find the authResponse");
            return;
        }

        var authResponse = response.authResponse;
        $scope.facebookKey = authResponse.accessToken;

        $scope.getFacebookProfileInfo(authResponse)
            .then(function(profileInfo) {
                // For the purpose of this example I will store user data on local storage
                UserService.setFacebookUser({
                    authResponse: authResponse,
                    userID: profileInfo.id,
                    name: profileInfo.name,
                    email: profileInfo.email,
                    picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
                });
                $ionicLoading.hide();
                $state.go('app.intro');
            }, function(fail){
                // Fail get profile info
                console.log('profile info fail', fail);
            });
    };

    // This is the fail callback from the login method
    var fbLoginError = function(error){
        console.log('fbLoginError', error);
        $ionicLoading.hide();
    };

    // This method is to get the user profile info from the facebook api
    $scope.getFacebookProfileInfo = function (accessToken) {
        var info = $q.defer();

        facebookConnectPlugin.api('/me?fields=email,name&access_token=' + accessToken, null,
            function (response) {
                console.log(response);

                $scope.facebookProfileInfo = response;
                console.log(accessToken);
                $scope.facebookProfileInfo.accessToken = accessToken;
                $scope.facebookProfileInfo.photo = "http://graph.facebook.com/" + response.id + "/picture?type=large";

                info.resolve(response);
            },
            function (response) {
                console.log(response);
                info.reject(response);
            }
        );
        return info.promise;
    };


    //This method is executed when the user press the "Login with facebook" button
    $scope.facebookSignIn = function() {
        console.log('facebook login');
        facebookConnectPlugin.getLoginStatus(function(success){
            $scope.facebookLoginStatus = success.status;

            if(success.status === 'connected'){
                // The user is logged in and has authenticated your app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed request, and the time the access token
                // and signed request each expire
                console.log('getLoginStatus', success.status);

                // Check if we have our user saved
                var user = UserService.getFacebookUser('facebook');

                if(!user.userID){
                    getFacebookProfileInfo(success.authResponse.accessToken)
                        .then(function(profileInfo) {
                            // For the purpose of this example I will store user data on local storage
                            UserService.setFacebookUser({
                                authResponse: success.authResponse,
                                userID: profileInfo.id,
                                name: profileInfo.name,
                                email: profileInfo.email,
                                picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
                            });

                            $state.go('app.intro');
                        }, function(fail){
                            // Fail get profile info
                            console.log('profile info fail', fail);
                        });
                }else{
                    $state.go('app.intro');
                }
            } else {
                // If (success.status === 'not_authorized') the user is logged in to Facebook,
                // but has not authenticated your app
                // Else the person is not logged into Facebook,
                // so we're not sure if they are logged into this app or not.

                console.log('getLoginStatus', success.status);

                $ionicLoading.show({
                    template: 'Logging in...'
                });

                // Ask the permissions you need. You can learn more about
                // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
            }
        });
    };

    $scope.facebookLogout = function(){
        facebookConnectPlugin.logout();

        UserService.setFacebookUser({});
    }

    $scope.facebookProfile = function(){
        var user = UserService.getFacebookUser();


        $scope.getFacebookProfileInfo(user.authResponse.accessToken);

        /*var token = localStorageService.get('facebookToken');

        facebookConnectPlugin.api('/me?fields=email,name&access_token=' + token, null,
            function (response) {
                console.log(response);
                $scope.facebookProfileInfo = response;
                $scope.facebookProfileInfo.photo = "http://graph.facebook.com/" + response.id + "/picture?type=large";
            },
            function (response) {
                console.log(response);

            }
        );*/
    }
});
