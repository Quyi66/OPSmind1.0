(function () {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('BusinessModule', BusinessModule);

    BusinessModule.$inject = ['$resource', '$http', '$q'];

    function BusinessModule($resource, $http, $q) {
        var resourceUrl = 'api/business-modules/:id';

        var service = $resource(resourceUrl, {}, {
            'query': {method: 'GET', isArray: true},
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
