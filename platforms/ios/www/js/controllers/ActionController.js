var controllers = angular.module('App.controllers');


controllers.controller('ActionCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $ionicPlatform, $ionicPopup, $log, $translate, $ionicLoading, $ionicModal, $templateCache, $ionicActionSheet, $timeout, LocalDataService, MessageService, UserService, DTMFService, $cordovaContacts, OrganizationService) {
    $log.debug('init action controller');


    $scope.init = function(){
        $scope.currentOrganization = {};
        $scope.hasWebpage = false;


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

    };



    $scope.call = function () {

        $log.info('make a call');



        var opts = {                                           //search options
            filter: $translate.instant("CONTACT_NAME"),
            multiple: true,                                      // Yes, return any contact that matches criteria
            fields: [ 'displayName', 'name' ],                   // These are the fields to search for 'wrppr'.
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

            $rootScope.reloadFavorites = true;
            $rootScope.reloadMessages = true;

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


    $scope.webpage = function () {
        var generalWebpage = "https://www.mplify.nl";
        var selfServiceWebpage = "https://mplify.atlassian.net";
        var communityWebpage = "https://www.facebook.com/mPlify/";

        var buttons = [];
        if (generalWebpage) {
            buttons.push({ text: 'General', url: generalWebpage });
        }

        if (selfServiceWebpage) {
            buttons.push({ text: 'Self-service', url: selfServiceWebpage});
        }

        if (communityWebpage) {
            buttons.push({ text: 'Community', url: communityWebpage });
        }

        // redirect without actions shett
        if (buttons.length === 1) {
            $window.location = buttons[0].url;
        }
        else {

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: buttons,
                titleText: 'Open company webpage',
                cancelText: 'Cancel',
                buttonClicked: function (index) {


                    window.open(buttons[index].url);

                    return true;
                }
            });

        }


    };


});
