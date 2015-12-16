angular.module('App.controllers', [])

    .controller('AppCtrl', function ($scope, $rootScope, $state, $ionicModal, $timeout, Auth) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
                $scope.modal = modal;
        });


        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };

        $rootScope.$on('check-authorization', function(){
            if (!Auth.isAuthorized()){
                $scope.login();
            }
        });

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            console.log('Doing login', $scope.loginData);

            Auth.setCredentials($scope.loginData.username, $scope.loginData.password);


            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };

        $scope.logout = function(){
            Auth.clearCredentials();
            $state.go($state.current, {}, {reload: true});

        };

        var deploy = new Ionic.Deploy();

        // Update app code with new release from Ionic Deploy
        $scope.doUpdate = function() {
            deploy.update().then(function(res) {
                console.log('Ionic Deploy: Update Success! ', res);
            }, function(err) {
                console.log('Ionic Deploy: Update error! ', err);
            }, function(prog) {
                console.log('Ionic Deploy: Progress... ', prog);
            });
        };

        // Check Ionic Deploy for new code
        $scope.checkForUpdates = function() {
            console.log('Ionic Deploy: Checking for updates');
            deploy.check().then(function(hasUpdate) {
                console.log('Ionic Deploy: Update available: ' + hasUpdate);
                $scope.hasUpdate = hasUpdate;
            }, function(err) {
                console.error('Ionic Deploy: Unable to check for updates', err);
            });
        }
    })


    .controller('RegistrationCtrl', function ($scope, $stateParams) {
    })



;

