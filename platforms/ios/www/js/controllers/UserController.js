var controllers = angular.module('App.controllers');

controllers.controller('UserCtrl', function ($scope, $rootScope, Auth, localStorageService, UserService) {
    $scope.localUser = UserService.getUser();

    console.log($scope.localUser);

    $scope.localFBUser = UserService.getLocalFacebookUser();




    $scope.sessionKey = Auth.getCredentials();
    $scope.facebookKey = localStorageService.get('facebookToken');

    $scope.localFBUser = UserService.getLocalFacebookUser();
    console.log($scope.localFBUser);

});


