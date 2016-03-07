var controllers = angular.module('App.controllers');

controllers.controller('MessageCtrl', function ($scope, $rootScope, $state, $log, $stateParams, $ionicLoading, $ionicHistory, MessageService, LocalDataService, OrganizationService) {
    $log.info('init messages controller');

    $scope.messages = [

    ];

    $scope.organizations = [];

    $scope.userID = LocalDataService.loadUser().id;

    $scope.load = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });

        var orgID = $stateParams.orgID;

        MessageService.getMessagesByUser($scope.userID, orgID).then(function (response) {
            $scope.messages = response;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.loadOrgs = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });

        MessageService.getCompaniesWithMsgCount($scope.userID).then(function (response) {
                $scope.organizations = response;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function (err) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.selectOrganisation = function (organization) {
        $rootScope.sessionData.organization = organization;
        $rootScope.sessionData.options = [];

        OrganizationService.getOrganization(organization.OrgID).then(function(success){
            $log.info('load organization details');
            $rootScope.sessionData.organization = success;

            $state.go('app.options', { 'orgID' : organization.OrgID , 'parentID' : 0});
        }, function(err){
            $log.error('failed to load org details selected in favorites', err);
        });


    };

    $scope.selectMessage = function (message) {
        $state.go('app.messagedetails', { 'messageID': message.id});
    };

    $scope.currentMessage = {};

    $scope.loadMessage = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });


        var messageID = $stateParams.messageID;
        MessageService.loadMessage(messageID).then(
            function (success) {
                $ionicLoading.hide();
                $log.info('loaded message', success);
                $scope.currentMessage = success;
            },
            function (err) {
                $ionicLoading.hide();
                $log.error('failed to load message ', err);
            });

        MessageService.getMessageDetails(messageID).then(function(success){
            $ionicLoading.hide();
            $log.info('loaded message', success);
            $scope.currentMessage = success[0];

            $scope.messageOptions = [];
            $scope.getSelectedRoutingPath($scope.currentMessage.PreviousRoutingID);

        }, function(err){
            $ionicLoading.hide();
            $log.error('failed to load message ', err);
        });
    };

    $scope.getSelectedRoutingPath = function(source){
         var routing = source[0];
         $scope.messageOptions.push(routing);
         if(routing.children.length > 0){
              $scope.getSelectedRoutingPath(routing.children);
         }

    };

    $scope.mailFeedback = function () {
        $window.location = 'mailto:feedback@mplify.nl' + '?subject=Feedback about wrapper app';
    };

    $scope.mailSupport = function () {
        $window.location = 'mailto:support@mplify.nl' + '?subject=Feedback about wrapper app';
    };

    $scope.userCorrect = function(){
        $scope.modal = $ionicModal.fromTemplate($templateCache.get('user-correct.html'), {
            scope: $scope
        });
        $scope.modal.show();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove();
    };

    $scope.submitUserCorrect = function(){
        $log.info($scope.userCorrect.comment);
        $scope.closeModal();
    };

    $scope.saveMessageNote = function(){
        $log.info("add message to note");

        $ionicLoading.show({
            template: 'Saving message...'
        });

        MessageService.updateMessageNote($scope.currentMessage).then(function(success){
            $ionicLoading.hide();
            $scope.messageForm.$setPristine();
            $scope.messageForm.$setUntouched();

        }, function(err){
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Failed to save note',
                template : err
            });
        });


    };


});
