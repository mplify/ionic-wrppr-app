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

    .run(['$ionicPlatform', 'BasicAuthorizationService', '$http', '$log', 'LocalDataService', 'TwitterService', 'ExternalLoad', 'NetworkService', 'DTMFService', 'EmailService', 'FacebookService', 'LoginService', 'DocumentService', function ($ionicPlatform, BasicAuthorizationService, $http, $log, LocalDataService, TwitterService, ExternalLoad, NetworkService, DTMFService, EmailService, FacebookService, LoginService, DocumentService) {

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


    }])

    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$ionicConfigProvider', '$translateProvider', '$logProvider', '$compileProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, $translateProvider, $logProvider, $compileProvider) {
        $stateProvider

            //INTRO
            .state('auth', {
                url: "/auth",
                templateUrl: "auth/auth.html",
                abstract: false
            })


            .state('auth.login', {
                url: '/login',
                templateUrl: 'auth/login.html',
                controller : 'AppCtrl'
            })


            .state('auth.walkthrough', {
                url: '/walkthrough',
                templateUrl: "auth/walkthrough.html"
            })

            .state('auth.signup', {
                url: '/signup',
                templateUrl: "auth/signup.html"
            })


            .state('auth.restorepassword', {
                url: '/restorepassword',
                templateUrl: 'auth/restore-password.html',
                controller : 'RestorePasswordCtrl'
            })

            .state('auth.changepassword', {
                url: '/changepassword/:key',
                templateUrl: 'auth/change-password.html',
                controller : 'RestorePasswordCtrl'
            })

            .state('offline', {
                url: '/offline',
                templateUrl: 'no-internet.html',
                controller : 'AppCtrl'
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


    }]
);

angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("actions.html","<ion-view view-title=\"{{\'ACTIONS.TITLE\' | translate}} {{currentOrganization}}\" ng-controller=\"ActionCtrl\">\n\n    <ion-content ng-init=\"init();\">\n        <div style=\"height: 5px;\" ng-style=\"{\'background-color\': brandingColor}\"></div>\n        <div class=\"row\" style=\"height: 10%; padding-left: 20px; padding-right: 20px;\">\n            <h3 style=\"text-align: center; width: 100%;\">{{currentOrganization}}</h3>\n        </div>\n\n        <div class=\"row\" ng-repeat=\"option in currentOptions\">\n            <p style=\"text-align: center; width: 100%;\">{{option.NodeName}}</p>\n        </div>\n\n        <div class=\"row button-block\" style=\"text-align: center; display: block;\"\n             ng-show=\"contacts.call == null && contacts.twitter == null && contacts.email == null\">\n\n            <div class=\"ion-sad-outline\" style=\"font-size: 86px; color: lightgray;\"></div>\n            <h4 class=\"title\" style=\"width: 100%; text-align: center;\">We don\'t have any contacts for\n                {{currentOrganization}}, please try later or contact our support</h4>\n\n\n        </div>\n\n        <div class=\"row\" style=\"height: 40%; padding-left: 20px; padding-right: 20px;\">\n            <div class=\"col\" ng-hide=\"contacts.call == null\">\n                <div class=\"features-box-icon\" ng-style=\"{\'background-color\': brandingColor2}\" ng-click=\"call();\">\n                    <span aria-hidden=\"true\" class=\"ion-ios-telephone\"></span>\n                    <button class=\"button button-clear\">\n\n                    </button>\n                </div>\n\n            </div>\n\n            <div class=\"col\" ng-hide=\"contacts.twitter == null\">\n                <div class=\"features-box-icon\" ng-style=\"{\'background-color\': brandingColor2}\" ng-click=\"tweet();\">\n                    <span aria-hidden=\"true\" class=\"ion-social-twitter\"></span>\n                    <button class=\"button button-clear\">\n\n                    </button>\n                </div>\n\n            </div>\n\n        </div>\n        <div class=\"row\" style=\"height: 40%; padding-left: 20px; padding-right: 20px;\">\n\n            <div class=\"col\" ng-hide=\"contacts.email == null\">\n                <div class=\"features-box-icon\" ng-style=\"{\'background-color\': brandingColor2}\" ng-click=\"mail();\">\n                    <span aria-hidden=\"true\" class=\"ion-email\"></span>\n                    <button class=\"button button-clear\">\n\n                    </button>\n                </div>\n\n            </div>\n            <div class=\"col\" ng-show=\"hasWebpage\">\n                <div class=\"features-box-icon\" ng-style=\"{\'background-color\': brandingColor2}\" ng-click=\"webpage();\">\n                    <span aria-hidden=\"true\" class=\"ion-android-globe\"></span>\n                    <button class=\"button button-clear\">\n\n                    </button>\n                </div>\n\n            </div>\n        </div>\n\n    </ion-content>\n    <div class=\"tabs tabs-icon-top\">\n        <a class=\"tab-item\" ng-click=\"mailFeedback();\">\n            <i class=\"icon ion-speakerphone\"></i>\n            {{ \'GENERIC.FEEDBACK\' | translate }}\n        </a>\n        <a class=\"tab-item\" ng-show=\"supportMessage.id\">\n            <i class=\"icon ion-edit\" ng-click=\"showUserCorrect();\"></i>\n            {{ \'USER_CORRECT.BUTTON\' | translate }}\n        </a>\n        <a class=\"tab-item\" ng-click=\"mailSupport();\">\n            <i class=\"icon ion-help-buoy\"></i>\n            {{ \'GENERIC.SUPPORT\' | translate }}\n        </a>\n    </div>\n\n\n</ion-view>");
$templateCache.put("capture-document.html","<ion-view view-title=\"{{\'ATTACHMENT.TITLE\' | translate}}\" ng-controller=\"DocumentCtrl\" ng-init=\"load()\">\n\n    <ion-content>\n\n        <ion-list>\n            <ion-item ng-repeat=\"image in images track by image.name\" class=\"item item-image\" style=\"padding: 10px;\" ng-click=\"selectDocument(image);\">\n                <p>{{image.name | Filename}}</p>\n                <img class=\"full-image\" ng-src=\"{{urlForImage(image.url)}}\" style=\"height: 300px;\">\n\n\n            </ion-item>\n        </ion-list>\n    </ion-content>\n    <div class=\"bar bar-footer\" ng-show=\"cameraAvailable\">\n        <div class=\"button-bar\">\n            <button class=\"button button-clear\" ng-click=\"addImage();\">\n                {{\'ATTACHMENT.ADD\' | translate}}\n            </button>\n            <button id=\"attachmentsReload\" class=\"button button-clear\" ng-click=\"load();\">\n                {{\'ATTACHMENT.RELOAD\' | translate}}\n            </button>\n        </div>\n    </div>\n\n\n</ion-view>");
$templateCache.put("document-details.html","<div class=\"modal image-modal transparent\" on-swipe-down=\"closeModal()\" ng-controller=\"DocumentCtrl\">\n\n            <ion-scroll direction=\"xy\" scrollbar-x=\"false\" scrollbar-y=\"false\"\n                        zooming=\"true\" min-zoom=\"{{zoomMin}}\" style=\"width: 100%; height: 100%\"\n                        >\n\n                <div class=\"image\" style=\"background-image: url({{urlForImage(document.url)}} )\"></div>\n\n            </ion-scroll>\n\n</div>");
$templateCache.put("favorites.html","\n<ion-view class=\"bookmarks-view\" ng-controller=\"FavoritesCtrl\">\n    <ion-nav-title>\n        <span>{{\'FAVORITES.TITLE\' | translate}}</span>\n    </ion-nav-title>\n    <ion-content>\n        <div ng-if=\"organizations.length === 0\" class=\"row bookmarks-container\">\n            <div class=\"col col-center\">\n                <div class=\"empty-results\">\n                    <i class=\"icon ion-bookmark\"></i>\n                    <h3 class=\"no-bookmarks\">There\'s nothing here yet. Start exploring!</h3>\n                </div>\n            </div>\n        </div>\n\n            <ion-list ng-if=\"organizations.length > 0\">\n                <ion-item ng-repeat=\"org in organizations track by org.OrgID\"  ng-click=\"selectOrganisation(org);\">\n                    {{org.orgName}}\n                    <span class=\"badge wrppr-action-button\" style=\"color: white;\">{{org.count}}</span>\n                </ion-item>\n            </ion-list>\n\n    </ion-content>\n</ion-view>");
$templateCache.put("intro.html","<ion-modal-view>\n    <ion-header-bar align-title=\"left\">\n        <h1 class=\"title\">{{\'INTRO.TITLE\' | translate}}</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ng-click=\"hideIntro();\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n\n\n\n    <ion-content style=\"margin-left: 20px; margin-right: 20px;\">\n\n        <div class=\"row button-block \" style=\"text-align: center; display: block;\">\n            <div class=\"ion-coffee\" style=\"font-size: 86px; color: lightgray;\"></div>\n\n        </div>\n        <div class=\"row\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'INTRO.TEXT\' | translate}}{{userName}}</h4></div>\n        <div class=\"row\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'INTRO.DESCRIPTION\' | translate}}</h4></div>\n        <div class=\"row\" style=\"height: 30%\"></div>\n        <div class=\"row\">\n\n            <button class=\"button button-large button-assertive wrppr-action-button\" style=\"width: 100%;\" ng-click=\"hideIntro()\">\n                {{\'INTRO.SEARCH_BUTTON\' | translate}}\n            </button>\n\n        </div>\n\n\n\n    </ion-content>\n\n\n</ion-modal-view>");
$templateCache.put("menu.html","\n<ion-side-menus enable-menu-with-back-views=\"false\">\n    <ion-side-menu-content class=\"post-size-14px\">\n        <ion-nav-bar class=\"bar app-top-bar\">\n            <ion-nav-back-button>\n            </ion-nav-back-button>\n            <ion-nav-buttons side=\"left\">\n                <button class=\"button button-icon button-clear ion-navicon\" menu-toggle=\"left\">\n                </button>\n            </ion-nav-buttons>\n        </ion-nav-bar>\n        <ion-nav-view name=\"menuContent\"></ion-nav-view>\n    </ion-side-menu-content>\n\n    <ion-side-menu side=\"left\" class=\"main-menu\" expose-aside-when=\"large\">\n        <ion-content>\n            <ion-list>\n                <ion-item class=\"heading-item item item-avatar\" nav-clear menu-close ui-sref=\"app.user\">\n                    <div class=\"user-image-container\">\n\n                        <pre-img ratio=\"_1_1\" helper-class=\"rounded-image\">\n                            <img class=\"user-image\" ng-src=\"{{localFBUser.picture}}\">\n                        </pre-img>\n                    </div>\n                    <h2 class=\"greeting\">Hi, {{currentUsername}}</h2>\n                    <p class=\"message\">Welcome back</p>\n                </ion-item>\n                <ion-item class=\"item-icon-left\" nav-clear menu-close href=\"#/app/search\">\n                    <i class=\"icon ion-radio-waves\"></i>\n                    <h2 class=\"menu-text\">{{\'MENU.BUSINESS_CONTACT_SEARCH\' | translate}}</h2>\n                </ion-item>\n                <ion-item class=\"item-icon-left\" nav-clear menu-close href=\"#/app/favorites\">\n                    <i class=\"icon ion-asterisk\"></i>\n                    <h2 class=\"menu-text\">{{\'MENU.FAVORITES\' | translate}}</h2>\n                </ion-item>\n                <ion-item class=\"item-icon-left\" nav-clear menu-close href=\"#/app/messages\">\n                    <i class=\"icon ion-bookmark\"></i>\n                    <h2 class=\"menu-text\">{{\'MENU.HISTORY\' | translate}}</h2>\n                </ion-item>\n            </ion-list>\n        </ion-content>\n    </ion-side-menu>\n</ion-side-menus>\n\n");
$templateCache.put("message-details.html","\n<ion-view class=\"wordpress-view\" ng-controller=\"MessageCtrl\">\n    <form name=\"messageForm\" novalidate>\n    <ion-nav-buttons side=\"left\">\n        <button menu-toggle=\"left\" class=\"button button-icon icon ion-navicon\"></button>\n    </ion-nav-buttons>\n    <ion-nav-title>\n        <span>{{\'MESSAGES.DETAILS_TITLE\' | translate}}</span>\n    </ion-nav-title>\n    <ion-content>\n\n        <div class=\"posts-list\" ng-hide=\"isLoading\">\n            <div class=\"list card post-item\">\n\n                <div class=\"post-heading item item-text-wrap\">\n                    <h2 class=\"post-title\">{{currentMessage.Question}}</h2>\n                    <p class=\"post-author\">\n                       {{currentMessage.createdAt | date:\'dd.MM.yyyy HH:mm\'}}\n                    </p>\n                </div>\n                <div class=\"post-content item item-text-wrap\" post-content>\n                    <div ng-switch=\"currentMessage.ChannelTypeID\">\n                        <div class=\"row button-block \" style=\"text-align: center; display: block;\">\n                            <div ng-switch-when=\"1\" class=\"ion-ios-telephone\" style=\"font-size: 86px; color: lightgray;\"></div>\n                            <div ng-switch-when=\"2\" class=\"icon ion-email\" style=\"font-size: 86px; color: lightgray;\"></div>\n                            <div ng-switch-when=\"3\" class=\"ion-social-twitter\" style=\"font-size: 86px; color: lightgray;\"></div>\n\n                        </div>\n                    </div>\n                    <div ng-show=\"messageOptions.length > 0\" style=\"padding: 10px;\">\n                        <p ng-repeat=\"option in messageOptions\" style=\"text-align: center; width: 100%;\">{{option.NodeName}}</p>\n                    </div>\n                    <p style=\"text-align: center; padding: 10px;\">{{currentMessage.Notes}}</p>\n                    <div class=\"post-tags item item-text-wrap\" ng-repeat=\"attachment in currentAttachments\"  ng-show=\"currentAttachments.length > 0\">\n                        <span class=\"post-tag button button-small button-outline button-stable\" ng-click=\"selectDocument(attachment)\" >{{attachment.name | Filename}}</span>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n\n    </ion-content>\n    <ion-footer-bar class=\"post-footer bar bar-footer bar-dark\">\n        <div class=\"row\">\n            <div class=\"col col-20 col-offset-10 col-center\">\n                <a class=\"button button-icon icon icon-right ion-android-attach\"  ng-click=\"addImage();\"></a>\n            </div>\n            <div class=\"col col-20 col-offset-10 col-center\">\n                <a class=\"button button-icon icon icon-right ion-chatbox\"  ng-click=\"openNoteModal();\"></a>\n            </div>\n            <div class=\"col col-20 col-offset-10 col-center\">\n                <a class=\"button button-icon icon icon-right ion-help-buoy\"  ng-click=\"openSupport();\"></a>\n            </div>\n\n        </div>\n    </ion-footer-bar>\n    </form>\n</ion-view>\n");
$templateCache.put("message-list.html","<ion-view class=\"category-feeds-view\" ng-controller=\"MessageHistoryCtrl\">\n    <ion-nav-title>\n        <span>{{\'MESSAGES.HISTORY_TITLE\' | translate}}</span>\n    </ion-nav-title>\n    <ion-content>\n        <div class=\"list category-feeds\">\n            <a ng-repeat=\"message in messages track by message.id\" class=\"item item-icon-right\"\n               ng-click=\"selectMessage(message)\">\n                <div class=\"thumbnail-outer\">\n                    <div class=\"thumbnail-outer\" ng-switch=\"message.ChannelTypeID\">\n\n                        <i ng-switch-when=\"1\" class=\"thumbnail icon ion-ios-telephone\" style=\"padding-top: 20px;\"></i>\n                        <i ng-switch-when=\"2\" class=\"thumbnail icon ion-email\" style=\"padding-top: 20px;\"></i>\n                        <i ng-switch-when=\"3\" class=\"thumbnail icon ion-social-twitter\" style=\"padding-top: 20px;\"></i>\n\n                    </div>\n                </div>\n                <div>\n                    <span class=\"title\">{{message.OrgID.orgName}}</span>\n\n                    <p class=\"description\">{{message.createdAt | date:\'dd.MM.yyyy\'}}</p>\n                </div>\n                <i class=\"icon ion-arrow-right-c\"></i>\n            </a>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("message-note.html","<ion-modal-view>\n    <ion-header-bar align-title=\"left\">\n        <h1 class=\"title\">Message Note</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ng-click=\"closeModal();\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n    <ion-content scroll=\"false\" ng-controller=\"AuthorizationCtrl\">\n        <form name=\"messageNoteForm\" ng-submit=\"saveMessageNote()\" novalidate>\n            <div class=\"list\">\n\n                <label class=\"item item-input\">\n\n                    <textarea placeholder=\"Note\" name=\"username\" ng-model=\"currentMessage.Notes\" rows=\"5\"></textarea>\n\n                </label>\n\n                <label class=\"item\">\n                    <button class=\"button button-block button-assertive wrppr-action-button\"  type=\"submit\">Save</button>\n                </label>\n            </div>\n        </form>\n    </ion-content>\n</ion-modal-view>");
$templateCache.put("new-document.html","<ion-modal-view>\n    <ion-header-bar align-title=\"left\">\n        <h1 class=\"title\">{{\'ATTACHMENT.NEW_TITLE\' | translate}}</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ng-click=\"closeModal()\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n    <ion-content scroll=\"false\">\n        <form name=\"newDocumentForm\" ng-submit=\"closeAttachmentModal(attachment.filename)\" novalidate>\n            <div class=\"list\">\n\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">{{\'ATTACHMENT.FILENAME\' | translate}}</span>\n                    <input type=\"text\" name=\"username\" ng-model=\"attachment.filename\">\n\n                </label>\n\n                <label class=\"item\">\n                    <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"newDocument.$invalid\" type=\"submit\">{{\'ATTACHMENT.SAVE\' | translate}}</button>\n                </label>\n            </div>\n        </form>\n    </ion-content>\n</ion-modal-view>");
$templateCache.put("no-internet.html","<ion-view view-title=\"{{\'OFFLINE.TITLE\' | translate}}\" ng-controller=\"AppCtrl\">\n\n\n    <ion-content style=\"margin-left: 20px; margin-right: 20px;\">\n\n        <div class=\"row button-block \" style=\"text-align: center; display: block;\">\n            <div class=\"ion-android-wifi\" style=\"font-size: 86px; color: lightgray;\"></div>\n\n        </div>\n        <div class=\"row\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'OFFLINE.TEXT\' | translate}}</h4></div>\n        <div class=\"row\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'OFFLINE.DESCRIPTION\' | translate}}</h4></div>\n        <div class=\"row\" style=\"height: 30%\"></div>\n        <div class=\"row\">\n\n            <button class=\"button button-large button-assertive wrppr-action-button\" style=\"width: 100%;\" ng-click=\"refreshNetworkState()\">\n                {{\'OFFLINE.REFRESH\' | translate}}\n            </button>\n\n        </div>\n\n\n\n    </ion-content>\n\n\n</ion-view>");
$templateCache.put("option-list.html","\n<ion-view view-title=\"{{currentOrganization}}\" ng-controller=\"OptionsCtrl\">\n    <ion-content ng-show=\"showOptions\">\n        <div style=\"height: 5px; background-color: white;\" ng-style=\"{\'background-color\': brandingColor}\"></div>\n\n        <ion-list ng-init=\"load();\">\n            <ion-item ng-repeat=\"option in options track by option.id\" ng-click=\"selectOption(option);\">\n                {{option.NodeName}}\n            </ion-item>\n        </ion-list>\n    </ion-content>\n\n    <ion-content ng-hide=\"showOptions\">\n        <div ng-include src=\"\'actions.html\'\"></div>\n    </ion-content>\n</ion-view>");
$templateCache.put("organization-list.html","<ion-view>\n    <ion-nav-title>\n        <span>{{ \'BUSINESS_CONTACT.SEARCH\' | translate }}</span>\n    </ion-nav-title>\n\n    <ion-header-bar class=\"bar bar-subheader item-input-inset\">\n        <label class=\"item-input-wrapper\">\n            <i class=\"icon ion-ios-search placeholder-icon\"></i>\n            <input type=\"search\" placeholder=\"{{ \'BUSINESS_CONTACT.SEARCH_FILTER_PLACEHOLDER\' | translate }}\" ng-model=\"search.model\">\n            <a ng-if=\"search.model != \'\'\"\n               on-touch=\"search.model=\'\'\">\n                <i class=\"icon ion-ios-close placeholder-icon\"></i>\n            </a>\n        </label>\n    </ion-header-bar>\n\n    <ion-content >\n\n\n\n        <ion-list>\n            <ion-item ng-repeat=\"organisation in organizations track by organisation.id\" ng-click=\"selectOrganisation(organisation);\">\n                {{organisation.orgName}}\n            </ion-item>\n        </ion-list>\n\n        <ion-infinite-scroll\n                ng-if=\"!noMoreItemsAvailable\"\n                immediate-check=\"false\"\n                on-infinite=\"loadNext()\"\n                distance=\"10%\">\n        </ion-infinite-scroll>\n\n\n    </ion-content>\n\n</ion-view>");
$templateCache.put("rating.html","<ion-modal-view>\n    <ion-header-bar align-title=\"left\">\n        <h1 class=\"title\">{{\'RATING.TITLE\' | translate}}</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ng-click=\"closeModal();\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n\n\n\n    <ion-content style=\"margin-left: 20px; margin-right: 20px;\">\n\n        <div class=\"row button-block \" style=\"text-align: center; display: block;\">\n            <div class=\"ion-star\" style=\"font-size: 86px; color: lightgray;\"></div>\n\n        </div>\n        <div class=\"row\" ng-hide=\"isRated\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'RATING.TEXT\' | translate}}{{userName}}</h4></div>\n        <div class=\"row\" ng-hide=\"isRated\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'RATING.DESCRIPTION\' | translate}}</h4></div>\n\n\n        <div class=\"row\" ng-show=\"isRated\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'RATING.THANKS\' | translate}}{{userName}}</h4></div>\n\n\n        <div class=\"row\" style=\"height: 20px\"></div>\n        <div class=\"row\" ng-hide=\"isRated\">\n            <div class=\"col\">\n                <div class=\"features-box-icon\" ng-click=\"ratePositive();\">\n                    <span aria-hidden=\"true\" class=\"ion-happy\"></span>\n                    <button class=\"button button-clear\">\n\n                    </button>\n                </div>\n\n            </div>\n\n            <div class=\"col\">\n                <div class=\"features-box-icon\" ng-click=\"rateNegative();\">\n                    <span aria-hidden=\"true\" class=\"ion-sad\"></span>\n                    <button class=\"button button-clear\">\n\n                    </button>\n                </div>\n\n            </div>\n        </div>\n\n\n\n    </ion-content>\n\n\n</ion-modal-view>");
$templateCache.put("tabs.html","<ion-view>\n    <ion-tabs class=\"tabs-icon-top tabs-color-active-assertive\">\n\n        <ion-tab title=\"tab1\" icon=\"ion-man\" ui-sref=\"intro.login\">\n            <ion-nav-view name=\"tab-tab1\"></ion-nav-view>\n        </ion-tab>\n\n        <ion-tab title=\"tab2\" icon=\"ion-person-stalker\" ui-sref=\"intro.register\">\n            <ion-nav-view name=\"menuContent\"></ion-nav-view>\n        </ion-tab>\n    </ion-tabs>\n</ion-view>");
$templateCache.put("user-correct.html","<ion-modal-view>\n    <ion-header-bar align-title=\"left\">\n        <h1 class=\"title\">{{ \'USER_CORRECT.TITLE\' | translate }}</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ng-click=\"closeModal();\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n    <ion-content scroll=\"false\" ng-controller=\"AuthorizationCtrl\">\n        <form name=\"userCorrectForm\" ng-submit=\"submitUserCorrect(\'Usercorrect\', userCorrect.comment)\" novalidate>\n            <div class=\"list\">\n                <label class=\"item\">\n                    {{ \'USER_CORRECT.DESCRIPTION\' | translate }}\n                </label>\n\n\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">Comment</span>\n                    <input type=\"text\" name=\"username\" ng-model=\"userCorrect.comment\">\n\n                </label>\n\n                <label class=\"item\">\n                    <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"userCorrectForm.$invalid\" type=\"submit\">{{ \'USER_CORRECT.SUBMIT\' | translate }}</button>\n                </label>\n\n\n            </div>\n        </form>\n    </ion-content>\n</ion-modal-view>");
$templateCache.put("user-feedback.html","<ion-modal-view>\n    <ion-header-bar align-title=\"left\">\n        <h1 class=\"title\">Feedback</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ng-click=\"closeModal();\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n    <ion-content scroll=\"false\" ng-controller=\"AuthorizationCtrl\">\n        <form  ng-submit=\"submitUserCorrect(\'feedback\', comment )\" novalidate>\n            <div class=\"list\">\n                <label class=\"item\">\n                    Feedback procedure description\n                </label>\n\n\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">Comment</span>\n                    <input type=\"text\" name=\"username\" ng-model=\"comment\">\n\n                </label>\n\n                <label class=\"item\">\n                    <button class=\"button button-block button-assertive wrppr-action-button\"  type=\"submit\">Save</button>\n                </label>\n\n\n            </div>\n        </form>\n    </ion-content>\n</ion-modal-view>");
$templateCache.put("user-support.html","<ion-modal-view>\n    <ion-header-bar align-title=\"left\">\n        <h1 class=\"title\">Support</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ng-click=\"closeModal();\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n    <ion-content scroll=\"false\" ng-controller=\"AuthorizationCtrl\">\n        <form  ng-submit=\"submitUserCorrect(\'support\', comment )\" novalidate>\n            <div class=\"list\">\n                <label class=\"item\">\n                    How can we help you\n                </label>\n\n\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">Comment</span>\n                    <input type=\"text\" name=\"username\" ng-model=\"comment\">\n\n                </label>\n\n                <label class=\"item\">\n                    <button class=\"button button-block button-assertive wrppr-action-button\"  type=\"submit\">Save</button>\n                </label>\n\n\n            </div>\n        </form>\n    </ion-content>\n</ion-modal-view>");
$templateCache.put("user.html","\n<ion-view class=\"profile-view\" ng-controller=\"UserCtrl\">\n    <ion-nav-title>\n        <span>{{localUser.UserName}}</span>\n    </ion-nav-title>\n    <ion-content>\n        <div class=\"top-content row\">\n            <div class=\"profile-container\">\n                <div class=\"user-image-container\">\n                    <pre-img ratio=\"_1_1\" helper-class=\"rounded-image\">\n                        <img class=\"user-image\" ng-src=\"{{localFBUser.picture}}\">\n                    </pre-img>\n                </div>\n                <div class=\"user-name\">{{localUser.UserName}}</div>\n                <div class=\"user-twitter\">{{user.email}}</div>\n                <div class=\"user-twitter\">{{user.createdAt | date:\'medium\' }}</div>\n            </div>\n            <div class=\"user-background-image-outer\">\n                <div multi-bg=\"[\'{{localFBUser.picture}}\']\"></div>\n            </div>\n        </div>\n        <div class=\"bottom-content\">\n            <div class=\"user-bio\">\n                <p></p>\n            </div>\n        </div>\n\n\n    </ion-content>\n    <ion-footer-bar class=\"post-footer bar bar-footer bar-dark\">\n        <div class=\"row\">\n            <div class=\"col col-50 col-offset-10 col-center\">\n                <a class=\"button button-icon icon icon-right ion-at\"  ng-click=\"switchLanguage();\"></a>\n            </div>\n            <div class=\"col col-50 col-offset-10 col-center\">\n                <a class=\"button button-icon icon icon-right ion-android-walk\"  ng-click=\"logout();\"></a>\n            </div>\n\n\n        </div>\n    </ion-footer-bar>\n</ion-view>\n");
$templateCache.put("auth/auth.html","<ion-nav-view class=\"auth-outer\">\n    <!--<div multi-bg=\"[\'img/bg-gif.gif\']\"></div> -->\n    <div multi-bg=\"[\'img/bg_mini.jpg\']\"></div>\n</ion-nav-view>\n");
$templateCache.put("auth/change-password.html","\n<ion-view class=\"forgot-password-view auth-view\" cache-view=\"false\">\n    <ion-content scroll=\"false\">\n        <div class=\"row\">\n            <div class=\"col col-center\">\n                <div class=\"card forgot-password-container\" ng-controller=\"RestorePasswordCtrl\">\n                    <form name=\"changePasswordForm\" ng-submit=\"doChangePassword()\" class=\"\" novalidate>\n                        <div class=\"item item-body\">\n                            <label class=\"item item-input\">\n                                <input type=\"password\" placeholder=\"{{\'PASSWORD\' | translate}}\" ng-model=\"newPassword\" required>\n                            </label>\n                        </div>\n                        <label class=\"item password-complexity row\" ng-show=\"passwordComplexity\">\n                            <div class=\"col\" ng-class=\"passwordComplexity\"></div>\n                        </label>\n                        <label class=\"item item-input\" ng-show=\"!changePasswordForm.newPassword.$pristine && changePasswordForm.newPassword.$invalid\">\n                            <p ng-show=\"changePasswordForm.newPassword.$error.required\">{{\'PASSWORD_REQUIRED_VALIDATOR\' | translate}}</p>\n                        </label>\n                        <label class=\"item item-input\">\n                            <input type=\"password\" placeholder=\"{{\'CHANGE_PASSWORD.REPEAT_PASSWORD\' | translate}}\" ng-model=\"repeatPassword\" required>\n                        </label>\n                        <label class=\"item item-input\" ng-show=\"!changePasswordForm.repeatPassword.$pristine && !passwordMatch\">\n                            <p ng-show=\"!passwordMatch\">{{\'CHANGE_PASSWORD.PASSWORD_MATCH\' | translate}}</p>\n                        </label>\n\n                        <div class=\"item item-body bottom-content\">\n                            <button type=\"submit\" class=\"button button-positive button-block\"  ng-disabled=\"changePasswordForm.$invalid || !passwordMatch\" type=\"submit\">\n                                {{\'CHANGE_PASSWORD.SUBMIT\' | translate}}\n                            </button>\n                        </div>\n                    </form>\n                </div>\n                <div class=\"alternative-actions\">\n                    <a class=\"log-in button button-small button-clear button-light\" ui-sref=\"auth.walkthrough\">\n                        {{\'LOGIN_BUTTON\' | translate}}\n                    </a>\n                    <a class=\"sign-up button button-small button-clear button-light\" ui-sref=\"auth.signup\">\n                        {{\'GENERIC.SUPPORT\' | translate}}\n                    </a>\n                </div>\n            </div>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("auth/forgot-password.html","\n<ion-view class=\"forgot-password-view auth-view\" cache-view=\"false\">\n    <ion-content scroll=\"false\">\n        <div class=\"row\">\n            <div class=\"col col-center\">\n                <div class=\"card forgot-password-container\" ng-controller=\"RestorePasswordCtrl\">\n                    <form name=\"restorePasswordForm\" ng-submit=\"doRestorePassword()\" class=\"\" novalidate>\n                        <div class=\"item item-body\">\n                            <label class=\"item item-input\">\n                                <input type=\"text\" placeholder=\"{{\'USERNAME\' | translate}}\" name=\"username\" ng-model=\"username\" required>\n                            </label>\n                        </div>\n                        <label class=\"item item-input\" ng-show=\"!restorePasswordForm.username.$pristine && restorePasswordForm.username.$invalid\">\n                            <p ng-show=\"restorePasswordForm.username.$error.required\">{{\'USERNAME_REQUIRED_VALIDATOR | translate\'}}</p>\n                        </label>\n                        <div class=\"item item-body bottom-content\">\n                            <button type=\"submit\" class=\"button button-positive button-block\"  ng-disabled=\"restorePasswordForm.$invalid\">\n                                {{ \'CHANGE_PASSWORD.RESTORE_SUBMIT\' | translate }}\n                            </button>\n                        </div>\n                    </form>\n                </div>\n                <div class=\"alternative-actions\">\n                    <a class=\"log-in button button-small button-clear button-light\" ui-sref=\"auth.login\">\n                        {{\'LOGIN_BUTTON\' | translate}}\n                    </a>\n                    <a class=\"sign-up button button-small button-clear button-light\" ui-sref=\"auth.signup\">\n                        Sign Up\n                    </a>\n                </div>\n            </div>\n        </div>\n    </ion-content>\n</ion-view>");
$templateCache.put("auth/login.html","<ion-view class=\"login-view auth-view\" cache-view=\"false\">\n  <ion-content scroll=\"false\">\n    <div class=\"row\">\n      <div class=\"col col-center\">\n        <div class=\"card login-container\" content-tabs tabsdata=\'tabsdata\' ng-controller=\"AuthorizationCtrl\">\n          <form name=\"loginForm\" ng-submit=\"doLogin()\" class=\"\" novalidate ng-cloak>\n            <my-tabs>\n              <my-tab title=\"{{\'LOGIN_TITLE\' | translate}}\">\n                <div class=\"list\">\n                  <label class=\"item item-input\">\n                    <input type=\"text\" placeholder=\"{{\'USERNAME\' | translate}}\" name=\"username\" ng-model=\"loginData.UserName\" required>\n                  </label>\n                    <label class=\"item item-input\" ng-show=\"!loginForm.username.$pristine && loginForm.username.$invalid\">\n                        <p ng-show=\"loginForm.username.$error.required\">{{\'USERNAME_REQUIRED_VALIDATOR\' | translate}}</p>\n                    </label>\n                  <label class=\"item item-input\" show-hide-container>\n                    <input type=\"password\" placeholder=\"{{\'PASSWORD\' | translate}}\" name=\"password\" ng-model=\"loginData.Password\" required show-hide-input required>\n                  </label>\n                    <label class=\"item item-input\" ng-show=\"!loginForm.password.$pristine && loginForm.password.$invalid\">\n                        <p ng-show=\"loginForm.password.$error.required\">{{\'PASSWORD_REQUIRED_VALIDATOR\' | translate}}</p>\n                    </label>\n                </div>\n              </my-tab>\n            </my-tabs>\n            <div class=\"item item-body bottom-content\">\n              <button type=\"submit\" class=\"button button-positive button-block\" ng-disabled=\"loginForm.$invalid\">\n                  {{\'LOGIN_BUTTON\' | translate}}\n              </button>\n            </div>\n          </form>\n        </div>\n        <div class=\"alternative-actions\">\n          <a class=\"forgot-password button button-small button-clear button-light\" ui-sref=\"auth.restorepassword\">\n            Forgot Password?\n          </a>\n          <a class=\"sign-up button button-small button-clear button-light\" ui-sref=\"auth.signup\">\n            Sign Up\n          </a>\n        </div>\n      </div>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("auth/restore-password.html","\n<ion-view class=\"forgot-password-view auth-view\" cache-view=\"false\">\n    <ion-content scroll=\"false\">\n        <div class=\"row\">\n            <div class=\"col col-center\">\n                <div class=\"card forgot-password-container\" ng-controller=\"RestorePasswordCtrl\">\n                    <form name=\"restorePasswordForm\" ng-submit=\"doRestorePassword()\" class=\"\" novalidate>\n                        <div class=\"item item-body\">\n                            <label class=\"item item-input\">\n                                <input type=\"text\" placeholder=\"{{\'USERNAME\' | translate}}\" name=\"username\" ng-model=\"username\" required>\n                            </label>\n                        </div>\n                        <label class=\"item item-input\" ng-show=\"!restorePasswordForm.username.$pristine && restorePasswordForm.username.$invalid\">\n                            <p ng-show=\"restorePasswordForm.username.$error.required\">{{\'USERNAME_REQUIRED_VALIDATOR | translate\'}}</p>\n                        </label>\n                        <div class=\"item item-body bottom-content\">\n                            <button type=\"submit\" class=\"button button-positive button-block\"  ng-disabled=\"restorePasswordForm.$invalid\">\n                                {{ \'CHANGE_PASSWORD.RESTORE_SUBMIT\' | translate }}\n                            </button>\n                        </div>\n                    </form>\n                </div>\n                <div class=\"alternative-actions\">\n                    <a class=\"log-in button button-small button-clear button-light\" ui-sref=\"auth.walkthrough\">\n                        {{\'LOGIN_BUTTON\' | translate}}\n                    </a>\n                    <a class=\"sign-up button button-small button-clear button-light\" ui-sref=\"auth.signup\">\n                        Sign Up\n                    </a>\n                </div>\n            </div>\n        </div>\n    </ion-content>\n</ion-view>\n\n");
$templateCache.put("auth/signup.html","<ion-view class=\"signup-view auth-view\" cache-view=\"false\">\n  <ion-content scroll=\"false\">\n    <div class=\"row\">\n      <div class=\"col col-center\">\n        <div class=\"card sign-up-container\" ng-controller=\"AuthorizationCtrl\">\n          <form class=\"\"  name=\"registerForm\" ng-submit=\"doRegister()\" novalidate>\n            <div class=\"item item-body\">\n              <label class=\"item item-input\">\n                  <input placeholder=\"{{\'USERNAME\' | translate}}\" type=\"text\" name=\"UserName\" ng-model=\"registerData.UserName\" ng-change=\"resetValidators(\'UserName\');\" required>\n              </label>\n              <label class=\"item item-input\" ng-show=\"!registerForm.UserName.$pristine && registerForm.UserName.$invalid\">\n                    <p ng-show=\"registerForm.UserName.$error.required\">{{\'USERNAME_REQUIRED_VALIDATOR\' | translate}}</p>\n                    <p ng-show=\"registerForm.UserName.$error.unique\">{{\'USERNAME_NOT_UNIQUE_VALIDATOR\' | translate}}</p>\n              </label>\n              <label class=\"item item-input\" show-hide-container>\n                <input placeholder=\"{{\'PASSWORD\' | translate}}\" type=\"password\" name=\"Password\" ng-model=\"registerData.Password\" ng-change=\"resetValidators(\'Password\');\" ng-minlength=\"6\" ng-maxlength=\"50\" required show-hide-input>\n              </label>\n              <label class=\"item password-complexity row\" ng-show=\"passwordComplexity\">\n                    <div class=\"col\" ng-class=\"passwordComplexity\"></div>\n               </label>\n                <label class=\"item item-input\" ng-show=\"!registerForm.Password.$pristine && registerForm.Password.$invalid\">\n                    <p ng-show=\"registerForm.Password.$error.minlength\">{{\'PASSWORD_MIN_LENGTH_VALIDATOR\' | translate}}</p>\n                    <p ng-show=\"registerForm.Password.$error.maxlength\">{{\'PASSWORD_MAX_LENGTH_VALIDATOR\' | translate}}</p>\n                </label>\n                <label class=\"item item-input\">\n                    <input placeholder=\"{{\'REGISTER.MOBILE\' | translate}}\" type=\"tel\" pattern=\"+[0-9]*\" ng-model=\"registerData.mobile\" required>\n                </label>\n                <label class=\"item item-input\">\n                    <input placeholder=\"{{\'REGISTER.EMAIL\' | translate}}\" type=\"email\" name=\"Email\" ng-model=\"registerData.Emailaddress\" required>\n                </label>\n                <label class=\"item item-input\" ng-show=\"!registerForm.Email.$pristine && registerForm.Email.$invalid\">\n                    <p ng-show=\"registerForm.Email.$error.required\">{{\'EMAIL_REQUIRED_VALIDATOR\' | translate}}</p>\n                </label>\n            </div>\n            <div class=\"item item-body bottom-content\">\n              <button type=\"submit\" class=\"button button-assertive button-block\" ng-disabled=\"registerForm.$invalid\" type=\"submit\">\n                  {{\'REGISTER.SUBMIT_BUTTON\' | translate}}\n              </button>\n            </div>\n          </form>\n        </div>\n        <div class=\"alternative-actions\">\n          <a class=\"log-in button button-small button-clear button-light\" ui-sref=\"auth.login\">\n              {{\'LOGIN_BUTTON\' | translate}}\n          </a>\n        </div>\n      </div>\n    </div>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("auth/walkthrough.html","<ion-view class=\"walkthrough-view\" cache-view=\"false\" ng-controller=\"DashboardCtrl\">\n    <ion-content scroll=\"false\">\n        <div class=\"top-content row\" style=\"height: 65%;\">\n            <div class=\"col col-center\">\n                <h2 style=\"text-align: center; width: 100%; color: white;\">{{\'DASHBOARD.TITLE\' | translate}}</h2>\n\n                <h3 style=\"text-align: center; width: 100%; color: #A9A9A9;\">{{\'DASHBOARD.DESCRIPTION\' | translate}}</h3>\n            </div>\n        </div>\n\n        <div class=\"bottom-content\" style=\"height: 35%;\">\n            <div class=\"row\">\n                <div class=\"col col-center\">\n                    <a class=\"login button button-block button-stable\" ng-controller=\"FacebookCtrl\"\n                       ng-show=\"facebookLoginEnabled\" ng-init=\"facebookAutoLogin()\" ng-click=\"facebookManualLogin()\">\n                        {{\'DASHBOARD.FACEBOOK_LOGIN\' | translate}}\n                    </a>\n                    <a class=\"login button button-block button-stable\" ng-controller=\"TwitterCtrl\"\n                       ng-show=\"twitterLoginEnabled\" ng-click=\"twitterLogin()\">\n                        {{\'DASHBOARD.TWITTER_LOGIN\' | translate}}\n                    </a>\n\n\n                </div>\n\n\n            </div>\n            <div class=\"row\">\n                <div class=\"col col-center\" style=\"text-align: center;\">\n                    <a class=\"button button-small button-clear button-light\" ui-sref=\"auth.login\">\n                        Log In\n                    </a>\n                </div>\n                <div class=\"col col-center\" style=\"text-align: center;\">\n                    <a class=\"button button-small button-clear button-light\" ui-sref=\"auth.signup\">\n                        Sign Up\n                    </a>\n                </div>\n            </div>\n        </div>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("common/ionic-youtube-video.html","<youtube-video video-id=\"videoId\" player=\"yt_video\" player-vars=\"playerVars\"></youtube-video>\n");
$templateCache.put("common/multi-bg.html","<div class=\"multi-bg-outer\" ng-class=\"{ \'finish-loading\': loaded }\">\n	<img bg class=\"multi-bg {{ helperClass }}\" ng-src=\"{{ bg_img }}\"/>\n	<span class=\"bg-overlay\"></span>\n	<ion-spinner ng-show=\"!loaded\" class=\"spinner-on-load\"></ion-spinner>\n	<!-- <span ng-show=\"!loaded\" class=\"spinner-on-load ion-load-c\"></span> -->\n	<ng-transclude></ng-transclude>\n</div>\n");
$templateCache.put("common/my-tab.html","<div class=\"tab-content ng-cloak ng-hide\" ng-cloak ng-show=\"selected\" ng-transclude></div>\n");
$templateCache.put("common/my-tabs.html","<div class=\"item item-divider card-heding\">\n	<div class=\"tabs-striped\">\n		<div class=\"tabs\">\n			<a ng-repeat=\"tab in tabs\" ng-click=\"select(tab)\" ng-class=\"{ active: tab.selected }\" class=\"tab-item\">{{tab.title}}</a>\n		</div>\n	</div>\n</div>\n<div class=\"item item-body\">\n	<div class=\"tabs-content\" ng-transclude></div>\n</div>\n");
$templateCache.put("common/pre-img.html","<div class=\"pre-img {{ratio}} {{ helperClass }}\" ng-class=\"{ \'finish-loading\': loaded }\">\n\n	<!-- <span ng-show=\"!loaded\" class=\"spinner-on-load ion-load-c\"></span> -->\n	<ng-transclude></ng-transclude>\n</div>\n");
$templateCache.put("common/show-hide-password.html","<div class=\"show-hide-input\" ng-transclude>\n</div>\n<a class=\"toggle-view-anchor\" on-touch=\"toggleType($event)\">\n	<span class=\"ion-eye-disabled\" ng-show=\"show\"></span>\n	<span class=\"ion-eye\" ng-show=\"!show\"></span>\n</a>\n");}]);
angular.module('App.directives', [])

