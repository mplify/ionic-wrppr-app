var controllers = angular.module('App.controllers');


controllers.controller('ActionCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $ionicPlatform, $log, localStorageService, MessageService, UserService, DTMFService) {
    $log.debug('init action controller');

    if(!$rootScope.sessionData.organization){
        $log.info('organization not selected, redirects to organization search');
        $state.go('app.organizations');
    }

    $scope.actionMessages = {
        'CALL' : 'Called ',
        'MAIL' : 'Send email to',
        'TWEET' : 'Send tweet to'
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
        $scope.logAction($scope.actionMessages.CALL);

        var number = DTMFService.createNumber($rootScope.sessionData.organization, $scope.currentOptions);
        $window.location = 'tel:' + number;
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
        var hasTwitterApp = localStorageService.get('twitterApp');

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
            'UserID' :  UserService.getUser().id,
            'Question' :  action+ ' "' + $scope.currentOrganization + '"'
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
