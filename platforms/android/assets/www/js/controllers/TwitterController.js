var controllers = angular.module('App.controllers');

controllers.controller('TwitterCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $ionicPlatform, $log, $cordovaOauth, localStorageService, UserService, BasicAuthorizationService) {
    $scope.twitterLoginEnabled = window.cordova;

    $scope.consumerKey = 'JVj33eTXGPxlVZxoT8htdqwNK';
    $scope.consumerSecret = 'Q6K9GtYCrxhLPLWfIkr5eTHvpizf4NbEm6sHhkE0pSo0Ts7TFl';

    $scope.twitterProfileInfo = {};

    $scope.loadTwitterUser = function(){
        $scope.twitterProfileInfo = UserService.getUser();
    };

    $scope.twitterLogin = function () {

        $ionicLoading.show({
            template: 'Logging in...'
        });

        $cordovaOauth.twitter($scope.consumerKey, $scope.consumerSecret, {}).then(function (result) {
            $log.info('logged in via twitter', result);
            $ionicLoading.hide();

            $log.debug('twitter login success', result);

            var twitterName = result.screen_name;
            var twitterToken = result.oauth_token;

            UserService.searchByTwitterAccount(twitterName).then(function(users){
                if(users.length > 0){
                    $log.info('found user with same twitter account', users);

                    $scope.updateToken(users[0], twitterToken);
                    //fixme update token

                }
                else {
                    UserService.searchByUsername(twitterName).then(
                        function(usersWithUsername){
                            if(usersWithUsername.length > 0){
                                $scope.updateToken(usersWithUsername[0], twitterToken);
                            }
                            else {
                                //fixme create user
                                var user = {
                                    'UserName' :  twitterName,
                                    'TwitterAccount' :  twitterName,
                                    'TwitterOauthToken' :  twitterToken
                                };

                                UserService.createUser(user).then(
                                    function(createdUser){
                                         $scope.updateCredentials(createdUser, twitterToken);
                                    },
                                    function(createError){

                                    }
                                );
                            }
                        },
                        function(err){
                           $log.error('failed to search user', err);
                        }
                    );
                }
            }, function(error){
                $log.error('failed to search user', error);
            });

            //$state.go('app.search');
        }, function (error) {
            $log.error('failed to login via twitter', error);
            $ionicLoading.hide();
        });
    };

    $scope.updateToken = function(user, token){
       user.TwitterOauthToken = token;
       UserService.updateUser(user).then(
           function(updateSuccess){
               $scope.updateCredentials(user, token);
           },
           function(error){
               $log.error('failed update user', error);
           }
       );
    };

    $scope.updateCredentials = function(user, token){
        $log.info('logged in via twitter', user);
        var username = user.UserName;
        var password = "twitter " + token;
        BasicAuthorizationService.generateToken(username, password);

        $state.go('app.search');
    };




});
