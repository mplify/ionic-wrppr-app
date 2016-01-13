var controllers = angular.module('App.controllers');


controllers.controller('ActionCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $ionicPlatform, $cordovaAppAvailability) {


    console.log('init action controller');
    console.log($rootScope.sessionData);
    if(!$rootScope.sessionData.organization){
        $state.go('app.organizations');
    }

    $scope.contacts = {};


    if($rootScope.sessionData.organization != undefined) {

        $scope.currentOrganization = $rootScope.sessionData.organization.orgName;

        $scope.currentOptions = $rootScope.sessionData.options;

        $scope.contacts.email = $rootScope.sessionData.organization.EmailAddress;
        $scope.contacts.twitter = $rootScope.sessionData.organization.TwitterAccount;
        $scope.contacts.call = $rootScope.sessionData.organization.TelephoneNumber;
    }

    $scope.call = function(){
        console.log('make a call');
        $window.location = 'tel:' + $scope.contacts.call;
    }

    $scope.mail = function(){
        console.log('send an email');
        $window.location = 'mailto:' +$scope.contacts.email+ '?subject=This is a sample subject';
    }

    $scope.hasTwitterApp = false;


    $scope.tweet = function(){
        console.log('tweet');

        if($scope.hasTwitterApp) {
            window.open('twitter://user?screen_name=' + $scope.contacts.twitter, '_system', 'location=no');
        }
        else {
            window.open('https://twitter.com/intent/tweet?screen_name='+ $scope.contacts.twitter, '_system', 'location=no');
        }
    }

    $scope.mailFeedback = function(){
        $window.location = 'mailto:feedback@mplify.nl'+ '?subject=Feedback about wrapper app';
    }

    $scope.mailSupport = function(){
        $window.location = 'mailto:support@mplify.nl'+ '?subject=Feedback about wrapper app';
    }

    /*$ionicPlatform.ready(function() {

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
    }); */

});
