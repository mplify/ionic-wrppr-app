var controllers = angular.module('App.controllers');

controllers.controller('OptionsCtrl', function ($scope, $rootScope, $state, $stateParams, $ionicLoading, OptionService) {
    console.log('init options controller');
    console.log($rootScope.sessionData.options);
    $scope.showOptions = true;

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

        // FIXME support for Back button, remove if options will be retrived from sails
        for (var i in $rootScope.sessionData.options) {
            var o = $rootScope.sessionData.options[i];
            if(o.ParentNode === option.NodeID && option.ParentNode !== 0){
                $rootScope.sessionData.options.splice(i, 1);
            }

            if(o.ParentNode === option.ParentNode && option.ParentNode !== 0){
                $rootScope.sessionData.options.splice(i, 1);
            }
        }

        $rootScope.sessionData.options.push(option);

        $state.go('app.options', { 'orgID' : $stateParams.orgID , 'parentID' : option.NodeID});
    }

});
