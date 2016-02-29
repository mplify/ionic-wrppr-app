var services = angular.module('App.services');

services.service('EmailService', function($ionicPlatform, $log, $cordovaFile, LocalDataService) {
    return {
        'checkEmailApp' : function(){
            $log.info('check email availability');

            if(window.cordova){
                cordova.plugins.email.isAvailable(
                    function (isAvailable) {
                        LocalDataService.setEmailApp(isAvailable);
                    }
                );
            }
        },
        'sendEmail' : function(){
            $log.info('send an email');




            var photos = LocalDataService.getPhotos();
            var url = photos[0].url;

            var name = url.substr(url.lastIndexOf('/') + 1);
            var folder = url.substr(0, url.lastIndexOf('/'));
            var trueOrigin = cordova.file.dataDirectory + name;


            var path = url.replace('file://', '');

            alert(url);
            $log.info(folder);
            $log.info(name);

            $cordovaFile.checkFile(folder, name).then(
                function(success){
                    $log.debug('exist', success);

                    cordova.plugins.email.open({
                        to:      'marykiselova@gmail.com',
                        attachments : [path],
                        subject: 'Hi, it s me again',
                        body:    'How are you?'
                    });
                },
                function(error) {
                    $log.debug('exist', error);

                }
            );



        }


    };

});