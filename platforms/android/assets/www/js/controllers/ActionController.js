var controllers = angular.module('App.controllers');


controllers.controller('ActionCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $ionicPlatform, $log, LocalDataService, MessageService, UserService, DTMFService, $cordovaContacts) {
    $log.debug('init action controller');

    if(!$rootScope.sessionData.organization){
        $log.info('organization not selected, redirects to organization search');
        $state.go('app.organizations');
    }

    $scope.actionMessages = {
        'CALL' : {type : 1, message : "Called "},
        'MAIL' : {type: 2, message : "Send email to"},
        'TWEET' : {type : 3, message: "Send tweet to"},
        'FACEBOOK' : {type: 4, message: "Send a facebook msg"}
    }

    $scope.contacts = {};


    if($rootScope.sessionData.organization != undefined) {

        $scope.currentOrganization = $rootScope.sessionData.organization.orgName;

        $scope.currentOptions = $rootScope.sessionData.options;

        $scope.contacts.email = $rootScope.sessionData.organization.EmailAddress;
        $scope.contacts.twitter = $rootScope.sessionData.organization.TwitterAccount;
        $scope.contacts.call = $rootScope.sessionData.organization.TelephoneNumber;
    }

    $scope.call = function(){
        $log.info('make a call');

            var opts = {                                           //search options
                filter : 'Wrapper',                                 // 'Bob'
                multiple: true,                                      // Yes, return any contact that matches criteria
                fields:  [ 'displayName', 'name' ],                   // These are the fields to search for 'bob'.
                desiredFields: [id]    //return fields.
        };



        $cordovaContacts.find(opts).then(function (contactsFound) {
            console.log(contactsFound);
        });

        $cordovaContacts.save({"displayName": "Steve Jobs"}).then(function(result) {
            console.log(JSON.stringify(result));
        }, function(error) {
            console.log(error);
        });

       // alert('call');

        var number = DTMFService.createNumber($rootScope.sessionData.organization, $scope.currentOptions);
        number = "+37126077635";

        //window.plugins.CallNumber.callNumber(function(){}, function(){}, number, false);
        //$scope.logAction($scope.actionMessages.CALL);

        window.open('tel:' + number, '_system');

        //$window.location = 'tel:' + number;
    }

    $scope.mail = function(){
        $log.info('send an email');
        $scope.logAction($scope.actionMessages.MAIL);

        $window.location = 'mailto:' +$scope.contacts.email+ '?subject=This is a sample subject';
    }

    $scope.hasTwitterApp = false;


    $scope.tweet = function(){
        $log.info('tweet');
        $scope.logAction($scope.actionMessages.TWEET);
        var hasTwitterApp = LocalDataService.hasTwitterApp();

        if(hasTwitterApp) {
            window.open('twitter://user?screen_name=' + $scope.contacts.twitter, '_system', 'location=no');
        }
        else {
            window.open('https://twitter.com/intent/tweet?screen_name='+ $scope.contacts.twitter, '_system', 'location=no');
        }
    }


    $scope.logAction = function(action){
        var message = {
            'OrgID' : $rootScope.sessionData.organization.id,
            'UserID' :  LocalDataService.loadUser().id,
            'Question' :  action.message + ' "' + $scope.currentOrganization + '"',
            'ChannelTypeID' : action.type
        };

        if($rootScope.sessionData.options.length > 0){
            var contactMenu = $rootScope.sessionData.options[$rootScope.sessionData.options.length -1];
            $log.debug('try to ' +action+ ' for menu: ',contactMenu);

            message.ChoiceMenuID = contactMenu.id;
        }
        MessageService.createMessage(message);
    }


    $scope.mailFeedback = function(){
        $window.location = 'mailto:feedback@mplify.nl'+ '?subject=Feedback about wrapper app';
    }

    $scope.mailSupport = function(){
        $window.location = 'mailto:support@mplify.nl'+ '?subject=Feedback about wrapper app';
    }



});
