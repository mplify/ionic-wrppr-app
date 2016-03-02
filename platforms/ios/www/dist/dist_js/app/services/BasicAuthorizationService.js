var services = angular.module('App.services');

services.factory('BasicAuthorizationService', ['Base64', '$http', '$log', 'LocalDataService', function (Base64, $http, $log, LocalDataService) {
    return {
        generateToken : function (username, password) {
            if(!username || !password){
                $log.error('trying to generate token with empty credentials');
            }
            $log.info('set credentials');
            var encoded = Base64.encode(username + ':' + password);
            var token = "Basic " + encoded;

            LocalDataService.saveBaseToken(token);
            $http.defaults.headers.common.Authorization = token;


        },
        setToken : function(token){
            $log.info('update auth token ' + token);
            LocalDataService.saveBaseToken(token);
            $http.defaults.headers.common.Authorization = token;
        },
        getToken : function (){
            return LocalDataService.getBaseToken();
        },
        isAuthorized: function () {
            var token = LocalDataService.getBaseToken();
            $log.info('authorization check: ' + token);

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
}]);