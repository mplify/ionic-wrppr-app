var services = angular.module('App.services');

services.service('OrganizationService', function($http, $q, api, Base64, Auth) {
    return {
        'getOrganizations': function() {
            $http.defaults.headers.common['Access-Control-Allow-Origin'] = "*";
            $http.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
            Auth.isAuthorized();

            console.log($http.defaults.headers.common.Authorization);

            var url = api.byName('base-url') + api.byName('organization-url');
            var defer = $q.defer();


            $http.post(url).success(function(resp){
                defer.resolve(resp);
            }).error( function(err) {
                    defer.reject(err);
                });
            return defer.promise;
        }
    }});
