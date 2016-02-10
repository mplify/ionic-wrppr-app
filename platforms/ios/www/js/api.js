/**=========================================================
 * Module: api.js
 * Services to retrieve global API urls
 =========================================================*/
var App = angular.module('App.services');

App.constant('API', {
    // the basis
    'proxy-url':	 '/api',

     // apiary
     //'base-url' : 'http://private-a8cff4-mplify.apiary-mock.com',

    // local sails
     //'base-url' : 'http://localhost:1337',

    // heroku
    'base-url': 'https://wrppr-core.herokuapp.com',



    // login
    'login-url':	 	   	   '/login',
    'logout-url':	 	   	   '/logout',
    'restore-password-url':    '/wrppr_pwRestoreEmail',

    // organizations
    'organization-url':		   '/wrppr_organizations',

    // routing
    'routing-url' :            '/wrppr_routing',

    //users
    'user-url' :                '/wrppr_users',

    //messages
    'message-url':              '/wrppr_messages',

    //actions
    'create' :                  '/create',
    'update' :                  '/update'

});


App.factory('api', ['API', function(api) {
    return {
        byName: function(name) {
            if(!window.cordova && name == "base-url"){
                // for browser version replace base-url to proxied
                name = "proxy-url";
            }
            return (api[name]);
        }
    };
}]);
