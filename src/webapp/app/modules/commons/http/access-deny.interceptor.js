(function () {
    'use strict';

    angular
        .module('oplus.commons')
        .factory('accessDenyInterceptor', accessDenyInterceptor);

    accessDenyInterceptor.$inject = ['$q', 'messageService'];

    function accessDenyInterceptor($q, messageService) {
        var service = {
            responseError: responseError
        };

        return service;

        function responseError(response) {
            // Disable show 403 error
            // console.log("responseError");
            // if (response.status === 403 && response.data != null && response.data.path.indexOf("/api/account") == -1) {
            //     var title = response.data.error;
            //     var message =response.data.message +  "<br>[Path = " + response.data.path + "]";
            //     messageService.alertError(title, message);
            // }
            return $q.reject(response);
        }
    }
})();
