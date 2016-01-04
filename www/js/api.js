/**=========================================================
 * Module: api.js
 * Services to retrieve global API urls
 =========================================================*/
var App = angular.module('App.services');

App.constant('API', {
    // the basis
    'base-url':	 '/api',
     //'base-url' : 'http://private-a8cff4-mplify.apiary-mock.com',

    //'base-url' : 'http://localhost:1337',
    //'base-url': 'https://wrppr-core.herokuapp.com',
    //'base-url': 'https://wrppr-core-tmp.herokuapp.com',


    // login
    'login-url':	 	   	   '/login',

    // organizations
    'organization-url':		   '/wrppr_organizations',

    // routing
    'routing-url' :            '/wrppr_routing',

    //users
    'user-url' :                '/wrppr_user'

});


App.factory('api', ['API', function(api) {
    return {
        byName: function(name) {
            return (api[name]);
        }
    };
}]);
