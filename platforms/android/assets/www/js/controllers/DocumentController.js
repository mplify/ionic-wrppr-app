var controllers = angular.module('App.controllers');


controllers.controller('DocumentCtrl', function ($scope, $log, $cordovaCamera, $cordovaFile, $ionicLoading, $ionicPopup, LocalDataService, DocumentService) {
    $log.debug('init document controller');


    $scope.images = LocalDataService.getPhotos();

    $scope.load = function () {
        $log.debug('load documents');
        DocumentService.createFolder().then(
            function (success) {
                $scope.images = LocalDataService.getPhotos();

            },
            function (err) {

            }
        );


    };

    $scope.urlForImage = function (imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        return imageName;
    }

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
    }
});