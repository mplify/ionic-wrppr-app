var services = angular.module('App.services');

services.service('UserService', function ($http, $q, api) {


    var setUser = function (user_data) {
        window.localStorage.wrapper_user = JSON.stringify(user_data);
    };

    var getUser = function () {
        return JSON.parse(window.localStorage.wrapper_user || '{}');
    };


    var setTwitterUser = function (user_data) {
        window.localStorage.wrapper_twitter_user = JSON.stringify(user_data);
    };

    var getTwitterUser = function () {
        return JSON.parse(window.localStorage.wrapper_twitter_user || '{}');
    };


    var setLocalFacebookUser = function (user_data) {
        window.localStorage.wrapper_facebook_user = JSON.stringify(user_data);
    };

    var getLocalFacebookUser = function () {
        return JSON.parse(window.localStorage.wrapper_facebook_user || '{}');
    };





    var searchByFacebookAccount = function (username) {
        console.log('search user by facebook account: ' + username);


        var url = api.byName('base-url') + api.byName('user-url');
        var defer = $q.defer();


        var params = {};
        params = {
            where: '{"FacebookAccount": "' + username + '"}'
        };

        $http.get(url,
            {
                params: params
            })
            .success(function (resp) {
                if (resp.length > 1) {
                    console.err('There is a problem, more then 1 user with ' + username + ' facebookAccount')
                }

                defer.resolve(resp);
            })
            .error(function (err) {
                defer.reject(err);
            });
        return defer.promise;
    }

    var searchByEmail = function (email) {
        console.log('search user by email: ' + email);


        var url = api.byName('base-url') + api.byName('user-url');
        var defer = $q.defer();


        var params = {};
        params = {
            where: '{"Emailaddress": "' + email + '"}'
        };

        $http.get(url,
            {
                params: params
            })
            .success(function (resp){
                defer.resolve(resp);
            })
            .error(function (err) {
                defer.reject(err);
            });
        return defer.promise;
    }


    var createUser = function (userData) {
        console.log('create user' + userData);

        var url = api.byName('base-url') + api.byName('user-url') + api.byName('create');

        var defer = $q.defer();

        $http.post(url, userData)
            .success(function (resp) {
                setUser(resp);
                defer.resolve(resp);
            })
            .error(function (err) {
                defer.reject(err);
            });
        return defer.promise;
    }


    var updateUser = function (userData) {
        console.log('update user' + userData);

        var url = api.byName('base-url') + api.byName('user-url') + api.byName('update') + '/' + userData.id;

        var defer = $q.defer();

        var data = {
            'FacebookToken' : userData.FacebookToken,
            'FacebookAccount' : userData.FacebookAccount,
            'Emailaddress' : userData.Emailaddress
        }

        $http.put(url, data)
            .success(function (resp) {
                setUser(resp);
                defer.resolve(resp);
            })
            .error(function (err) {
                defer.reject(err);
            });
        return defer.promise;
    }


    var loadUser = function (userID) {
        console.log('load user details: ' + userID);


        var url =  api.byName('base-url') + api.byName('user-url') + '/' + userID;
        var defer = $q.defer();



        $http.get(url,
            {})
            .success(function (resp) {
                defer.resolve(resp);
            })
            .error(function (err) {
                defer.reject(err);
            });
        return defer.promise;

    }
    return {
        setUser: setUser,
        getUser: getUser,


        getTwitterUser: getTwitterUser,
        setTwitterUser: setTwitterUser,

        createUser: createUser,
        updateUser: updateUser,
        loadUser : loadUser,

        searchByEmail : searchByEmail,
        searchByFacebookAccount: searchByFacebookAccount,
        getLocalFacebookUser: getLocalFacebookUser,
        setLocalFacebookUser: setLocalFacebookUser
    };
});