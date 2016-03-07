var controllers = angular.module('App.controllers');

controllers.controller('MessageHistoryCtrl', function ($scope, $rootScope, $state, $log, $stateParams, $ionicLoading, $ionicHistory, MessageService, LocalDataService, OrganizationService) {
    $log.info('init messages controller');

    $scope.$on('$ionicView.enter', function () {
        if ($rootScope.reloadMessages) {
            $scope.load();
        }

    });

    $scope.messages = [

    ];


    $scope.userID = LocalDataService.loadUser().id;

    $scope.load = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });

        var orgID = $stateParams.orgID;

        MessageService.getMessagesByUser($scope.userID, orgID).then(function (response) {
                $scope.messages = response;

                $rootScope.reloadMessages = false;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function (err) {
                $log.error('failed to load messages history', err);
            });
    };
    $scope.load();


    $scope.selectMessage = function (message) {
        $state.go('app.messagedetails', { 'messageID': message.id});
    };


});
