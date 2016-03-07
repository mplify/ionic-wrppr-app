var controllers = angular.module('App.controllers');


controllers.controller('DocumentCtrl', function ($scope, $rootScope, $stateParams, $state, $log, $templateCache, $ionicBackdrop, $ionicModal, $cordovaCamera, $cordovaFile, $ionicLoading, $ionicPopup, LocalDataService, DocumentService) {

    $log.debug('init document controller');
    $scope.cameraAvailable = window.cordova;


    $scope.images = LocalDataService.getPhotos();
    $scope.attachment = {};

    $scope.$on('$ionicView.enter', function(){
        if($stateParams.document){
            $scope.load();
        }

    });

    $scope.load = function () {
        $log.debug('load documents');
        if($scope.cameraAvailable){

        DocumentService.createFolder().then(
            function (success) {

                $scope.images = LocalDataService.getPhotos();

            },
            function (err) {
               $log.debug('failed to create folder', err);
            }
        );

        }


    };

    $scope.urlForImage = function (imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        return imageName;
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


    $scope.selectDocument = function(document){
        $scope.document = document;
        $scope.showModal('document-details.html');
    };

    $scope.showModal = function(templateUrl) {
        $scope.modal = $ionicModal.fromTemplate($templateCache.get(templateUrl), {
            scope: $scope
        });
        $scope.modal.show();

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


    $scope.closeAttachmentModal = function(){
        var filename = $scope.attachment.filename;


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

        DocumentService.moveFile($scope.fileURI, $scope.attachment.filename).then(
            function(success){

                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: 'Picture saved'
                });

                $scope.closeModal();


                $scope.images = LocalDataService.getPhotos();
                $log.info('display images', $scope.images);
            },
            function(fail){
                $ionicLoading.hide();
            }
        );

    };
});