.directive('myTabs', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {},
		controller: ['$scope', function($scope) {
			var tabs = $scope.tabs = [];

			$scope.select = function(tab) {
				angular.forEach(tabs, function(tab) {
					tab.selected = false;
				});
				tab.selected = true;
				$scope.$emit('my-tabs-changed', tab);
			};

			this.addTab = function(tab) {
				if (tabs.length === 0) {
					$scope.select(tab);
				}
				tabs.push(tab);
			};
		}],
		templateUrl: 'common/my-tabs.html'
	};
})

.directive('myTab', function() {
	return {
		require: '^myTabs',
		restrict: 'E',
		transclude: true,
		scope: {
			title: '@'
		},
		link: function(scope, element, attrs, tabsCtrl) {
			tabsCtrl.addTab(scope);
		},
		templateUrl: 'common/my-tab.html'
	};
})

.directive('validPin', ['$http', function($http) {
	return {
		require: 'ngModel',
		link: function(scope, ele, attrs, c) {
			scope.$watch(attrs.ngModel, function(pinValue) {
				// $http({
				// 	method: 'POST',
				// 	url: '/api/check/' + attrs.validPin,
				// 	data: {'pin': attrs.validPin}
				// }).success(function(data, status, headers, cfg) {
				// 	c.$setValidity('valid-pin', data.isValid);
				// }).error(function(data, status, headers, cfg) {
				// 	c.$setValidity('valid-pin', false);
				// });
				if(pinValue=="12345")
				{
					c.$setValidity('valid-pin', true);
				}
				else
				{
					c.$setValidity('valid-pin', false);
				}
			});
		}
	};
}])


