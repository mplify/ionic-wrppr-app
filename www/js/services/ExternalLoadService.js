var services = angular.module('App.services');

services.service('ExternalLoad', function(LocalDataService,  $state, $log){
    var getParameterByName = function(url, name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(url);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    return {
        checkExternalLoad : function(){
            var url = LocalDataService.getExternalURL();

            if(url && url.indexOf('changepassword') > - 1){
                $log.info('redirect to change password screen');

                var key = getParameterByName(url, 'key');

                $state.go('changepassword', {
                    'key' : key
                });
                LocalDataService.clearExternalURL();
            }
        }
    }

});