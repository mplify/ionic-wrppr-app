var controllers = angular.module('App.controllers');

controllers.controller('AuthorizationCtrl', function ($scope, $ionicLoading, $ionicModal, $ionicPopup, $state, $stateParams, AuthorizationService, Auth, UserService) {
    console.log('init auth controller');

    $scope.registerData = {};
    $scope.loginData = {};

    $scope.loginSubmitted = false;

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
            $scope.loginData.UserName = "";
            $scope.loginData.Password = "";

            $state.go('app.search');


        },
        function(result){
            $ionicLoading.hide();
            console.log('failed to login' + result);
        });


    };


    $scope.doRegister = function(){
        $ionicLoading.show({
            template: 'Loading...'
        });

        console.log('start registration');

        AuthorizationService.createUser($scope.registerData).then(function(response) {
            Auth.setCredentials($scope.loginData.UserName, $scope.loginData.Password);

            var user = response;
            UserService.setUser(user);

           $ionicLoading.hide();
           $scope.$broadcast('scroll.refreshComplete');

          $state.go('app.intro');

       }, function(error){
            $ionicLoading.hide();

            $ionicPopup.alert({
                title: 'Registration Failed',
                template: error.message
            });
        });
    }
});


