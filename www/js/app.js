// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'LocalStorageModule', 'ionic.service.core', 'App.controllers', 'App.services', 'ngCordova', 'ngCordova.plugins.appAvailability', 'ngCordovaOauth'])

    .run(function ($ionicPlatform, Auth, $http) {



        $ionicPlatform.ready(function () {

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }


        });



        $http.defaults.headers.common.Authorization = 'Basic ' + Auth.getCredentials();
    })

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
        $stateProvider

            .state('root', {
                url: '/root',
                templateUrl: 'templates/dashboard2.html'
            })


            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller : 'AppCtrl'
            })

            .state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller : 'AuthorizationCtrl'
            })

            .state('restorepassword', {
                url: '/restorepassword',
                templateUrl: 'templates/restore-password.html',
                controller : 'RestorePasswordCtrl'
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
                        templateUrl: 'templates/intro.html'
                    }
                }
            })

            .state('app.dashboard2', {
                url: '/dashboard2',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dashboard2.html'
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
                        templateUrl: 'templates/organization-list.html'
                    }
                },
                controller : 'OrganizationsCtrl'
            })

            .state('app.options', {
                url: '/options/:orgID/:parentID',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/option-list.html'
                    }
                },
                controller : 'OptionsCtrl'
            })


            .state('app.actions', {
                url: '/actions/:orgName',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/actions.html'
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

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/root');

        $httpProvider.interceptors.push('APIInterceptor');

        $httpProvider.defaults.withCredentials = true;


        $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = "*";

        $ionicConfigProvider.views.swipeBackEnabled(true);



    });
