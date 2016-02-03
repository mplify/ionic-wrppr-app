var controllers = angular.module('App.controllers');

controllers.controller('RestorePasswordCtrl', function ($scope, $state, $log, $ionicLoading, $ionicPopup, AuthorizationService, PasswordComplexity) {
    $log.info('init restore password controller');
    $scope.userEmail = "";

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
});
