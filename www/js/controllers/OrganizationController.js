var controllers = angular.module('App.controllers');

controllers.controller('OrganizationsCtrl', function ($scope, $rootScope, $ionicLoading, $state, OrganizationService, Auth, $http) {

    $scope.organizations = [

    ];


    $scope.search = {
        model : ""
    };

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

    $scope.selectOrganisation = function(organization){
        $rootScope.sessionData.organization = organization;
        console.log('organisation selected ' + organization.orgName);
        console.log(organization);

        $state.go('app.options', { 'orgID' : organization.id , 'parentID' : 0});
    }

    $scope.$watch('search.model', function(newVal, oldVal){
        $scope.load(newVal);
    });


});
