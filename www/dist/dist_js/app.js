// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'LocalStorageModule', 'ionic.service.core', 'App.controllers', 'App.services', 'ngCordova', 'ngCordova.plugins.appAvailability', 'ngCordovaOauth', 'pascalprecht.translate', 'templates', 'ionic-native-transitions'])

    .run(['$ionicPlatform', 'BasicAuthorizationService', '$http', '$log', 'TwitterService', 'ExternalLoad', 'NetworkService', 'DTMFService', 'EmailService', 'FacebookService', 'LoginService', function ($ionicPlatform, BasicAuthorizationService, $http, $log, TwitterService, ExternalLoad, NetworkService, DTMFService, EmailService, FacebookService, LoginService) {

        LoginService.autoLogin().then(
            function(success){

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

            .state('root', {
                url: '/root',
                templateUrl: 'dashboard.html'
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
        $urlRouterProvider.otherwise('/root');

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

angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("actions.html","<ion-view view-title=\"{{\'ACTIONS.TITLE\' | translate}} {{currentOrganization}}\" ng-controller=\"ActionCtrl\">\n\n    <ion-content>\n        <div style=\"height: 5px;\" ng-style=\"{\'background-color\': brandingColor}\"></div>\n        <div class=\"row\" style=\"height: 10%; padding-left: 20px; padding-right: 20px;\">\n            <h3 style=\"text-align: center; width: 100%;\">{{currentOrganization}}</h3>\n        </div>\n\n        <div class=\"row\" ng-repeat=\"option in currentOptions\">\n            <p style=\"text-align: center; width: 100%;\">{{option.NodeName}}</p>\n        </div>\n\n        <div class=\"row button-block\" style=\"text-align: center; display: block;\"\n             ng-show=\"contacts.call == null && contacts.twitter == null && contacts.email == null\">\n\n            <div class=\"ion-sad-outline\" style=\"font-size: 86px; color: lightgray;\"></div>\n            <h4 class=\"title\" style=\"width: 100%; text-align: center;\">We don\'t have any contacts for\n                {{currentOrganization}}, please try later or contact our support</h4>\n\n\n        </div>\n\n        <div class=\"row\" style=\"height: 40%; padding-left: 20px; padding-right: 20px;\">\n            <div class=\"col\" ng-hide=\"contacts.call == null\">\n                <div class=\"features-box-icon\" ng-style=\"{\'background-color\': brandingColor2}\" ng-click=\"call();\">\n                    <span aria-hidden=\"true\" class=\"icon_phone\"></span>\n                    <button class=\"button button-clear\">\n                        {{ \'ACTIONS.CALL\' | translate }}\n                    </button>\n                </div>\n\n            </div>\n\n            <div class=\"col\">\n\n            </div>\n\n            <div class=\"col\" ng-hide=\"contacts.twitter == null\">\n                <div class=\"features-box-icon\" ng-style=\"{\'background-color\': brandingColor2}\" ng-click=\"tweet();\">\n                    <span aria-hidden=\"true\" class=\"social_twitter\"></span>\n                    <button class=\"button button-clear\">\n                        {{ \'ACTIONS.TWEET\' | translate }}\n                    </button>\n                </div>\n\n            </div>\n\n        </div>\n        <div class=\"row\" style=\"height: 40%; padding-left: 20px; padding-right: 20px;\">\n            <div class=\"col\">\n            </div>\n            <div class=\"col\" ng-hide=\"contacts.email == null\">\n                <div class=\"features-box-icon\" ng-style=\"{\'background-color\': brandingColor2}\" ng-click=\"mail();\">\n                    <span aria-hidden=\"true\" class=\"icon_mail\"></span>\n                    <button class=\"button button-clear\">\n                        {{ \'ACTIONS.MAIL\' | translate }}\n                    </button>\n                </div>\n\n            </div>\n            <div class=\"col\">\n            </div>\n        </div>\n\n    </ion-content>\n    <div class=\"tabs tabs-icon-top\">\n        <a class=\"tab-item\" ng-click=\"mailFeedback();\">\n            <i class=\"icon ion-speakerphone\"></i>\n            {{ \'GENERIC.FEEDBACK\' | translate }}\n        </a>\n        <a class=\"tab-item\" ng-show=\"userCorrect.message\">\n            <i class=\"icon ion-edit\" ng-click=\"userCorrect();\"></i>\n            {{ \'USER_CORRECT.BUTTON\' | translate }}\n        </a>\n        <a class=\"tab-item\" ng-click=\"mailSupport();\">\n            <i class=\"icon ion-help-buoy\"></i>\n            {{ \'GENERIC.SUPPORT\' | translate }}\n        </a>\n    </div>\n\n\n</ion-view>");
$templateCache.put("capture-document.html","<ion-view view-title=\"{{\'ATTACHMENT.TITLE\' | translate}}\" ng-controller=\"DocumentCtrl\" ng-init=\"load()\">\n\n    <ion-content>\n\n        <ion-list>\n            <ion-item ng-repeat=\"image in images\" class=\"item item-image\" style=\"padding: 10px;\" ng-click=\"selectDocument(image);\">\n                <p>{{image.name | Filename}}</p>\n                <img class=\"full-image\" ng-src=\"{{urlForImage(image.url)}}\" style=\"height: 300px;\">\n\n\n            </ion-item>\n        </ion-list>\n    </ion-content>\n    <div class=\"bar bar-footer\" ng-show=\"cameraAvailable\">\n        <div class=\"button-bar\">\n            <button class=\"button button-clear\" ng-click=\"addImage();\">\n                {{\'ATTACHMENT.ADD\' | translate}}\n            </button>\n            <button class=\"button button-clear\" ng-click=\"load();\">\n                {{\'ATTACHMENT.RELOAD\' | translate}}\n            </button>\n        </div>\n    </div>\n\n\n</ion-view>");
$templateCache.put("change-password.html","<ion-view>\n    <ion-header-bar>\n        <h1 class=\"title\">{{\'CHANGE_PASSWORD.TITLE\' | translate}}</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ui-sref=\"root\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n    <ion-content scroll=\"false\">\n        <form name=\"changePasswordForm\" ng-submit=\"doChangePassword()\" novalidate  ng-controller=\"RestorePasswordCtrl\">\n            <div class=\"list\">\n\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">{{\'PASSWORD\' | translate}}</span>\n                    <input type=\"password\" ng-model=\"newPassword\" required>\n\n                </label>\n                <label class=\"item password-complexity row\" ng-show=\"passwordComplexity\">\n                    <div class=\"col\" ng-class=\"passwordComplexity\"></div>\n                </label>\n                <label class=\"item item-input\" ng-show=\"!changePasswordForm.newPassword.$pristine && changePasswordForm.newPassword.$invalid\">\n                    <p ng-show=\"changePasswordForm.newPassword.$error.required\">{{\'PASSWORD_REQUIRED_VALIDATOR\' | translate}}</p>\n                </label>\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">{{\'CHANGE_PASSWORD.REPEAT_PASSWORD\' | translate}}</span>\n                    <input type=\"password\" ng-model=\"repeatPassword\" required>\n                </label>\n                <label class=\"item item-input\" ng-show=\"!changePasswordForm.repeatPassword.$pristine && !passwordMatch\">\n                    <p ng-show=\"!passwordMatch\">{{\'CHANGE_PASSWORD.PASSWORD_MATCH\' | translate}}</p>\n                </label>\n\n                <label class=\"item\">\n                    <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"changePasswordForm.$invalid || !passwordMatch\" type=\"submit\">{{\'CHANGE_PASSWORD.SUBMIT\' | translate}}</button>\n                </label>\n                <label class=\"\">\n                    <button class=\"button button-block button-clear\">{{\'GENERIC.SUPPORT\' | translate}}</button>\n                </label>\n\n            </div>\n        </form>\n\n\n\n    </ion-content>\n\n\n</ion-view>\n");
$templateCache.put("dashboard.html","<ion-view class=\"fill\" ng-controller=\"DashboardCtrl\">\n    <ion-content style=\"margin-left: 20px; margin-right: 20px;\">\n        <div class=\"row\" style=\"height: 20%;\"> </div>\n        <div class=\"row\">\n            <h1 style=\"text-align: center; width: 100%;\">{{\'DASHBOARD.TITLE\' | translate}}</h1>\n\n        </div>\n        <div class=\"row\">\n            <h2 style=\"text-align: center; width: 100%;\">{{\'DASHBOARD.DESCRIPTION\' | translate}}</h2>\n        </div>\n        <div class=\"row\" ng-controller=\"FacebookCtrl\" ng-show=\"facebookLoginEnabled\" ng-init=\"facebookAutoLogin()\">\n            <button class=\"button button-block button-positive\" ng-click=\"facebookManualLogin()\">{{\'DASHBOARD.FACEBOOK_LOGIN\' | translate}}</button>\n        </div>\n        <div class=\"row\" ng-controller=\"TwitterCtrl\" ng-show=\"twitterLoginEnabled\">\n            <button class=\"button button-block button-calm\" ng-click=\"twitterLogin()\">{{\'DASHBOARD.TWITTER_LOGIN\' | translate}}</button>\n        </div>\n        <div class=\"row\">\n            <div class=\"col\">\n                <button class=\"button button-block button-clear\" style=\"color: black;\" ui-sref=\"login\">{{\'DASHBOARD.LOGIN\' | translate}}</button>\n            </div>\n            <div class=\"col\">\n                <button class=\"button button-block button-clear\" style=\"color: black;\" ui-sref=\"register\">{{\'DASHBOARD.REGISTER\' | translate}}</button>\n            </div>\n\n        </div>\n\n    </ion-content>\n\n</ion-view>");
$templateCache.put("document-details.html","<div class=\"modal image-modal transparent\" on-swipe-down=\"closeModal()\" ng-controller=\"DocumentCtrl\" ng-init=\"load()\">\n\n            <ion-scroll direction=\"xy\" scrollbar-x=\"false\" scrollbar-y=\"false\"\n                        zooming=\"true\" min-zoom=\"{{zoomMin}}\" style=\"width: 100%; height: 100%\"\n                        >\n\n                <div class=\"image\" style=\"background-image: url({{urlForImage(document.url)}} )\"></div>\n\n            </ion-scroll>\n\n</div>");
$templateCache.put("favorites.html","\n<ion-view view-title=\"{{\'FAVORITES.TITLE\' | translate}}\" ng-controller=\"MessageCtrl\">\n    <ion-content>\n        <ion-refresher\n                pulling-text=\"{{\'GENERIC.REFRESH\' | translate}}\"\n                on-refresh=\"loadCompanies();\">\n        </ion-refresher>\n        <ion-list ng-init=\"loadCompanies();\">\n            <ion-item ng-repeat=\"company in companies track by company.OrgID\"  ng-click=\"selectOrganisation(company);\">\n                {{company.orgName}}\n                <span class=\"badge wrppr-action-button\" style=\"color: white;\">{{company.count}}</span>\n            </ion-item>\n        </ion-list>\n    </ion-content>\n\n</ion-view>");
$templateCache.put("intro.html","<ion-view view-title=\"{{\'INTRO.TITLE\' | translate}}\" ng-controller=\"IntroCtrl\" ng-init=\"init();\">\n\n\n    <ion-content style=\"margin-left: 20px; margin-right: 20px;\">\n\n        <div class=\"row button-block \" style=\"text-align: center; display: block;\">\n            <div class=\"ion-coffee\" style=\"font-size: 86px; color: lightgray;\"></div>\n\n        </div>\n        <div class=\"row\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'INTRO.TEXT\' | translate}}{{userName}}</h4></div>\n        <div class=\"row\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'INTRO.DESCRIPTION\' | translate}}</h4></div>\n        <div class=\"row\" style=\"height: 30%\"></div>\n        <div class=\"row\">\n\n            <button class=\"button button-large button-assertive wrppr-action-button\" style=\"width: 100%;\" ng-click=\"hideIntro()\">\n                {{\'INTRO.SEARCH_BUTTON\' | translate}}\n            </button>\n\n        </div>\n\n\n\n    </ion-content>\n\n\n</ion-view>");
$templateCache.put("login.html","<ion-view>\n  <ion-header-bar align-title=\"left\">\n    <h1 class=\"title\">{{\'LOGIN_TITLE\' | translate}}</h1>\n    <div class=\"buttons\">\n      <button class=\"button button-clear\" ui-sref=\"root\">{{\'GENERIC_CLOSE\' | translate}}</button>\n    </div>\n  </ion-header-bar>\n  <ion-content scroll=\"false\" ng-controller=\"AuthorizationCtrl\">\n    <form name=\"loginForm\" ng-submit=\"doLogin()\" novalidate>\n      <div class=\"list\">\n\n        <label class=\"item item-input\">\n          <span class=\"input-label\">{{\'USERNAME\' | translate}}</span>\n          <input type=\"text\" name=\"username\" ng-model=\"loginData.UserName\" required>\n\n        </label>\n        <label class=\"item item-input\" ng-show=\"!loginForm.username.$pristine && loginForm.username.$invalid\">\n            <p ng-show=\"loginForm.username.$error.required\">{{\'USERNAME_REQUIRED_VALIDATOR\' | translate}}</p>\n        </label>\n\n        <label class=\"item item-input\">\n          <span class=\"input-label\">{{\'PASSWORD\' | translate}}</span>\n          <input type=\"password\" name=\"password\" ng-model=\"loginData.Password\" required complex-password>\n        </label>\n        <label class=\"item item-input\" ng-show=\"!loginForm.password.$pristine && loginForm.password.$invalid\">\n              <p ng-show=\"loginForm.password.$error.required\">{{\'PASSWORD_REQUIRED_VALIDATOR\' | translate}}</p>\n        </label>\n        <label class=\"item\">\n          <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"loginForm.$invalid\" type=\"submit\">{{\'LOGIN_BUTTON\' | translate}}</button>\n        </label>\n        <label class=\"\">\n                <button class=\"button button-block button-clear\" ui-sref=\"restorepassword\">{{\'FORGOT_PASSWORD_BUTTON\' | translate}}</button>\n        </label>\n\n      </div>\n    </form>\n\n\n\n  </ion-content>\n\n\n</ion-view>\n");
$templateCache.put("menu.html","<ion-side-menus enable-menu-with-back-views=\"false\">\n    <ion-side-menu-content>\n        <ion-nav-bar class=\"bar-stable\">\n            <ion-nav-buttons >\n                <button class=\"button button-icon button-clear ion-navicon\" menu-toggle=\"left\">\n                </button>\n            </ion-nav-buttons>\n            <ion-nav-back-button>\n            </ion-nav-back-button>\n        </ion-nav-bar>\n\n        <ion-nav-view name=\"menuContent\"></ion-nav-view>\n    </ion-side-menu-content>\n\n    <ion-side-menu side=\"left\">\n        <ion-header-bar class=\"bar-stable\">\n            <h1 class=\"title\">{{\'APP_TITLE\' | translate}}</h1>\n        </ion-header-bar>\n        <ion-content>\n            <ion-list>\n\n                <ion-item menu-close href=\"#/app/search\">\n                    {{\'MENU.BUSINESS_CONTACT_SEARCH\' | translate}}\n                </ion-item>\n                <ion-item menu-close href=\"#/app/user\">\n                    {{\'MENU.USER_PROFILE\' | translate}}\n                </ion-item>\n                <ion-item menu-close href=\"#/app/favorites\">\n                    {{\'MENU.FAVORITES\' | translate}}\n                </ion-item>\n                <ion-item menu-close href=\"#/app/messages\">\n                    {{\'MENU.HISTORY\' | translate}}\n                </ion-item>\n                <ion-item menu-close href=\"#/app/documents\">\n                    {{\'MENU.ATTACHMENTS\' | translate}}\n                </ion-item>\n                <ion-item menu-close ng-click=\"logout()\">\n                    {{\'MENU.LOGOUT\' | translate}}\n                </ion-item>\n\n            </ion-list>\n        </ion-content>\n    </ion-side-menu>\n</ion-side-menus>\n");
$templateCache.put("message-details.html","<ion-view view-title=\"{{\'MESSAGES.DETAILS_TITLE\' | translate}}\" ng-controller=\"MessageCtrl\">\n\n    <ion-content>\n        <div style=\"height: 5px;\" ng-style=\"{\'background-color\': brandingColor}\"></div>\n        <div ng-switch=\"currentMessage.ChannelTypeID\">\n            <div class=\"row button-block \" style=\"text-align: center; display: block;\">\n                <div ng-switch-when=\"1\" class=\"ion-ios-telephone\" style=\"font-size: 86px; color: lightgray;\"></div>\n                <div ng-switch-when=\"2\" class=\"icon ion-email\" style=\"font-size: 86px; color: lightgray;\"></div>\n                <div ng-switch-when=\"3\" class=\"ion-social-twitter\" style=\"font-size: 86px; color: lightgray;\"></div>\n\n            </div>\n        </div>\n        <div class=\"row\" style=\"height: 10%; padding-left: 20px; padding-right: 20px;\">\n            <h3 style=\"text-align: center; width: 100%;\">{{currentMessage.Question}}</h3>\n        </div>\n\n        <div class=\"row\" ng-repeat=\"option in messageOptions\">\n            <p style=\"text-align: center; width: 100%;\">{{option.NodeName}}</p>\n        </div>\n\n        <p style=\"text-align: center;\">Created At: {{currentMessage.createdAt | date:\'MM.dd.yyyy HH:mm\'}}</p>\n\n    </ion-content>\n    <div class=\"tabs tabs-icon-top\">\n        <a class=\"tab-item\" ng-click=\"mailFeedback();\">\n            <i class=\"icon ion-speakerphone\"></i>\n            {{ \'GENERIC.FEEDBACK\' | translate }}\n        </a>\n        <a class=\"tab-item\">\n            <i class=\"icon ion-edit\" ng-click=\"userCorrect();\"></i>\n            {{ \'USER_CORRECT.BUTTON\' | translate }}\n        </a>\n        <a class=\"tab-item\" ng-click=\"mailSupport();\">\n            <i class=\"icon ion-help-buoy\"></i>\n            {{ \'GENERIC.SUPPORT\' | translate }}\n        </a>\n    </div>\n\n</ion-view>");
$templateCache.put("message-list.html","\n<ion-view view-title=\"{{\'MESSAGES.HISTORY_TITLE\' | translate}}\" ng-controller=\"MessageCtrl\">\n    <ion-content>\n        <ion-refresher\n                pulling-text=\"{{\'GENERIC.REFRESH\' | translate}}\"\n                on-refresh=\"load();\">\n        </ion-refresher>\n        <ion-list ng-init=\"load();\">\n            <ion-item ng-repeat=\"message in messages track by message.id\" class=\"item-icon-left\" ng-click=\"selectMessage(message)\">\n                   <div ng-switch=\"message.ChannelTypeID\">\n                        <i ng-switch-when=\"1\" class=\"icon ion-ios-telephone\"></i>\n                        <i ng-switch-when=\"2\" class=\"icon ion-email\"></i>\n                        <i ng-switch-when=\"3\" class=\"icon ion-social-twitter\"></i>\n                    </div>\n                    {{message.Question}}\n                    <span class=\"item-note\">\n                     {{message.createdAt | date:\'MM.dd.yyyy HH:mm\'}}\n                    </span>\n            </ion-item>\n        </ion-list>\n    </ion-content>\n\n</ion-view>");
$templateCache.put("new-document.html","<ion-modal-view ng-controller=\"DocumentCtrl\">\n    <ion-header-bar align-title=\"left\">\n        <h1 class=\"title\">{{\'ATTACHMENT.NEW_TITLE\' | translate}}</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ng-click=\"closeModal()\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n    <ion-content scroll=\"false\">\n        <form name=\"newDocumentForm\" ng-submit=\"closeAttachmentModal()\" novalidate>\n            <div class=\"list\">\n\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">{{\'ATTACHMENT.FILENAME\' | translate}}</span>\n                    <input type=\"text\" name=\"username\" ng-model=\"attachment.filename\">\n\n                </label>\n\n                <label class=\"item\">\n                    <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"newDocument.$invalid\" type=\"submit\">{{\'ATTACHMENT.SAVE\' | translate}}</button>\n                </label>\n            </div>\n        </form>\n    </ion-content>\n</ion-modal-view>");
$templateCache.put("no-internet.html","<ion-view view-title=\"{{\'OFFLINE.TITLE\' | translate}}\" ng-controller=\"AppCtrl\">\n\n\n    <ion-content style=\"margin-left: 20px; margin-right: 20px;\">\n\n        <div class=\"row button-block \" style=\"text-align: center; display: block;\">\n            <div class=\"ion-android-wifi\" style=\"font-size: 86px; color: lightgray;\"></div>\n\n        </div>\n        <div class=\"row\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'OFFLINE.TEXT\' | translate}}</h4></div>\n        <div class=\"row\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'OFFLINE.DESCRIPTION\' | translate}}</h4></div>\n        <div class=\"row\" style=\"height: 30%\"></div>\n        <div class=\"row\">\n\n            <button class=\"button button-large button-assertive wrppr-action-button\" style=\"width: 100%;\" ng-click=\"refreshNetworkState()\">\n                {{\'OFFLINE.REFRESH\' | translate}}\n            </button>\n\n        </div>\n\n\n\n    </ion-content>\n\n\n</ion-view>");
$templateCache.put("option-list.html","\n<ion-view view-title=\"{{currentOrganization}}\" ng-controller=\"OptionsCtrl\">\n    <ion-content ng-show=\"showOptions\">\n        <div style=\"height: 5px; background-color: #ff5642;\" ng-style=\"{\'background-color\': brandingColor}\"></div>\n        <ion-refresher\n                pulling-text=\"Pull to refresh...\"\n                on-refresh=\"load();\">\n        </ion-refresher>\n        <ion-list ng-init=\"load();\">\n            <ion-item ng-repeat=\"option in options track by option.id\" ng-click=\"selectOption(option);\">\n                {{option.NodeName}}\n            </ion-item>\n        </ion-list>\n    </ion-content>\n\n    <ion-content ng-hide=\"showOptions\">\n        <div ng-include src=\"\'actions.html\'\"></div>\n    </ion-content>\n</ion-view>");
$templateCache.put("organization-list.html","<ion-view view-title=\"{{ \'BUSINESS_CONTACT.SEARCH\' | translate }}\" ng-controller=\"OrganizationsCtrl\" >\n\n    <ion-content ng-show=\"introVisible\">\n        <div class=\"bar bar-header item-input-inset\">\n            <label class=\"item-input-wrapper\">\n                <i class=\"icon ion-ios-search placeholder-icon\"></i>\n                <input type=\"search\" placeholder=\"{{ \'BUSINESS_CONTACT.SEARCH_FILTER_PLACEHOLDER\' | translate }}\" ng-model=\"search.model\">\n                <a ng-if=\"search.model != \'\'\"\n                   on-touch=\"search.model=\'\'\">\n                    <i class=\"icon ion-ios-close placeholder-icon\"></i>\n                </a>\n            </label>\n\n\n        </div>\n        <ion-refresher\n                pulling-text=\"{{ \'GENERIC.REFRESH\' | translate }}\"\n                on-refresh=\"reload();\">\n        </ion-refresher>\n        <ion-list>\n            <ion-item ng-repeat=\"organisation in organizations track by organisation.id\" ng-click=\"selectOrganisation(organisation);\">\n                {{organisation.orgName}}\n            </ion-item>\n        </ion-list>\n        <ion-infinite-scroll\n                ng-if=\"!noMoreItemsAvailable\"\n                on-infinite=\"loadNext()\"\n                distance=\"10%\">\n        </ion-infinite-scroll>\n    </ion-content>\n    <ion-content ng-hide=\"introVisible\">\n        <div ng-include src=\"\'intro.html\'\"></div>\n    </ion-content>\n</ion-view>");
$templateCache.put("register.html","<ion-view>\n    <ion-header-bar>\n        <h1 class=\"title\">{{\'REGISTER.TITLE\' | translate}}</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ui-sref=\"root\">{{\'GENERIC.CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n    <ion-content scroll=\"false\" ng-controller=\"AuthorizationCtrl\">\n        <form name=\"registerForm\" ng-submit=\"doRegister()\">\n            <div class=\"list\">\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">Username</span>\n                    <input type=\"text\" name=\"UserName\" ng-model=\"registerData.UserName\" ng-change=\"resetValidators(\'UserName\');\" required>\n                </label>\n                <label class=\"item item-input\" ng-show=\"!registerForm.UserName.$pristine && registerForm.UserName.$invalid\">\n                    <p ng-show=\"registerForm.UserName.$error.required\">{{\'USERNAME_REQUIRED_VALIDATOR\' | translate}}</p>\n                    <p ng-show=\"registerForm.UserName.$error.unique\">{{\'USERNAME_NOT_UNIQUE_VALIDATOR\' | translate}}</p>\n                </label>\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">{{\'PASSWORD\' | translate}}</span>\n                    <input type=\"password\" name=\"Password\" ng-model=\"registerData.Password\" ng-change=\"resetValidators(\'Password\');\" ng-minlength=\"6\" ng-maxlength=\"50\" required>\n                </label>\n                <label class=\"item password-complexity row\" ng-show=\"passwordComplexity\">\n                    <div class=\"col\" ng-class=\"passwordComplexity\"></div>\n                </label>\n                <label class=\"item item-input\" ng-show=\"!registerForm.Password.$pristine && registerForm.Password.$invalid\">\n                    <p ng-show=\"registerForm.Password.$error.minlength\">{{\'PASSWORD_MIN_LENGTH_VALIDATOR\' | translate}}</p>\n                    <p ng-show=\"registerForm.Password.$error.maxlength\">{{\'PASSWORD_MAX_LENGTH_VALIDATOR\' | translate}}</p>\n                </label>\n\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">{{\'REGISTER.MOBILE\' | translate}}</span>\n                    <input type=\"tel\" pattern=\"+[0-9]*\" ng-model=\"registerData.mobile\">\n                </label>\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">{{\'REGISTER.EMAIL\' | translate}}</span>\n                    <input type=\"email\" name=\"Email\" ng-model=\"registerData.email\" required>\n                </label>\n                <label class=\"item item-input\" ng-show=\"!registerForm.Email.$pristine && registerForm.Email.$invalid\">\n                    <p ng-show=\"registerForm.Email.$error.required\">{{\'EMAIL_REQUIRED_VALIDATOR\' | translate}}</p>\n                </label>\n                <label class=\"item\">\n                    <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"registerForm.$invalid\" type=\"submit\">{{\'REGISTER.SUBMIT_BUTTON\' | translate}}</button>\n                </label>\n            </div>\n        </form>\n        <div>\n\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("restore-password.html","<ion-view>\n  <ion-header-bar>\n    <h1 class=\"title\">{{ \'CHANGE_PASSWORD.RECOVER_PASSWORD\' | translate }}</h1>\n    <div class=\"buttons\">\n      <button class=\"button button-clear\" ui-sref=\"root\">{{ \'GENERIC.CLOSE\' | translate }}</button>\n    </div>\n  </ion-header-bar>\n  <ion-content scroll=\"false\">\n    <form name=\"restorePasswordForm\" ng-submit=\"doRestorePassword()\" novalidate  ng-controller=\"RestorePasswordCtrl\">\n      <div class=\"list\">\n\n        <label class=\"item item-input\">\n          <span class=\"input-label\">{{\'USERNAME | translate\'}}</span>\n          <input type=\"text\" name=\"username\" ng-model=\"username\" required>\n\n        </label>\n        <label class=\"item item-input\" ng-show=\"!restorePasswordForm.username.$pristine && restorePasswordForm.username.$invalid\">\n            <p ng-show=\"restorePasswordForm.username.$error.required\">{{\'USERNAME_REQUIRED_VALIDATOR | translate\'}}</p>\n        </label>\n\n\n        <label class=\"item\">\n          <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"restorePasswordForm.$invalid\" type=\"submit\">{{ \'CHANGE_PASSWORD.RESTORE_SUBMIT\' | translate }}</button>\n        </label>\n        <label class=\"\">\n                <button class=\"button button-block button-clear\">{{\'GENERIC.SUPPORT | translate\'}}</button>\n        </label>\n\n      </div>\n    </form>\n\n\n\n  </ion-content>\n\n\n</ion-view>\n");
$templateCache.put("tabs.html","<ion-view>\n    <ion-tabs class=\"tabs-icon-top tabs-color-active-assertive\">\n\n        <ion-tab title=\"tab1\" icon=\"ion-man\" ui-sref=\"intro.login\">\n            <ion-nav-view name=\"tab-tab1\"></ion-nav-view>\n        </ion-tab>\n\n        <ion-tab title=\"tab2\" icon=\"ion-person-stalker\" ui-sref=\"intro.register\">\n            <ion-nav-view name=\"menuContent\"></ion-nav-view>\n        </ion-tab>\n    </ion-tabs>\n</ion-view>");
$templateCache.put("user-correct.html","<ion-modal-view>\n    <ion-header-bar align-title=\"left\">\n        <h1 class=\"title\">{{ \'USER_CORRECT.TITLE\' | translate }}</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ui-sref=\"root\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n    <ion-content scroll=\"false\" ng-controller=\"AuthorizationCtrl\">\n        <form name=\"userCorrectForm\" ng-submit=\"submitUserCorrect()\" novalidate>\n            <div class=\"list\">\n                <label class=\"item\">\n                    {{ \'USER_CORRECT.DESCRIPTION\' | translate }}\n                </label>\n\n\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">Comment</span>\n                    <input type=\"text\" name=\"username\" ng-model=\"userCorrect.comment\">\n\n                </label>\n\n                <label class=\"item\">\n                    <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"userCorrectForm.$invalid\" type=\"submit\">{{ \'USER_CORRECT.SUBMIT\' | translate }}</button>\n                </label>\n\n\n            </div>\n        </form>\n    </ion-content>\n</ion-modal-view>");
$templateCache.put("user.html","<ion-view view-title=\"{{localUser.UserName}}\" ng-controller=\"UserCtrl\">\n    <ion-content>\n        <ion-list >\n                <ion-item class=\"item-avatar\">\n                    <img ng-src=\"{{localUser.picture}}\" src=\"../img/photo.jpg\">\n                    <h2>{{user.UserName}}</h2>\n                    <p>{{user.email}}</p>\n                    <p>{{user.createdAt | date:\'medium\' }}</p>\n                    <p ng-show=\"debugMode\">\n                        Basic Auth: {{sessionKey}}\n                    </p>\n                </ion-item>\n                <ion-item class=\"item-avatar\" ng-show=\"debugMode\">\n                    <img ng-src=\"{{localFBUser.picture}}\" src=\"../img/photo.jpg\">\n                    <h2>{{localFBUser.name}}</h2>\n                    <h2>{{localFBUser.email}}</h2>\n                    <p>{{localFBUser.authResponse.expiresIn | date:\'medium\' }}</p>\n                    <p>\n                        {{localFBUser.authResponse.accessToken}}\n                    </p>\n                </ion-item>\n                <ion-item ng-show=\"networkType\">\n                    Network Type: {{networkType}} is {{networkStatus}}\n                </ion-item>\n\n                <ion-item>\n                    <button class=\"button button-large button-assertive wrppr-action-button\" style=\"width: 100%;\" ng-click=\"switchLanguage()\">\n                        Switch to English Version\n                    </button>\n                </ion-item>\n            <ion-item class=\"item-toggle\">\n                Debug\n            <label class=\"toggle\">\n                <input type=\"checkbox\" ng-model=\"$root.debugMode\">\n                <div class=\"track\">\n                    <div class=\"handle\"></div>\n                </div>\n            </label>\n            </ion-item>\n\n\n        </ion-list>\n\n\n    </ion-content>\n</ion-view>");}]);
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
                        'UserID': userID
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
                cameraDirection: 1,
                saveToPhotoAlbum: false
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
        'moveFile' : function(fileURI, filename){
            var defer = $q.defer();
            //Grab the file name of the photo in the temporary directory
            var currentName = fileURI.replace(/^.*[\\\/]/, '');



            var newFileName = filename + ".jpg";

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
    'change-password-url':      '/wrppr_pwRenew',

    //messages
    'message-url':              '/wrppr_messages',
    'message-tree-url':         '/wrppr_message_tree',
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

    .controller('AppCtrl', ['$scope', '$rootScope', '$state', '$log', '$ionicPlatform', '$ionicModal', '$ionicPopup', '$ionicLoading', '$ionicHistory', '$timeout', '$q', 'BasicAuthorizationService', 'UserService', '$cordovaOauth', 'api', '$http', 'LocalDataService', 'NetworkService', function ($scope, $rootScope, $state, $log, $ionicPlatform, $ionicModal, $ionicPopup, $ionicLoading, $ionicHistory, $timeout, $q, BasicAuthorizationService, UserService, $cordovaOauth,  api, $http, LocalDataService, NetworkService) {

        $rootScope.debugMode = true;


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


        $scope.refreshNetworkState = function(){
            NetworkService.checkNetworkState();
        };






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
        function(err){
            $ionicLoading.hide();
            $log.error('failed to login', err);

            $ionicPopup.alert({
                title: 'Login failed',
                template: err
            });

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


           $state.go('app.search');

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

                $state.go('root');
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

controllers.controller('OrganizationsCtrl', ['$scope', '$rootScope', '$ionicLoading', '$state', '$log', 'OrganizationService', 'LocalDataService', function ($scope, $rootScope, $ionicLoading, $state, $log, OrganizationService, LocalDataService) {
    $scope.introVisible = LocalDataService.getIntroScreenVisited();


    $scope.hideIntro = function(){
        LocalDataService.setIntroScreenVisited(true);
        $scope.introVisible = true;
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


        $state.go('app.options', { 'orgID' : organization.id , 'parentID' : 0});
    };

    $scope.$watch('search.model', function(newVal, oldVal){
        // wait till prev load done
        if($scope.isLoading){
            $log.debug('skipped loading organization, prev is not done');
            return;
        }

        if(newVal === oldVal ){
            return;
        }

        $log.info('search organization model changed: ' + newVal + oldVal);
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


controllers.controller('ActionCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$window', '$ionicPlatform', '$ionicPopup', '$log', '$translate', '$ionicLoading', '$ionicModal', '$templateCache', 'LocalDataService', 'MessageService', 'UserService', 'DTMFService', '$cordovaContacts', 'EmailService', function ($scope, $rootScope, $state, $stateParams, $window, $ionicPlatform, $ionicPopup, $log, $translate, $ionicLoading, $ionicModal, $templateCache, LocalDataService, MessageService, UserService, DTMFService, $cordovaContacts, EmailService) {
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

    $scope.userCorrect = {
        comment : "",
        message : {}
    };


    if ($rootScope.sessionData.organization !== undefined) {

        $scope.currentOrganization = $rootScope.sessionData.organization.orgName;

        $scope.currentOptions = $rootScope.sessionData.options;

        $scope.contacts.email = $rootScope.sessionData.organization.EmailAddress;
        $scope.contacts.twitter = $rootScope.sessionData.organization.TwitterAccount;
        $scope.contacts.call = $rootScope.sessionData.organization.TelephoneNumber;
    }

    $scope.call = function () {

        $log.info('make a call');



        var opts = {                                           //search options
            filter: 'wrapper',                                 // 'Bob'
            multiple: true,                                      // Yes, return any contact that matches criteria
            fields: [ 'displayName', 'name' ],                   // These are the fields to search for 'bob'.
            desiredFields: ['id']    //return fields.
        };

        var number = DTMFService.createNumber($rootScope.sessionData.organization, $scope.currentOptions);
        if (window.cordova) {
            $ionicLoading.show({
                template: 'Calling ...'
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
                            "displayName": "wrapper",
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
            },

            function (err) {
                $log.error('failed call', err);
                $ionicPopup.alert({
                    title: 'Call failed',
                    template : err
                });
                $scope.makeCallViaURL(number);
            },
            number,
            false);
    };

    $scope.makeCallViaURL = function(number){
       $log.debug('call via url');
       $window.location = 'tel:' +number;
    };

    $scope.mail = function () {
        //EmailService.sendEmail();

        $log.info('send an email');
        $scope.logAction($scope.actionMessages.MAIL);

        var body = $translate.instant("MAIL.BODY", { "company": $rootScope.sessionData.organization.orgName});
        $window.location = 'mailto:' + $scope.contacts.email + '?subject=' + $translate.instant("MAIL.SUBJECT") + "&body=" + body;
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
        MessageService.createMessage(message).then(function(message){
            $scope.userCorrect.message = message;
        }, function(err){

        });

    };


    $scope.mailFeedback = function () {
        $window.location = 'mailto:feedback@mplify.nl' + '?subject=Feedback about wrapper app';
    };

    $scope.mailSupport = function () {
        $window.location = 'mailto:support@mplify.nl' + '?subject=Feedback about wrapper app';
    };

    $scope.userCorrect = function(){
        $scope.modal = $ionicModal.fromTemplate($templateCache.get('user-correct.html'), {
            scope: $scope
        });
        $scope.modal.show();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove();
    };

    $scope.submitUserCorrect = function(){
         $log.info($scope.userCorrect.comment);
         $scope.closeModal();
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

controllers.controller('FacebookCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$ionicPlatform', '$q', '$log', '$ionicLoading', '$ionicPopup', '$http', '$cordovaOauth', 'UserService', 'BasicAuthorizationService', 'LocalDataService', 'FacebookService', function ($scope, $rootScope, $state, $stateParams, $ionicPlatform, $q, $log, $ionicLoading, $ionicPopup, $http, $cordovaOauth, UserService, BasicAuthorizationService, LocalDataService, FacebookService) {
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
                            var user = saveSuccess;
                            $scope.updateLocalStorage(user, profileSuccess, accessToken);
                            $ionicLoading.hide();

                        }, function (saveError) {
                            $log.error('failed to save profile info');
                            $ionicLoading.hide();

                            $ionicPopup.alert({
                                title: 'Facebook Login Failed'
                            });
                        });

                    }, function (error) {
                        $log.error('failed to get profile info');
                        $ionicLoading.hide();

                        $ionicPopup.alert({
                            title: 'Facebook Login Failed'
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
                        title: 'Facebook Login Failed'
                    });
                });

        }, function (error) {
            $log.error('failed to get profile info');
            $ionicLoading.hide();

            $ionicPopup.alert({
                title: 'Facebook Login Failed'
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


            $state.go('app.search');
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

    $scope.$on('$ionicView.enter', function () {
        if ($stateParams.messageID) {
            $scope.loadMessage();
        }
        else {
            $scope.load();
        }
    });

    $scope.messages = [

    ];

    $scope.companies = [];

    $scope.userID = LocalDataService.loadUser().id;

    $scope.load = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });

        var orgID = $stateParams.orgID;

        MessageService.getMessagesByUser($scope.userID, orgID).then(function (response) {
            $scope.messages = response;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.loadCompanies = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });

        MessageService.getCompaniesWithMsgCount($scope.userID).then(function (response) {
                $scope.companies = response;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function (err) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.selectOrganisation = function (organisation) {
        $state.go('app.favorite', { 'orgID': organisation.OrgID});
    };

    $scope.selectMessage = function (message) {
        $state.go('app.messagedetails', { 'messageID': message.id});
    };

    $scope.currentMessage = {};

    $scope.loadMessage = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });


        var messageID = $stateParams.messageID;
        MessageService.loadMessage(messageID).then(
            function (success) {
                $ionicLoading.hide();
                $log.info('loaded message', success);
                $scope.currentMessage = success;
            },
            function (err) {
                $ionicLoading.hide();
                $log.error('failed to load message ', err);
            });

        MessageService.getMessageDetails(messageID).then(function(success){
            $ionicLoading.hide();
            $log.info('loaded message', success);
            $scope.currentMessage = success[0];

            $scope.messageOptions = [];
            $scope.getSelectedRoutingPath($scope.currentMessage.PreviousRoutingID);

        }, function(err){
            $ionicLoading.hide();
            $log.error('failed to load message ', err);
        });
    };

    $scope.getSelectedRoutingPath = function(source){
         var routing = source[0];
         $scope.messageOptions.push(routing);
         if(routing.children.length > 0){
              $scope.getSelectedRoutingPath(routing.children);
         }

    };

    $scope.mailFeedback = function () {
        $window.location = 'mailto:feedback@mplify.nl' + '?subject=Feedback about wrapper app';
    };

    $scope.mailSupport = function () {
        $window.location = 'mailto:support@mplify.nl' + '?subject=Feedback about wrapper app';
    };

    $scope.userCorrect = function(){
        $scope.modal = $ionicModal.fromTemplate($templateCache.get('user-correct.html'), {
            scope: $scope
        });
        $scope.modal.show();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove();
    };

    $scope.submitUserCorrect = function(){
        $log.info($scope.userCorrect.comment);
        $scope.closeModal();
    };


}]);

var controllers = angular.module('App.controllers');


controllers.controller('DocumentCtrl', ['$scope', '$rootScope', '$stateParams', '$state', '$log', '$templateCache', '$ionicBackdrop', '$ionicModal', '$cordovaCamera', '$cordovaFile', '$ionicLoading', '$ionicPopup', 'LocalDataService', 'DocumentService', function ($scope, $rootScope, $stateParams, $state, $log, $templateCache, $ionicBackdrop, $ionicModal, $cordovaCamera, $cordovaFile, $ionicLoading, $ionicPopup, LocalDataService, DocumentService) {

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

        DocumentService.createFolder().then(
            function (success) {
                $scope.images = LocalDataService.getPhotos();

            },
            function (err) {

            }
        );

        }


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
                    title: 'Picture name is not unique'
                });
                return;
            }
        }

        DocumentService.moveFile($scope.fileURI, $scope.attachment.filename).then(
            function(success){

                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: 'Picture saved'
                });

                $scope.closeModal();
                $log.info('display images', LocalDataService.getPhotos());
                $scope.load();
            },
            function(fail){
                $ionicLoading.hide();
            }
        );

    };
}]);