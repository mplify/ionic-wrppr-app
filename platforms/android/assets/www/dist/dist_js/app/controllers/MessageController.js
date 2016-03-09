var controllers = angular.module('App.controllers');

controllers.controller('MessageCtrl', ['$scope', '$rootScope', '$state', '$log', '$stateParams', '$ionicLoading', '$ionicHistory', 'MessageService', 'LocalDataService', 'OrganizationService', function ($scope, $rootScope, $state, $log, $stateParams, $ionicLoading, $ionicHistory, MessageService, LocalDataService, OrganizationService) {
    $log.info('init messages controller');

    $scope.$on('$ionicView.enter', function () {
        if ($stateParams.messageID) {
            $scope.loadMessage();
        }

    });

    $scope.userID = LocalDataService.loadUser().id;
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

        MessageService.getMessageDetails(messageID).then(function (success) {
            $ionicLoading.hide();
            $log.info('loaded message', success);
            $scope.currentMessage = success[0];

            $scope.messageOptions = [];
            $scope.getSelectedRoutingPath($scope.currentMessage.PreviousRoutingID);

        }, function (err) {
            $ionicLoading.hide();
            $log.error('failed to load message ', err);
        });
    };

    $scope.getSelectedRoutingPath = function (source) {
        var routing = source[0];
        $scope.messageOptions.push(routing);
        if (routing.children.length > 0) {
            $scope.getSelectedRoutingPath(routing.children);
        }

    };

    $scope.mailFeedback = function () {
        $window.location = 'mailto:feedback@mplify.nl' + '?subject=Feedback about wrapper app';
    };

    $scope.mailSupport = function () {
        $window.location = 'mailto:support@mplify.nl' + '?subject=Feedback about wrapper app';
    };

    $scope.userCorrect = function () {
        $scope.modal = $ionicModal.fromTemplate($templateCache.get('user-correct.html'), {
            scope: $scope
        });
        $scope.modal.show();
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
        $scope.modal.remove();
    };

    $scope.submitUserCorrect = function () {
        $log.info($scope.userCorrect.comment);
        $scope.closeModal();
    };

    $scope.saveMessageNote = function () {
        $log.info("add message to note");

        $ionicLoading.show({
            template: 'Saving message...'
        });

        MessageService.updateMessageNote($scope.currentMessage).then(function (success) {
            $ionicLoading.hide();
            $scope.messageForm.$setPristine();
            $scope.messageForm.$setUntouched();

        }, function (err) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Failed to save note',
                template: err
            });
        });


    };


}]);
