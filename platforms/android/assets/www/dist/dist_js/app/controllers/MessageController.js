var controllers = angular.module('App.controllers');

controllers.controller('MessageCtrl', ['$scope', '$rootScope', '$state', '$log', '$stateParams', '$ionicLoading', '$ionicHistory', 'MessageService', 'LocalDataService', function ($scope, $rootScope, $state, $log, $stateParams, $ionicLoading, $ionicHistory, MessageService, LocalDataService) {
    $log.info('init messages controller');

    $scope.$on('$ionicView.enter', $scope.load);

    $scope.messages = [

    ];

    $scope.companies = [];

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

    $scope.loadCompanies =  function(){
        $ionicLoading.show({
            template: 'Loading...'
        });

        MessageService.getCompaniesWithMsgCount($scope.userID).then(function(response) {
            $scope.companies = response;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        },
        function(err){
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });
    };



}]);
