// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'LocalStorageModule', 'ionic.service.core', 'App.controllers', 'App.services', 'ngCordova', 'ngCordova.plugins.appAvailability', 'ngCordovaOauth', 'pascalprecht.translate', 'templates'])

    .run(['$ionicPlatform', 'BasicAuthorizationService', '$http', '$log', 'TwitterService', 'ExternalLoad', 'NetworkService', 'DTMFService', function ($ionicPlatform, BasicAuthorizationService, $http, $log, TwitterService, ExternalLoad, NetworkService, DTMFService) {


        $log.debug('run app');

        $ionicPlatform.ready(function () {
            $log.debug('ionic platform ready');

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);



            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            TwitterService.checkTwitterApp();
            ExternalLoad.checkExternalLoad();


        });

        $ionicPlatform.on('resume', function(){
            ExternalLoad.checkExternalLoad();
        });

        var token = BasicAuthorizationService.getToken();
        if(token){
            $log.info('set default credentials');
            $http.defaults.headers.common.Authorization = token;
        }


    }])

    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$ionicConfigProvider', '$translateProvider', '$logProvider', '$compileProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, $translateProvider, $logProvider, $compileProvider) {
        $stateProvider

            .state('root', {
                url: '/root',
                templateUrl: 'dashboard2.html'
            })


            .state('login', {
                url: '/login',
                templateUrl: 'login.html',
                controller : 'AppCtrl'
            })

            .state('register', {
                url: '/register',
                templateUrl: 'register.html',
                controller : 'AuthorizationCtrl'
            })

            .state('restorepassword', {
                url: '/restorepassword',
                templateUrl: 'restore-password.html',
                controller : 'RestorePasswordCtrl'
            })

            .state('changepassword', {
                url: '/changepassword/:key',
                templateUrl: 'change-password.html',
                controller : 'RestorePasswordCtrl'
            })

            .state('app', {
                url : '/app',
                templateUrl : 'menu.html',
                abstract : true,
                controller : 'AppCtrl'
            })

            .state('app.intro', {
                url: '/intro',
                views: {
                    'menuContent': {
                        templateUrl: 'intro.html'
                    }
                }
            })

            .state('app.dashboard2', {
                url: '/dashboard2',
                views: {
                    'menuContent': {
                        templateUrl: 'dashboard2.html'
                    }
                }
            })

            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'organization-list.html',
                        controller : 'OrganizationsCtrl'
                    }
                }
            })

            .state('app.organizations', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'organization-list.html'
                    }
                },
                controller : 'OrganizationsCtrl'
            })

            .state('app.options', {
                url: '/options/:orgID/:parentID',
                views: {
                    'menuContent': {
                        templateUrl: 'option-list.html'
                    }
                },
                controller : 'OptionsCtrl'
            })


            .state('app.actions', {
                url: '/actions/:orgName',
                views: {
                    'menuContent': {
                        templateUrl: 'actions.html'
                    }
                },
                controller : 'OptionsCtrl'
            })

            .state('app.user', {
                url: '/user',
                views: {
                    'menuContent': {
                        templateUrl: 'user.html'
                    }
                }
            })

            .state('app.messages', {
                url: '/messages',
                views: {
                    'menuContent': {
                        templateUrl: 'message-list.html'
                    }
                }
            })

            .state('app.favorites', {
                url: '/favorites',
                views: {
                    'menuContent': {
                        templateUrl: 'favorites.html'
                    }
                }
            })


            .state('app.documents', {
                url: '/documents',
                views: {
                    'menuContent': {
                        templateUrl: 'capture-document.html'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/root');

        //$httpProvider.interceptors.push('APIInterceptor');

        $httpProvider.defaults.withCredentials = true;


        $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = "*";

        $ionicConfigProvider.views.swipeBackEnabled(true);

        //FIXME
        //$ionicConfigProvider.scrolling.jsScrolling(false);


        $translateProvider
            .useStaticFilesLoader({
                prefix: 'locales/',
                suffix: '.json'
            })
            .registerAvailableLanguageKeys(['en', 'nl'], {
                'en' : 'en', 'en_GB': 'en', 'en_US': 'en',
                'de' : 'nl', 'de_DE': 'nl', 'de_CH': 'nl'
            })
            .preferredLanguage('en')
            .fallbackLanguage('nl')
            //.determinePreferredLanguage()
            .useSanitizeValueStrategy('escapeParameters');


        //Disable logging for production, set false
        $logProvider.debugEnabled(true);

        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
    }]
);

angular.module('App.services', []);

var services = angular.module('App.services');

services.factory('Base64', function () {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});
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

var services = angular.module('App.services');

services.factory('BasicAuthorizationService', ['Base64', '$http', '$log', 'LocalDataService', function (Base64, $http, $log, LocalDataService) {
    return {
        generateToken : function (username, password) {
            $log.info('set credentials');
            var encoded = Base64.encode(username + ':' + password);
            var token = "Basic " + encoded;

            LocalDataService.saveBaseToken(token);
            $http.defaults.headers.common.Authorization = token;


        },
        setToken : function(token){
            $log.info('update auth token ' + token);
            LocalDataService.saveBaseToken(token);
            $http.defaults.headers.common.Authorization = token;
        },
        getToken : function (){
            return LocalDataService.getBaseToken();
        },
        isAuthorized: function () {
            var token = LocalDataService.getBaseToken();
            $log.info('authorization check: ' + token);

            if (token !== null) {
                $http.defaults.headers.common.Authorization = token;
            }
            return (token !== null);
        },
        clearCredentials: function () {
            document.execCommand("ClearAuthenticationCache");
            LocalDataService.saveBaseToken("");
            $http.defaults.headers.common.Authorization = '';
        }
    };
}]);
var services = angular.module('App.services');



services.factory('PasswordComplexity', ['$log', function($log){
    return {
        check : function(password) {
            if(password === undefined || password.length === 0){
                return;
            }

            var complexity = "";
            if(password === undefined){
                password = "";
            }


            var hasUpperCase = /[A-Z]/.test(password);
            var hasLowerCase = /[a-z]/.test(password);
            var hasNumbers = /\d/.test(password);
            var hasNonalphas = /\W/.test(password);


            var characterGroupCount = hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas;

            $log.info('test password complexity ' + characterGroupCount);
            if((password.length >= 8) && (characterGroupCount >= 3)){
                complexity = 'green';
            }
            else if((password.length >= 8) && (characterGroupCount >= 2)){
                complexity = 'yellow col-67';
            }
            else {
                complexity = 'red col-33';
            }
            return complexity;
        }
    };
}]);

var services = angular.module('App.services');

services.service('LocalDataService', ['localStorageService', function (localStorageService) {

    var data_keys = {
        AUTH_TOKEN: "base_token",
        APP_USER: "wrapper_user",
        FACEBOOK: "facebook_user",
        TWITTER_APP_AVAILABLE: "twitter_app",
        NETWORK_TYPE: "network_type",
        NETWORK_STATE: "network_state",
        EXTERNAL_LOAD_URL: "external_load",
        PHOTO_LIBRARY : "photo_library",
        INTRO_VISITED  : "intro_visited"
    };

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
        },
        'setIntroScreenVisited' : function(visited){
            localStorageService.set(data_keys.INTRO_VISITED, visited);
        },
        'getIntroScreenVisited' : function(){
           return localStorageService.get(data_keys.INTRO_VISITED) ? localStorageService.get(data_keys.INTRO_VISITED) : false;
        }



    };

}]);
var services = angular.module('App.services');

