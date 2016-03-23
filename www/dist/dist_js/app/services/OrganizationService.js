var services = angular.module('App.services');

services.service('OrganizationService', ['$http', '$q', '$log', 'api', function($http, $q, $log, api) {
    return {
        'getOrganizations2': function(searchText, skip) {

            angular.forEach($http.pendingRequests, function (request) {
                $log.info('pending request', request.url);

            });

            $log.info('load organisations: ' + searchText);
            $log.debug($http.defaults.headers.common.Authorization);

            var url =  api.byName('base-url') + api.byName('organization-url');
            var defer = $q.defer();


            var params = {
                'sort' : 'orgName ASC',
                'where' : '{"activeInApp" : "X"}'
            };
            if(searchText !== undefined && searchText.length > 0){
               params = {
                   where : '{"orgName":{"startsWith":"'+searchText+'"}, "activeInApp" : "X"}'

               };
            }

            if(skip){
               $log.info('use last id paging param ' + skip);
               params.skip = skip;

            }

            params.limit = 30;

            $http.get(url,
            {
                params: params
            })
            .success(function (resp) {
                    defer.resolve(resp);
            })
            .error(function (err) {
                    defer.reject(err);
            });
            return defer.promise;
        },
        'getOrganizations' : function(searchText, skip){
            $log.info('load organisations: ' + searchText);

            var url =  api.byName('base-url') + api.byName('organization-url');
            var canceller = $q.defer();

            var cancel = function(reason){
                canceller.resolve(reason);
            };

            var params = {
                'sort' : 'orgName ASC',
                'where' : '{"activeInApp" : "X"}'
            };
            if(searchText !== undefined && searchText.length > 0){
                params = {
                    where : '{"orgName":{"startsWith":"'+searchText+'"}, "activeInApp" : "X"}'

                };
            }

            if(skip){
                $log.info('use last id paging param ' + skip);
                params.skip = skip;

            }

            params.limit = 30;

            var promise =
                $http.get(url, {
                    'params' :  params, 'timeout': canceller.promise})
                    .then(function(response){
                        return response.data;
                    });

            return {
                promise: promise,
                cancel: cancel
            };
        },
        'getOrganization' : function(organizationID){
            $log.info('load organisation details: ' + organizationID);


            var url =  api.byName('base-url') + api.byName('organization-url') + '/' + organizationID;
            var defer = $q.defer();


            var params = {};

            $http.get(url,
                {
                    params: params
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
}]);
