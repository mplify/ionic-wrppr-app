var controllers = angular.module('App.controllers');

controllers.controller('FavoritesCtrl', ['$scope', '$rootScope', '$state', '$log', '$stateParams', '$ionicLoading', '$ionicHistory', 'MessageService', 'LocalDataService', 'OrganizationService', function ($scope, $rootScope, $state, $log, $stateParams, $ionicLoading, $ionicHistory, MessageService, LocalDataService, OrganizationService) {
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
        $rootScope.sessionData.organization = organization;
        $rootScope.sessionData.options = [];

        OrganizationService.getOrganization(organization.OrgID).then(function (success) {
            $log.info('load organization details');
            $rootScope.sessionData.organization = success;

            $state.go('app.options', { 'orgID': organization.OrgID, 'parentID': 0});
        }, function (err) {
            $log.error('failed to load org details selected in favorites', err);
        });


    };
}]);
