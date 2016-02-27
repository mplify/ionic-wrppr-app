var controllers = angular.module('App.controllers');

controllers.controller('UserCtrl', function ($scope, $rootScope, $log, $translate, $ionicLoading, UserService, LocalDataService) {


    $scope.loadUserDetails = function(userId){
        UserService.loadUser(userId).then(function(userDetails){
            $scope.user = userDetails;

        }, function(error){
            $log.error('failed to load user details');
        });

    };



    $scope.load = function(){
        $log.info('load user details from local storage');

        $scope.localUser = LocalDataService.loadUser();
        $scope.localFBUser = LocalDataService.getFacebookResponse();
        $scope.sessionKey = LocalDataService.getBaseToken();
        $scope.networkStatus = LocalDataService.getNetworkState();
        $scope.networkType = LocalDataService.getNetworkType();


        if($scope.localUser.id){
            $scope.loadUserDetails($scope.localUser.id);
        }
    };

    $scope.load();
    $scope.$on('$ionicView.enter', function(){$scope.load();});

    $scope.switchLanguage = function(){
        $translate.use("en");

        $ionicLoading.show({
            template: 'Switching language ...'
        });
        $translate.refresh();

    };

    $rootScope.$on('$translateRefreshEnd', function () {

        $ionicLoading.hide();
    });

});


