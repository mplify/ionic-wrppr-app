var services = angular.module('App.services');

services.service('APIInterceptor', ['$rootScope', '$q', 'LocalDataService', function ($rootScope, $q, LocalDataService) {
    var service = this;

    service.request = function (config) {

        $rootScope.$broadcast('check-authorization');
        if (!config.headers.authorization) {
            var access_token = LocalDataService.getBaseToken();
            if (access_token) {
                config.headers.authorization = access_token;
            }
        }
        return config;
    };

    service.response = function (config) {
        if (config.data && config.data.message) {
            if (config.data.wrppr_users !== undefined && config.data.wrppr_users === false) {
                $rootScope.$broadcast('unauthorized');
            }
        }
        return config;
    };


    service.responseError = function (response) {
        if (response.status === 401) {
            $rootScope.$broadcast('unauthorized');

        }

        if (response.status === 503) {
            $rootScope.$broadcast('serverdown');
        }
        return $q.reject(response);
    };
}]);
