var controllers = angular.module('App.controllers');

controllers.controller('MessageCtrl', function ($scope, $rootScope, $state, $filter, $log, $stateParams, $ionicLoading, $ionicHistory, $ionicActionSheet, $ionicModal, $templateCache, $ionicPopup, $translate, MessageService, LocalDataService, DocumentService) {
    $log.info('init messages controller');
    $scope.isLoading = false;

    $scope.$on('$ionicView.beforeEnter', function () {
        if ($stateParams.messageID) {

            $scope.loadMessage();
        }

    });

    $scope.$on('$ionicView.beforeLeave', function () {
        $rootScope.supportMessage = {};

    });

    $scope.userID = LocalDataService.loadUser().id;
    $scope.currentMessage = {};
    $scope.currentAttachments = [];

    $scope.loadMessage = function () {
        $ionicLoading.show({
            template: $translate.instant("MESSAGES.LOADING")
        });
        $scope.isLoading = true;


        var messageID = $stateParams.messageID;

        MessageService.getMessageDetails(messageID).then(function (success) {
            $ionicLoading.hide();
            $scope.isLoading = false;

            $log.info('loaded message', success);
            $scope.currentMessage = success[0];

            $scope.messageOptions = [];
            $scope.getSelectedRoutingPath($scope.currentMessage.PreviousRoutingID);

            $scope.images = LocalDataService.getPhotos();
            $scope.currentAttachments = $filter('filter')($scope.images, { message: messageID });


            $rootScope.supportMessage = $scope.currentMessage;

        }, function (err) {
            $ionicLoading.hide();
            $scope.isLoading = false;

            $log.error('failed to load message ', err);

            $ionicPopup.alert({
                title: $translate.instant("MESSAGES.LOAD_FAILED"),
                template: err
            });
        });
    };

    $scope.getSelectedRoutingPath = function (source) {
        var routing = source[0];
        if (routing) {
            $scope.messageOptions.push(routing);
            if (routing.children.length > 0) {
                $scope.getSelectedRoutingPath(routing.children);
            }
        }

    };


    $scope.addNote = function () {
        if (!window.cordova) {
            $scope.openNoteModal();
        }
        else {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: $translate.instant("MESSAGES.NOTE_BUTTON")},
                    { text: $translate.instant("MESSAGES.PHOTO_BUTTON")}

                ],
                titleText: $translate.instant("MESSAGES.NOTE_TITLE"),
                cancelText: $translate.instant("GENERIC.CANCEL"),
                buttonClicked: function (index) {
                    if (index === 0) {
                        $scope.openNoteModal();
                    }
                    else if (index === 1) {
                        $scope.addImage();
                    }


                    return true;
                }
            });
        }
    };

    $scope.openNoteModal = function () {
        $scope.modal = $ionicModal.fromTemplate($templateCache.get('message-note.html'), {
            scope: $scope
        });
        $scope.modal.show();
    };

    $scope.saveMessageNote = function () {
        $log.info("add message to note");

        $ionicLoading.show({
            template: $translate.instant("MESSAGES.SAVING")
        });

        MessageService.updateMessageNote($scope.currentMessage).then(function (success) {
            $ionicLoading.hide();
            $scope.messageForm.$setPristine();
            $scope.messageForm.$setUntouched();

            $scope.closeModal();

        }, function (err) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: $translate.instant("MESSAGES.SAVING_FAILED"),
                template: err
            });
        });


    };

    $scope.addImage = function () {
        $ionicLoading.show({
            template: $translate.instant("ATTACHMENT.LOADING")
        });

        DocumentService.capturePicture().then(
            function (fileURI) {
                $scope.fileURI = fileURI;

                $scope.showAttachmentModal();
                $ionicLoading.hide();
            },
            function (fail) {
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: $translate.instant("ATTACHMENT.SAVING_FAILED"),
                    template: err
                });
            }
        );
    };

    $scope.closeModal = function () {
        $log.debug('close modal');

        $scope.modal.hide();
        $scope.modal.remove();
    };

    $scope.showAttachmentModal = function () {
        $scope.modal = $ionicModal.fromTemplate($templateCache.get('new-document.html'), {
            scope: $scope
        });
        $scope.modal.show();
    };


    $scope.closeAttachmentModal = function (filename) {
        for (var i in $scope.images) {
            var image = $scope.images[i].name;
            var imageName = image.substring(0, image.length - 4);
            if (filename === imageName) {
                $ionicPopup.alert({
                    title: $translate.instant("ATTACHMENT.FILENAME_NOT_UNIQUE")
                });
                return;
            }
        }

        var messageID = $scope.currentMessage.id;

        DocumentService.moveFile($scope.fileURI, filename, messageID).then(
            function (success) {

                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: $translate.instant("ATTACHMENT.SAVE_SUCCESS")
                });


                $scope.currentAttachments.push({
                    "name": filename + ".jpg",
                    "url": success
                });
                $log.info('document saved: ' + filename);

                $scope.closeModal();


            },
            function (fail) {
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: $translate.instant("ATTACHMENT.SAVE_FAILED"),
                    template: fail
                });
            }
        );

    };


    $scope.selectDocument = function (document) {

        $scope.document = document;
        $scope.showModal('document-details.html');

    };

    $scope.showModal = function (templateUrl) {
        $scope.modal = $ionicModal.fromTemplate($templateCache.get(templateUrl), {
            scope: $scope
        });
        $scope.modal.show();

    };


});
