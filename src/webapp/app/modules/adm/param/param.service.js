(function () {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('Param', Param);

    Param.$inject = ['$resource', '$http', '$q'];

    function Param($resource, $http, $q) {
        var resourceUrl = 'api/params/:id';

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

        service.getByDomainAndName = function (domain, name) {
            var deferred = $q.defer();
            $http.get("api/params/" + domain + "/" + name)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }

        service.getByDomain = function (domain) {
            var deferred = $q.defer();
            $http.get("api/params/query?domain=" + domain)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }
        service.batchUpdate = function (paramList) {
            var deferred = $q.defer();
            $http.post("api/params/multi-update",paramList)
                .success(function (data) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject(data);
                });
            return deferred.promise;
        }

        return service;
    }

})();
