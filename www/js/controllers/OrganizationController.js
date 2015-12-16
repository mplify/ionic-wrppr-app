var controllers = angular.module('App.controllers');

controllers.controller('OrganizationsCtrl', function ($scope, $ionicLoading, $state, OrganizationService) {
    $scope.organizations = [

    ];


    $scope.search = {};

    $scope.load = function(searchText){

        $ionicLoading.show({
            template: 'Loading...'
        });

        OrganizationService.getOrganizations(searchText).then(function(response) {
            $scope.organizations = response;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');

        });
    };

    $scope.selectOrganisation = function(organisation){
        console.log('organisation selected ' + organisation.orgName);

        $state.go('app.options', { 'orgName' : organisation.orgName });
    }

    $scope.$watch('search.model', function(newVal, oldVal){
        $scope.load(newVal);
    });


});
