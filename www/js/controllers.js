angular.module('App.controllers', [])

    .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, Auth) {

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

    .controller('PlaylistsCtrl', function ($scope) {
        $scope.playlists = [
            { title: 'Reggae', id: 1 },
            { title: 'Chill', id: 2 },
            { title: 'Dubstep', id: 3 },
            { title: 'Indie', id: 4 },
            { title: 'Rap', id: 5 },
            { title: 'Cowbell', id: 6 }
        ];
    })

    .controller('PlaylistCtrl', function ($scope, $stateParams) {
    })

    .controller('RegistrationCtrl', function ($scope, $stateParams) {
    })

    .controller('OrganizationsCtrl', function ($scope, OrganizationService) {
        $scope.organizations = [
            { title: 'ABN Amro', id: 1 },
            { title: 'KPN', id: 2 }
        ];

        $scope.load = function(){
            $scope.isLoading = true;

            OrganizationService.getOrganizations().then(function(response) {
                $scope.organizations = response;
                $scope.isLoading = false;

            });
        };
    })

    .controller('OptionsCtrl', function ($scope, $rootScope) {
        $scope.options = [
            { title: 'Mobile Bank', id: 1 },
            { title: 'Cards', id: 2 }
        ];
    })
    .controller('DashCtrl', function($scope) {


    })
;

