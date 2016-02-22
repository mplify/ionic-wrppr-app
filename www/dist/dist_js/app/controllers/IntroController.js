var controllers = angular.module('App.controllers');

controllers.controller('IntroCtrl', ['$scope', '$state', 'LocalDataService', function ($scope, $state, LocalDataService) {

    $scope.$on('$ionicView.beforeEnter', function(){
        // check intro already shows flag
        if(LocalDataService.getIntroScreenVisited()){
            $state.go('app.search');
        }
    });


    $scope.$on('$ionicView.beforeLeave', function(){
        //mark as visited
        LocalDataService.setIntroScreenVisited(true);
    });

    $scope.init = function(){

        var user = LocalDataService.loadUser();
        $scope.userName = user.UserName;
    };




}]);
