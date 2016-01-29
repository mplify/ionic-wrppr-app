var controllers = angular.module('App.controllers');

controllers.controller('IntroCtrl', function ($scope, $state, UserService) {

    $scope.init = function(){

        var user = UserService.getUser();
        $scope.userName = user.UserName;
    }




});
