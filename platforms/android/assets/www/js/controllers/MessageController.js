var controllers = angular.module('App.controllers');

controllers.controller('MessageCtrl', function ($scope, $rootScope, $state, $log, $stateParams, $ionicLoading, $ionicHistory, MessageService, LocalDataService) {
    $log.info('init messages controller');

    $scope.$on('$ionicView.enter', function(){
        if($stateParams.messageID){
            $scope.loadMessage();
        }
        else {
            $scope.load();
        }
    });

    $scope.messages = [

    ];

    $scope.companies = [];

    $scope.userID = LocalDataService.loadUser().id;

    $scope.load = function(){
        $ionicLoading.show({
            template: 'Loading...'
        });

        var orgID = $stateParams.orgID;

        MessageService.getMessagesByUser($scope.userID, orgID).then(function(response) {
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

    $scope.selectOrganisation = function(organisation){
        $state.go('app.favorite', { 'orgID' : organisation.OrgID});
    };

    $scope.selectMessage = function(message){
        $state.go('app.messagedetails', { 'messageID' : message.id});
    };

    $scope.currentMessage = {};

    $scope.loadMessage = function(){
        $ionicLoading.show({
            template: 'Loading...'
        });


        var messageID = $stateParams.messageID;
        MessageService.loadMessage(messageID).then(
            function(success){
               $ionicLoading.hide();
               $log.info('loaded message', success);
               $scope.currentMessage = success;
            },
            function(err){
               $ionicLoading.hide();
               $log.error('failed to load message ', err);
            });
    };



});
