var controllers = angular.module('App.controllers');

controllers.controller('OrganizationsCtrl', ['$scope', '$rootScope', '$ionicLoading', '$ionicModal', '$templateCache', '$state', '$log', 'OrganizationService', 'LocalDataService', function ($scope, $rootScope, $ionicLoading, $ionicModal, $templateCache, $state, $log, OrganizationService, LocalDataService) {
    $log.info('init organizations controller');
    $scope.introVisited = LocalDataService.getIntroScreenVisited();


    $scope.showIntro = function () {
        var user = LocalDataService.loadUser();

        $scope.userName = user.UserName;

        $scope.modal = $ionicModal.fromTemplate($templateCache.get('intro.html'), {
            scope: $scope
        });
        $scope.modal.show();
    };



    $scope.$on('$ionicView.enter', function () {
        if(!$scope.introVisited){
            $scope.showIntro();
        }

    });



    $scope.hideIntro = function(){
        LocalDataService.setIntroScreenVisited(true);
        $scope.introVisited = true;
        $scope.modal.hide();
        $scope.modal.remove();
    };


    $scope.organizations = [

    ];



    $scope.noMoreItemsAvailable = false;
    $scope.isLoading = false;


    $scope.search = {
        model : ""
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.reload();
    });

    $scope.load = function(searchText){
        $log.info('load organizations '+ searchText);

        $ionicLoading.show({
            template: 'Loading...'
        });



        $scope.isLoading = true;

        OrganizationService.getOrganizations(searchText, $scope.organizations.length).then(function(response) {

            if(response.length === 0){
               $scope.noMoreItemsAvailable = true;
            }


            $scope.organizations = $scope.organizations.concat(response);



            $ionicLoading.hide();
            $scope.isLoading = false;

            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');

        },
        function(error){
            $log.error('Failed to load organizations', error);
            $ionicLoading.hide();
            $scope.isLoading = false;



        }
        );
    };

    $scope.loadNext = function(){

        $log.debug('load organizations next page');
        $scope.load($scope.search.model);
    };

    $scope.reload = function(searchText){
        $log.debug('reload organization list');
        $scope.organizations = [];
        $scope.noMoreItemsAvailable = false;
        $scope.load(searchText);
    };

    $scope.selectOrganisation = function(organization){
        $rootScope.sessionData.organization = organization;
        $rootScope.sessionData.options = [];
        $log.info('organisation selected ' + organization.orgName);


        $state.go('app.options', { 'orgID' : organization.id , 'parentID' : 0});
    };

    $scope.$watch('search.model', function(newVal, oldVal){
        // wait till prev load done
        if($scope.isLoading){
            $log.debug('skipped loading organization, prev is not done');
            return;
        }



        $log.info('search organization model changed: ' + newVal + oldVal);
        $scope.reload(newVal);
    });



}]);
