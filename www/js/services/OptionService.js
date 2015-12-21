var services = angular.module('App.services');

services.service('OptionService', function($http, $q, api, Base64, Auth) {
    return {
        'getOptions': function(searchText) {
            console.log('load options: ' + searchText);

            var url =  api.byName('base-url') + api.byName('routing-url');
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
