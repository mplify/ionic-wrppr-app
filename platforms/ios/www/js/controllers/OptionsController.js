var controllers = angular.module('App.controllers');

controllers.controller('OptionsCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, $ionicHistory, OptionService) {
    console.log('init options controller');
    console.log($rootScope.sessionData.options);
    $scope.showOptions = true;


    $rootScope.$ionicGoBack = function() {

        // before go back remove  from options
        if($state.is('app.options')){
            $rootScope.sessionData.options.pop();
        }
        $ionicHistory.goBack();
    };

    $scope.options = [

    ];

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
        console.log('selected option ' + option);

        $rootScope.sessionData.options.push(option);

        $state.go('app.options', { 'orgID' : $stateParams.orgID , 'parentID' : option.NodeID});
    }

});
