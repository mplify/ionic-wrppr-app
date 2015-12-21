var controllers = angular.module('App.controllers');

controllers.controller('AuthorizationCtrl', function ($scope, $ionicLoading, $state, AuthorizationService) {
    $scope.currentUser = {};
    $scope.registerData = {};


    $scope.doRegister = function(){
        $ionicLoading.show({
            template: 'Loading...'
        });

        AuthorizationService.createUser($scope.registerData).then(function(response) {
           $scope.currentUser = response;
           $ionicLoading.hide();
           $scope.$broadcast('scroll.refreshComplete');

          $state.go('app.organizations');

       });
    }
});


