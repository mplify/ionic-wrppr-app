var services = angular.module('App.services');

services.service('LoginService', function ($http, $q, $log, api) {
    return {
        'login' : function (loginData){
            $log.info('login');

            var url = api.byName('base-url') + api.byName('login-url');

            var defer = $q.defer();

            $http.post(url, loginData)
                .success(function (resp) {
                    defer.resolve(resp);
                })
                .error(function (err) {
                    defer.reject(err);
                });
            return defer.promise;

        },
        'restorePassword' : function(username){
            $log.info('send restore password email');

            var url = api.byName('base-url') + api.byName('restore-password-url');

            var defer = $q.defer();

            $http.get(url,{ params :  { 'type' : 'passwordRestore', 'username': username} })
                .success(function (resp) {
                    defer.resolve(resp);
                })
                .error(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        },
        'activateUser' : function(userID){
            $log.info('send activate password email');

            var url = api.byName('base-url') + api.byName('restore-password-url');

            var defer = $q.defer();

            $http.get(url,{ params :  { type: 'createUser', 'userID' : userID} })
                .success(function (resp) {
                    defer.resolve(resp);
                })
                .error(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        }
    };

});

