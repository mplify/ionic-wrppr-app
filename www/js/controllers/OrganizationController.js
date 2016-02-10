var controllers = angular.module('App.controllers');

controllers.controller('OrganizationsCtrl', function ($scope, $rootScope, $ionicLoading, $state, $log, OrganizationService) {

    $scope.organizations = [

    ];

    $scope.noMoreItemsAvailable = false;
    $scope.isLoading = false;


    $scope.search = {
        model : ""
    };

    $scope.load = function(searchText){
        console.log('load organizations '+ searchText);

        $ionicLoading.show({
            template: 'Loading...'
        });



        $scope.isLoading = true;
        OrganizationService.getOrganizations(searchText, $scope.organizations.length).then(function(response) {
            if(response.length == 0){
               $scope.noMoreItemsAvailable = true;
            }

            $scope.organizations = $scope.organizations.concat(response);

            $ionicLoading.hide();
            $scope.isLoading = false;

            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');

        });
    };

    $scope.loadNext = function(){
        $log.debug('load organizations next page');
        $scope.load($scope.search.model);
    }

    $scope.reload = function(searchText){
        $log.debug('reload organization list');
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
        // wait till prev load done
        if($scope.isLoading){
            $log.debug('skipped loading organization, prev is not done');
            return;
        }

        console.log('search organization model changed');
        $scope.reload(newVal);
    });


});
