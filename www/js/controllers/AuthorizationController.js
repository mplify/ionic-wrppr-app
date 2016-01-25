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

            //$scope.loginData.UserName = "marykiselova@gmail.com";
            //$scope.loginData.Password = "facebook CAAOJstuInwIBAPPtRGV1JP8nLxw47FhQzoejXMZA8CwP6uUyPgO6LHwHCLxtNydIiB8tVpdLQIanJY0QBpvZCLpxBgcdAseW7lhTSezBrWhGYe2Iv7CoEzkLy9ZAzF7dmOEF2LDO4hldORVnoc6DgNmBBdiHAl1ZBLVEZBwr59F9JYo7vc0Ihes2ZA2i7roNJllreDzkVcwCmZAU0S9GS9pOZA8OOKpC4JVpQrKGxzt5xQZDZD";

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

    $scope.$watch('registerData.Password', function(password, oldValue) {

        var hasUpperCase = /[A-Z]/.test(password);
        var hasLowerCase = /[a-z]/.test(password);
        var hasNumbers = /\d/.test(password);
        var hasNonalphas = /\W/.test(password);
        var characterGroupCount = hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas;

        console.log('test password complexity ' + characterGroupCount);
        if((password.length >= 8) && (characterGroupCount >= 3)){
            $scope.registerData.passwordComplexity = 'green';
        }
        else if((password.length >= 8) && (characterGroupCount >= 2)){
            $scope.registerData.passwordComplexity = 'yellow col-67';
        }
        else {
            $scope.registerData.passwordComplexity = 'red col-33';
        }
    });
});




