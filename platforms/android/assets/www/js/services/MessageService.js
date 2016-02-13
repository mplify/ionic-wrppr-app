var services = angular.module('App.services');

services.service('MessageService', function($http, $q, $log, api) {
    return {
        'createMessage' : function(messageData){
            $log.info('save message' + messageData);


            var url = api.byName('base-url') + api.byName('message-url') + api.byName('create');

            var defer = $q.defer();

            $http.post(url, messageData)
                .success(function (resp) {
                    defer.resolve(resp);
                })
                .error(function (err) {
                    defer.reject(err);
                });
            return defer.promise;

        },
        'getMessagesByUser' : function(userID){
            $log.info('load messages for user: ' + userID);

            var url =  api.byName('base-url') + api.byName('message-url');
            var defer = $q.defer();


            var params = {};
            if(userID != undefined){
                params = {
                    'UserID' : userID
                };
            }

            $http.get(url, {
                    'params' :params
                })
                .success(function (resp) {
                    defer.resolve(resp);
                })
                .error(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        }
    }});
