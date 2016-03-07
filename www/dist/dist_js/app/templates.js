angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("actions.html","<ion-view view-title=\"{{\'ACTIONS.TITLE\' | translate}} {{currentOrganization}}\" ng-controller=\"ActionCtrl\">\n\n    <ion-content>\n        <div style=\"height: 5px;\" ng-style=\"{\'background-color\': brandingColor}\"></div>\n        <div class=\"row\" style=\"height: 10%; padding-left: 20px; padding-right: 20px;\">\n            <h3 style=\"text-align: center; width: 100%;\">{{currentOrganization}}</h3>\n        </div>\n\n        <div class=\"row\" ng-repeat=\"option in currentOptions\">\n            <p style=\"text-align: center; width: 100%;\">{{option.NodeName}}</p>\n        </div>\n\n        <div class=\"row button-block\" style=\"text-align: center; display: block;\"\n             ng-show=\"contacts.call == null && contacts.twitter == null && contacts.email == null\">\n\n            <div class=\"ion-sad-outline\" style=\"font-size: 86px; color: lightgray;\"></div>\n            <h4 class=\"title\" style=\"width: 100%; text-align: center;\">We don\'t have any contacts for\n                {{currentOrganization}}, please try later or contact our support</h4>\n\n\n        </div>\n\n        <div class=\"row\" style=\"height: 40%; padding-left: 20px; padding-right: 20px;\">\n            <div class=\"col\" ng-hide=\"contacts.call == null\">\n                <div class=\"features-box-icon\" ng-style=\"{\'background-color\': brandingColor2}\" ng-click=\"call();\">\n                    <span aria-hidden=\"true\" class=\"icon_phone\"></span>\n                    <button class=\"button button-clear\">\n                        {{ \'ACTIONS.CALL\' | translate }}\n                    </button>\n                </div>\n\n            </div>\n\n            <div class=\"col\">\n\n            </div>\n\n            <div class=\"col\" ng-hide=\"contacts.twitter == null\">\n                <div class=\"features-box-icon\" ng-style=\"{\'background-color\': brandingColor2}\" ng-click=\"tweet();\">\n                    <span aria-hidden=\"true\" class=\"social_twitter\"></span>\n                    <button class=\"button button-clear\">\n                        {{ \'ACTIONS.TWEET\' | translate }}\n                    </button>\n                </div>\n\n            </div>\n\n        </div>\n        <div class=\"row\" style=\"height: 40%; padding-left: 20px; padding-right: 20px;\">\n            <div class=\"col\">\n            </div>\n            <div class=\"col\" ng-hide=\"contacts.email == null\">\n                <div class=\"features-box-icon\" ng-style=\"{\'background-color\': brandingColor2}\" ng-click=\"mail();\">\n                    <span aria-hidden=\"true\" class=\"icon_mail\"></span>\n                    <button class=\"button button-clear\">\n                        {{ \'ACTIONS.MAIL\' | translate }}\n                    </button>\n                </div>\n\n            </div>\n            <div class=\"col\">\n            </div>\n        </div>\n\n    </ion-content>\n    <div class=\"tabs tabs-icon-top\">\n        <a class=\"tab-item\" ng-click=\"mailFeedback();\">\n            <i class=\"icon ion-speakerphone\"></i>\n            {{ \'GENERIC.FEEDBACK\' | translate }}\n        </a>\n        <a class=\"tab-item\" ng-show=\"userCorrect.message\">\n            <i class=\"icon ion-edit\" ng-click=\"userCorrect();\"></i>\n            {{ \'USER_CORRECT.BUTTON\' | translate }}\n        </a>\n        <a class=\"tab-item\" ng-click=\"mailSupport();\">\n            <i class=\"icon ion-help-buoy\"></i>\n            {{ \'GENERIC.SUPPORT\' | translate }}\n        </a>\n    </div>\n\n\n</ion-view>");
$templateCache.put("capture-document.html","<ion-view view-title=\"{{\'ATTACHMENT.TITLE\' | translate}}\" ng-controller=\"DocumentCtrl\" ng-init=\"load()\">\n\n    <ion-content>\n\n        <ion-list>\n            <ion-item ng-repeat=\"image in images\" class=\"item item-image\" style=\"padding: 10px;\" ng-click=\"selectDocument(image);\">\n                <p>{{image.name | Filename}}</p>\n                <img class=\"full-image\" ng-src=\"{{urlForImage(image.url)}}\" style=\"height: 300px;\">\n\n\n            </ion-item>\n        </ion-list>\n    </ion-content>\n    <div class=\"bar bar-footer\" ng-show=\"cameraAvailable\">\n        <div class=\"button-bar\">\n            <button class=\"button button-clear\" ng-click=\"addImage();\">\n                {{\'ATTACHMENT.ADD\' | translate}}\n            </button>\n            <button class=\"button button-clear\" ng-click=\"load();\">\n                {{\'ATTACHMENT.RELOAD\' | translate}}\n            </button>\n        </div>\n    </div>\n\n\n</ion-view>");
$templateCache.put("change-password.html","<ion-view>\n    <ion-header-bar>\n        <h1 class=\"title\">{{\'CHANGE_PASSWORD.TITLE\' | translate}}</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ui-sref=\"root\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n    <ion-content scroll=\"false\">\n        <form name=\"changePasswordForm\" ng-submit=\"doChangePassword()\" novalidate  ng-controller=\"RestorePasswordCtrl\">\n            <div class=\"list\">\n\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">{{\'PASSWORD\' | translate}}</span>\n                    <input type=\"password\" ng-model=\"newPassword\" required>\n\n                </label>\n                <label class=\"item password-complexity row\" ng-show=\"passwordComplexity\">\n                    <div class=\"col\" ng-class=\"passwordComplexity\"></div>\n                </label>\n                <label class=\"item item-input\" ng-show=\"!changePasswordForm.newPassword.$pristine && changePasswordForm.newPassword.$invalid\">\n                    <p ng-show=\"changePasswordForm.newPassword.$error.required\">{{\'PASSWORD_REQUIRED_VALIDATOR\' | translate}}</p>\n                </label>\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">{{\'CHANGE_PASSWORD.REPEAT_PASSWORD\' | translate}}</span>\n                    <input type=\"password\" ng-model=\"repeatPassword\" required>\n                </label>\n                <label class=\"item item-input\" ng-show=\"!changePasswordForm.repeatPassword.$pristine && !passwordMatch\">\n                    <p ng-show=\"!passwordMatch\">{{\'CHANGE_PASSWORD.PASSWORD_MATCH\' | translate}}</p>\n                </label>\n\n                <label class=\"item\">\n                    <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"changePasswordForm.$invalid || !passwordMatch\" type=\"submit\">{{\'CHANGE_PASSWORD.SUBMIT\' | translate}}</button>\n                </label>\n                <label class=\"\">\n                    <button class=\"button button-block button-clear\">{{\'GENERIC.SUPPORT\' | translate}}</button>\n                </label>\n\n            </div>\n        </form>\n\n\n\n    </ion-content>\n\n\n</ion-view>\n");
$templateCache.put("dashboard.html","<ion-view class=\"fill\" ng-controller=\"DashboardCtrl\">\n    <ion-content style=\"margin-left: 20px; margin-right: 20px;\">\n        <div class=\"row\" style=\"height: 20%;\"> </div>\n        <div class=\"row\">\n            <h1 style=\"text-align: center; width: 100%;\">{{\'DASHBOARD.TITLE\' | translate}}</h1>\n\n        </div>\n        <div class=\"row\">\n            <h2 style=\"text-align: center; width: 100%;\">{{\'DASHBOARD.DESCRIPTION\' | translate}}</h2>\n        </div>\n        <div class=\"row\" ng-controller=\"FacebookCtrl\" ng-show=\"facebookLoginEnabled\" ng-init=\"facebookAutoLogin()\">\n            <button class=\"button button-block button-positive\" ng-click=\"facebookManualLogin()\">{{\'DASHBOARD.FACEBOOK_LOGIN\' | translate}}</button>\n        </div>\n        <div class=\"row\" ng-controller=\"TwitterCtrl\" ng-show=\"twitterLoginEnabled\">\n            <button class=\"button button-block button-calm\" ng-click=\"twitterLogin()\">{{\'DASHBOARD.TWITTER_LOGIN\' | translate}}</button>\n        </div>\n        <div class=\"row\">\n            <div class=\"col\">\n                <button class=\"button button-block button-clear\" style=\"color: black;\" ui-sref=\"login\">{{\'DASHBOARD.LOGIN\' | translate}}</button>\n            </div>\n            <div class=\"col\">\n                <button class=\"button button-block button-clear\" style=\"color: black;\" ui-sref=\"register\">{{\'DASHBOARD.REGISTER\' | translate}}</button>\n            </div>\n\n        </div>\n\n    </ion-content>\n\n</ion-view>");
$templateCache.put("document-details.html","<div class=\"modal image-modal transparent\" on-swipe-down=\"closeModal()\" ng-controller=\"DocumentCtrl\" ng-init=\"load()\">\n\n            <ion-scroll direction=\"xy\" scrollbar-x=\"false\" scrollbar-y=\"false\"\n                        zooming=\"true\" min-zoom=\"{{zoomMin}}\" style=\"width: 100%; height: 100%\"\n                        >\n\n                <div class=\"image\" style=\"background-image: url({{urlForImage(document.url)}} )\"></div>\n\n            </ion-scroll>\n\n</div>");
$templateCache.put("favorites.html","\n<ion-view view-title=\"{{\'FAVORITES.TITLE\' | translate}}\" ng-controller=\"MessageCtrl\">\n    <ion-content>\n        <ion-refresher\n                pulling-text=\"{{\'GENERIC.REFRESH\' | translate}}\"\n                on-refresh=\"loadCompanies();\">\n        </ion-refresher>\n        <ion-list ng-init=\"loadCompanies();\">\n            <ion-item ng-repeat=\"company in companies track by company.OrgID\"  ng-click=\"selectOrganisation(company);\">\n                {{company.orgName}}\n                <span class=\"badge wrppr-action-button\" style=\"color: white;\">{{company.count}}</span>\n            </ion-item>\n        </ion-list>\n    </ion-content>\n\n</ion-view>");
$templateCache.put("intro.html","<ion-view view-title=\"{{\'INTRO.TITLE\' | translate}}\" ng-controller=\"IntroCtrl\" ng-init=\"init();\">\n\n\n    <ion-content style=\"margin-left: 20px; margin-right: 20px;\">\n\n        <div class=\"row button-block \" style=\"text-align: center; display: block;\">\n            <div class=\"ion-coffee\" style=\"font-size: 86px; color: lightgray;\"></div>\n\n        </div>\n        <div class=\"row\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'INTRO.TEXT\' | translate}}{{userName}}</h4></div>\n        <div class=\"row\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'INTRO.DESCRIPTION\' | translate}}</h4></div>\n        <div class=\"row\" style=\"height: 30%\"></div>\n        <div class=\"row\">\n\n            <button class=\"button button-large button-assertive wrppr-action-button\" style=\"width: 100%;\" ng-click=\"hideIntro()\">\n                {{\'INTRO.SEARCH_BUTTON\' | translate}}\n            </button>\n\n        </div>\n\n\n\n    </ion-content>\n\n\n</ion-view>");
$templateCache.put("login.html","<ion-view>\n  <ion-header-bar align-title=\"left\">\n    <h1 class=\"title\">{{\'LOGIN_TITLE\' | translate}}</h1>\n    <div class=\"buttons\">\n      <button class=\"button button-clear\" ui-sref=\"root\">{{\'GENERIC_CLOSE\' | translate}}</button>\n    </div>\n  </ion-header-bar>\n  <ion-content scroll=\"false\" ng-controller=\"AuthorizationCtrl\">\n    <form name=\"loginForm\" ng-submit=\"doLogin()\" novalidate>\n      <div class=\"list\">\n\n        <label class=\"item item-input\">\n          <span class=\"input-label\">{{\'USERNAME\' | translate}}</span>\n          <input type=\"text\" name=\"username\" ng-model=\"loginData.UserName\" required>\n\n        </label>\n        <label class=\"item item-input\" ng-show=\"!loginForm.username.$pristine && loginForm.username.$invalid\">\n            <p ng-show=\"loginForm.username.$error.required\">{{\'USERNAME_REQUIRED_VALIDATOR\' | translate}}</p>\n        </label>\n\n        <label class=\"item item-input\">\n          <span class=\"input-label\">{{\'PASSWORD\' | translate}}</span>\n          <input type=\"password\" name=\"password\" ng-model=\"loginData.Password\" required complex-password>\n        </label>\n        <label class=\"item item-input\" ng-show=\"!loginForm.password.$pristine && loginForm.password.$invalid\">\n              <p ng-show=\"loginForm.password.$error.required\">{{\'PASSWORD_REQUIRED_VALIDATOR\' | translate}}</p>\n        </label>\n        <label class=\"item\">\n          <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"loginForm.$invalid\" type=\"submit\">{{\'LOGIN_BUTTON\' | translate}}</button>\n        </label>\n        <label class=\"\">\n                <button class=\"button button-block button-clear\" ui-sref=\"restorepassword\">{{\'FORGOT_PASSWORD_BUTTON\' | translate}}</button>\n        </label>\n\n      </div>\n    </form>\n\n\n\n  </ion-content>\n\n\n</ion-view>\n");
$templateCache.put("menu.html","<ion-side-menus enable-menu-with-back-views=\"false\">\n    <ion-side-menu-content>\n        <ion-nav-bar class=\"bar-stable\">\n            <ion-nav-buttons >\n                <button class=\"button button-icon button-clear ion-navicon\" menu-toggle=\"left\">\n                </button>\n            </ion-nav-buttons>\n            <ion-nav-back-button>\n            </ion-nav-back-button>\n        </ion-nav-bar>\n\n        <ion-nav-view name=\"menuContent\"></ion-nav-view>\n    </ion-side-menu-content>\n\n    <ion-side-menu side=\"left\">\n        <ion-header-bar class=\"bar-stable\">\n            <h1 class=\"title\">{{\'APP_TITLE\' | translate}}</h1>\n        </ion-header-bar>\n        <ion-content>\n            <ion-list>\n\n                <ion-item menu-close href=\"#/app/search\">\n                    {{\'MENU.BUSINESS_CONTACT_SEARCH\' | translate}}\n                </ion-item>\n                <ion-item menu-close href=\"#/app/user\">\n                    {{\'MENU.USER_PROFILE\' | translate}}\n                </ion-item>\n                <ion-item menu-close href=\"#/app/favorites\">\n                    {{\'MENU.FAVORITES\' | translate}}\n                </ion-item>\n                <ion-item menu-close href=\"#/app/messages\">\n                    {{\'MENU.HISTORY\' | translate}}\n                </ion-item>\n                <ion-item menu-close href=\"#/app/documents\">\n                    {{\'MENU.ATTACHMENTS\' | translate}}\n                </ion-item>\n                <ion-item menu-close ng-click=\"logout()\">\n                    {{\'MENU.LOGOUT\' | translate}}\n                </ion-item>\n\n            </ion-list>\n        </ion-content>\n    </ion-side-menu>\n</ion-side-menus>\n");
$templateCache.put("message-details.html","<ion-view view-title=\"{{\'MESSAGES.DETAILS_TITLE\' | translate}}\" ng-controller=\"MessageCtrl\">\n\n    <ion-content>\n        <div style=\"height: 5px;\"></div>\n        <div ng-switch=\"currentMessage.ChannelTypeID\">\n            <div class=\"row button-block \" style=\"text-align: center; display: block;\">\n                <div ng-switch-when=\"1\" class=\"ion-ios-telephone\" style=\"font-size: 86px; color: lightgray;\"></div>\n                <div ng-switch-when=\"2\" class=\"icon ion-email\" style=\"font-size: 86px; color: lightgray;\"></div>\n                <div ng-switch-when=\"3\" class=\"ion-social-twitter\" style=\"font-size: 86px; color: lightgray;\"></div>\n\n            </div>\n        </div>\n        <div class=\"row\" style=\"height: 10%; padding-left: 20px; padding-right: 20px;\">\n            <h3 style=\"text-align: center; width: 100%;\">{{currentMessage.Question}}</h3>\n        </div>\n\n        <div class=\"row\" ng-repeat=\"option in messageOptions\">\n            <p style=\"text-align: center; width: 100%;\">{{option.NodeName}}</p>\n        </div>\n\n        <p style=\"text-align: center;\">Created At: {{currentMessage.createdAt | date:\'MM.dd.yyyy HH:mm\'}}</p>\n\n    </ion-content>\n    <div class=\"tabs tabs-icon-top\">\n        <a class=\"tab-item\" ng-click=\"mailFeedback();\">\n            <i class=\"icon ion-speakerphone\"></i>\n            {{ \'GENERIC.FEEDBACK\' | translate }}\n        </a>\n        <a class=\"tab-item\">\n            <i class=\"icon ion-edit\" ng-click=\"userCorrect();\"></i>\n            {{ \'USER_CORRECT.BUTTON\' | translate }}\n        </a>\n        <a class=\"tab-item\" ng-click=\"mailSupport();\">\n            <i class=\"icon ion-help-buoy\"></i>\n            {{ \'GENERIC.SUPPORT\' | translate }}\n        </a>\n    </div>\n\n</ion-view>");
$templateCache.put("message-list.html","\n<ion-view view-title=\"{{\'MESSAGES.HISTORY_TITLE\' | translate}}\" ng-controller=\"MessageCtrl\">\n    <ion-content>\n        <ion-refresher\n                pulling-text=\"{{\'GENERIC.REFRESH\' | translate}}\"\n                on-refresh=\"load();\">\n        </ion-refresher>\n        <ion-list ng-init=\"load();\">\n            <ion-item ng-repeat=\"message in messages track by message.id\" class=\"item-icon-left\" ng-click=\"selectMessage(message)\">\n                   <div ng-switch=\"message.ChannelTypeID\">\n                        <i ng-switch-when=\"1\" class=\"icon ion-ios-telephone\"></i>\n                        <i ng-switch-when=\"2\" class=\"icon ion-email\"></i>\n                        <i ng-switch-when=\"3\" class=\"icon ion-social-twitter\"></i>\n                    </div>\n                    {{message.Question}}\n                    <span class=\"item-note\">\n                     {{message.createdAt | date:\'MM.dd.yyyy HH:mm\'}}\n                    </span>\n            </ion-item>\n        </ion-list>\n    </ion-content>\n\n</ion-view>");
$templateCache.put("new-document.html","<ion-modal-view ng-controller=\"DocumentCtrl\">\n    <ion-header-bar align-title=\"left\">\n        <h1 class=\"title\">{{\'ATTACHMENT.NEW_TITLE\' | translate}}</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ng-click=\"closeModal()\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n    <ion-content scroll=\"false\">\n        <form name=\"newDocumentForm\" ng-submit=\"closeAttachmentModal()\" novalidate>\n            <div class=\"list\">\n\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">{{\'ATTACHMENT.FILENAME\' | translate}}</span>\n                    <input type=\"text\" name=\"username\" ng-model=\"attachment.filename\">\n\n                </label>\n\n                <label class=\"item\">\n                    <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"newDocument.$invalid\" type=\"submit\">{{\'ATTACHMENT.SAVE\' | translate}}</button>\n                </label>\n            </div>\n        </form>\n    </ion-content>\n</ion-modal-view>");
$templateCache.put("no-internet.html","<ion-view view-title=\"{{\'OFFLINE.TITLE\' | translate}}\" ng-controller=\"AppCtrl\">\n\n\n    <ion-content style=\"margin-left: 20px; margin-right: 20px;\">\n\n        <div class=\"row button-block \" style=\"text-align: center; display: block;\">\n            <div class=\"ion-android-wifi\" style=\"font-size: 86px; color: lightgray;\"></div>\n\n        </div>\n        <div class=\"row\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'OFFLINE.TEXT\' | translate}}</h4></div>\n        <div class=\"row\"><h4 class=\"title\" style=\"width: 100%; text-align: center;\">{{\'OFFLINE.DESCRIPTION\' | translate}}</h4></div>\n        <div class=\"row\" style=\"height: 30%\"></div>\n        <div class=\"row\">\n\n            <button class=\"button button-large button-assertive wrppr-action-button\" style=\"width: 100%;\" ng-click=\"refreshNetworkState()\">\n                {{\'OFFLINE.REFRESH\' | translate}}\n            </button>\n\n        </div>\n\n\n\n    </ion-content>\n\n\n</ion-view>");
$templateCache.put("option-list.html","\n<ion-view view-title=\"{{currentOrganization}}\" ng-controller=\"OptionsCtrl\">\n    <ion-content ng-show=\"showOptions\">\n        <div style=\"height: 5px; background-color: #ff5642;\" ng-style=\"{\'background-color\': brandingColor}\"></div>\n        <ion-refresher\n                pulling-text=\"Pull to refresh...\"\n                on-refresh=\"load();\">\n        </ion-refresher>\n        <ion-list ng-init=\"load();\">\n            <ion-item ng-repeat=\"option in options track by option.id\" ng-click=\"selectOption(option);\">\n                {{option.NodeName}}\n            </ion-item>\n        </ion-list>\n    </ion-content>\n\n    <ion-content ng-hide=\"showOptions\">\n        <div ng-include src=\"\'actions.html\'\"></div>\n    </ion-content>\n</ion-view>");
$templateCache.put("organization-list.html","<ion-view view-title=\"{{ \'BUSINESS_CONTACT.SEARCH\' | translate }}\" ng-controller=\"OrganizationsCtrl\" >\n\n    <ion-content ng-show=\"introVisible\">\n        <div class=\"bar bar-header item-input-inset\">\n            <label class=\"item-input-wrapper\">\n                <i class=\"icon ion-ios-search placeholder-icon\"></i>\n                <input type=\"search\" placeholder=\"{{ \'BUSINESS_CONTACT.SEARCH_FILTER_PLACEHOLDER\' | translate }}\" ng-model=\"search.model\">\n                <a ng-if=\"search.model != \'\'\"\n                   on-touch=\"search.model=\'\'\">\n                    <i class=\"icon ion-ios-close placeholder-icon\"></i>\n                </a>\n            </label>\n\n\n        </div>\n        <ion-refresher\n                pulling-text=\"{{ \'GENERIC.REFRESH\' | translate }}\"\n                on-refresh=\"reload();\">\n        </ion-refresher>\n        <ion-list>\n            <ion-item ng-repeat=\"organisation in organizations track by organisation.id\" ng-click=\"selectOrganisation(organisation);\">\n                {{organisation.orgName}}\n            </ion-item>\n        </ion-list>\n        <ion-infinite-scroll\n                ng-if=\"!noMoreItemsAvailable\"\n                on-infinite=\"loadNext()\"\n                distance=\"10%\">\n        </ion-infinite-scroll>\n    </ion-content>\n    <ion-content ng-hide=\"introVisible\">\n        <div ng-include src=\"\'intro.html\'\"></div>\n    </ion-content>\n</ion-view>");
$templateCache.put("register.html","<ion-view>\n    <ion-header-bar>\n        <h1 class=\"title\">{{\'REGISTER.TITLE\' | translate}}</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ui-sref=\"root\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n    <ion-content scroll=\"false\" ng-controller=\"AuthorizationCtrl\">\n        <form name=\"registerForm\" ng-submit=\"doRegister()\">\n            <div class=\"list\">\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">Username</span>\n                    <input type=\"text\" name=\"UserName\" ng-model=\"registerData.UserName\" ng-change=\"resetValidators(\'UserName\');\" required>\n                </label>\n                <label class=\"item item-input\" ng-show=\"!registerForm.UserName.$pristine && registerForm.UserName.$invalid\">\n                    <p ng-show=\"registerForm.UserName.$error.required\">{{\'USERNAME_REQUIRED_VALIDATOR\' | translate}}</p>\n                    <p ng-show=\"registerForm.UserName.$error.unique\">{{\'USERNAME_NOT_UNIQUE_VALIDATOR\' | translate}}</p>\n                </label>\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">{{\'PASSWORD\' | translate}}</span>\n                    <input type=\"password\" name=\"Password\" ng-model=\"registerData.Password\" ng-change=\"resetValidators(\'Password\');\" ng-minlength=\"6\" ng-maxlength=\"50\" required>\n                </label>\n                <label class=\"item password-complexity row\" ng-show=\"passwordComplexity\">\n                    <div class=\"col\" ng-class=\"passwordComplexity\"></div>\n                </label>\n                <label class=\"item item-input\" ng-show=\"!registerForm.Password.$pristine && registerForm.Password.$invalid\">\n                    <p ng-show=\"registerForm.Password.$error.minlength\">{{\'PASSWORD_MIN_LENGTH_VALIDATOR\' | translate}}</p>\n                    <p ng-show=\"registerForm.Password.$error.maxlength\">{{\'PASSWORD_MAX_LENGTH_VALIDATOR\' | translate}}</p>\n                </label>\n\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">{{\'REGISTER.MOBILE\' | translate}}</span>\n                    <input type=\"tel\" pattern=\"+[0-9]*\" ng-model=\"registerData.mobile\">\n                </label>\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">{{\'REGISTER.EMAIL\' | translate}}</span>\n                    <input type=\"email\" name=\"Email\" ng-model=\"registerData.email\" required>\n                </label>\n                <label class=\"item item-input\" ng-show=\"!registerForm.Email.$pristine && registerForm.Email.$invalid\">\n                    <p ng-show=\"registerForm.Email.$error.required\">{{\'EMAIL_REQUIRED_VALIDATOR\' | translate}}</p>\n                </label>\n                <label class=\"item\">\n                    <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"registerForm.$invalid\" type=\"submit\">{{\'REGISTER.SUBMIT_BUTTON\' | translate}}</button>\n                </label>\n            </div>\n        </form>\n        <div>\n\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("restore-password.html","<ion-view>\n  <ion-header-bar>\n    <h1 class=\"title\">{{ \'CHANGE_PASSWORD.RECOVER_PASSWORD\' | translate }}</h1>\n    <div class=\"buttons\">\n      <button class=\"button button-clear\" ui-sref=\"root\">{{ \'GENERIC.CLOSE\' | translate }}</button>\n    </div>\n  </ion-header-bar>\n  <ion-content scroll=\"false\">\n    <form name=\"restorePasswordForm\" ng-submit=\"doRestorePassword()\" novalidate  ng-controller=\"RestorePasswordCtrl\">\n      <div class=\"list\">\n\n        <label class=\"item item-input\">\n          <span class=\"input-label\">{{\'USERNAME | translate\'}}</span>\n          <input type=\"text\" name=\"username\" ng-model=\"username\" required>\n\n        </label>\n        <label class=\"item item-input\" ng-show=\"!restorePasswordForm.username.$pristine && restorePasswordForm.username.$invalid\">\n            <p ng-show=\"restorePasswordForm.username.$error.required\">{{\'USERNAME_REQUIRED_VALIDATOR | translate\'}}</p>\n        </label>\n\n\n        <label class=\"item\">\n          <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"restorePasswordForm.$invalid\" type=\"submit\">{{ \'CHANGE_PASSWORD.RESTORE_SUBMIT\' | translate }}</button>\n        </label>\n        <label class=\"\">\n                <button class=\"button button-block button-clear\">{{\'GENERIC.SUPPORT | translate\'}}</button>\n        </label>\n\n      </div>\n    </form>\n\n\n\n  </ion-content>\n\n\n</ion-view>\n");
$templateCache.put("tabs.html","<ion-view>\n    <ion-tabs class=\"tabs-icon-top tabs-color-active-assertive\">\n\n        <ion-tab title=\"tab1\" icon=\"ion-man\" ui-sref=\"intro.login\">\n            <ion-nav-view name=\"tab-tab1\"></ion-nav-view>\n        </ion-tab>\n\n        <ion-tab title=\"tab2\" icon=\"ion-person-stalker\" ui-sref=\"intro.register\">\n            <ion-nav-view name=\"menuContent\"></ion-nav-view>\n        </ion-tab>\n    </ion-tabs>\n</ion-view>");
$templateCache.put("user-correct.html","<ion-modal-view>\n    <ion-header-bar align-title=\"left\">\n        <h1 class=\"title\">{{ \'USER_CORRECT.TITLE\' | translate }}</h1>\n        <div class=\"buttons\">\n            <button class=\"button button-clear\" ui-sref=\"root\">{{\'GENERIC_CLOSE\' | translate}}</button>\n        </div>\n    </ion-header-bar>\n    <ion-content scroll=\"false\" ng-controller=\"AuthorizationCtrl\">\n        <form name=\"userCorrectForm\" ng-submit=\"submitUserCorrect()\" novalidate>\n            <div class=\"list\">\n                <label class=\"item\">\n                    {{ \'USER_CORRECT.DESCRIPTION\' | translate }}\n                </label>\n\n\n                <label class=\"item item-input\">\n                    <span class=\"input-label\">Comment</span>\n                    <input type=\"text\" name=\"username\" ng-model=\"userCorrect.comment\">\n\n                </label>\n\n                <label class=\"item\">\n                    <button class=\"button button-block button-assertive wrppr-action-button\" ng-disabled=\"userCorrectForm.$invalid\" type=\"submit\">{{ \'USER_CORRECT.SUBMIT\' | translate }}</button>\n                </label>\n\n\n            </div>\n        </form>\n    </ion-content>\n</ion-modal-view>");
$templateCache.put("user.html","<ion-view view-title=\"{{localUser.UserName}}\" ng-controller=\"UserCtrl\">\n    <ion-content>\n        <ion-list >\n                <ion-item class=\"item-avatar\">\n                    <img ng-src=\"{{localUser.picture}}\" src=\"../img/photo.jpg\">\n                    <h2>{{user.UserName}}</h2>\n                    <p>{{user.email}}</p>\n                    <p>{{user.createdAt | date:\'medium\' }}</p>\n                    <p ng-show=\"debugMode\">\n                        Basic Auth: {{sessionKey}}\n                    </p>\n                </ion-item>\n                <ion-item class=\"item-avatar\" ng-show=\"debugMode\">\n                    <img ng-src=\"{{localFBUser.picture}}\" src=\"../img/photo.jpg\">\n                    <h2>{{localFBUser.name}}</h2>\n                    <h2>{{localFBUser.email}}</h2>\n                    <p>{{localFBUser.authResponse.expiresIn | date:\'medium\' }}</p>\n                    <p>\n                        {{localFBUser.authResponse.accessToken}}\n                    </p>\n                </ion-item>\n                <ion-item ng-show=\"networkType\">\n                    Network Type: {{networkType}} is {{networkStatus}}\n                </ion-item>\n\n                <ion-item>\n                    <button class=\"button button-large button-assertive wrppr-action-button\" style=\"width: 100%;\" ng-click=\"switchLanguage()\">\n                        Switch to English Version\n                    </button>\n                </ion-item>\n            <ion-item class=\"item-toggle\">\n                Debug\n            <label class=\"toggle\">\n                <input type=\"checkbox\" ng-model=\"$root.debugMode\">\n                <div class=\"track\">\n                    <div class=\"handle\"></div>\n                </div>\n            </label>\n            </ion-item>\n\n\n        </ion-list>\n\n\n    </ion-content>\n</ion-view>");}]);