var controllers = angular.module('App.controllers');

controllers.controller('TwitterCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $ionicPlatform, $log, $cordovaOauth, localStorageService, UserService, LocalDataService) {
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


            $state.go('app.search');
        }, function (error) {
            $log.error('failed to login via twitter', error);
            $ionicLoading.hide();
        });
    };




});
