var controllers = angular.module('App.controllers');


controllers.controller('DocumentCtrl', function ($scope, $log, $cordovaCamera, $cordovaFile, LocalDataService) {
    $log.debug('init document controller');

    // 1
    $scope.images = LocalDataService.getPhotos();

    LocalDataService.addPhoto("aaa", "bbb");

    $scope.load = function(){
        $scope.images = LocalDataService.getPhotos();

        for(var image in $scope.images){
            window.plugins.Base64.encodeFile(image, function(base64){  // Encode URI to Base64 needed for contacts plugin
                alert(base64);
                image = base64;
            });
        }
    };

    $scope.urlForImage = function(imageName) {
        var trueOrigin = cordova.file.dataDirectory + imageName;
        return trueOrigin;
    }




    $scope.addImage = function() {
        // 2
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            cameraDirection: 1,
            saveToPhotoAlbum: true
        };

        // 3
        $cordovaCamera.getPicture(options).then(function(imageData) {

            // 4
            onImageSuccess(imageData);

            function onImageSuccess(fileURI) {
                //Grab the file name of the photo in the temporary directory
                var currentName = fileURI.replace(/^.*[\\\/]/, '');

                //Create a new name for the photo
                var d = new Date(),
                    n = d.getTime(),
                    newFileName = n + ".jpg";

                //Move the file to permanent storage
                $cordovaFile.moveFile(cordova.file.tempDirectory, currentName, cordova.file.dataDirectory, newFileName).then(function(success){

                    //success.nativeURL will contain the path to the photo in permanent storage, do whatever you wish with it, e.g:
                    alert(success.nativeURL);
                    $scope.images.push(newFileName, success.nativeURL);

                    LocalDataService.addPhoto(newFileName, success.nativeURL);

                }, function(error){
                    //an error occured
                });

                //createFileEntry(fileURI);
            }

            function createFileEntry(fileURI) {
                window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
            }

            // 5
            function copyFile(fileEntry) {
                var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                var newName = makeid() + name;

                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                        fileEntry.copyTo(
                            fileSystem2,
                            newName,
                            onCopySuccess,
                            fail
                        );
                    },
                    fail);
            }

            // 6
            function onCopySuccess(entry) {
                $scope.$apply(function () {
                    $log.info(entry.nativeURL);
                    $scope.images.push(entry.nativeURL);
                });
            }

            function fail(error) {
                $log.error("fail: " + error.code);
            }

            function makeid() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i=0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }

        }, function(err) {
            $log.error(err);
        });
    }
});