// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'LocalStorageModule', 'ionic.service.core', 'App.controllers', 'App.services'])

    .run(function ($ionicPlatform) {
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
    })

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
        $stateProvider

            .state('intro', {
                url: '/intro',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })

            .state('intro.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html'
                    }
                },
                controller : 'RegistrationCtrl'
            })

            .state('intro.register', {
                url: '/register',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/register.html'
                    }
                },
                controller : 'RegistrationCtrl'
            })

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

            .state('app.dashboard', {
                url: '/dashboard',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/dashboard.html'
                    }
                },
                controller : 'RegistrationCtrl'
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
                url: '/options/:orgName/:optionId',
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


            /*.state('app.single', {
                url: '/playlists/:playlistId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/playlist.html',
                        controller: 'PlaylistCtrl'
                    }
                }
            });*/

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/dashboard');

        $httpProvider.interceptors.push('APIInterceptor');
        $httpProvider.defaults.withCredentials = true;


        $httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = "*";

        $ionicConfigProvider.views.swipeBackEnabled(true);

    });
