var controllers = angular.module('App.controllers');

controllers.controller('MessageCtrl', ['$scope', '$rootScope', '$state', '$filter', '$log', '$stateParams', '$ionicLoading', '$ionicHistory', '$ionicActionSheet', '$ionicModal', '$templateCache', '$ionicPopup', 'MessageService', 'LocalDataService', 'DocumentService', function ($scope, $rootScope, $state, $filter, $log, $stateParams, $ionicLoading, $ionicHistory, $ionicActionSheet, $ionicModal, $templateCache, $ionicPopup, MessageService, LocalDataService, DocumentService) {
    $log.info('init messages controller');

    $scope.$on('$ionicView.enter', function () {
        if ($stateParams.messageID) {
            $scope.loadMessage();
        }

    });

    $scope.userID = LocalDataService.loadUser().id;
    $scope.currentMessage = {};
    $scope.currentAttachments = [];

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

                $scope.images = LocalDataService.getPhotos();
                $scope.currentAttachments = $filter('filter')($scope.images, { message : messageID });
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
        if(routing){
            $scope.messageOptions.push(routing);
            if (routing.children.length > 0) {
                $scope.getSelectedRoutingPath(routing.children);
            }
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


    $scope.addNote = function(){
        if(!window.cordova){
            $scope.openNoteModal();
        }
        else {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text : "Text note"},
                    { text : "Capture Photo"}

                ],
                titleText: 'Note',
                cancelText: 'Cancel',
                buttonClicked: function (index) {
                    if(index === 0){
                        $scope.openNoteModal();
                    }
                    else if(index === 1){
                        $scope.addImage();
                    }


                    return true;
                }
            });
        }
    };

    $scope.openNoteModal = function(){
        $scope.modal = $ionicModal.fromTemplate($templateCache.get('message-note.html'), {
            scope: $scope
        });
        $scope.modal.show();
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

            $scope.closeModal();

        }, function (err) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Failed to save note',
                template: err
            });
        });


    };

    $scope.addImage = function () {
        $ionicLoading.show({
            template: 'Capturing image...'
        });

        DocumentService.capturePicture().then(
            function(fileURI){
                $scope.fileURI = fileURI;

                $scope.showAttachmentModal();
                $ionicLoading.hide();
            },
            function(fail){
                $ionicLoading.hide();
            }
        );
    };

    $scope.closeModal = function() {
        $log.debug('close modal');

        $scope.modal.hide();
        $scope.modal.remove();
    };

    $scope.showAttachmentModal = function(){
        $scope.modal = $ionicModal.fromTemplate($templateCache.get('new-document.html'), {
            scope: $scope
        });
        $scope.modal.show();
    };


    $scope.closeAttachmentModal = function(filename){
        for(var i in $scope.images)
        {
            var image = $scope.images[i].name;
            var imageName = image.substring(0, image.length - 4);
            if(filename === imageName){
                $ionicPopup.alert({
                    title: 'Picture name is not unique'
                });
                return;
            }
        }

        var messageID = $scope.currentMessage.id;

        DocumentService.moveFile($scope.fileURI, filename, messageID).then(
            function(success){

                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: 'Picture saved'
                });


                $scope.currentAttachments.push({
                    "name" : filename,
                    "url" : success
                });
                $log.info('document saved: '+ filename);

                $scope.closeModal();


            },
            function(fail){
                $ionicLoading.hide();
            }
        );

    };


    $scope.selectDocument = function(document){
        $ionicLoading.show({
            template: 'Saving message...'
        });

        $scope.document = document;
        $scope.showModal('document-details.html');
        $ionicLoading.hide();
    };

    $scope.showModal = function(templateUrl) {
        $scope.modal = $ionicModal.fromTemplate($templateCache.get(templateUrl), {
            scope: $scope
        });
        $scope.modal.show();

    };



}]);