services.service('TwitterService', ['$ionicPlatform', '$log', 'LocalDataService', function($ionicPlatform, $log, LocalDataService) {
    return {
        'checkTwitterApp' : function(){
            $log.info('check Twitter App availability');

            var urlSchema = "twitter://";
            if(ionic.Platform.isAndroid()){
                urlSchema = 'com.twitter.android';
            }


            if(window.cordova){
                appAvailability.checkBool(urlSchema, function(availability) {
                    $log.info('check Twitter App is available: ' + availability);
                    LocalDataService.setTwitterApp(availability);
                });
            }



        }


    };

}]);
var services = angular.module('App.services');

services.service('UserService', ['$http', '$q', '$log', 'api', function ($http, $q, $log, api) {

    return {
        'searchByFacebookAccount': function (username) {
            $log.info('search user by facebook account: ' + username);


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
                        $log.error('There is a problem, more then 1 user with ' + username + ' facebookAccount');
                    }

                    defer.resolve(resp);
                })
                .error(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        },
        'searchByEmail': function (email) {
            $log.info('search user by email: ' + email);


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
            $log.info('create user' + userData);

            var url = api.byName('base-url') + api.byName('user-url') + api.byName('create');

            var defer = $q.defer();

            $http.post(url, userData)
                .success(function (resp) {
                    defer.resolve(resp);
                })
                .error(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        },
        'updateUser': function (userData) {
            $log.info('update user' + userData);

            var url = api.byName('base-url') + api.byName('user-url') + api.byName('update') + '/' + userData.id;

            var defer = $q.defer();

            var data = {
                'FacebookToken': userData.FacebookToken,
                'FacebookAccount': userData.FacebookAccount,
                'Emailaddress': userData.Emailaddress
            };

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
            $log.info('load user details: ' + userID);


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

    };
}]);
var services = angular.module('App.services');

