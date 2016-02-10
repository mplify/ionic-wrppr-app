var services = angular.module('App.services');

services.service('OptionService', function($http, $q, api) {
    return {
        'getOptions': function(organizationID, parentID) {
            console.log('load options:  organization'  + organizationID + ' parent node id' + parentID);

            var url =  api.byName('base-url') + api.byName('routing-url');
            var defer = $q.defer();


            var params = {
                OrgID : organizationID,
                ParentNode : parentID
            };

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