.directive('showHideContainer', function(){
	return {
		scope: {
		},
		controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
			$scope.show = false;

			$scope.toggleType = function($event){
				$event.stopPropagation();
				$event.preventDefault();

				$scope.show = !$scope.show;

				// Emit event
				$scope.$broadcast("toggle-type", $scope.show);
			};
		}],
		templateUrl: 'common/show-hide-password.html',
		restrict: 'A',
		replace: false,
		transclude: true
	};
})


.directive('showHideInput', function(){
	return {
		scope: {
		},
		link: function(scope, element, attrs) {
			// listen to event
			scope.$on("toggle-type", function(event, show){
				var password_input = element[0],
						input_type = password_input.getAttribute('type');

				if(!show)
				{
					password_input.setAttribute('type', 'password');
				}

				if(show)
				{
					password_input.setAttribute('type', 'text');
				}
			});
		},
		require: '^showHideContainer',
		restrict: 'A',
		replace: false,
		transclude: false
	};
})


.directive('biggerText', ['$ionicGesture', function($ionicGesture) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$ionicGesture.on('touch', function(event){
				event.stopPropagation();
				event.preventDefault();

				var text_element = document.querySelector(attrs.biggerText),
						root_element = document.querySelector(".menu-content"),
						current_size_str = window.getComputedStyle(text_element, null).getPropertyValue('font-size'),
						current_size = parseFloat(current_size_str),
						new_size = Math.min((current_size+2), 24),
						new_size_str = new_size + 'px';

				root_element.classList.remove("post-size-"+current_size_str);
				root_element.classList.add("post-size-"+new_size_str);
			}, element);
		}
	};
}])

.directive('smallerText', ['$ionicGesture', function($ionicGesture) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			$ionicGesture.on('touch', function(event){
				event.stopPropagation();
				event.preventDefault();

				var text_element = document.querySelector(attrs.smallerText),
				root_element = document.querySelector(".menu-content"),
				current_size_str = window.getComputedStyle(text_element, null).getPropertyValue('font-size'),
				current_size = parseFloat(current_size_str),
				new_size = Math.max((current_size-2), 12),
				new_size_str = new_size + 'px';

				root_element.classList.remove("post-size-"+current_size_str);
				root_element.classList.add("post-size-"+new_size_str);
			}, element);
		}
	};
}])

.directive('ionicYoutubeVideo', ['$timeout', '$ionicPlatform', 'youtubeEmbedUtils', function($timeout, $ionicPlatform, youtubeEmbedUtils) {
	return {
		restrict: 'E',
		scope: {
			videoId: '@'
		},
		controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
			$scope.playerVars = {
				rel: 0,
				showinfo: 0
			};
			$ionicPlatform.on("pause", function(){
				var yt_ready = youtubeEmbedUtils.ready;
				if(yt_ready)
				{
					$scope.yt_video.stopVideo();
				}
		  });
		}],
		templateUrl: 'common/ionic-youtube-video.html',
		replace: false
	};
}])

.directive('postContent', ['$timeout', '_', '$compile', function($timeout, _, $compile) {
	return {
		restrict: 'A',
		scope: {},
		link: function(scope, element, attrs) {
			/**
			 * JavaScript function to match (and return) the video Id
			 * of any valid Youtube Url, given as input string.
			 * @author: Stephan Schmitz <eyecatchup@gmail.com>
			 * @url: http://stackoverflow.com/a/10315969/624466
			 */
			//  Ver: https://regex101.com/r/tY9jN6/1
			function ytVidId(url) {
			  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11,})(?:\S+)?$/gmi;
			  return (url.match(p)) ? RegExp.$1 : false;
			}

			$timeout(function(){
				var iframes = element.find('iframe');
				if(iframes.length > 0)
				{
					angular.forEach(iframes, function(i) {

						var iframe = angular.element(i),
								youtube_video_id = ((iframe.length > 0) && (!_.isUndefined(iframe[0].src))) ? ytVidId(iframe[0].src) : false;
						if(youtube_video_id !== false)
						{
							// Then it's a youtube video, compile our custom directive
							var ionic_yt_video = $compile("<ionic-youtube-video video-id='"+youtube_video_id+"'></ionic-youtube-video>")(scope);
        			iframe.parent().append(ionic_yt_video);
							iframe.remove();
						}
					});
				}
			}, 10);
		}
	};
}])

