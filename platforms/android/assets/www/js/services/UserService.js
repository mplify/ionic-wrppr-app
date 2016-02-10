var services = angular.module('App.services');

services.service('UserService', function ($http, $q, api) {

    return {
        'searchByFacebookAccount': function (username) {
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
        },
        'searchByEmail': function (email) {
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
                .success(function (resp) {
                    defer.resolve(resp);
                })
                .error(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        },
        'createUser': function (userData) {
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
        },
        'updateUser': function (userData) {
            console.log('update user' + userData);

            var url = api.byName('base-url') + api.byName('user-url') + api.byName('update') + '/' + userData.id;

            var defer = $q.defer();

            var data = {
                'FacebookToken': userData.FacebookToken,
                'FacebookAccount': userData.FacebookAccount,
                'Emailaddress': userData.Emailaddress
            }

            $http.put(url, data)
                .success(function (resp) {
                    defer.resolve(resp);
                })
                .error(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        },
        'loadUser': function (userID) {
            console.log('load user details: ' + userID);


            var url = api.byName('base-url') + api.byName('user-url') + '/' + userID;
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

    }
});