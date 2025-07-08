(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('Ldap', Ldap);

    Ldap.$inject = ['$resource'];

    function Ldap ($resource) {
        var service = $resource('api/users/sync', {}, {
            'syncLdapUsers': {
                method: 'GET',
                isArray: true
            }
        });
        return service;
    }
})();
