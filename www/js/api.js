/**=========================================================
 * Module: api.js
 * Services to retrieve global API urls
 =========================================================*/
var App = angular.module('App.services');

App.constant('API', {
    // the basis
     //'base-url':	 '/api',

    //'base-url' : 'http://localhost:1337',
    'base-url': 'https://wrppr-core.herokuapp.com',


    // login
    'login-url':	 	   	   '/login',

    // organizations
    'organization-url':		   '/wrppr_organizations'

});


App.factory('api', ['API', function(api) {
    return {
        byName: function(name) {
            return (api[name]);
        }
    };
}]);
