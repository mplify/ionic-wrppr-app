var controllers = angular.module('App.controllers');

controllers.controller('FacebookCtrl', function ($scope, $rootScope, $state, $stateParams, $q, $ionicLoading, $http, $cordovaOauth, localStorageService, UserService, Auth) {
    $scope.log = 'debug';


    $scope.facebookLoginEnabled = window.cordova;

    $scope.facebookProfileInfo = {};
    $scope.facebookLoginStatus = "";


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
        $scope.debugMessage('fb login success' + angular.toJson(response));


        if (!response.authResponse){
            fbLoginError("Cannot find the authResponse");
            return;
        }

        var authResponse = response.authResponse;



        $scope.getFacebookProfileInfo(authResponse)
            .then(function(profileInfo) {
                alert('loaded profile info');
                // For the purpose of this example I will store user data on local storage
                UserService.setLocalFacebookUser({
                    authResponse: authResponse,
                    userID: profileInfo.id,
                    name: profileInfo.name,
                    email: profileInfo.email,
                    picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
                });
                $ionicLoading.hide();

                $scope.facebookConnectedStateHandler(authResponse);
            }, function(fail){
                // Fail get profile info
                console.log('profile info fail', fail);
                $ionicLoading.hide();
            });
    };

    // This is the fail callback from the login method
    var fbLoginError = function(error){
        console.log('fbLoginError', error);

        $ionicLoading.hide();
    };

    // This method is to get the user profile info from the facebook api
    $scope.getFacebookProfileInfo = function (authResponse) {
        $scope.debugMessage('load profile info' + authResponse.accessToken);
        var info = $q.defer();

        facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, ["public_profile"],
            function (profileInfo) {
                $scope.debugMessage('profile info success' + angular.toJson(profileInfo));
                // For the purpose of this example I will store user data on local storage
                UserService.setLocalFacebookUser({
                    authResponse: authResponse,
                    userID: profileInfo.id,
                    name: profileInfo.name,
                    email: profileInfo.email,
                    picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
                });
                $scope.localFBUser = UserService.getLocalFacebookUser();

                $scope.checkFacebookUser(profileInfo);


                info.resolve(profileInfo);
            },
            function (response) {
                $scope.debugMessage('profile info failed' + angular.toJson(response));
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
            console.log('facebook login status: '  + success.status);
            $scope.debugMessage("fb status " + success.status);

            if(success.status === 'connected'){

                $scope.facebookConnectedStateHandler(success);

            } else {
                $scope.debugMessage('open facebookConnenct login');
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
        $scope.localFBUser = UserService.getLocalFacebookUser();
        console.log("load local fb user: " + $scope.localFBUser);


        if(!$scope.localFBUser.userID){
            $scope.debugMessage("No local fb user");

            $scope.getFacebookProfileInfo(connectedResponse.authResponse.accessToken)
                .then(function(profileInfo) {

                    // For the purpose of this example I will store user data on local storage
                    UserService.setLocalFacebookUser({
                        authResponse: connectedResponse.authResponse,
                        userID: profileInfo.id,
                        name: profileInfo.name,
                        email: profileInfo.email,
                        picture : "http://graph.facebook.com/" + connectedResponse.authResponse.userID + "/picture?type=large"
                    });
                    $scope.localFBUser = UserService.getLocalFacebookUser();

                    $scope.checkFacebookUser(profileInfo);



                }, function(fail){
                    // Fail get profile info
                    console.log('profile info fail', fail);
                });
        }else{
            $scope.debugMessage("Has local user "+ $scope.localFBUser.email);
            $scope.checkFacebookUser($scope.localFBUser);

        }


    }

    $scope.testFacebook = function(){
        UserService.searchByFacebookAccount('marykiselova@gmail.com').then(function(facebookUsers) {
            alert(facebookUsers.length);
        });
    }

    $scope.checkFacebookUser = function(localFBUser){
        console.log('check facebook users in our DB');

        UserService.searchByFacebookAccount(localFBUser.email).then(function(facebookUsers) {
            $scope.debugMessage("found FB users: " +  facebookUsers.length);


            if(facebookUsers.length == 0){
                // try to find user with same email

                UserService.searchByEmail(localFBUser.email).then(function(matchedUsers){
                    if(matchedUsers.length == 0){
                        $scope.debugMessage('create user in DB');
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
                        $scope.debugMessage('update user in DB');
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
                $scope.debugMessage('Found matched FB user in DB: ' + $scope.localFBUser.userID);
                console.log('update facebook token to existing facebook account');
                var remoteFBUser = facebookUsers[0];
                if(remoteFBUser.FacebookToken !== localFBUser.authResponse.accessToken) {
                    console.log('remote and locat facebook tokens are not equals');
                }
                remoteFBUser.FacebookToken = localFBUser.authResponse.accessToken;
                UserService.updateUser(remoteFBUser).then(function(updatedUser){
                    $scope.finishFacebookLogin();
                });
            }

        });

    }

    $scope.finishFacebookLogin = function(){
        $scope.debugMessage('finish fb login');

         var localFBUser = UserService.getLocalFacebookUser();

         var username = localFBUser.email;
         var password = "facebook " + localFBUser.authResponse.accessToken;
         Auth.setCredentials(username, password);

        $state.go('app.intro');
    }

    $scope.facebookLogout = function(){
        facebookConnectPlugin.logout();
        UserService.setLocalFacebookUser({});
        $scope.localFBUser = UserService.getLocalFacebookUser();
    }


    $scope.clearLocalStorage = function(){
       delete(window.localStorage.wrapper_facebook_user);
    }

    $scope.debugMessage = function(message, data){
        if($scope.log == 'debug'){
         alert(message);
         console.log(data);
        }
    }

});
