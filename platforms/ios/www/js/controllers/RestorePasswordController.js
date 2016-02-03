var controllers = angular.module('App.controllers');

controllers.controller('RestorePasswordCtrl', function ($scope, AuthorizationService) {
   $scope.email = "";

   $scope.doRestorePassword = function(){
        AuthorizationService.restorePassword($scope.email).then(function(){alert('success');}, function(){alert('fail');});
   }
});
