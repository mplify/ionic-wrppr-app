var controllers = angular.module('App.controllers');


controllers.controller('ActionCtrl', function ($scope, $rootScope, $state, $stateParams, $window) {

    console.log('init action controller');
    console.log($rootScope.sessionData);
    if(!$rootScope.sessionData.organization){
        $state.go('app.organizations');
    }

    $scope.currentOrganization = $rootScope.sessionData.organization.orgName;

    $scope.call = function(){
        console.log('make a call');
        $window.location = 'tel:+37126077635';
    }

    $scope.mail = function(){
        console.log('send an email');
        $window.location = 'mailto:marykiselova@gmail.com?subject=This is a sample subject';
    }

    $scope.tweet = function(){
        console.log('tweet');
        $window.location = 'http://www.twitter.com/' + $scope.currentOrganization;
    }
});
