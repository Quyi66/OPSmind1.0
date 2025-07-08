(function() {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('Dict', Dict);

    Dict.$inject = ['$resource','$http','$q'];

    function Dict ($resource,$http,$q) {
        var resourceUrl =  'api/dicts/:id';

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

        service.delDicts = function (idList) {
            var deferred = $q.defer();//声明承诺
            $http({
                method: 'DELETE',
                url: 'api/dicts/delete',
                params:{'idList':idList}
            }).then(function successCallback(response) {
                deferred.resolve(response.data);//请求成功
            }, function errorCallback(response) {
                deferred.reject(response.data);//请求成功
            });

            return deferred.promise;   // 返回承诺
        };

        service.getDictByCode = function (code) {
            var deferred = $q.defer();//声明承诺
            var url = 'api/dicts/code/'+code;
            $http({
                method: 'GET',
                url: url,
            }).then(function successCallback(response) {
                deferred.resolve(response.data);//请求成功
            }, function errorCallback(response) {
                deferred.reject(response.data);//请求成功
            });

            return deferred.promise;   // 返回承诺
        };

        return service;

    }
})();
