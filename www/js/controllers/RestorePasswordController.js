var controllers = angular.module('App.controllers');

controllers.controller('RestorePasswordCtrl', function ($scope, $state, $stateParams,  $log, $ionicLoading, $ionicPopup, AuthorizationService, PasswordComplexity) {
    $log.info('init restore password controller');
    $scope.userEmail = "";
    $scope.passwordMatch = true;



    $scope.doRestorePassword = function () {
        $ionicLoading.show({
            template: 'Sends email ...'
        });


        AuthorizationService.restorePassword($scope.userEmail).then(function () {
            $ionicLoading.hide();

            $ionicPopup.alert({
                title: 'Restore Password',
                template: 'Please checkout you  email for instructions'
            });

            $state.go('root');

        }, function () {
            $ionicLoading.hide();

            $ionicPopup.alert({
                title: 'Failed to restore',
                template: 'Please try again'
            });
        });
    }



    $scope.$watch('newPassword', function (password) {
        var complexity = PasswordComplexity.check(password);
        $scope.passwordComplexity = complexity;

    });

    $scope.$watch('repeatPassword', function(repeatPassword) {
       if(repeatPassword == undefined){
           return;
       }
       if(repeatPassword && $scope.newPassword === repeatPassword){
           $scope.passwordMatch = true;
       }
       else {
           $scope.passwordMatch = false;
       }
       console.log('password match ' + $scope.passwordMatch);
    });

    $scope.doChangePassword = function(){
        $log.info('change password');

        alert($stateParams.key);
    }
});