//Use this directive to open external links using inAppBrowser cordova plugin
.directive('dynamicAnchorFix', ['$ionicGesture', '$timeout', '$cordovaInAppBrowser', function($ionicGesture, $timeout, $cordovaInAppBrowser) {
	return {
		scope: {},
		link: function(scope, element, attrs) {
			$timeout(function(){
				var anchors = element.find('a');
				if(anchors.length > 0)
				{
					angular.forEach(anchors, function(a) {

						var anchor = angular.element(a);

						anchor.bind('click', function (event) {
							event.preventDefault();
							event.stopPropagation();

							var href = event.currentTarget.href;
							var	options = {};

							//inAppBrowser see documentation here: http://ngcordova.com/docs/plugins/inAppBrowser/

							$cordovaInAppBrowser.open(href, '_blank', options)
								.then(function(e) {
									// success
								})
								.catch(function(e) {
									// error
								});
						});

					});
				}
			}, 10);
		},
		restrict: 'A',
		replace: false,
		transclude: false
	};
}])


.directive('multiBg', ['_', function(_){
	return {
		scope: {
			multiBg: '=',
			interval: '=',
			helperClass: '@'
		},
		controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {

			$scope.loaded = false;
			var utils = this;

			this.animateBg = function(){
				// Think i have to use apply because this function is not called from this controller ($scope)
				$scope.$apply(function () {
					$scope.loaded = true;
					$element.css({'background-image': 'url(' + $scope.bg_img + ')'});
				});
			};

			this.setBackground = function(bg) {
				$scope.bg_img = bg;
			};

			if(!_.isUndefined($scope.multiBg))
			{
				if(_.isArray($scope.multiBg) && ($scope.multiBg.length > 1) && !_.isUndefined($scope.interval) && _.isNumber($scope.interval))
				{
					// Then we need to loop through the bg images
					utils.setBackground($scope.multiBg[0]);
				}
				else
				{
					// Then just set the multiBg image as background image
					utils.setBackground($scope.multiBg[0]);
				}
			}
		}],
		templateUrl: 'common/multi-bg.html',
		restrict: 'A',
		replace: true,
		transclude: true
	};
}])


.directive('bg', function() {
	return {
		restrict: 'A',
		require: '^multiBg',
		scope: {
			ngSrc: '@'
		},
		link: function(scope, element, attr, multiBgController) {
			element.on('load', function() {
				multiBgController.animateBg();
		  });
		}
	};
})

.directive('preImg', function() {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			ratio:'@',
			helperClass: '@'
		},
		controller: ['$scope', function($scope) {
			$scope.loaded = false;

			this.hideSpinner = function(){
				// Think i have to use apply because this function is not called from this controller ($scope)
				$scope.$apply(function () {
					$scope.loaded = true;
				});
			};
		}],
		templateUrl: 'common/pre-img.html'
	};
})

.directive('spinnerOnLoad', function() {
	return {
		restrict: 'A',
		require: '^preImg',
		scope: {
			ngSrc: '@'
		},
		link: function(scope, element, attr, preImgController) {
			element.on('load', function() {
				preImgController.hideSpinner();
		  });

            element.bind('error', function(){
                preImgController.hideSpinner();
            });
		}
	};
})


;

angular.module('App.services', []);

var services = angular.module('App.services');

