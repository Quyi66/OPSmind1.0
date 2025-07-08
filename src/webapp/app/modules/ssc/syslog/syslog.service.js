(function () {
    'use strict';
    angular
        .module('oplus.ssc')
        .factory('SyslogService', SyslogService);

    SyslogService.$inject = ['$resource', '$http', '$q'];

    function SyslogService($resource, $http, $q) {
        var resourceUrl = 'api/login-logs/:id';

        var service = $resource(resourceUrl, {}, {
            'query': {method: 'GET', isArray: false},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': {method: 'PUT'}
        });

        return service;
    }

})();
