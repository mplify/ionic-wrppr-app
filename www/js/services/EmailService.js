var services = angular.module('App.services');

services.service('EmailService', function($ionicPlatform, $log, LocalDataService) {
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
            var trueOrigin = cordova.file.dataDirectory + name;

            var path = trueOrigin.replace('file://', '');

            alert(url);

            cordova.plugins.email.open({
                to:      'marykiselova@gmail.com',
                attachments : path,
                subject: 'Hi, it s me again',
                body:    'How are you?'
            });
        }


    };

});