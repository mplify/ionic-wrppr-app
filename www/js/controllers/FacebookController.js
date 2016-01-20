var controllers = angular.module('App.controllers');

controllers.controller('FacebookCtrl', function ($scope, $rootScope, $state, $stateParams, $q, $ionicLoading, $http, $cordovaOauth, localStorageService, UserService, Auth) {
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

        //FIXME
        $http.defaults.headers.common.Authorization = 'facebook ' + authResponse.accessToken;

        $scope.getFacebookProfileInfo(authResponse)
            .then(function(profileInfo) {
                UserService.loadUser(profileInfo.email);
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

                $scope.facebookConnectedStateHandler(success);

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

    $scope.facebookConnectedStateHandler = function(connectedResponse) {

        // Check if we have our user saved
        var localFBUser = UserService.getLocalFacebookUser();


        if(!localFBUser.userID){
            $scope.getFacebookProfileInfo(connectedResponse.authResponse.accessToken)
                .then(function(profileInfo) {

                    $scope.checkFacebookUser(profileInfo);

                    // For the purpose of this example I will store user data on local storage
                    UserService.setLocalFacebookUser({
                        authResponse: connectedResponse.authResponse,
                        userID: profileInfo.id,
                        name: profileInfo.name,
                        email: profileInfo.email,
                        picture : "http://graph.facebook.com/" + connectedResponse.authResponse.userID + "/picture?type=large"
                    });

                }, function(fail){
                    // Fail get profile info
                    console.log('profile info fail', fail);
                });
        }else{
            $scope.checkFacebookUser(localFBUser);

        }


    }

    $scope.checkFacebookUser = function(localFBUser){
        UserService.searchByFacebookAccount(localFBUser.email).then(function(facebookUsers) {
            console.log(facebookUsers);

            if(facebookUsers.length == 0){
                // try to find user with same email

                UserService.searchByEmail(localFBUser.email).then(function(matchedUsers){
                    if(matchedUsers.length == 0){
                        console.log('create user based on facebook profile info: ' + localFBUser);

                        var userData = {
                            UserName : localFBUser.email,
                            Emailaddress : localFBUser.email,
                            FacebookAccount : localFBUser.email,
                            Password : localFBUser.email,
                            FacebookToken : localFBUser.authResponse.accessToken
                        }

                        UserService.createUser(userData).then(function(createdUser){
                            $scope.finishFacebookLogin();
                        });
                    }
                    else {
                        console.log('link facebook acoount to user with same email address');
                        var remoteFBUser = matchedUsers[0];
                        remoteFBUser.FacebookToken = localFBUser.authResponse.accessToken;
                        remoteFBUser.FacebookAccount = localFBUser.email;

                        UserService.updateUser(remoteFBUser).then(function(updatedUser){
                            $scope.finishFacebookLogin();
                        });;
                    }

                });

            }
            else {
                console.log('update facebook token to existing facebook account');
                var remoteFBUser = facebookUsers[0];
                if(remoteFBUser.FacebookToken !== localFBUser.authResponse.accessToken) {
                    console.log('remote and locat facebook tokens are not equals');
                }
                remoteFBUser.FacebookToken = localFBUser.authResponse.accessToken;
                UserService.updateUser(remoteFBUser).then(function(updatedUser){
                    $scope.finishFacebookLogin();
                });;
            }

        });;

    }

    $scope.finishFacebookLogin = function(){
         var localFBUser = UserService.getLocalFacebookUser();
         Auth.setToken('Facebook ' + localFBUser.authResponse.accessToken);

        $state.go('app.intro');
    }

    $scope.facebookLogout = function(){
        facebookConnectPlugin.logout();
        UserService.setFacebookUser({});
    }





    //FIXME for user testing screen, remove later
    $scope.facebookProfile = function(){
        var user = UserService.getFacebookUser();
        $scope.getFacebookProfileInfo(user.authResponse.accessToken);


    }
});
