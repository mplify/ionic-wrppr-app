var controllers = angular.module('App.controllers');

controllers.controller('IntroCtrl', function ($scope, $state, LocalDataService) {

    $scope.init = function(){

        var user = LocalDataService.loadUser();
        $scope.userName = user.UserName;
    }




});
