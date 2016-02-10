var controllers = angular.module('App.controllers');

controllers.controller('MessageCtrl', function ($scope, $rootScope, $state, $log, $stateParams, $ionicLoading, $ionicHistory, MessageService, LocalDataService) {
    $log.info('init messages controller');

    $scope.$on('$ionicView.enter', $scope.load);

    $scope.messages = [

    ];

    $scope.userID = LocalDataService.loadUser().id;

    $scope.load = function(){
        $ionicLoading.show({
            template: 'Loading...'
        });

        MessageService.getMessagesByUser($scope.userID).then(function(response) {
            $scope.messages = response;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });
    };



});
