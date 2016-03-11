var services = angular.module('App.services');

services.service('FacebookService', ['$q', '$log', '$state', 'UserService', 'LocalDataService', 'BasicAuthorizationService', function ($q, $log, $state, UserService, LocalDataService, BasicAuthorizationService) {


    var autoLogin = function(){
           $log.info('try to auto login');
           var localUser = LocalDataService.getFacebookResponse();
           if(localUser && localUser.accessToken){
                getLoginStatus().then(function(success){
                    if (success.status === 'connected') {
                        $log.info('auto logged in via facebook', localUser);

                        var username = localUser.email;
                        var password = "facebook " + localUser.accessToken;
                        BasicAuthorizationService.generateToken(username, password);

                        $state.go('app.search');
                    }
                }, function(err){
                      $log.error("facebook auto login failed", err);
                });
           }
    };


    var getLoginStatus = function () {
        $log.info('facebook login status');

        var defer = $q.defer();

        facebookConnectPlugin.getLoginStatus(function (success) {
                $log.info('facebook login status success : ' + success.status);
                defer.resolve(success);

            },
            function (error) {
                defer.reject(error);
            });
        return defer.promise;
    };


    var getProfileInfo = function (accessToken) {
        var info = $q.defer();

        facebookConnectPlugin.api('/me?fields=email,name&access_token=' + accessToken, ["public_profile"],
            function (profileInfo) {
                info.resolve(profileInfo);
            },
            function (response) {
                $log.error(response);
                info.reject(response);
            }
        );
        return info.promise;
    };


    var saveUser = function (profileInfo, accessToken) {


        var defer = $q.defer();

        if (angular.isDefined(profileInfo.email)) {
            var email = profileInfo.email;
            UserService.searchByFacebookAccount(email).then(
                function (users) {
                    if (users.length === 0) {
                        UserService.searchByEmail(email).then(
                            function (emailMapedUsers) {
                                if (emailMapedUsers.length === 0) {
                                    // create new user
                                    var userData = {
                                        UserName: profileInfo.email,
                                        Emailaddress: profileInfo.email,
                                        FacebookAccount: profileInfo.email,
                                        Password: profileInfo.email,
                                        FacebookToken: accessToken
                                    };

                                    UserService.createUser(userData).then(function (createdUser) {
                                            defer.resolve(createdUser);
                                        },
                                        function (error) {
                                            defer.reject(error);
                                        });


                                }
                                else {
                                    var user = emailMapedUsers[0];

                                    user.FacebookToken = accessToken;
                                    UserService.updateUser(user).then(function (updatedUser) {
                                            defer.resolve(updatedUser);
                                        },
                                        function (error) {
                                            defer.reject(error);
                                        });
                                }
                            },
                            function (error) {
                                defer.reject(error);
                            });
                    }
                    else {
                        // update token for existing user
                        var user = users[0];

                        user.FacebookToken = accessToken;
                        UserService.updateUser(user).then(function (updatedUser) {
                                defer.resolve(updatedUser);
                            },
                            function (error) {
                                defer.reject(error);
                            });
                    }
                }, function (error) {
                    defer.reject(error);
                });
        }
        else {
            defer.reject();
        }

        return defer.promise;
    };


    return {
        getLoginStatus: getLoginStatus,
        getProfileInfo: getProfileInfo,
        saveUser: saveUser,
        autoLogin : autoLogin
    };

}]);