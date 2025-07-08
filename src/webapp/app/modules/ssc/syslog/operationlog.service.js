(function () {
    'use strict';
    angular
        .module('oplus.ssc')
        .factory('OperationlogService', OperationlogService);

    OperationlogService.$inject = ['$resource', '$http', '$q'];

    function OperationlogService($resource, $http, $q) {
        var resourceUrl = 'api/operation-logs/:id';

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
