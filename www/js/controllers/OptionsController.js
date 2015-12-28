var controllers = angular.module('App.controllers');

controllers.controller('OptionsCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, OptionService) {


    $scope.showOptions = true;

    $scope.options = [

    ];

    $rootScope.sessionData.options = [];


    $scope.load = function(){


        $ionicLoading.show({
            template: 'Loading...'
        });

        OptionService.getOptions($stateParams.orgID, $stateParams.parentID).then(function(response) {
            $scope.options = response;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');

            // if no options redirect to actions
            if($scope.options.length == 0){
                $scope.showOptions = false;
            }
            else {
                $scope.showOptions = true;
            }

        });
    };


    $scope.currentOrganization = $stateParams.orgName;

    $scope.selectOption = function(option){
        console.log(option);

        $rootScope.sessionData.options.push(option);

        $state.go('app.options', { 'orgID' : $stateParams.orgID , 'parentID' : option.NodeID});
    }

});