services.service('LoginService', ['$http', '$q', '$log', 'api', function ($http, $q, $log, api) {
    return {
        'login' : function (loginData){
            $log.info('login');

            var url = api.byName('base-url') + api.byName('login-url');

            var defer = $q.defer();

            $http.post(url, loginData)
                .success(function (resp) {
                    defer.resolve(resp);
                })
                .error(function (err) {
                    defer.reject(err);
                });
            return defer.promise;

        },
        'restorePassword' : function(username){
            $log.info('send restore password email');

            var url = api.byName('base-url') + api.byName('restore-password-url');

            var defer = $q.defer();

            $http.get(url,{ params :  { 'type' : 'passwordRestore', 'username': username} })
                .success(function (resp) {
                    defer.resolve(resp);
                })
                .error(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        },
        'activateUser' : function(userID){
            $log.info('send activate password email');

            var url = api.byName('base-url') + api.byName('restore-password-url');

            var defer = $q.defer();

            $http.get(url,{ params :  { type: 'createUser', 'userID' : userID} })
                .success(function (resp) {
                    defer.resolve(resp);
                })
                .error(function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        }
    };

}]);


var services = angular.module('App.services');

services.service('OrganizationService', ['$http', '$q', '$log', 'api', function($http, $q, $log, api) {
    return {
        'getOrganizations': function(searchText, skip) {
            $log.info('load organisations: ' + searchText);
            $log.debug($http.defaults.headers.common.Authorization);

            var url =  api.byName('base-url') + api.byName('organization-url');
            var defer = $q.defer();


            var params = {};
            if(searchText !== undefined && searchText.length > 0){
               params = {
                   where : '{"orgName":{"startsWith":"'+searchText+'"}}'
               };
            }

            if(skip){
               $log.info('use last id paging param ' + skip);
               params.skip = skip;

            }

            params.limit = 30;

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
        'getOrganization' : function(organizationID){
            $log.info('load organisation details: ' + organizationID);


            var url =  api.byName('base-url') + api.byName('organization-url') + '/' + organizationID;
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
    };
}]);

var services = angular.module('App.services');

services.service('OptionService', ['$http', '$q', '$log', 'api', function ($http, $q, $log, api) {
    return {
        'getOptions': function (organizationID, parentID) {
            $log.info('load options:  organization' + organizationID + ' parent node id' + parentID);

            var url = api.byName('base-url') + api.byName('routing-url');
            var defer = $q.defer();


            var params = {
                OrgID: organizationID,
                ParentNode: parentID
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
    };
}]);

var services = angular.module('App.services');

services.service('MessageService', ['$http', '$q', '$log', 'api', function ($http, $q, $log, api) {
        return {
            'createMessage': function (messageData) {
                $log.info('save message' + messageData);


                var url = api.byName('base-url') + api.byName('message-url') + api.byName('create');

                var defer = $q.defer();

                $http.post(url, messageData)
                    .success(function (resp) {
                        defer.resolve(resp);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    });
                return defer.promise;

            },
            'getMessagesByUser': function (userID) {
                $log.info('load messages for user: ' + userID);

                var url = api.byName('base-url') + api.byName('message-url');
                var defer = $q.defer();


                var params = {};
                if (userID !== undefined) {
                    params = {
                        'UserID': userID
                    };
                }

                $http.get(url, {
                    'params': params
                })
                    .success(function (resp) {
                        defer.resolve(resp);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    });
                return defer.promise;
            },
            'getCompaniesWithMsgCount': function (userID) {
                $log.info('load companies with messages count');

                var url = api.byName('base-url') + api.byName('companies-messages-url');
                var defer = $q.defer();


                var params = {};
                if (userID !== undefined) {
                    params = {
                        'UserID': userID
                    };
                }

                $http.get(url, {
                    'params': params
                })
                    .success(function (resp) {
                        defer.resolve(resp);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    });
                return defer.promise;
            }
        };
    }]
);

var services = angular.module('App.services');

services.service('DTMFService', ['$log', '$cordovaContacts', function ($log, $cordovaContacts) {
    return {
        'createNumber': function (organization, routings) {
            $log.info('convert selected routing to DTMF number');

            var baseNumber = organization.TelephoneNumber;

            if (organization.initialpause && organization.initialpause !== null) {
                $log.info('add initial pause ' + organization.initialpause);
                for (i = 0; i < organization.initialpause; i++) {
                    baseNumber = baseNumber + ",";
                }
            }
            for (var routing in routings) {
                baseNumber = baseNumber + "," + routings[0].DTMFID;
            }
            return baseNumber;
        }


    };
}]);
var services = angular.module('App.services');

services.service('NetworkService', ['$ionicPlatform', '$rootScope', '$log', '$ionicPopup', '$cordovaNetwork', 'LocalDataService', function($ionicPlatform, $rootScope, $log, $ionicPopup, $cordovaNetwork, LocalDataService) {
    $ionicPlatform.ready(function () {


        var type = $cordovaNetwork.getNetwork();
        var isOnline = $cordovaNetwork.isOnline();
        $log.info('network type: ' + type);

        LocalDataService.setNetworkState(isOnline);
        LocalDataService.setNetworkType(type);



        // listen for Online event
        $rootScope.$on('networkOnline', function(event, networkState){
            var onlineState = networkState;
            LocalDataService.setNetworkState(onlineState);
        });

        // listen for Offline event
        $rootScope.$on('networkOffline', function(event, networkState){
            LocalDataService.setNetworkState(networkState);
        });


    }, false);
}]);
var services = angular.module('App.services');

services.service('ExternalLoad', ['LocalDataService', '$state', '$log', function(LocalDataService,  $state, $log){
    var getParameterByName = function(url, name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(url);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    };

    return {
        checkExternalLoad : function(){
            var url = LocalDataService.getExternalURL();

            if(url && url.indexOf('changepassword') > - 1){
                $log.info('redirect to change password screen');

                var key = getParameterByName(url, 'key');

                $state.go('changepassword', {
                    'key' : key
                });
                LocalDataService.clearExternalURL();
            }
        }
    };

}]);
var services = angular.module('App.services');

services.service('FacebookService', ['$q', '$log', 'UserService', 'LocalDataService', function ($q, $log, UserService, LocalDataService) {

    var getLoginStatus = function () {
        $log.info('facebook login status');

        var defer = $q.defer();

        facebookConnectPlugin.getLoginStatus(function (success) {
                $log.info('facebook login status success : ' + success.status);
                defer.resolve(success);

            },
            function (error) {
                defer.reject(error);
            });
        return defer.promise;
    };


    var getProfileInfo = function (accessToken) {
        var info = $q.defer();

        facebookConnectPlugin.api('/me?fields=email,name&access_token=' + accessToken, ["public_profile"],
            function (profileInfo) {
                info.resolve(profileInfo);
            },
            function (response) {
                $log.error(response);
                info.reject(response);
            }
        );
        return info.promise;
    };


    var saveUser = function (profileInfo, accessToken) {


        var defer = $q.defer();

        if (angular.isDefined(profileInfo.email)) {
            var email = profileInfo.email;
            UserService.searchByFacebookAccount(email).then(
                function (users) {
                    if (users.length === 0) {
                        UserService.searchByEmail(email).then(
                            function (emailMapedUsers) {
                                if (emailMapedUsers === 0) {
                                    // create new user
                                    var userData = {
                                        UserName: profileInfo.email,
                                        Emailaddress: profileInfo.email,
                                        FacebookAccount: profileInfo.email,
                                        Password: profileInfo.email,
                                        FacebookToken: accessToken
                                    };

                                    UserService.createUser(userData).then(function (createdUser) {
                                            defer.resolve(createdUser);
                                        },
                                        function (error) {
                                            defer.reject(error);
                                        });


                                }
                                else {
                                    var user = emailMapedUsers[0];

                                    user.FacebookToken = accessToken;
                                    UserService.updateUser(user).then(function (updatedUser) {
                                            defer.resolve(updatedUser);
                                        },
                                        function (error) {
                                            defer.reject(error);
                                        });
                                }
                            },
                            function (error) {
                                defer.reject(error);
                            });
                    }
                    else {
                        // update token for existing user
                        var user = users[0];

                        user.FacebookToken = accessToken;
                        UserService.updateUser(user).then(function (updatedUser) {
                                defer.resolve(updatedUser);
                            },
                            function (error) {
                                defer.reject(error);
                            });
                    }
                }, function (error) {
                    defer.reject(error);
                });
        }
        else {
            defer.reject();
        }

        return defer.promise;
    };


    return {
        getLoginStatus: getLoginStatus,
        getProfileInfo: getProfileInfo,
        saveUser: saveUser
    };

}]);
var services = angular.module('App.services');

services.service('DocumentService', ['$cordovaCamera', '$cordovaFile', 'LocalDataService', '$log', '$q', function ($cordovaCamera, $cordovaFile, LocalDataService, $log, $q) {
    var dirName = "documents";
    return {
        'createFolder': function () {
            var defer = $q.defer();

            // check does folder exists
            $cordovaFile.checkDir(cordova.file.dataDirectory, dirName).then(
                function (success) {
                    $log.debug('directory exists');
                    defer.resolve(success);

                },
                function (err) {
                    $log.error('failed to check folder exists', err);

                    //FILE NOT FOUND
                    if (err.code && err.code == 1) {
                        // create dir
                        $cordovaFile.createDir(cordova.file.dataDirectory, dirName).then(
                            function (success) {
                                $log.debug('directory created');
                                defer.resolve(success);
                            },
                            function (createErr) {
                                $log.error('failed to create folder exists', createErr);
                                defer.reject(createErr);
                            }
                        );
                    }
                    else {
                        defer.reject(err);
                    }
                });

            return defer.promise;
        },
        'capturePicture': function () {
            var defer = $q.defer();

            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                encodingType: Camera.EncodingType.JPEG,
                cameraDirection: 1,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(
                function (fileURI) {
                    //Grab the file name of the photo in the temporary directory
                    var currentName = fileURI.replace(/^.*[\\\/]/, '');

                    //Create a new name for the photo
                    var d = new Date(),
                        n = d.getTime(),
                        newFileName = n + ".jpg";

                    var targetDir = cordova.file.dataDirectory + dirName;
                    var sourceDir = fileURI.substring(0, fileURI.lastIndexOf("/"));


                    $cordovaFile.moveFile(sourceDir, currentName, targetDir , newFileName).then(function (success) {
                        var url = success.nativeURL;
                        LocalDataService.addPhoto(newFileName, success.nativeURL);

                        $log.debug('moved file from temp location to ', url);
                        defer.resolve(url);

                    }, function (error) {
                        $log.error('failed to move file from temp location', JSON.stringify(error));
                        defer.reject(error);
                    });


                },
                function (err) {
                    $log.error('failed to capture image', err);
                    defer.reject(err);
                }
            );

            return defer.promise;
        }
    };
}]);
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
    'companies-messages-url':   '/wrppr_numMessPerOrg',

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

angular.module('App.controllers', [])

    .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$log', '$ionicPlatform', '$ionicModal', '$ionicPopup', '$ionicLoading', '$ionicHistory', '$timeout', '$q', 'BasicAuthorizationService', 'UserService', '$cordovaOauth', 'api', '$http', 'LocalDataService', function ($scope, $rootScope, $state, $log, $ionicPlatform, $ionicModal, $ionicPopup, $ionicLoading, $ionicHistory, $timeout, $q, BasicAuthorizationService, UserService, $cordovaOauth,  api, $http, LocalDataService) {




        $rootScope.sessionData = {};

        // company styling
        $scope.$on('$ionicView.beforeEnter', function() {
            if($rootScope.sessionData.organization){
                if($rootScope.sessionData.organization.BrandingColor1 !== null){
                    $rootScope.brandingColor = $rootScope.sessionData.organization.BrandingColor1;
                }
                else {
                    $rootScope.brandingColor = '#ff5642';
                }

                if($rootScope.sessionData.organization.BrandingColor2 !== null){
                    $rootScope.brandingColor2 = $rootScope.sessionData.organization.BrandingColor2;
                }
                else {
                    $rootScope.brandingColor2 = '#ff5642';
                }

            }

        });


        $scope.logout = function(){
            BasicAuthorizationService.clearCredentials();

            if(window.cordova){
                facebookConnectPlugin.logout();
            }
            LocalDataService.saveUser({});

            var url =  api.byName('base-url') + api.byName('logout-url');


            $http.get(url,
                {

                })
                .success(function (resp) {
                    $log.debug('logout done');
                })
                .error(function (err) {

                });

            $state.go('root');

        };

        $scope.$on('serverdown', function(){
            $ionicPopup.alert({
                title: 'Service is temporarily not available',
                template: 'BUT we are working hard to fix it'
            });
        });

        $scope.$on('unauthorized', function(){
            $log.info('unauthorized, redirect to root');
            if($state.current.name.indexOf('app') > -1){
                $state.go('root');
            }
        });



    }]);


var controllers = angular.module('App.controllers');

controllers.controller('AuthorizationCtrl', ['$scope', '$ionicLoading', '$ionicModal', '$ionicPopup', '$state', '$log', '$stateParams', 'LoginService', 'BasicAuthorizationService', 'UserService', 'PasswordComplexity', 'LocalDataService', function ($scope, $ionicLoading, $ionicModal, $ionicPopup, $state, $log, $stateParams, LoginService, BasicAuthorizationService , UserService, PasswordComplexity, LocalDataService) {
    $log.info('init auth controller');


    $scope.registerData = {};
    $scope.loginData = {};

    $scope.passwordComplexity = "";

    $scope.loginSubmitted = false;

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        $log.info('Doing login', $scope.loginData);

        $ionicLoading.show({
            template: 'Loading...'
        });


        LoginService.login($scope.loginData).then(function(loginResponse) {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');


            if(loginResponse.wrppr_users === false){
                $log.error('login failed: ' + loginResponse.message);

                $ionicPopup.alert({
                    title: 'Login failed',
                    template: loginResponse.message
                });

                return;
            }

            var user = loginResponse.wrppr_users;
            LocalDataService.saveUser(user);
            LocalDataService.saveFacebookResponse({});

            BasicAuthorizationService.generateToken($scope.loginData.UserName, $scope.loginData.Password);


            $scope.resetLoginForm();
            $state.go('app.search');

        },
        function(result){
            $ionicLoading.hide();
            $log.error('failed to login', result);
        });


    };

    $scope.resetLoginForm = function(){
        $scope.loginData.UserName = "";
        $scope.loginData.Password = "";


        $scope.loginForm.$setPristine();
        $scope.loginForm.$setUntouched();
    };


    $scope.doRegister = function(){
        $ionicLoading.show({
            template: 'Loading...'
        });

        $log.info('start registration');

        UserService.createUser($scope.registerData).then(function(response) {
            BasicAuthorizationService.generateToken($scope.loginData.UserName, $scope.loginData.Password);

            var user = response;
            LocalDataService.saveUser(user);

            //LoginService.activateUser(user.id).then(function(response){});

           $ionicLoading.hide();
           $scope.$broadcast('scroll.refreshComplete');
           $scope.resetRegisterForm();
           $state.go('app.intro');

       }, function(error){
            $ionicLoading.hide();

            if(error.error === "E_VALIDATION"){
                for(var attribute in error.invalidAttributes){
                    var inputKey = attribute.replace(/"/g,"");

                    var validators = error.invalidAttributes[attribute];
                    for(var validatorIndex in validators){
                        $scope.registerForm[inputKey].$setValidity(validators[validatorIndex].rule, false);
                    }

                }

            }

            $ionicPopup.alert({
                title: 'Registration Failed',
                template: error.message
            });
        });
    };

    $scope.resetRegisterForm = function(){
        $scope.registerData = {};


        $scope.registerForm.$setPristine();
        $scope.registerForm.$setUntouched();
    };



    $scope.resetValidators = function(fieldName){
        $scope.registerForm[fieldName].$setValidity('unique', true);
        $scope.registerForm[fieldName].$setValidity('minLength', true);
    };




    $scope.$watch('registerData.Password', function(password) {
        var complexity = PasswordComplexity.check(password);
        $scope.passwordComplexity = complexity;

    });


}]);





var controllers = angular.module('App.controllers');

controllers.controller('RestorePasswordCtrl', ['$scope', '$state', '$stateParams', '$log', '$ionicLoading', '$ionicPopup', 'LoginService', 'PasswordComplexity', function ($scope, $state, $stateParams,  $log, $ionicLoading, $ionicPopup, LoginService, PasswordComplexity) {
    $log.info('init restore password controller');
    $scope.username = "";
    $scope.passwordMatch = true;



    $scope.doRestorePassword = function () {
        $ionicLoading.show({
            template: 'Sends email ...'
        });


        LoginService.restorePassword($scope.username).then(function () {
            $ionicLoading.hide();

            $ionicPopup.alert({
                title: 'Restore Password',
                template: 'Please checkout you  email for instructions'
            });

            $state.go('root');

        }, function () {
            $ionicLoading.hide();

            $ionicPopup.alert({
                title: 'Failed to restore',
                template: 'Please try again'
            });
        });
    };



    $scope.$watch('newPassword', function (password) {
        var complexity = PasswordComplexity.check(password);
        $scope.passwordComplexity = complexity;

    });

    $scope.$watch('repeatPassword', function(repeatPassword) {
       if(repeatPassword === undefined){
           return;
       }
       if(repeatPassword && $scope.newPassword === repeatPassword){
           $scope.passwordMatch = true;
       }
       else {
           $scope.passwordMatch = false;
       }


       $log.info('password match ' + $scope.passwordMatch);
    });

    $scope.doChangePassword = function(){
        $log.info('change password');

        alert($stateParams.key);
    };
}]);

var controllers = angular.module('App.controllers');

controllers.controller('DashboardCtrl', ['$scope', '$log', 'LocalDataService', function ($scope, $log, LocalDataService) {
    $log.info('init dashboard controller');


}]);
var controllers = angular.module('App.controllers');

controllers.controller('OrganizationsCtrl', ['$scope', '$rootScope', '$ionicLoading', '$state', '$log', 'OrganizationService', function ($scope, $rootScope, $ionicLoading, $state, $log, OrganizationService) {

    $scope.organizations = [

    ];

    $scope.noMoreItemsAvailable = false;
    $scope.isLoading = false;


    $scope.search = {
        model : ""
    };

    $scope.load = function(searchText){
        $log.info('load organizations '+ searchText);

        $ionicLoading.show({
            template: 'Loading...'
        });



        $scope.isLoading = true;
        OrganizationService.getOrganizations(searchText, $scope.organizations.length).then(function(response) {
            if(response.length === 0){
               $scope.noMoreItemsAvailable = true;
            }

            $scope.organizations = $scope.organizations.concat(response);

            $ionicLoading.hide();
            $scope.isLoading = false;

            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');

        });
    };

    $scope.loadNext = function(){
        $log.debug('load organizations next page');
        $scope.load($scope.search.model);
    };

    $scope.reload = function(searchText){
        $log.debug('reload organization list');
        $scope.organizations = [];
        $scope.noMoreItemsAvailable = false;
        $scope.load(searchText);
    };

    $scope.selectOrganisation = function(organization){
        $rootScope.sessionData.organization = organization;
        $rootScope.sessionData.options = [];
        $log.info('organisation selected ' + organization.orgName);


        $state.go('app.options', { 'orgID' : organization.id , 'parentID' : 0});
    };

    $scope.$watch('search.model', function(newVal, oldVal){
        // wait till prev load done
        if($scope.isLoading){
            $log.debug('skipped loading organization, prev is not done');
            return;
        }

        $log.info('search organization model changed');
        $scope.reload(newVal);
    });


}]);

var controllers = angular.module('App.controllers');

controllers.controller('OptionsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$ionicLoading', '$ionicHistory', 'OptionService', function ($scope, $rootScope, $state, $stateParams, $log, $ionicLoading, $ionicHistory, OptionService) {
    $log.debug('init options controller', $rootScope.sessionData.options);

    $scope.showOptions = true;


    $rootScope.$ionicGoBack = function() {

        // before go back remove  from options
        if($state.is('app.options')){
            $rootScope.sessionData.options.pop();
        }
        $ionicHistory.goBack();
    };

    $scope.options = [

    ];

    $scope.load = function(){


        $ionicLoading.show({
            template: 'Loading...',
            delay : 500
        });

        OptionService.getOptions($stateParams.orgID, $stateParams.parentID).then(function(response) {
            $scope.options = response;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');

            // if no options redirect to actions
            if($scope.options.length === 0){
                $scope.showOptions = false;
            }
            else {
                $scope.showOptions = true;
            }

        });
    };


    $scope.currentOrganization = $stateParams.orgName;

    $scope.selectOption = function(option){
        $log.info('selected option ' + option);

        $rootScope.sessionData.options.push(option);

        $state.go('app.options', { 'orgID' : $stateParams.orgID , 'parentID' : option.NodeID});
    };

}]);

var controllers = angular.module('App.controllers');


controllers.controller('ActionCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$window', '$ionicPlatform', '$log', '$ionicLoading', 'LocalDataService', 'MessageService', 'UserService', 'DTMFService', '$cordovaContacts', function ($scope, $rootScope, $state, $stateParams, $window, $ionicPlatform, $log, $ionicLoading ,LocalDataService, MessageService, UserService, DTMFService, $cordovaContacts) {
    $log.debug('init action controller');

    if (!$rootScope.sessionData.organization) {
        $log.info('organization not selected, redirects to organization search');
        $state.go('app.organizations');
    }

    $scope.actionMessages = {
        'CALL': {type: 1, message: "Called "},
        'MAIL': {type: 2, message: "Send email to"},
        'TWEET': {type: 3, message: "Send tweet to"},
        'FACEBOOK': {type: 4, message: "Send a facebook msg"}
    };

    $scope.contacts = {};


    if ($rootScope.sessionData.organization !== undefined) {

        $scope.currentOrganization = $rootScope.sessionData.organization.orgName;

        $scope.currentOptions = $rootScope.sessionData.options;

        $scope.contacts.email = $rootScope.sessionData.organization.EmailAddress;
        $scope.contacts.twitter = $rootScope.sessionData.organization.TwitterAccount;
        $scope.contacts.call = $rootScope.sessionData.organization.TelephoneNumber;
    }

    $scope.call = function () {

        $log.info('make a call');

        $ionicLoading.show({
            template: 'Calling ...'
        });


        var opts = {                                           //search options
            filter: 'Wrapper',                                 // 'Bob'
            multiple: true,                                      // Yes, return any contact that matches criteria
            fields: [ 'displayName', 'name' ],                   // These are the fields to search for 'bob'.
            desiredFields: ['id']    //return fields.
        };


        $cordovaContacts.find(opts).then(function (contactsFound) {
                var number = DTMFService.createNumber($rootScope.sessionData.organization, $scope.currentOptions);
                var phoneNumber = new ContactField($rootScope.sessionData.organization.orgName, number, false);
                if (contactsFound && contactsFound.length > 0) {
                    var wrapperContact = contactsFound[0];


                    if (wrapperContact.phoneNumbers === null) {
                        wrapperContact.phoneNumbers = [];
                    }
                    wrapperContact.phoneNumbers.push(phoneNumber);

                    wrapperContact.save(function () {
                        $log.info('saved wrapper contact number');
                        $scope.makeCall(number);

                        $ionicLoading.hide();
                    }, function (err) {
                        $log.error('failed to save wrapper contact', err);
                        $ionicLoading.hide();
                    });
                }
                else {
                    var contact =
                        {
                            "displayName": "Wrapper",
                            "phoneNumbers": [phoneNumber]
                        };


                    $cordovaContacts.save(contact).then(function (result) {
                        $log.info('added wrapper contact number');
                        $scope.makeCall(number);
                        $ionicLoading.hide();
                    }, function (error) {
                        $log.error('failed to save wrapper contact', err);

                        $ionicLoading.hide();
                    });
                }
            },
            function (err) {
                $log.error('failed to find wrapper contact', err);

                $ionicLoading.hide();
            });


        $scope.logAction($scope.actionMessages.CALL);

    };

    $scope.makeCall = function (number) {
        window.plugins.CallNumber.callNumber(
            function () {
                $log.info('finish call');
            },
            function () {
                $log.info('failed call');
            },
            number,
            false);
    };

    $scope.mail = function () {
        $log.info('send an email');
        $scope.logAction($scope.actionMessages.MAIL);

        $window.location = 'mailto:' + $scope.contacts.email + '?subject=This is a sample subject';
    };

    $scope.hasTwitterApp = false;


    $scope.tweet = function () {
        $log.info('tweet');
        $scope.logAction($scope.actionMessages.TWEET);
        var hasTwitterApp = LocalDataService.hasTwitterApp();

        if (hasTwitterApp) {
            window.open('twitter://user?screen_name=' + $scope.contacts.twitter, '_system', 'location=no');
        }
        else {
            window.open('https://twitter.com/intent/tweet?screen_name=' + $scope.contacts.twitter, '_system', 'location=no');
        }
    };


    $scope.logAction = function (action) {
        var message = {
            'OrgID': $rootScope.sessionData.organization.id,
            'UserID': LocalDataService.loadUser().id,
            'Question': action.message + ' "' + $scope.currentOrganization + '"',
            'ChannelTypeID': action.type
        };

        if ($rootScope.sessionData.options.length > 0) {
            var contactMenu = $rootScope.sessionData.options[$rootScope.sessionData.options.length - 1];
            $log.debug('try to ' + action + ' for menu: ', contactMenu);

            message.ChoiceMenuID = contactMenu.id;
        }
        MessageService.createMessage(message);
    };


    $scope.mailFeedback = function () {
        $window.location = 'mailto:feedback@mplify.nl' + '?subject=Feedback about wrapper app';
    };

    $scope.mailSupport = function () {
        $window.location = 'mailto:support@mplify.nl' + '?subject=Feedback about wrapper app';
    };


}]);

var controllers = angular.module('App.controllers');

controllers.controller('UserCtrl', ['$scope', '$rootScope', '$log', 'UserService', 'LocalDataService', function ($scope, $rootScope, $log, UserService, LocalDataService) {


    $scope.loadUserDetails = function(userId){
        UserService.loadUser(userId).then(function(userDetails){
            $scope.user = userDetails;

        }, function(error){
            $log.error('failed to load user details');
        });

    };



    $scope.load = function(){
        $log.info('load user details from local storage');

        $scope.localUser = LocalDataService.loadUser();
        $scope.localFBUser = LocalDataService.getFacebookResponse();
        $scope.sessionKey = LocalDataService.getBaseToken();
        $scope.networkStatus = LocalDataService.getNetworkState();
        $scope.networkType = LocalDataService.getNetworkType();


        if($scope.localUser.id){
            $scope.loadUserDetails($scope.localUser.id);
        }
    };

    $scope.load();
    $scope.$on('$ionicView.enter', function(){$scope.load();});

}]);



var controllers = angular.module('App.controllers');

controllers.controller('FacebookCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicPlatform', '$q', '$log', '$ionicLoading', '$http', '$cordovaOauth', 'UserService', 'BasicAuthorizationService', 'LocalDataService', 'FacebookService', function ($scope, $rootScope, $state, $stateParams, $ionicPlatform, $q, $log, $ionicLoading, $http, $cordovaOauth, UserService, BasicAuthorizationService, LocalDataService, FacebookService) {
    $scope.facebookLoginEnabled = window.cordova;

    $scope.facebookManualLogin = function () {
        $ionicLoading.show({
            template: 'Logging in...'
        });

        FacebookService.getLoginStatus().then(
            function (success) {
                if (success.status === 'connected') {
                    var accessToken = success.authResponse.accessToken;

                    FacebookService.getProfileInfo(accessToken).then(function (profileSuccess) {
                        // sync with local user
                        FacebookService.saveUser(profileSuccess, accessToken).then(function (saveSuccess) {
                            $scope.updateLocalStorage(saveSuccess, profileSuccess, accessToken);
                            $ionicLoading.hide();

                        }, function (saveError) {
                            $log.error('failed to save profile info');
                            $ionicLoading.hide();
                        });

                    }, function (error) {
                        $log.error('failed to get profile info');
                        $ionicLoading.hide();
                    });
                }
                else {
                    // show native login dialog
                    $scope.openNativeLogin();
                }
            },
            function (error) {

            });
    };

    $scope.nativeLoginSuccess = function (response) {
        var accessToken = response.authResponse.accessToken;

        FacebookService.getProfileInfo(accessToken).then(function (profileSuccess) {
            // sync with local user
            FacebookService.saveUser(profileSuccess, accessToken).then(
                function (saveSuccess) {
                    $scope.updateLocalStorage(saveSuccess, profileSuccess, accessToken);
                    $ionicLoading.hide();
                },
                function (saveError) {
                    $log.error('failed to save user');
                    $ionicLoading.hide();
                });

        }, function (error) {
            $log.error('failed to get profile info');
            $ionicLoading.hide();
        });
    };

    $scope.nativeLoginError = function (error) {
        $ionicLoading.hide();
    };

    $scope.openNativeLogin = function () {
        facebookConnectPlugin.login(['email', 'public_profile'], $scope.nativeLoginSuccess, $scope.nativeLoginError);
    };

    $scope.updateLocalStorage = function (user, profileInfo, accessToken) {
        LocalDataService.saveUser(user);

        profileInfo.accessToken = accessToken;
        profileInfo.picture = "http://graph.facebook.com/" + profileInfo.userID + "/picture?type=large";
        LocalDataService.saveFacebookResponse(profileInfo);

        $log.info('logged in via facebook', user);
        var username = user.Emailaddress;
        var password = "facebook " + accessToken;
        BasicAuthorizationService.generateToken(username, password);

        $state.go('app.intro');


    };


}]);

