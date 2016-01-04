var controllers = angular.module('App.controllers');


controllers.controller('ActionCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $ionicPlatform, $cordovaAppAvailability) {


    console.log('init action controller');
    console.log($rootScope.sessionData);
    if(!$rootScope.sessionData.organization){
        $state.go('app.organizations');
    }

    if($rootScope.sessionData.organization != undefined) {
        $scope.currentOrganization = $rootScope.sessionData.organization.orgName;
    }

    $scope.call = function(){
        console.log('make a call');
        $window.location = 'tel:+37126077635';
    }

    $scope.mail = function(){
        console.log('send an email');
        $window.location = 'mailto:marykiselova@gmail.com?subject=This is a sample subject';
    }

    $scope.hasTwitterApp = false;


    $scope.tweet = function(){
        console.log('tweet');

        if($scope.hasTwitterApp) {
            window.open('twitter://user?screen_name=marykiselova', '_system', 'location=no');
        }
        else {
            window.open('https://twitter.com/intent/tweet?screen_name=marykiselova', '_system', 'location=no');
        }
    }


    $ionicPlatform.ready(function() {

        if(!window.cordova){
            return;
        }

        $scope.scheme = 'twitter://';

        if(device.platform === 'iOS') {
            $scope.scheme = 'twitter://';
        }
        else if(device.platform === 'Android') {
            $scope.scheme = 'com.twitter.android';
        }

        $cordovaAppAvailability.check($scope.scheme)
            .then(function() {
                // is available
                console.log('Twitter is available');
                $scope.hasTwitterApp = true;

            }, function () {
                // not available
                console.log('Twitter is not available');
                $scope.hasTwitterApp = false;
            });
    });

});
