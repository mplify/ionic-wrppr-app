var services = angular.module('App.services');

services.service('OrganizationService', function($http, $q, api, Base64, Auth) {
    return {
        'getOrganizations': function(searchText) {
            console.log('load organisations: ' + searchText);
            console.log($http.defaults.headers.common.Authorization);

            var url =  api.byName('base-url') + api.byName('organization-url');
            var defer = $q.defer();


            var params = {};
            if(searchText != undefined && searchText.length > 0){
               params = {
                   where : '{"orgName":{"startsWith":"'+searchText+'"}}'
               };
            }



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
