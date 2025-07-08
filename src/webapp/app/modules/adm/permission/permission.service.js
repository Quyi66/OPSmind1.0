(function() {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('Permission', Permission);

    Permission.$inject = ['$resource','$q','$http'];

    function Permission ($resource,$q,$http) {
        var resourceUrl =  'api/permissions/:id';

        var service = $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                    }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });

        return service;

    }
})();