var controllers = angular.module('App.controllers');

controllers.controller('TwitterCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicLoading', '$ionicPlatform', '$log', '$cordovaOauth', 'localStorageService', 'UserService', 'LocalDataService', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $ionicPlatform, $log, $cordovaOauth, localStorageService, UserService, LocalDataService) {
    $scope.twitterLoginEnabled = window.cordova;

    $scope.consumerKey = 'JVj33eTXGPxlVZxoT8htdqwNK';
    $scope.consumerSecret = 'Q6K9GtYCrxhLPLWfIkr5eTHvpizf4NbEm6sHhkE0pSo0Ts7TFl';

    $scope.twitterProfileInfo = {};

    $scope.loadTwitterUser = function(){
        $scope.twitterProfileInfo = UserService.getUser();
    };

    $scope.twitterLogin = function () {

        $ionicLoading.show({
            template: 'Logging in...'
        });

        $cordovaOauth.twitter($scope.consumerKey, $scope.consumerSecret, {}).then(function (result) {
            $log.info('logged in via twitter', result);
            $ionicLoading.hide();


            $state.go('app.intro');
        }, function (error) {
            $log.error('failed to login via twitter', error);
            $ionicLoading.hide();
        });
    };




}]);

var controllers = angular.module('App.controllers');

controllers.controller('IntroCtrl', ['$scope', '$state', 'LocalDataService', function ($scope, $state, LocalDataService) {

    $scope.$on('$ionicView.beforeEnter', function(){
        // check intro already shows flag
        if(LocalDataService.getIntroScreenVisited()){
            $state.go('app.search');
        }
    });


    $scope.$on('$ionicView.beforeLeave', function(){
        //mark as visited
        LocalDataService.setIntroScreenVisited(true);
    });

    $scope.init = function(){

        var user = LocalDataService.loadUser();
        $scope.userName = user.UserName;
    };




}]);

