var services = angular.module('App.services');

services.service('OrganizationService', function($http, $q, $log, api) {
    return {
        'getOrganizations': function(searchText, skip) {
            $log.info('load organisations: ' + searchText);
            $log.debug($http.defaults.headers.common.Authorization);

            var url =  api.byName('base-url') + api.byName('organization-url');
            var defer = $q.defer();


            var params = {};
            if(searchText != undefined && searchText.length > 0){
               params = {
                   where : '{"orgName":{"startsWith":"'+searchText+'"}}'
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
    }});
