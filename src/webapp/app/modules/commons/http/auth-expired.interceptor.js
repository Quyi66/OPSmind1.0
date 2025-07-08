(function () {
    'use strict';

    angular
        .module('oplus.commons')
        .factory('authExpiredInterceptor', authExpiredInterceptor);

    authExpiredInterceptor.$inject = ['$rootScope', '$q', '$injector', '$localStorage', '$sessionStorage', 'currentUser'];

    function authExpiredInterceptor($rootScope, $q, $injector, $localStorage, $sessionStorage, currentUser) {
        var service = {
            responseError: responseError
        };

        return service;

        function responseError(response) {
            var clearAuthIf401 = false;
            if (response.status === 401 && clearAuthIf401) {
                //LEO@20170109
                // currentUser.clearUserInfo();
            }
            return $q.reject(response);
        }
    }
})();
