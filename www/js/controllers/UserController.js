var controllers = angular.module('App.controllers');

controllers.controller('UserCtrl', function ($scope, $rootScope, Auth, localStorageService, UserService) {
    var user = UserService.getUser();
    $scope.userName = user.UserName;




    $scope.sessionKey = Auth.getCredentials();
    $scope.facebookKey = localStorageService.get('facebookToken');

    $scope.localFBUser = UserService.getLocalFacebookUser();
    console.log($scope.localFBUser);

});


