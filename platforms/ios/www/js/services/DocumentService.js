var services = angular.module('App.services');

services.service('DocumentService', function ($cordovaCamera, $cordovaFile, LocalDataService, $log, $q) {
    var dirName = "documents";

    return {
        'createFolder': function () {
            var defer = $q.defer();

            // check does folder exists
            $cordovaFile.checkDir(cordova.file.dataDirectory, dirName).then(
                function (success) {
                    $log.debug('directory exists');
                    defer.resolve(success);

                },
                function (err) {
                    $log.error('failed to check folder exists', err);

                    //FILE NOT FOUND
                    if (err.code && err.code == 1) {
                        // create dir
                        $cordovaFile.createDir(cordova.file.dataDirectory, dirName).then(
                            function (success) {
                                $log.debug('directory created');
                                defer.resolve(success);
                            },
                            function (createErr) {
                                $log.error('failed to create folder exists', createErr);
                                defer.reject(createErr);
                            }
                        );
                    }
                    else {
                        defer.reject(err);
                    }
                });

            return defer.promise;
        },
        'capturePicture': function () {
            var defer = $q.defer();

            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.JPEG,
                cameraDirection: 1,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(
                function (fileURI) {

                   defer.resolve(fileURI);




                },
                function (err) {
                    $log.error('failed to capture image', err);
                    defer.reject(err);
                }
            );

            return defer.promise;
        },
        'moveFile' : function(fileURI, filename, messageID){
            var defer = $q.defer();
            //Grab the file name of the photo in the temporary directory
            var currentName = fileURI.replace(/^.*[\\\/]/, '');



            var newFileName = filename + ".jpg";

            var targetDir = cordova.file.dataDirectory + dirName;
            var sourceDir = fileURI.substring(0, fileURI.lastIndexOf("/"));


            $cordovaFile.moveFile(sourceDir, currentName, targetDir , newFileName).then(function (success) {
                var url = success.nativeURL;
                LocalDataService.addPhoto(newFileName, success.nativeURL, messageID);

                $log.debug('moved file from temp location to ', url);
                defer.resolve(url);

            }, function (error) {
                $log.error('failed to move file from temp location', JSON.stringify(error));
                defer.reject(error);
            });

            return defer.promise;
        }
    };
});