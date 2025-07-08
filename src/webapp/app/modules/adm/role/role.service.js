(function() {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('Role', Role);

    Role.$inject = ['$resource','$http','$q'];

    function Role ($resource,$http,$q) {
        var resourceUrl =  'api/roles/:id';

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


        service.updateRolePermissions = function (roles) {
            var deferred = $q.defer();//声明承诺
            $http.put("api/roles/permissions", roles)
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };


        return service;

    }
})();
