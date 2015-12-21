var controllers = angular.module('App.controllers');

controllers.controller('OptionsCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, OptionService) {
    $scope.options = [
        { title: 'Mobile Bank', id: 1 },
        { title: 'Cards', id: 2 }


    ];


    $scope.load = function(searchText){

        $ionicLoading.show({
            template: 'Loading...'
        });

        OptionService.getOptions(searchText).then(function(response) {
            $scope.options = response;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');

        });
    };


    $scope.currentOrganization = $stateParams.orgName;

    $scope.selectOption = function(option){
        //$state.go('app.options', {"optionId" : option.title});
        $state.go('app.actions', {'orgName': $stateParams.orgName});
    }

});
