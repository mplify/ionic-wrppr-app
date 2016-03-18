var controllers = angular.module('App.controllers');

controllers.controller('RestorePasswordCtrl', ['$scope', '$state', '$stateParams', '$log', '$ionicLoading', '$ionicPopup', 'LoginService', 'PasswordComplexity', 'UserService', function ($scope, $state, $stateParams,  $log, $ionicLoading, $ionicPopup, LoginService, PasswordComplexity, UserService) {
    $log.info('init restore password controller');
    $scope.newPassword = "";
    $scope.passwordMatch = true;



    $scope.doRestorePassword = function () {
        $ionicLoading.show({
            template: 'Sends email ...'
        });


        LoginService.restorePassword($scope.username).then(function () {
            $ionicLoading.hide();

            $ionicPopup.alert({
                title: 'Restore Password',
                template: 'Please checkout you  email for instructions'
            });

            $state.go('root');

        }, function (error) {
            $ionicLoading.hide();

            var message = error;
            if(error.message){
                message = error.message;
            }

            $ionicPopup.alert({
                title: 'Failed to restore',
                template: message
            });
        });
    };



    $scope.$watch('newPassword', function (password) {
        var complexity = PasswordComplexity.check(password);
        $scope.passwordComplexity = complexity;

    });

    $scope.$watch('repeatPassword', function(repeatPassword) {
       if(repeatPassword === undefined){
           return;
       }
       if(repeatPassword && $scope.newPassword === repeatPassword){
           $scope.passwordMatch = true;
       }
       else {
           $scope.passwordMatch = false;
       }


       $log.info('password match ' + $scope.passwordMatch);
    });

    $scope.doChangePassword = function(){
        $ionicLoading.show({
            template: 'Saving ..'
        });

        $log.info('change password');

        var key = $stateParams.key;

        UserService.changePassword(key,  $scope.newPassword).then(
            function(success){
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: 'Password saved',
                    template: 'Try to login with new password'
                });

                $state.go('root');
            },
            function(err){
                $ionicLoading.hide();

                $ionicPopup.alert({
                    title: 'Failed to change password',
                    template: 'Please try again'
                });
            }
        );


    };
}]);
