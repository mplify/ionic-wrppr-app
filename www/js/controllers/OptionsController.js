var controllers = angular.module('App.controllers');

controllers.controller('OptionsCtrl', function ($scope, $rootScope, $state, $stateParams) {
    $scope.options = [
        { title: 'Mobile Bank', id: 1 },
        { title: 'Cards', id: 2 }
    ];

    $scope.currentOrganization = $stateParams.orgName;

    $scope.selectOption = function(option){
        //$state.go('app.options', {"optionId" : option.title});
        $state.go('app.actions', {'orgName': $stateParams.orgName});
    }

});
