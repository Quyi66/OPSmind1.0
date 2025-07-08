(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('licenseService', licenseService);

    licenseService.$inject = ['$resource', '$http', '$q', 'Upload'];

    function licenseService($resource, $http, $q, Upload) {

        var service = {
            register: register,
            verify: verify,
            license: license,
            isEnabled: isEnabled
        };
        return service;

        function register(licenseFile) {
            var deferred = $q.defer();//声明承诺
            Upload.upload({
                url: 'api/licenses/activate/v2',
                file: licenseFile
            }).then(function successCallback(response) {
                deferred.resolve(response.data);//请求成功
            }, function errorCallback(response) {
                deferred.reject(response.data);//请求成功
            });

            return deferred.promise;   // 返回承诺
        }

        function verify() {
            var deferred = $q.defer();//声明承诺
            var url = 'api/licenses/verify';
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                deferred.resolve(response.data);//请求成功
            }, function errorCallback(response) {
                deferred.reject(response.data);//请求成功
            });
            return deferred.promise;   // 返回承诺
        }


        function license() {
            var deferred = $q.defer();//声明承诺
            var url = 'api/licenses/license';
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                deferred.resolve(response.data);//请求成功
            }, function errorCallback(response) {
                deferred.reject(response.data);//请求成功
            });
            return deferred.promise;   // 返回承诺
        }

        function isEnabled() {
            var deferred = $q.defer();//声明承诺
            var url = 'api/licenses/enabled';
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                deferred.resolve(response.data);//请求成功
            }, function errorCallback(response) {
                deferred.reject(response.data);//请求成功
            });
            return deferred.promise;   // 返回承诺
        }

    }
})();
