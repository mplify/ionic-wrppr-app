var controllers = angular.module('App.controllers');


controllers.controller('ActionCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $ionicPlatform, $ionicPopup, $log, $translate, $ionicLoading, $ionicModal, $templateCache, $ionicActionSheet, $timeout, LocalDataService, MessageService, UserService, DTMFService, $cordovaContacts, OrganizationService) {
    $log.debug('init action controller');

    $scope.$on('$ionicView.beforeLeave', function () {
        $rootScope.supportMessage = {};

    });


    $scope.init = function(){
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
    };

    $scope.mail = function () {
        //EmailService.sendEmail();

        $log.info('send an email');
        $scope.logAction($scope.actionMessages.MAIL);

        var body = $translate.instant("MAIL.BODY", { "company": $rootScope.sessionData.organization.orgName});

        var url = 'mailto:' + $scope.contacts.email + '?subject=' + $translate.instant("MAIL.SUBJECT") + "&body=" + body;
        window.open(url,'_system');

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


});
