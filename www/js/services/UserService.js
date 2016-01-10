var services = angular.module('App.services');

services.service('UserService', function($http, $q, api) {


    var setUser = function(user_data) {
        window.localStorage.wrapper_user = JSON.stringify(user_data);
    };

    var getUser = function(){
        return JSON.parse(window.localStorage.wrapper_user || '{}');
    };


    var setTwitterUser = function(user_data) {
        window.localStorage.wrapper_twitter_user = JSON.stringify(user_data);
    };

    var getTwitterUser = function(){
        return JSON.parse(window.localStorage.wrapper_twitter_user || '{}');
    };


    var setFacebookUser = function(user_data) {
        window.localStorage.wrapper_facebook_user = JSON.stringify(user_data);
    };

    var getFacebookUser = function(){
        return JSON.parse(window.localStorage.wrapper_facebook_user || '{}');
    };


    return {
        setUser : setUser,
        getUser : getUser,
        getTwitterUser: getTwitterUser,
        setTwitterUser: setTwitterUser,
        getFacebookUser: getFacebookUser,
        setFacebookUser: setFacebookUser
    };
});