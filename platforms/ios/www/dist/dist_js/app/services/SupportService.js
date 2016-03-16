var services = angular.module('App.services');

services.service('SupportService', ['$http', '$q', '$log', 'api', function ($http, $q, $log, api) {
        return {
            'submitSupport': function (action, username, description, messageID) {
                $log.info('create support: ' +  action + ' from '+ username);


                var url = api.byName('base-url') + api.byName('support-url');

                var defer = $q.defer();

                var data = {
                    "action" : action,
                    "userName" : username,
                    "description" : description,
                    "messageID" : messageID
                };

                $http.post(url, data)
                    .success(function (resp) {
                        defer.resolve(resp);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    });
                return defer.promise;

            }
        };
    }]
);
