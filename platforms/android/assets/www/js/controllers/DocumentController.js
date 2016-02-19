var controllers = angular.module('App.controllers');


controllers.controller('DocumentCtrl', function ($scope, $log, $cordovaCamera, $cordovaFile, $ionicLoading, $ionicPopup, LocalDataService, DocumentService) {
    $log.debug('init document controller');


    $scope.images = LocalDataService.getPhotos();

    $scope.load = function () {
        $log.debug('load documents');
        DocumentService.createFolder().then(
            function (success) {
                $scope.images = LocalDataService.getPhotos();
                $ionicPopup.alert({
                    title: 'Picture loaded',
                    template: $scope.images.length
                });
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
        DocumentService.capturePicture().then(
            function(success){
                $ionicPopup.alert({
                    title: 'Picture saved',
                    template: success
                });
            },
            function(fail){}
        );
    }
});