services.filter('Filename', function () {
    return function(path){
        return path.substring(0, path.length - 4);
    };
});


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
        if (!config.headers.Authorization) {
            var access_token = LocalDataService.getBaseToken();
            if (access_token) {
                config.headers.Authorization = access_token;
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
            if(!username || !password){
                $log.error('trying to generate token with empty credentials');
            }
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
        INTRO_VISITED  : "intro_visited",
        EMAIL_APP_AVAILABLE : "email_app"
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
        'addPhoto' : function(name, url, message){
            var photos = JSON.parse(localStorageService.get(data_keys.PHOTO_LIBRARY) || '[]');

            photos.push(
                {"name" : name, "url" : url, "message" : message}
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
        },
        'setEmailApp': function (available) {
            localStorageService.set(data_keys.EMAIL_APP_AVAILABLE, available);
        },
        'hasEmailApp': function () {
            return localStorageService.get(data_keys.EMAIL_APP_AVAILABLE);
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
        'searchByTwitterAccount': function (username) {
            $log.info('search user by twitter account: ' + username);


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
        'searchByUsername': function (username) {
            $log.info('search user by username: ' + username);


            var url = api.byName('base-url') + api.byName('user-url');
            var defer = $q.defer();


            var params = {};
            params = {
                where: '{"UserName": "' + username + '"}'
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
                    defer.resolve(resp[0]);
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
                    defer.resolve(resp[0]);
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

        },
        'changePassword' : function(key, newPassword){
            $log.info('change password');

            var url =  api.byName('base-url') + api.byName('change-password-url');
            var defer = $q.defer();

            var params = {
                'key' : key,
                'password' : newPassword
            };

            $http.post(url, params).then(
                function(success){
                   defer.resolve(success);
                },
                function(err){
                   defer.resolve(err);
                }
            );

            return defer.promise;
        }

    };
}]);
var services = angular.module('App.services');

services.service('LoginService', ['$http', '$q', '$log', 'api', 'LocalDataService', function ($http, $q, $log, api, LocalDataService) {
    return {
        'autoLogin' : function(){
            $log.info('auto login using basic token');

            var defer = $q.defer();
            var token = LocalDataService.getBaseToken();

            if(!token){
                defer.reject();
            }
            var url = api.byName('base-url') + api.byName('login-url');



            $http.post(url)
                .success(function (resp) {
                    defer.resolve(resp);
                })
                .error(function (err) {

                    defer.reject(err);
                });
            return defer.promise;

         },
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


            var params = {
                'sort' : 'orgName ASC',
                'where' : '{"activeInApp" : "X"}'
            };
            if(searchText !== undefined && searchText.length > 0){
               params = {
                   where : '{"orgName":{"startsWith":"'+searchText+'"}, "activeInApp" : "X"}'

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
        },
        'getOptionsTree' : function(organizationID){
            $log.info('load options:  organization' + organizationID );

            var url = api.byName('base-url') + api.byName('routing-tree-url');
            var defer = $q.defer();


            var params = {
                OrgID: organizationID
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
            'loadMessage' : function(messageID){
                $log.info('load message details ' + messageID);

                var url = api.byName('base-url') + api.byName('message-url') + '/' + messageID;
                var defer = $q.defer();


                $http.get(url)
                    .success(function (resp) {
                        defer.resolve(resp);
                    })
                    .error(function (err) {
                        defer.reject(err);
                    });
                return defer.promise;
            },
            'getMessagesByUser': function (userID, orgID) {
                $log.info('load messages for user: ' + userID);

                var url = api.byName('base-url') + api.byName('message-url');
                var defer = $q.defer();


                var params = {};
                if (userID !== undefined) {
                    params = {
                        'UserID': userID,
                        'sort' : 'createdAt DESC'
                    };
                }

                if(orgID){
                    params.OrgID = orgID;
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
                        'userID': userID
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
            'getMessageDetails' : function(messageID){
                $log.info('load message details for: ' + messageID);

                var url = api.byName('base-url') + api.byName('message-tree-url');
                var defer = $q.defer();


                var params = {
                    'MessageID': messageID
                };

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
            'updateMessageNote' : function(message){
                $log.info('update message note' + message.Notes);

                var url = api.byName('base-url') + api.byName('message-url') + api.byName('update') + '/' + message.id;

                var defer = $q.defer();

                var data = {
                    'Notes': message.Notes
                };

                $http.put(url, data)
                    .success(function (resp) {
                        defer.resolve(resp[0]);
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

            var pause = null;

            var lastRouting = routings[routings.length - 1];
            if (routings.length > 0 && lastRouting.AltInitialPause !== null) {
                pause = lastRouting.AltInitialPause;
            }
            else {
                pause = organization.initialpause;
            }


            if (pause !== null) {
                $log.info('add initial pause ' + pause);
                for (i = 0; i < pause; i++) {
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

services.service('NetworkService', ['$ionicPlatform', '$rootScope', '$log', '$ionicPopup', '$cordovaNetwork', '$templateCache', '$ionicModal', 'LocalDataService', function( $ionicPlatform, $rootScope, $log, $ionicPopup, $cordovaNetwork, $templateCache,  $ionicModal,LocalDataService)
{
    var modal ;
    var showOfflineView = function(){
        modal = $ionicModal.fromTemplate($templateCache.get('no-internet.html'));
        modal.show();
    };

    var closeOffline = function() {
        if(modal){
            modal.hide();
            modal.remove();
        }
    };


    return {
        'checkNetworkState' : function(){
            var type = $cordovaNetwork.getNetwork();
            var isOnline = $cordovaNetwork.isOnline();
            $log.info('network type: ' + type);

            LocalDataService.setNetworkState(isOnline);
            LocalDataService.setNetworkType(type);

            if(!isOnline){
                showOfflineView();
            }
            else {
                closeOffline();
            }


            // listen for Online event
            $rootScope.$on('networkOnline', function(event, networkState){
                var onlineState = networkState;
                LocalDataService.setNetworkState(onlineState);

                showOfflineView();
            });

            // listen for Offline event
            $rootScope.$on('networkOffline', function(event, networkState){
                LocalDataService.setNetworkState(networkState);

                closeOffline();

            });

        }
    };


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

services.service('FacebookService', ['$q', '$log', '$state', 'UserService', 'LocalDataService', 'BasicAuthorizationService', function ($q, $log, $state, UserService, LocalDataService, BasicAuthorizationService) {


    var autoLogin = function(){
           $log.info('try to auto login');
           var localUser = LocalDataService.getFacebookResponse();
           if(localUser && localUser.accessToken){
                getLoginStatus().then(function(success){
                    if (success.status === 'connected') {
                        $log.info('auto logged in via facebook', localUser);

                        var username = localUser.email;
                        var password = "facebook " + localUser.accessToken;
                        BasicAuthorizationService.generateToken(username, password);

                        $state.go('app.search');
                    }
                }, function(err){
                      $log.error("facebook auto login failed", err);
                });
           }
    };


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
                                if (emailMapedUsers.length === 0) {
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
        saveUser: saveUser,
        autoLogin : autoLogin
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
                cameraDirection: 0,
                saveToPhotoAlbum: true
            };

            $cordovaCamera.getPicture(options).then(
                function (fileURI) {

                   defer.resolve(fileURI);




                },
                function (err) {
                    $log.error('failed to capture image', err);
                    defer.reject(err);
                }
            );

            return defer.promise;
        },
        'moveFile' : function(fileURI, filename, messageID){
            var defer = $q.defer();
            //Grab the file name of the photo in the temporary directory
            var currentName = fileURI.replace(/^.*[\\\/]/, '');



            var newFileName = filename + ".jpg";

            var targetDir = cordova.file.dataDirectory + dirName;
            var sourceDir = fileURI.substring(0, fileURI.lastIndexOf("/"));


            $cordovaFile.moveFile(sourceDir, currentName, targetDir , newFileName).then(function (success) {
                var url = success.nativeURL;
                LocalDataService.addPhoto(newFileName, success.nativeURL, messageID);

                $log.debug('moved file from temp location to ', url);
                defer.resolve(url);

            }, function (error) {
                $log.error('failed to move file from temp location', JSON.stringify(error));
                defer.reject(error);
            });

            return defer.promise;
        }
    };
}]);
var services = angular.module('App.services');

services.service('EmailService', ['$ionicPlatform', '$log', '$cordovaFile', 'LocalDataService', function($ionicPlatform, $log, $cordovaFile, LocalDataService) {
    return {
        'checkEmailApp' : function(){
            $log.info('check email availability');

            if(window.cordova){
                cordova.plugins.email.isAvailable(
                    function (isAvailable) {
                        LocalDataService.setEmailApp(isAvailable);
                    }
                );
            }
        },
        'sendEmail' : function(){
            $log.info('send an email');




            var photos = LocalDataService.getPhotos();
            var url = photos[0].url;

            var name = url.substr(url.lastIndexOf('/') + 1);
            var folder = url.substr(0, url.lastIndexOf('/'));
            var trueOrigin = cordova.file.dataDirectory + name;


            var path = url.replace('file://', '');

            alert(url);
            $log.info(folder);
            $log.info(name);

            $cordovaFile.checkFile(folder, name).then(
                function(success){
                    $log.debug('exist', success);

                    cordova.plugins.email.open({
                        to:      'marykiselova@gmail.com',
                        attachments : [path],
                        subject: 'Hi, it s me again',
                        body:    'How are you?'
                    });
                },
                function(error) {
                    $log.debug('exist', error);

                }
            );



        }


    };

}]);
var services = angular.module('App.services');

services.service('SupportService', ['$http', '$q', '$log', 'api', function ($http, $q, $log, api) {
        return {
            'submitSupport': function (action, username, description, messageID) {
                $log.info('create support: ' +  action + ' from '+ username);


                var url = api.byName('base-url') + api.byName('support-url');

                var defer = $q.defer();

                var data = {
                    "action" : action,
                    "userName" : username,
                    "description" : description,
                    "messageID" : messageID
                };



                $http.post(url, data)
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
    'routing-tree-url' :       '/wrppr_routing_tree',

    //users
    'user-url' :                '/wrppr_users',
    'change-password-url':      '/wrppr_pwRenew',

    //messages
    'message-url':              '/wrppr_messages',
    'message-tree-url':         '/wrppr_message_tree',
    'companies-messages-url':   '/wrppr_numMessPerOrg',

    //support
    'support-url':              '/wrppr_support',

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

    .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$window', '$log', '$ionicPlatform', '$ionicModal', '$ionicPopup', '$ionicLoading', '$ionicHistory', '$q', '$ionicActionSheet', '$templateCache', '$translate', '$timeout', 'BasicAuthorizationService', 'UserService', '$cordovaOauth', 'api', '$http', 'LocalDataService', 'NetworkService', 'SupportService', function ($scope, $rootScope, $state, $window, $log, $ionicPlatform, $ionicModal, $ionicPopup, $ionicLoading, $ionicHistory, $q, $ionicActionSheet, $templateCache, $translate, $timeout, BasicAuthorizationService, UserService, $cordovaOauth,  api, $http, LocalDataService, NetworkService, SupportService) {

        $rootScope.debugMode = false;


        $rootScope.sessionData = {};

        // company styling
        $scope.$on('$ionicView.beforeEnter', function() {
            if($rootScope.sessionData.organization){
                if($rootScope.sessionData.organization.BrandingColor1 !== null){
                    $rootScope.brandingColor = $rootScope.sessionData.organization.BrandingColor1;
                }
                else {
                    $rootScope.brandingColor = '#00CCFF';
                }

                if($rootScope.sessionData.organization.BrandingColor2 !== null){
                    $rootScope.brandingColor2 = $rootScope.sessionData.organization.BrandingColor2;
                }
                else {
                    $rootScope.brandingColor2 = '#00CCFF';
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

            $state.go('auth.walkthrough');

        };

        $scope.$on('serverdown', function(){
            $ionicPopup.alert({
                title: $translate.instant("GENERIC.SERVER_ERROR_TITLE"),
                template: $translate.instant("GENERIC.SERVER_ERROR_TEXT")
            });
        });

        $scope.$on('unauthorized', function(){
            $log.info('unauthorized, redirect to root');
            if($state.current.name.indexOf('app') > -1){
                $state.go('auth.walkthrough');
            }
        });


        $scope.refreshNetworkState = function(){
            NetworkService.checkNetworkState();
        };


        $scope.openSupport = function(){
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text : "User correct"},
                    { text : "Support"},
                    { text : "Feedback"}

                ],
                titleText: 'Feedback',
                cancelText: 'Cancel',
                buttonClicked: function (index) {
                    if(index === 0){
                        $scope.showUserCorrect();
                    }
                    else if(index === 1){
                        $scope.mailSupport();
                    }
                    else if(index === 2){
                        $scope.mailFeedback();
                    }



                    return true;
                }
            });
        };


        $scope.mailFeedback = function () {
            $scope.modal = $ionicModal.fromTemplate($templateCache.get('user-feedback.html'), {
                scope: $scope
            });
            $scope.modal.show();
        };

        $scope.mailSupport = function () {
            $scope.modal = $ionicModal.fromTemplate($templateCache.get('user-support.html'), {
                scope: $scope
            });
            $scope.modal.show();
        };

        $scope.showUserCorrect = function () {
            $scope.modal = $ionicModal.fromTemplate($templateCache.get('user-correct.html'), {
                scope: $scope
            });
            $scope.modal.show();
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove();
        };



        $scope.submitUserCorrect = function (action, comment) {
            $log.info(comment);
            $log.debug('support message details', $rootScope.supportMessage);

            $ionicLoading.show({
                template: "Submitting"
            });

            var user = LocalDataService.loadUser();
            if($rootScope.supportMessage){
                $scope.messageID = $rootScope.supportMessage.id.toString();

            }

            SupportService.submitSupport(action, user.UserName, comment, $scope.messageID).then(
                function(success){
                    $ionicLoading.hide();

                    $ionicPopup.alert({
                        title: "Support",
                        template : "Thanks, you message send. We will contact you soon."
                    });
                    $scope.closeModal();

                    $rootScope.supportMessage = {};

                },
                function(err){
                    $ionicLoading.hide();

                    $log.error("failed to submit user correct", err);
                    $ionicPopup.alert({
                        title: "Failed",
                        template: err
                    });

                    $rootScope.supportMessage = {};
                }
            );

        };


        //rating
        $scope.isRated = false;

        $scope.requestRating = function(){
            $scope.modal = $ionicModal.fromTemplate($templateCache.get('rating.html'), {
                scope: $scope
            });
            $scope.modal.show();
        };

        $scope.$on('rating', function(){
            $log.info('show rating screen');
            $scope.requestRating();
        });


        $scope.ratePositive = function(){
            $log.info('rate positive');

            $scope.isRated = true;

            $timeout($scope.closeRating, 1000);

        };

        $scope.rateNegative = function(){
            $log.info('rate negative');

            $scope.isRated = true;
            $timeout($scope.closeRating, 1000);
        };

        $scope.closeRating = function(){
            $scope.isRated = false;
            $scope.closeModal();
        };



    }]);


var controllers = angular.module('App.controllers');

controllers.controller('OptionsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$ionicLoading', '$ionicHistory', '$ionicPopup', '$translate', 'OptionService', function ($scope, $rootScope, $state, $stateParams, $log, $ionicLoading, $ionicHistory, $ionicPopup, $translate, OptionService) {
    $log.debug('init options controller', $rootScope.sessionData.options);

    $scope.showOptions = true;
    $scope.organizationDetails = {};


    $rootScope.$ionicGoBack = function () {

        // before go back remove  from options
        if ($state.is('app.options')) {
            $rootScope.sessionData.options.pop();
        }
        $ionicHistory.goBack();
    };

    $scope.options = [

    ];



    $scope.filtered = [];
    $scope.recursiveFilter = function(items,id){
        angular.forEach(items,function(item){
            if(item.NodeID === id){
               $scope.filtered.push(item);
            }
            if(angular.isArray(item.children) && item.children.length > 0){
                $scope.recursiveFilter(item.children,id);
            }
        });
    };

    $scope.load = function () {




        if ($stateParams.parentID === "0") {
            $scope.options = $rootScope.organizationDetails.routes;
        }
        else {
           $scope.recursiveFilter($rootScope.organizationDetails.routes, $stateParams.parentID);
           $log.info('found parent node' , $scope.filtered);

           $scope.options = [];
           if($scope.filtered.length > 0){
            $scope.options = $scope.filtered[0].children;
           }



        }

        // if no options redirect to actions
        if ($scope.options.length === 0) {
            $scope.showOptions = false;
        }
        else {
            $scope.showOptions = true;
        }




        /*OptionService.getOptions($stateParams.orgID, $stateParams.parentID).then(function (response) {
                $scope.options = response;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');

                // if no options redirect to actions
                if ($scope.options.length === 0) {
                    $scope.showOptions = false;
                }
                else {
                    $scope.showOptions = true;
                }

            },
            function (err) {
                $ionicPopup.alert({
                    title: $translate.instant("ROUTING.FAILED"),
                    template: err
                });
            }); */
    };


    $scope.currentOrganization = $stateParams.orgName;

    $scope.selectOption = function (option) {
        $log.info('selected option ' + option);

        $rootScope.sessionData.options.push(option);

        $state.go('app.options', { 'orgID': $stateParams.orgID, 'parentID': option.NodeID});
    };

}]);

var controllers = angular.module('App.controllers');

controllers.controller('AuthorizationCtrl', ['$scope', '$rootScope', '$ionicLoading', '$ionicModal', '$ionicPopup', '$state', '$log', '$stateParams', '$translate', 'LoginService', 'BasicAuthorizationService', 'UserService', 'PasswordComplexity', 'LocalDataService', function ($scope, $rootScope, $ionicLoading, $ionicModal, $ionicPopup, $state, $log, $stateParams, $translate, LoginService, BasicAuthorizationService, UserService, PasswordComplexity, LocalDataService) {
    $log.info('init auth controller');


    $scope.registerData = {};
    $scope.loginData = {};

    $scope.passwordComplexity = "";

    $scope.loginSubmitted = false;

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        $log.info('doing login', $scope.loginData);

        $ionicLoading.show({
            template: $translate.instant("LOGIN.LOADING")
        });


        LoginService.login($scope.loginData).then(function (loginResponse) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');


                if (loginResponse.wrppr_users === false) {
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

                $rootScope.currentUsername = $scope.loginData.UserName;


                $scope.resetLoginForm();
                $state.go('app.search');

            },
            function (err) {
                $ionicLoading.hide();
                $log.error('failed to login', err);

                $ionicPopup.alert({
                    title: $translate.instant("LOGIN.FAILED"),
                    template: err
                });

            });


    };

    $scope.resetLoginForm = function () {
        $scope.loginData.UserName = "";
        $scope.loginData.Password = "";


        $scope.loginForm.$setPristine();
        $scope.loginForm.$setUntouched();
    };


    $scope.doRegister = function () {
        $log.info('start registration');

        $ionicLoading.show({
            template: $translate.instant("REGISTER.LOADING")
        });

        UserService.createUser($scope.registerData).then(function (response) {
            BasicAuthorizationService.generateToken($scope.registerData.UserName, $scope.registerData.Password);

            var user = response;
            LocalDataService.saveUser(user);


            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.resetRegisterForm();


            $state.go('app.search');

        }, function (error) {
            $ionicLoading.hide();

            if (error.error === "E_VALIDATION") {
                for (var attribute in error.invalidAttributes) {
                    var inputKey = attribute.replace(/"/g, "");

                    var validators = error.invalidAttributes[attribute];
                    for (var validatorIndex in validators) {
                        $scope.registerForm[inputKey].$setValidity(validators[validatorIndex].rule, false);
                    }

                }

            }

            $ionicPopup.alert({
                title: $translate.instant("REGISTER.FAILED"),
                template: error.message
            });
        });
    };

    $scope.resetRegisterForm = function () {
        $scope.registerData = {};


        $scope.registerForm.$setPristine();
        $scope.registerForm.$setUntouched();
    };


    $scope.resetValidators = function (fieldName) {
        $scope.registerForm[fieldName].$setValidity('unique', true);
        $scope.registerForm[fieldName].$setValidity('minLength', true);
    };


    $scope.$watch('registerData.Password', function (password) {
        var complexity = PasswordComplexity.check(password);
        $scope.passwordComplexity = complexity;

    });


}]);





var controllers = angular.module('App.controllers');

controllers.controller('RestorePasswordCtrl', ['$scope', '$state', '$stateParams', '$log', '$ionicLoading', '$ionicPopup', 'LoginService', 'PasswordComplexity', 'UserService', function ($scope, $state, $stateParams,  $log, $ionicLoading, $ionicPopup, LoginService, PasswordComplexity, UserService) {
    $log.info('init restore password controller');
    $scope.newPassword = "";
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

            $state.go('auth.walkthrough');

        }, function (error) {
            $ionicLoading.hide();

            var message = error;
            if(error.message){
                message = error.message;
            }

            $ionicPopup.alert({
                title: 'Failed to restore',
                template: message
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
        $ionicLoading.show({
            template: 'Saving ..'
        });

        $log.info('change password');

        var key = $stateParams.key;

        UserService.changePassword(key,  $scope.newPassword).then(
            function(success){
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: 'Password saved',
                    template: 'Try to login with new password'
                });

                $state.go('auth.walkthrough');
            },
            function(err){
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: 'Failed to change password',
                    template: 'Please try again'
                });
            }
        );


    };
}]);

var controllers = angular.module('App.controllers');

controllers.controller('DashboardCtrl', ['$scope', '$log', 'LocalDataService', function ($scope, $log, LocalDataService) {
    $log.info('init dashboard controller');


}]);
var controllers = angular.module('App.controllers');

controllers.controller('OrganizationsCtrl', ['$scope', '$rootScope', '$ionicLoading', '$ionicModal', '$templateCache', '$state', '$log', 'OrganizationService', 'LocalDataService', 'OptionService', function ($scope, $rootScope, $ionicLoading, $ionicModal, $templateCache, $state, $log, OrganizationService, LocalDataService, OptionService) {
    $log.info('init organizations controller');
    $scope.introVisited = LocalDataService.getIntroScreenVisited();


    $scope.showIntro = function () {
        var user = LocalDataService.loadUser();

        $scope.userName = user.UserName;

        $scope.modal = $ionicModal.fromTemplate($templateCache.get('intro.html'), {
            scope: $scope
        });
        $scope.modal.show();
    };



    $scope.$on('$ionicView.enter', function () {
        if(!$scope.introVisited){
            $scope.showIntro();
        }

    });



    $scope.hideIntro = function(){
        LocalDataService.setIntroScreenVisited(true);
        $scope.introVisited = true;
        $scope.modal.hide();
        $scope.modal.remove();
    };


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

        },
        function(error){
            $log.error('Failed to load organizations', error);
            $ionicLoading.hide();
            $scope.isLoading = false;



        }
        );
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

        OptionService.getOptionsTree(organization.id).then(
            function (success) {
                $log.info('loaded org details');
                $rootScope.organizationDetails = success;

                $state.go('app.options', { 'orgID' : organization.id , 'parentID' : 0});
                $ionicLoading.hide();

            }, function (err) {
                $log.error('failed to load organization details');
            });




    };

    $scope.$watch('search.model', function(newVal, oldVal){
        // wait till prev load done
        if($scope.isLoading){
            $log.debug('skipped loading organization, prev is not done');
            return;
        }

        $log.info('search organization model changed: ' + newVal + oldVal);
        $scope.reload(newVal);
    });



}]);

var controllers = angular.module('App.controllers');


controllers.controller('ActionCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$window', '$ionicPlatform', '$ionicPopup', '$log', '$translate', '$ionicLoading', '$ionicModal', '$templateCache', '$ionicActionSheet', '$timeout', 'LocalDataService', 'MessageService', 'UserService', 'DTMFService', '$cordovaContacts', 'OrganizationService', function ($scope, $rootScope, $state, $stateParams, $window, $ionicPlatform, $ionicPopup, $log, $translate, $ionicLoading, $ionicModal, $templateCache, $ionicActionSheet, $timeout, LocalDataService, MessageService, UserService, DTMFService, $cordovaContacts, OrganizationService) {
    $log.debug('init action controller');

    $scope.$on('$ionicView.beforeLeave', function () {
        $rootScope.supportMessage = {};

    });


    $scope.init = function(){
        $rootScope.supportMessage = {};
        $scope.currentOrganization = {};
        $scope.hasWebpage = false;
        $rootScope.showUserCorrect = false;



        if (!$rootScope.sessionData.organization) {
            $log.info('organization not selected, redirects to organization search');
            $state.go('app.organizations');
        }
        else {
            $scope.currentOrganization = $rootScope.sessionData.organization;
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

            $scope.hasWebpage = false;
            $scope.generalWebpage = $rootScope.sessionData.organization.GeneralWebsite;

            $scope.selfServiceWebpage = null;
            $scope.communityWebpage = null;

            if($scope.currentOptions.length > 0){

                var lastRouting = $scope.currentOptions[$scope.currentOptions.length - 1];
                $scope.generalWebpage = lastRouting.GeneralInformation;
                $scope.selfServiceWebpage = lastRouting.SelfService;
                $scope.communityWebpage = lastRouting.Community;

            }


            if($scope.generalWebpage || $scope.selfServiceWebpage || $scope.communityWebpage){
                $scope.hasWebpage = true;
            }

        }

    };



    $scope.call = function () {

        $log.info('make a call');



        var opts = {
            filter: $translate.instant("CONTACT_NAME"),
            multiple: true,
            fields: [ 'displayName', 'name' ],
            desiredFields: ['id']
        };

        var number = DTMFService.createNumber($rootScope.sessionData.organization, $scope.currentOptions);
        if (window.cordova) {
            $ionicLoading.show({
                template: $translate.instant("ACTIONS.CALL_PROCESS")
            });

            $cordovaContacts.find(opts).then(function (contactsFound) {

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

                            alert('failed to save wrapper contact');
                            $scope.makeCallViaURL(number);
                        });
                    }
                    else {
                        var contact =
                        {
                            "displayName": $translate.instant("CONTACT_NAME"),
                            "phoneNumbers": [phoneNumber]
                        };


                        $cordovaContacts.save(contact).then(function (result) {
                            $log.info('added wrapper contact number');
                            $scope.makeCall(number);
                            $ionicLoading.hide();
                        }, function (error) {
                            $log.error('failed to save wrapper contact', err);

                            $ionicLoading.hide();
                            $scope.makeCallViaURL(number);
                        });
                    }
                },
                function (err) {

                    $log.error('failed to find wrapper contact', err);

                    $ionicLoading.hide();
                    $scope.makeCallViaURL(number);
                });
        }
        else {
            // if contacts is not availble still make a call
            $scope.makeCallViaURL(number);
        }


        $scope.logAction($scope.actionMessages.CALL);


    };

    $scope.makeCall = function (number) {

        window.plugins.CallNumber.callNumber(
            function (success) {
                $log.info('finish call', success);
                $rootScope.$broadcast('rating');
            },

            function (err) {
                $log.error('failed call', err);
                $ionicPopup.alert({
                    title: $translate.instant("ACTIONS.CALL_FAILED"),
                    template : err
                });
                $scope.makeCallViaURL(number);
            },
            number,
            false);
    };

    $scope.makeCallViaURL = function(number){
       $log.debug('call via url');

       window.open('tel:' +number ,'_system');
       $rootScope.$broadcast('rating');
    };

    $scope.mail = function () {
        //EmailService.sendEmail();

        $log.info('send an email');
        $scope.logAction($scope.actionMessages.MAIL);

        var body = $translate.instant("MAIL.BODY", { "company": $rootScope.sessionData.organization.orgName});

        var url = 'mailto:' + $scope.contacts.email + '?subject=' + $translate.instant("MAIL.SUBJECT") + "&body=" + body;
        window.open(url,'_system');

        $rootScope.$broadcast('rating');

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
        $rootScope.$broadcast('rating');
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
        MessageService.createMessage(message).then(function(message){
            $rootScope.showUserCorrect = true;
            $rootScope.supportMessage = message;

            $rootScope.reloadFavorites = true;
            $rootScope.reloadMessages = true;

        }, function(err){
            $log.error('failed to save a message', err);
            $ionicPopup.alert({
                title: $translate.instant("ACTIONS.MESSAGE_SAVE_FAIL"),
                template : err
            });
        });

    };

    $scope.webpage = function () {

        var buttons = [];
        if ($scope.generalWebpage) {
            buttons.push({ text: $translate.instant("ACTIONS.WEBPAGE_GENERAL"), url: $scope.generalWebpage });
        }

        if ($scope.selfServiceWebpage) {
            buttons.push({ text: $translate.instant("ACTIONS.WEBPAGE_SELF_SERVICE"), url: $scope.selfServiceWebpage});
        }

        if ($scope.communityWebpage) {
            buttons.push({ text: "ACTIONS.WEBPAGE_COMMUNITY", url: $scope.communityWebpage });
        }

        if(buttons.length === 0){

        }
        // redirect without actions sheet
        else if (buttons.length === 1) {
            var url = buttons[0].url;

            $log.debug('try to open url ', url);
            window.open(url, '_system', 'location=yes');
        }
        else {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: buttons,
                titleText: $translate.instant("ACTIONS.WEBPAGE"),
                cancelText: $translate.instant("GENERIC.CANCEL"),
                buttonClicked: function (index) {
                    var url = buttons[index].url;
                    $log.debug('try to open url ', url);

                    window.open(url, '_system', 'location=yes');

                    return true;
                }
            });

        }


    };


}]);

var controllers = angular.module('App.controllers');

controllers.controller('UserCtrl', ['$scope', '$rootScope', '$log', '$translate', '$ionicLoading', 'UserService', 'LocalDataService', function ($scope, $rootScope, $log, $translate, $ionicLoading,  UserService, LocalDataService) {

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
        $scope.emailApp = LocalDataService.hasEmailApp();


        if($scope.localUser.id){
            $scope.loadUserDetails($scope.localUser.id);
        }
    };

    $scope.load();
    $scope.$on('$ionicView.enter', function(){$scope.load();});

    $scope.switchLanguage = function(){
        $log.info('switch to english');
        $translate.use("en");

        $ionicLoading.show({
            template: 'Switching language ...'
        });
        $translate.refresh();

    };

    $rootScope.$on('$translateRefreshEnd', function () {

        $ionicLoading.hide();
    });

}]);



var controllers = angular.module('App.controllers');

controllers.controller('FacebookCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicPlatform', '$q', '$log', '$ionicLoading', '$ionicPopup', '$http', '$cordovaOauth', '$translate', 'UserService', 'BasicAuthorizationService', 'LocalDataService', 'FacebookService', function ($scope, $rootScope, $state, $stateParams, $ionicPlatform, $q, $log, $ionicLoading, $ionicPopup, $http, $cordovaOauth, $translate, UserService, BasicAuthorizationService, LocalDataService, FacebookService) {
    $scope.facebookLoginEnabled = window.cordova;

    $scope.facebookManualLogin = function () {
        $ionicLoading.show({
            template: $translate.instant("FACEBOOK.LOADING")
        });

        FacebookService.getLoginStatus().then(
            function (success) {
                if (success.status === 'connected') {
                    var accessToken = success.authResponse.accessToken;

                    FacebookService.getProfileInfo(accessToken).then(function (profileSuccess) {

                        // sync with local user
                        FacebookService.saveUser(profileSuccess, accessToken).then(function (saveSuccess) {
                            var user = saveSuccess;
                            $scope.updateLocalStorage(user, profileSuccess, accessToken);
                            $ionicLoading.hide();

                        }, function (saveError) {
                            $log.error('failed to save profile info');
                            $ionicLoading.hide();

                            $ionicPopup.alert({
                                title: $translate.instant("FACEBOOK.FAILED")
                            });
                        });

                    }, function (error) {
                        $log.error('failed to get profile info');
                        $ionicLoading.hide();

                        $ionicPopup.alert({
                            title: $translate.instant("FACEBOOK.FAILED")
                        });
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

                    $ionicPopup.alert({
                        title: $translate.instant("FACEBOOK.FAILED"),
                        template: error
                    });
                });

        }, function (error) {
            $log.error('failed to get profile info');
            $ionicLoading.hide();

            $ionicPopup.alert({
                title: $translate.instant("FACEBOOK.FAILED"),
                template: error
            });
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

        $state.go('app.search');


    };


}]);

var controllers = angular.module('App.controllers');

controllers.controller('TwitterCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicLoading', '$ionicPlatform', '$log', '$cordovaOauth', 'localStorageService', 'UserService', 'BasicAuthorizationService', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $ionicPlatform, $log, $cordovaOauth, localStorageService, UserService, BasicAuthorizationService) {
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

            $log.debug('twitter login success', result);

            var twitterName = result.screen_name;
            var twitterToken = result.oauth_token;

            UserService.searchByTwitterAccount(twitterName).then(function(users){
                if(users.length > 0){
                    $log.info('found user with same twitter account', users);

                    $scope.updateToken(users[0], twitterToken);
                    //fixme update token

                }
                else {
                    UserService.searchByUsername(twitterName).then(
                        function(usersWithUsername){
                            if(usersWithUsername.length > 0){
                                $scope.updateToken(usersWithUsername[0], twitterToken);
                            }
                            else {
                                //fixme create user
                                var user = {
                                    'UserName' :  twitterName,
                                    'TwitterAccount' :  twitterName,
                                    'TwitterOauthToken' :  twitterToken
                                };

                                UserService.createUser(user).then(
                                    function(createdUser){
                                         $scope.updateCredentials(createdUser, twitterToken);
                                    },
                                    function(createError){

                                    }
                                );
                            }
                        },
                        function(err){
                           $log.error('failed to search user', err);
                        }
                    );
                }
            }, function(error){
                $log.error('failed to search user', error);
            });

            //$state.go('app.search');
        }, function (error) {
            $log.error('failed to login via twitter', error);
            $ionicLoading.hide();
        });
    };

    $scope.updateToken = function(user, token){
       user.TwitterOauthToken = token;
       UserService.updateUser(user).then(
           function(updateSuccess){
               $scope.updateCredentials(user, token);
           },
           function(error){
               $log.error('failed update user', error);
           }
       );
    };

    $scope.updateCredentials = function(user, token){
        $log.info('logged in via twitter', user);
        var username = user.UserName;
        var password = "twitter " + token;
        BasicAuthorizationService.generateToken(username, password);

        $state.go('app.search');
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

controllers.controller('MessageHistoryCtrl', ['$scope', '$rootScope', '$state', '$log', '$stateParams', '$ionicLoading', '$ionicHistory', '$ionicPopup', '$translate', 'MessageService', 'LocalDataService', 'OrganizationService', function ($scope, $rootScope, $state, $log, $stateParams, $ionicLoading, $ionicHistory, $ionicPopup, $translate, MessageService, LocalDataService, OrganizationService) {
    $log.info('init messages controller');

    $scope.$on('$ionicView.enter', function () {
        if ($rootScope.reloadMessages) {
            $scope.load();
        }

    });

    $scope.messages = [

    ];


    $scope.userID = LocalDataService.loadUser().id;

    $scope.load = function () {
        $ionicLoading.show({
            template: $translate.instant("MESSAGES.LOADING_LIST")
        });

        var orgID = $stateParams.orgID;

        MessageService.getMessagesByUser($scope.userID, orgID).then(function (response) {
                $scope.messages = response;

                $rootScope.reloadMessages = false;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function (err) {
                $log.error('failed to load messages history', err);

                $ionicPopup.alert({
                    title: $translate.instant("MESSAGES.LOAD_FAILED"),
                    template: err
                });
            });
    };
    $scope.load();


    $scope.selectMessage = function (message) {
        $state.go('app.messagedetails', { 'messageID': message.id});
    };


}]);

var controllers = angular.module('App.controllers');

controllers.controller('MessageCtrl', ['$scope', '$rootScope', '$state', '$filter', '$log', '$stateParams', '$ionicLoading', '$ionicHistory', '$ionicActionSheet', '$ionicModal', '$templateCache', '$ionicPopup', '$translate', 'MessageService', 'LocalDataService', 'DocumentService', function ($scope, $rootScope, $state, $filter, $log, $stateParams, $ionicLoading, $ionicHistory, $ionicActionSheet, $ionicModal, $templateCache, $ionicPopup, $translate, MessageService, LocalDataService, DocumentService) {
    $log.info('init messages controller');
    $scope.isLoading = false;

    $scope.$on('$ionicView.beforeEnter', function () {
        if ($stateParams.messageID) {

            $scope.loadMessage();
        }

    });

    $scope.$on('$ionicView.beforeLeave', function () {
        $rootScope.supportMessage = {};

    });

    $scope.userID = LocalDataService.loadUser().id;
    $scope.currentMessage = {};
    $scope.currentAttachments = [];

    $scope.loadMessage = function () {
        $ionicLoading.show({
            template: $translate.instant("MESSAGES.LOADING")
        });
        $scope.isLoading = true;


        var messageID = $stateParams.messageID;

        MessageService.getMessageDetails(messageID).then(function (success) {
            $ionicLoading.hide();
            $scope.isLoading = false;

            $log.info('loaded message', success);
            $scope.currentMessage = success[0];

            $scope.messageOptions = [];
            $scope.getSelectedRoutingPath($scope.currentMessage.PreviousRoutingID);

            $scope.images = LocalDataService.getPhotos();
            $scope.currentAttachments = $filter('filter')($scope.images, { message: messageID });


            $rootScope.supportMessage = $scope.currentMessage;

        }, function (err) {
            $ionicLoading.hide();
            $scope.isLoading = false;

            $log.error('failed to load message ', err);

            $ionicPopup.alert({
                title: $translate.instant("MESSAGES.LOAD_FAILED"),
                template: err
            });
        });
    };

    $scope.getSelectedRoutingPath = function (source) {
        var routing = source[0];
        if (routing) {
            $scope.messageOptions.push(routing);
            if (routing.children.length > 0) {
                $scope.getSelectedRoutingPath(routing.children);
            }
        }

    };


    $scope.addNote = function () {
        if (!window.cordova) {
            $scope.openNoteModal();
        }
        else {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: $translate.instant("MESSAGES.NOTE_BUTTON")},
                    { text: $translate.instant("MESSAGES.PHOTO_BUTTON")}

                ],
                titleText: $translate.instant("MESSAGES.NOTE_TITLE"),
                cancelText: $translate.instant("GENERIC.CANCEL"),
                buttonClicked: function (index) {
                    if (index === 0) {
                        $scope.openNoteModal();
                    }
                    else if (index === 1) {
                        $scope.addImage();
                    }


                    return true;
                }
            });
        }
    };

    $scope.openNoteModal = function () {
        $scope.modal = $ionicModal.fromTemplate($templateCache.get('message-note.html'), {
            scope: $scope
        });
        $scope.modal.show();
    };

    $scope.saveMessageNote = function () {
        $log.info("add message to note");

        $ionicLoading.show({
            template: $translate.instant("MESSAGES.SAVING")
        });

        MessageService.updateMessageNote($scope.currentMessage).then(function (success) {
            $ionicLoading.hide();
            $scope.messageForm.$setPristine();
            $scope.messageForm.$setUntouched();

            $scope.closeModal();

        }, function (err) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: $translate.instant("MESSAGES.SAVING_FAILED"),
                template: err
            });
        });


    };

    $scope.addImage = function () {
        $ionicLoading.show({
            template: $translate.instant("ATTACHMENT.LOADING")
        });

        DocumentService.capturePicture().then(
            function (fileURI) {
                $scope.fileURI = fileURI;

                $scope.showAttachmentModal();
                $ionicLoading.hide();
            },
            function (fail) {
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: $translate.instant("ATTACHMENT.SAVING_FAILED"),
                    template: err
                });
            }
        );
    };

    $scope.closeModal = function () {
        $log.debug('close modal');

        $scope.modal.hide();
        $scope.modal.remove();
    };

    $scope.showAttachmentModal = function () {
        $scope.modal = $ionicModal.fromTemplate($templateCache.get('new-document.html'), {
            scope: $scope
        });
        $scope.modal.show();
    };


    $scope.closeAttachmentModal = function (filename) {
        for (var i in $scope.images) {
            var image = $scope.images[i].name;
            var imageName = image.substring(0, image.length - 4);
            if (filename === imageName) {
                $ionicPopup.alert({
                    title: $translate.instant("ATTACHMENT.FILENAME_NOT_UNIQUE")
                });
                return;
            }
        }

        var messageID = $scope.currentMessage.id;

        DocumentService.moveFile($scope.fileURI, filename, messageID).then(
            function (success) {

                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: $translate.instant("ATTACHMENT.SAVE_SUCCESS")
                });


                $scope.currentAttachments.push({
                    "name": filename + ".jpg",
                    "url": success
                });
                $log.info('document saved: ' + filename);

                $scope.closeModal();


            },
            function (fail) {
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: $translate.instant("ATTACHMENT.SAVE_FAILED"),
                    template: fail
                });
            }
        );

    };


    $scope.selectDocument = function (document) {

        $scope.document = document;
        $scope.showModal('document-details.html');

    };

    $scope.showModal = function (templateUrl) {
        $scope.modal = $ionicModal.fromTemplate($templateCache.get(templateUrl), {
            scope: $scope
        });
        $scope.modal.show();

    };


}]);

