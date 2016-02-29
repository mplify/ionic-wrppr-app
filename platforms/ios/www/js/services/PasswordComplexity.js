var services = angular.module('App.services');



services.factory('PasswordComplexity', function($log){
    return {
        check : function(password) {
            if(password === undefined || password.length === 0){
                return;
            }

            var complexity = "";
            if(password === undefined){
                password = "";
            }


            var hasUpperCase = /[A-Z]/.test(password);
            var hasLowerCase = /[a-z]/.test(password);
            var hasNumbers = /\d/.test(password);
            var hasNonalphas = /\W/.test(password);


            var characterGroupCount = hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas;

            $log.info('test password complexity ' + characterGroupCount);
            if((password.length >= 8) && (characterGroupCount >= 3)){
                complexity = 'green';
            }
            else if((password.length >= 8) && (characterGroupCount >= 2)){
                complexity = 'yellow col-67';
            }
            else {
                complexity = 'red col-33';
            }
            return complexity;
        }
    };
});
