var services = angular.module('App.services');

services.service('OrganizationService', function($http, $q, api, Base64, Auth) {
    return {
        'getOrganizations': function(searchText) {
            console.log('load organisations: ' + searchText);

            var url =  api.byName('base-url') + api.byName('organization-url');
            var defer = $q.defer();


            var params = {};
            if(searchText != undefined && searchText.length > 0){
               params = { orgName: searchText };
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
