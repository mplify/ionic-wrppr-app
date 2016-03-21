// Ionic Starter App


angular.module('underscore', [])
    .factory('_', function() {
        return window._; // assumes underscore has already been loaded on the page
    });

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
        'ionic',
        'LocalStorageModule',
        'ionic.service.core',
        'App.controllers',
        'App.services',
        'App.directives',
        'underscore',
        'ngCordova',
        'ngCordova.plugins.appAvailability',
        'ngCordovaOauth',
        'pascalprecht.translate',
        'templates',
        'ionic-native-transitions'
    ])

    .run(function ($ionicPlatform, BasicAuthorizationService, $http, $log, LocalDataService, TwitterService, ExternalLoad, NetworkService, DTMFService, EmailService, FacebookService, LoginService, DocumentService) {

        LoginService.autoLogin().then(
            function(success){
                if(success.wrppr_users){
                    var user = success.wrppr_users;
                    LocalDataService.saveUser(user);
                }

            },
            function(err){

            }
        );

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
            NetworkService.checkNetworkState();
            FacebookService.autoLogin();

            DocumentService.createFolder();


        });

        $ionicPlatform.on('resume', function(){
            ExternalLoad.checkExternalLoad();
            NetworkService.checkNetworkState();
        });

        var token = BasicAuthorizationService.getToken();
        if(token){
            $log.info('set default credentials');
            $http.defaults.headers.common.Authorization = token;
        }


    })

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, $translateProvider, $logProvider, $compileProvider) {
        $stateProvider

            //INTRO
            .state('auth', {
                url: "/auth",
                templateUrl: "views/auth/auth.html",
                abstract: false
            })


            .state('auth.login', {
                url: '/login',
                templateUrl: 'views/auth/login.html',
                controller : 'AppCtrl'
            })


            .state('auth.walkthrough', {
                url: '/walkthrough',
                templateUrl: "views/auth/walkthrough.html"
            })

            .state('auth.signup', {
                url: '/signup',
                templateUrl: "views/auth/signup.html"
            })

            .state('auth.forgot-password', {
                url: "/forgot-password",
                templateUrl: "views/auth/forgot-password.html"
            })

            .state('auth.restorepassword', {
                url: '/restorepassword',
                templateUrl: 'views/auth/restore-password.html',
                controller : 'RestorePasswordCtrl'
            })

            .state('auth.changepassword', {
                url: '/changepassword/:key',
                templateUrl: 'views/auth/change-password.html',
                controller : 'RestorePasswordCtrl'
            })



            .state('root', {
                url: '/root',
                templateUrl: 'dashboard.html'
            })


            .state('login', {
                url: 'login',
                templateUrl: 'views/auth/login.html',
                controller : 'AppCtrl'
            })

            .state('register', {
                url: '/register',
                templateUrl: 'register.html',
                controller : 'AuthorizationCtrl'
            })



            .state('offline', {
                url: '/offline',
                templateUrl: 'no-internet.html',
                controller : 'AppCtrl'
            })


            .state('app', {
                url : '/app',
                templateUrl : 'templates/menu.html',
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


            .state('app.search', {
                url: '/search',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/organization-list.html',
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
                        templateUrl: 'templates/user.html'
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

            .state('app.messagedetails', {
                url: '/messagedetails/:messageID',
                views: {
                    'menuContent': {
                        templateUrl: 'message-details.html'
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

            .state('app.favorite', {
            url: '/favorite/:orgID',
                views: {
                'menuContent': {
                    templateUrl: 'message-list.html'
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
            })

            .state('app.documentdetails', {
                url: '/documentdetails/:name',
                params: {
                    document : null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'document-details.html'
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/auth/walkthrough');

        $httpProvider.interceptors.push('APIInterceptor');

        $httpProvider.defaults.withCredentials = true;


        $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = "*";

        $ionicConfigProvider.views.swipeBackEnabled(true);

        //FIXME
        //$ionicConfigProvider.scrolling.jsScrolling(false);


        var userLanguage = navigator.language || navigator.userLanguage;


        var preferredLanguage = "nl";
        if(userLanguage && userLanguage.indexOf('en') > -1){
            preferredLanguage = "en";

        }

        $translateProvider
            .useStaticFilesLoader({
                prefix: 'locales/',
                suffix: '.json'
            })
            .registerAvailableLanguageKeys(['en', 'nl'], {
                'en' : 'en', 'en_GB': 'en', 'en_US': 'en',
                'de' : 'nl', 'de_DE': 'nl', 'de_CH': 'nl'
            })
            .preferredLanguage(preferredLanguage)
            .fallbackLanguage('nl')
            //.determinePreferredLanguage()
            .useSanitizeValueStrategy('escapeParameters');


        //Disable logging for production, set false
        $logProvider.debugEnabled(true);

        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);


    }
);
