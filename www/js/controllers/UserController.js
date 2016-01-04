var controllers = angular.module('App.controllers');

controllers.controller('UserCtrl', function ($scope, $rootScope, Auth, localStorageService) {
    $scope.sessionKey = Auth.getCredentials();
    $scope.facebookKey = localStorageService.get('facebookToken');

});


