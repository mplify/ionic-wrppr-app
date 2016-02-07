var controllers = angular.module('App.controllers');

controllers.controller('AuthorizationCtrl', function ($scope, $ionicLoading, $ionicModal, $ionicPopup, $state, $stateParams, AuthorizationService, Auth, UserService, PasswordComplexity) {
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


        AuthorizationService.login($scope.loginData).then(function(loginResponse) {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');


            if(result.wrppr_users == false){
                console.log('login failed: ' + loginResponse.message);

                $ionicPopup.alert({
                    title: 'Login failed',
                    template: loginResponse.message
                });

                return;
            }

            var user = loginResponse.wrppr_users;
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

            //AuthorizationService.activateUser(user.id).then(function(response){});

           $ionicLoading.hide();
           $scope.$broadcast('scroll.refreshComplete');

          $state.go('app.intro');

       }, function(error){
            $ionicLoading.hide();

            if(error.error === "E_VALIDATION"){
                for(var attribute in error.invalidAttributes){
                    var inputKey = attribute.replace(/"/g,"");;

                    var validators = error.invalidAttributes[attribute];
                    for(var validatorIndex in validators){
                        $scope.registerForm[inputKey].$setValidity(validators[validatorIndex].rule, false);
                    }

                }

            }

            $ionicPopup.alert({
                title: 'Registration Failed',
                template: error.message
            });
        });
    }

    $scope.resetValidators = function(fieldName){
        $scope.registerForm[fieldName].$setValidity('unique', true);
        $scope.registerForm[fieldName].$setValidity('minLength', true);
    }




    $scope.$watch('registerData.Password', function(password) {
        var complexity = PasswordComplexity.check(password);
        $scope.registerData.passwordComplexity = complexity;

    });
});




