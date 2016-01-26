var controllers = angular.module('App.controllers');

controllers.controller('OrganizationsCtrl', function ($scope, $rootScope, $ionicLoading, $state, OrganizationService, Auth, $http) {

    $scope.organizations = [

    ];

    $scope.noMoreItemsAvailable = false;


    $scope.search = {
        model : ""
    };

    $scope.load = function(searchText){
        console.log('load organizations '+ searchText);

        $ionicLoading.show({
            template: 'Loading...'
        });

        //FIXME replace with real impl
        if ( $scope.organizations.length >= 99 ) {
            alert('done');
            $scope.noMoreItemsAvailable = true;
        }

        if($scope.organizations.length > 0){
            var lastId =  $scope.organizations[$scope.organizations.length -1].id ;
        }


        OrganizationService.getOrganizations(searchText, lastId).then(function(response) {

            $scope.organizations = $scope.organizations.concat(response);

            $ionicLoading.hide();

            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');

        });
    };

    $scope.loadNext = function(){
        $scope.load($scope.search.model);
    }

    $scope.reload = function(searchText){
        $scope.organizations = [];
        $scope.noMoreItemsAvailable = false;
        $scope.load(searchText);
    }

    $scope.selectOrganisation = function(organization){
        $rootScope.sessionData.organization = organization;
        $rootScope.sessionData.options = [];
        console.log('organisation selected ' + organization.orgName);


        $state.go('app.options', { 'orgID' : organization.id , 'parentID' : 0});
    }

    $scope.$watch('search.model', function(newVal, oldVal){
        console.log('search organization model changed');
        $scope.reload(newVal);
    });


});
