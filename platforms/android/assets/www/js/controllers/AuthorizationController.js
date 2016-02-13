var controllers = angular.module('App.controllers');

controllers.controller('AuthorizationCtrl', function ($scope, $ionicLoading, $ionicModal, $ionicPopup, $state, $log, $stateParams, LoginService, BasicAuthorizationService , UserService, PasswordComplexity, LocalDataService) {
    $log.info('init auth controller');

    $scope.registerData = {};
    $scope.loginData = {};

    $scope.loginSubmitted = false;

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        $log.info('Doing login', $scope.loginData);

        $ionicLoading.show({
            template: 'Loading...'
        });


        LoginService.login($scope.loginData).then(function(loginResponse) {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');


            if(loginResponse.wrppr_users == false){
                $log.error('login failed: ' + loginResponse.message);

                $ionicPopup.alert({
                    title: 'Login failed',
                    template: loginResponse.message
                });

                return;
            }

            var user = loginResponse.wrppr_users;
            LocalDataService.saveUser(user);
            LocalDataService.saveFacebookResponse({});

            BasicAuthorizationService.generateToken($scope.loginData.UserName, $scope.loginData.Password);



            $scope.loginData.UserName = "";
            $scope.loginData.Password = "";

            $state.go('app.search');


        },
        function(result){
            $ionicLoading.hide();
            $log.error('failed to login', result);
        });


    };


    $scope.doRegister = function(){
        $ionicLoading.show({
            template: 'Loading...'
        });

        $log.info('start registration');

        LoginService.createUser($scope.registerData).then(function(response) {
            BasicAuthorizationService.generateToken($scope.loginData.UserName, $scope.loginData.Password);

            var user = response;
            LocalDataService.saveUser(user);

            //LoginService.activateUser(user.id).then(function(response){});

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




