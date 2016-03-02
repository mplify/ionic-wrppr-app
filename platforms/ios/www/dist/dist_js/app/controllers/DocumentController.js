var controllers = angular.module('App.controllers');


controllers.controller('DocumentCtrl', ['$scope', '$stateParams', '$state', '$log', '$templateCache', '$ionicBackdrop', '$ionicModal', '$cordovaCamera', '$cordovaFile', '$ionicLoading', '$ionicPopup', 'LocalDataService', 'DocumentService', function ($scope, $stateParams, $state, $log, $templateCache, $ionicBackdrop, $ionicModal, $cordovaCamera, $cordovaFile, $ionicLoading, $ionicPopup, LocalDataService, DocumentService) {

    $log.debug('init document controller');
    $scope.cameraAvailable = window.cordova;

    $scope.images = LocalDataService.getPhotos();

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
            function(success){
                $scope.images = LocalDataService.getPhotos();
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: 'Picture saved',
                    template: success
                });

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
        $scope.modal.hide();
        $scope.modal.remove();
    };
}]);