var controllers = angular.module('App.controllers');


controllers.controller('DocumentCtrl', ['$scope', '$rootScope', '$stateParams', '$state', '$log', '$templateCache', '$ionicBackdrop', '$ionicModal', '$translate', '$cordovaCamera', '$cordovaFile', '$ionicLoading', '$ionicPopup', 'LocalDataService', 'DocumentService', function ($scope, $rootScope, $stateParams, $state, $log, $templateCache, $ionicBackdrop, $ionicModal, $translate, $cordovaCamera, $cordovaFile, $ionicLoading, $ionicPopup, LocalDataService, DocumentService) {

    $log.debug('init document controller');
    $scope.cameraAvailable = window.cordova;


    $scope.images = LocalDataService.getPhotos();
    $scope.attachment = {};

    $scope.$on('$ionicView.enter', function(){
        if($stateParams.document){
            $scope.load();
        }

    });



    $scope.load = function () {
        $log.debug('load documents');
        if($scope.cameraAvailable){
            $scope.images = LocalDataService.getPhotos();
        }


    };

    $scope.urlForImage = function (imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        return imageName;
    };

    $scope.addImage = function () {
        $ionicLoading.show({
            template: $translate.instant("ATTACHMENT.LOADING")
        });

        DocumentService.capturePicture().then(
            function(fileURI){
                $scope.fileURI = fileURI;

                $scope.showAttachmentModal();
                $ionicLoading.hide();
            },
            function(fail){
                $ionicLoading.hide();
            }
        );
    };


    $scope.selectDocument = function(document){
        $scope.document = document;
        $scope.showModal('document-details.html');
    };

    $scope.showModal = function(templateUrl) {
        $scope.modal = $ionicModal.fromTemplate($templateCache.get(templateUrl), {
            scope: $scope
        });
        $scope.modal.show();

    };

    $scope.closeModal = function() {
        $log.debug('close modal');

        $scope.modal.hide();
        $scope.modal.remove();
    };

    $scope.showAttachmentModal = function(){
        $scope.modal = $ionicModal.fromTemplate($templateCache.get('new-document.html'), {
            scope: $scope
        });
        $scope.modal.show();
    };


    $scope.closeAttachmentModal = function(){
        var filename = $scope.attachment.filename;


        for(var i in $scope.images)
        {
            var image = $scope.images[i].name;
            var imageName = image.substring(0, image.length - 4);
            if(filename === imageName){
                $ionicPopup.alert({
                    title: $translate.instant("ATTACHMENT.FILENAME_NOT_UNIQUE")
                });
                return;
            }
        }

        DocumentService.moveFile($scope.fileURI, $scope.attachment.filename).then(
            function(success){

                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: $translate.instant("ATTACHMENT.SAVE_SUCCESS")
                });

                $scope.closeModal();


                $scope.images = LocalDataService.getPhotos();
                $log.info('display images', $scope.images);
            },
            function(fail){
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: $translate.instant("ATTACHMENT.SAVE_FAILED"),
                    template: err
                });
            }
        );

    };
}]);
var controllers = angular.module('App.controllers');

