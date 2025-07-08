(function () {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('Subordinate', Subordinate);

    Subordinate.$inject = ['$resource', '$q', '$http'];

    function Subordinate($resource, $q, $http) {
        var resourceUrl = 'api/subordinates/:id';

        var resource = $resource(resourceUrl, {}, {
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


        function getUserByLeader(leaderId) {
            var deferred = $q.defer();

            $http.get('api/subordinates/' + leaderId + '/users').then(function (response) {
                deferred.resolve(response);
            });

            return deferred.promise;
        }

        function getSubordinateTree() {
            var deferred = $q.defer();

            $http.get('api/subordinates/tree').then(function (response) {
                deferred.resolve(response);
            });

            return deferred.promise;
        }

        return {
            query: resource.query,
            get: resource.get,
            update: resource.update,
            getUserByLeader: getUserByLeader,
            getSubordinateTree: getSubordinateTree
        }
    }
})();
