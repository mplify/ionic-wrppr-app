var controllers = angular.module('App.controllers');

controllers.controller('TwitterCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $ionicPlatform, $log, localStorageService, UserService, LocalDataService) {
    $scope.twitterLoginEnabled = window.cordova;

    $scope.consumerKey = 'JVj33eTXGPxlVZxoT8htdqwNK';
    $scope.consumerSecret = 'Q6K9GtYCrxhLPLWfIkr5eTHvpizf4NbEm6sHhkE0pSo0Ts7TFl';

    $scope.twitterProfileInfo = {};

    $scope.loadTwitterUser = function(){
        $scope.twitterProfileInfo = UserService.getUser();
    }

    $scope.twitterLogin = function () {

        $cordovaOauth.twitter($scope.consumerKey, $scope.consumerSecret, {}).then(function (result) {
            alert(result.access_token);

            $scope.twitterProfileInfo = result;
            LocalDataService.saveUser(result);
            $log.info(result);

            localStorageService.set('twitterToken', result.access_token);

        }, function (error) {
            alert("Error: " + error);
        });
    }




});
