var controllers = angular.module('App.controllers');


controllers.controller('ActionCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $ionicPlatform, localStorageService, MessageService, UserService) {


    console.log('init action controller');
    console.log($rootScope.sessionData);
    if(!$rootScope.sessionData.organization){
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
        console.log('make a call');
        $scope.logAction($scope.actionMessages.CALL);
        $window.location = 'tel:' + $scope.contacts.call;
    }

    $scope.mail = function(){
        console.log('send an email');
        $scope.logAction($scope.actionMessages.MAIL);

        $window.location = 'mailto:' +$scope.contacts.email+ '?subject=This is a sample subject';
    }

    $scope.hasTwitterApp = false;


    $scope.tweet = function(){
        console.log('tweet');

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
            console.log(contactMenu);

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
