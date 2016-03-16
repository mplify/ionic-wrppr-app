var controllers = angular.module('App.controllers');

controllers.controller('OptionsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$log', '$ionicLoading', '$ionicHistory', '$ionicPopup', '$translate', 'OptionService', function ($scope, $rootScope, $state, $stateParams, $log, $ionicLoading, $ionicHistory, $ionicPopup, $translate, OptionService) {
    $log.debug('init options controller', $rootScope.sessionData.options);

    $scope.showOptions = true;
    $scope.organizationDetails = {};


    $rootScope.$ionicGoBack = function () {

        // before go back remove  from options
        if ($state.is('app.options')) {
            $rootScope.sessionData.options.pop();
        }
        $ionicHistory.goBack();
    };

    $scope.options = [

    ];



    $scope.filtered = [];
    $scope.recursiveFilter = function(items,id){
        angular.forEach(items,function(item){
            if(item.NodeID === id){
               $scope.filtered.push(item);
            }
            if(angular.isArray(item.items) && item.items.length > 0){
                $scope.recursiveFilter(item.items,id);
            }
        });
    };

    $scope.load = function () {




        if ($stateParams.parentID === "0") {
            $scope.options = $rootScope.organizationDetails.routes;
        }
        else {
           $scope.recursiveFilter($rootScope.organizationDetails.routes, $stateParams.parentID);
           $log.info('found parent node' , $scope.filtered);

            $scope.options = $scope.filtered[0].children;



        }

        // if no options redirect to actions
        if ($scope.options.length === 0) {
            $scope.showOptions = false;
        }
        else {
            $scope.showOptions = true;
        }




        /*OptionService.getOptions($stateParams.orgID, $stateParams.parentID).then(function (response) {
                $scope.options = response;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');

                // if no options redirect to actions
                if ($scope.options.length === 0) {
                    $scope.showOptions = false;
                }
                else {
                    $scope.showOptions = true;
                }

            },
            function (err) {
                $ionicPopup.alert({
                    title: $translate.instant("ROUTING.FAILED"),
                    template: err
                });
            }); */
    };


    $scope.currentOrganization = $stateParams.orgName;

    $scope.selectOption = function (option) {
        $log.info('selected option ' + option);

        $rootScope.sessionData.options.push(option);

        $state.go('app.options', { 'orgID': $stateParams.orgID, 'parentID': option.NodeID});
    };

}]);