var controllers = angular.module('App.controllers');

controllers.controller('MessageCtrl', ['$scope', '$rootScope', '$state', '$log', '$stateParams', '$ionicLoading', '$ionicHistory', 'MessageService', 'LocalDataService', function ($scope, $rootScope, $state, $log, $stateParams, $ionicLoading, $ionicHistory, MessageService, LocalDataService) {
    $log.info('init messages controller');

    $scope.$on('$ionicView.enter', $scope.load);

    $scope.messages = [

    ];

    $scope.companies = [];

    $scope.userID = LocalDataService.loadUser().id;

    $scope.load = function(){
        $ionicLoading.show({
            template: 'Loading...'
        });

        MessageService.getMessagesByUser($scope.userID).then(function(response) {
            $scope.messages = response;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.loadCompanies =  function(){
        $ionicLoading.show({
            template: 'Loading...'
        });

        MessageService.getCompaniesWithMsgCount($scope.userID).then(function(response) {
            $scope.companies = response;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });
    };



}]);

var controllers = angular.module('App.controllers');


controllers.controller('DocumentCtrl', ['$scope', '$log', '$cordovaCamera', '$cordovaFile', '$ionicLoading', '$ionicPopup', 'LocalDataService', 'DocumentService', function ($scope, $log, $cordovaCamera, $cordovaFile, $ionicLoading, $ionicPopup, LocalDataService, DocumentService) {
    $log.debug('init document controller');


    $scope.images = LocalDataService.getPhotos();

    $scope.load = function () {
        $log.debug('load documents');
        DocumentService.createFolder().then(
            function (success) {
                $scope.images = LocalDataService.getPhotos();

            },
            function (err) {

            }
        );


    };

    $scope.urlForImage = function (imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        return imageName;
    };

    $scope.addImage = function () {
        $ionicLoading.show({
            template: 'Capturing image...'
        });

        DocumentService.capturePicture().then(
            function(success){
                $scope.images = LocalDataService.getPhotos();
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: 'Picture saved',
                    template: success
                });

            },
            function(fail){
                $ionicLoading.hide();
            }
        );
    };
}]);