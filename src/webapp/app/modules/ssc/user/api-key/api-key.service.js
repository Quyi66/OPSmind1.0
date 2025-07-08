(function() {
    'use strict';
    angular
        .module('oplus.ssc')
        .factory('ApiKey', ApiKey);

    ApiKey.$inject = ['$resource', '$http', '$q'];

    function ApiKey ($resource, $http, $q) {
        var service = $resource('api/apikey/:id', {}, {
            'get': {
                method: 'GET',
                transformResponse: res => res ? angular.fromJson(res) : res,
            },
            'save': {
                method: 'POST',
                transformResponse: res => res,
            },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' },
        });


        service.enableApiKey = function (id) {
            var deferred = $q.defer();//声明承诺
            $http.put("api/apikey/enable/" + id)
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        service.discardApiKey = function (id) {
            var deferred = $q.defer();//声明承诺
            $http.put("api/apikey/discard/" + id)
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        service.generateApiKey = function (id) {
            var deferred = $q.defer(); //声明承诺
            $http({
                method: 'POST',
                url: `api/apikey/generate/${id}`,
                transformResponse: res => res,
            })
            .success(function (data) {
                deferred.resolve(data); //请求成功
            })
            .error(function (data) {
                deferred.reject(data); //请求成功
            });
            return deferred.promise; // 返回承诺
        };

        return service;

    }
})();
