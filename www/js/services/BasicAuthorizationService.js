var services = angular.module('App.services');

services.factory('BasicAuthorizationService', function (Base64, $http, LocalDataService) {
    return {
        generateToken : function (username, password) {
            console.log('set credentials');
            var encoded = Base64.encode(username + ':' + password);
            var token = "Basic " + encoded;

            LocalDataService.saveBaseToken(token);
            $http.defaults.headers.common.Authorization = token;


        },
        setToken : function(token){
            console.log('update auth token ' + token);
            LocalDataService.saveBaseToken(token);
            $http.defaults.headers.common.Authorization = token;
        },
        getToken : function (){
            return LocalDataService.getBaseToken();
        },
        isAuthorized: function () {
            var token = LocalDataService.getBaseToken();
            console.log('authorization check: ' + token);

            if (token !== null) {
                $http.defaults.headers.common.Authorization = token;
            }
            return (token !== null);
        },
        clearCredentials: function () {
            document.execCommand("ClearAuthenticationCache");
            LocalDataService.saveBaseToken("");
            $http.defaults.headers.common.Authorization = '';
        }
    };
});