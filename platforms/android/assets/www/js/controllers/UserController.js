var controllers = angular.module('App.controllers');

controllers.controller('UserCtrl', function ($scope, $rootScope, $log, Auth, localStorageService, UserService) {
    $scope.loadUserDetails = function(userId){
        UserService.loadUser(userId).then(function(userDetails){
            $scope.user = userDetails;

        }, function(error){
            $log.error('failed to load user details');
        });

    }


    $scope.localUser = UserService.getUser();

    console.log($scope.localUser);
    if($scope.localUser.id){
        $scope.loadUserDetails($scope.localUser.id);
    }


    $scope.localFBUser = UserService.getLocalFacebookUser();




    $scope.sessionKey = Auth.getCredentials();
    $scope.facebookKey = localStorageService.get('facebookToken');

    $scope.localFBUser = UserService.getLocalFacebookUser();
    console.log($scope.localFBUser);


});