controllers.controller('FavoritesCtrl', ['$scope', '$rootScope', '$state', '$log', '$stateParams', '$ionicLoading', '$ionicHistory', 'MessageService', 'LocalDataService', 'OrganizationService', 'OptionService', function ($scope, $rootScope, $state, $log, $stateParams, $ionicLoading, $ionicHistory, MessageService, LocalDataService, OrganizationService, OptionService) {
    $log.info('init favorites controller');

    $scope.organizations = [];

    $scope.userID = LocalDataService.loadUser().id;

    $scope.$on('$ionicView.enter', function () {
        if ($rootScope.reloadFavorites) {
            $scope.loadOrgs();
        }

    });


    $scope.loadOrgs = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });

        MessageService.getCompaniesWithMsgCount($scope.userID).then(function (response) {
                $scope.organizations = response;

                $rootScope.reloadFavorites = false;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function (err) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.loadOrgs();

    $scope.selectOrganisation = function (organization) {

        $rootScope.sessionData.options = [];

        OptionService.getOptionsTree(organization.OrgID).then(
            function (success) {
                $log.info('loaded org details');
                $rootScope.organizationDetails = success;
                $rootScope.sessionData.organization = success;

                $state.go('app.options', { 'orgID' : organization.OrgID , 'parentID' : 0});
                $ionicLoading.hide();

            }, function (err) {
                $log.error('failed to load org details selected in favorites', err);
            });



    };
}]);
