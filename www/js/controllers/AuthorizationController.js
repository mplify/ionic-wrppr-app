var controllers = angular.module('App.controllers');

controllers.controller('AuthorizationCtrl', function ($scope, $ionicLoading, $ionicModal, $ionicPopup, $state, AuthorizationService, Auth, UserService) {
    $scope.currentUser = {};
    $scope.registerData = {};


    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        $ionicLoading.show({
            template: 'Loading...'
        });


        AuthorizationService.login($scope.loginData).then(function(result) {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');


            if(result.wrppr_users == false){
                console.log('login failed: ' + result.message);

                $ionicPopup.alert({
                    title: 'Login failed',
                    template: result.message
                });

                return;
            }



            var user = result.wrppr_users;
            UserService.setUser(user);

            Auth.setCredentials($scope.loginData.UserName, $scope.loginData.Password);
            $scope.closeLogin();
            $scope.loginData = {};

            $state.go('app.search');


        });


    };


    $scope.doRegister = function(){
        $ionicLoading.show({
            template: 'Loading...'
        });

        console.log('start registration');

        AuthorizationService.createUser($scope.registerData).then(function(response) {

           $scope.currentUser = response;

            var user = response;
            UserService.setUser(user);

           $ionicLoading.hide();
           $scope.$broadcast('scroll.refreshComplete');

          $state.go('app.intro');

       }, function(error){
            alert('error');
        });
    }
});


