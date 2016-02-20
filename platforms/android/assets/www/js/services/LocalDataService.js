var services = angular.module('App.services');

services.service('LocalDataService', function (localStorageService) {

    var data_keys = {
        AUTH_TOKEN: "base_token",
        APP_USER: "wrapper_user",
        FACEBOOK: "facebook_user",
        TWITTER_APP_AVAILABLE: "twitter_app",
        NETWORK_TYPE: "network_type",
        NETWORK_STATE: "network_state",
        EXTERNAL_LOAD_URL: "external_load",
        PHOTO_LIBRARY : "photo_library"
    }

    return {
        'saveBaseToken': function (token) {
            localStorageService.set(data_keys.AUTH_TOKEN, token);

        },
        'getBaseToken': function () {
           return localStorageService.get(data_keys.AUTH_TOKEN);
        },
        'saveUser': function (user) {
            localStorageService.set(data_keys.APP_USER, JSON.stringify(user));
        },
        'loadUser': function () {
            var user = localStorageService.get(data_keys.APP_USER);
            return JSON.parse(user || '{}');
        },
        'saveFacebookResponse': function (response) {
            localStorageService.set(data_keys.FACEBOOK, JSON.stringify(response));
        },
        'getFacebookResponse': function () {
            var user = localStorageService.get(data_keys.FACEBOOK);
            return JSON.parse(user || '{}');
        },
        'setTwitterApp': function (available) {
            localStorageService.set(data_keys.TWITTER_APP_AVAILABLE, available);
        },
        'hasTwitterApp': function () {
            return localStorageService.get(data_keys.TWITTER_APP_AVAILABLE);
        },
        'setNetworkType': function (type) {
            localStorageService.set(data_keys.NETWORK_TYPE, type);
        },
        'getNetworkType': function () {
            return localStorageService.get(data_keys.NETWORK_TYPE);
        },
        'setNetworkState': function (online) {
            localStorageService.set(data_keys.NETWORK_STATE, online);
        },
        'getNetworkState': function () {
            return localStorageService.get(data_keys.NETWORK_STATE);
        },
        'getExternalURL': function () {
            return localStorageService.get(data_keys.EXTERNAL_LOAD_URL);
        },
        'clearExternalURL': function () {
            localStorageService.remove(data_keys.EXTERNAL_LOAD_URL);
        },
        'addPhoto' : function(name, url){
            var photos = JSON.parse(localStorageService.get(data_keys.PHOTO_LIBRARY) || '[]');

            photos.push(
                {"name" : name, "url" : url}
            );
            localStorageService.set(data_keys.PHOTO_LIBRARY, JSON.stringify(photos));

        },
        'getPhotos' : function(){
            var photos = JSON.parse(localStorageService.get(data_keys.PHOTO_LIBRARY) || '[]');
            return photos;
        }



    }

});