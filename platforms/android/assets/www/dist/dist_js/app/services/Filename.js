var services = angular.module('App.services');

services.filter('Filename', function () {
    return function(path){
        return path.substring(0, path.length - 4);
    };
});

