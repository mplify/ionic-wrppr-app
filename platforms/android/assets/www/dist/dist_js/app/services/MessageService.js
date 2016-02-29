var services = angular.module('App.services');

services.service('MessageService', ['$http', '$q', '$log', 'api', function ($http, $q, $log, api) {
        return {
            'createMessage': function (messageData) {
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
            'loadMessage' : function(messageID){
                $log.info('load message details ' + messageID);

                var url = api.byName('base-url') + api.byName('message-url') + '/' + messageID;
                var defer = $q.defer();


                $http.get(url)
                    .success(function (resp) {
                        defer.resolve(resp);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    });
                return defer.promise;
            },
            'getMessagesByUser': function (userID, orgID) {
                $log.info('load messages for user: ' + userID);

                var url = api.byName('base-url') + api.byName('message-url');
                var defer = $q.defer();


                var params = {};
                if (userID !== undefined) {
                    params = {
                        'UserID': userID
                    };
                }

                if(orgID){
                    params.OrgID = orgID;
                }

                $http.get(url, {
                    'params': params
                })
                    .success(function (resp) {
                        defer.resolve(resp);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    });
                return defer.promise;
            },
            'getCompaniesWithMsgCount': function (userID) {
                $log.info('load companies with messages count');

                var url = api.byName('base-url') + api.byName('companies-messages-url');
                var defer = $q.defer();


                var params = {};
                if (userID !== undefined) {
                    params = {
                        'userID': userID
                    };
                }

                $http.get(url, {
                    'params': params
                })
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
