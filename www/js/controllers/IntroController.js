var controllers = angular.module('App.controllers');

controllers.controller('IntroCtrl', function ($scope, $state, UserService) {

    $scope.init = function(){

        var user = UserService.getUser();
        $scope.userName = user.UserName;

        console.log(window.localStorage.skipIntro);
        if(window.localStorage.skipIntro !== true){
            window.localStorage.skipIntro = true;
            $state.go('app.search');
        }
    }




});
