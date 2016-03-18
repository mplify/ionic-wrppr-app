var controllers = angular.module('App.controllers');

controllers.controller('FavoritesCtrl', function ($scope, $rootScope, $state, $log, $stateParams, $ionicLoading, $ionicHistory, MessageService, LocalDataService, OrganizationService, OptionService) {
    $log.info('init favorites controller');

    $scope.organizations = [];

    $scope.userID = LocalDataService.loadUser().id;

    $scope.$on('$ionicView.enter', function () {
        if ($rootScope.reloadFavorites) {
            $scope.loadOrgs();
        }

    });


    $scope.loadOrgs = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });

        MessageService.getCompaniesWithMsgCount($scope.userID).then(function (response) {
                $scope.organizations = response;

                $rootScope.reloadFavorites = false;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            },
            function (err) {

                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    $scope.loadOrgs();

    $scope.selectOrganisation = function (organization) {

        $rootScope.sessionData.options = [];

        OptionService.getOptionsTree(organization.OrgID).then(
            function (success) {
                $log.info('loaded org details');
                $rootScope.organizationDetails = success;
                $rootScope.sessionData.organization = success;

                $state.go('app.options', { 'orgID' : organization.OrgID , 'parentID' : 0});
                $ionicLoading.hide();

            }, function (err) {
                $log.error('failed to load org details selected in favorites', err);
            });



    };
});
