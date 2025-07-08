(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('Register', Register);

    Register.$inject = ['$resource'];

    function Register ($resource) {
        return $resource('api/register', {}, {});
    }
})();
