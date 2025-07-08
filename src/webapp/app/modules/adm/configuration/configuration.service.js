(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .factory('JhiConfigurationService', JhiConfigurationService);

    JhiConfigurationService.$inject = ['$filter', '$http', '$q'];

    function JhiConfigurationService($filter, $http, $q) {
        var service = {
            get: get,
            getEnv: getEnv,
            hotReloadShiro: hotReloadShiro
        };

        return service;

        function get() {
            return $http.get('management/configprops').then(getConfigPropsComplete);

            function getConfigPropsComplete(response) {
                var properties = [];
                angular.forEach(response.data, function (data) {
                    properties.push(data);
                });
                var orderBy = $filter('orderBy');
                return orderBy(properties, 'prefix');
            }
        }

        function getEnv() {
            return $http.get('management/env').then(getEnvComplete);

            function getEnvComplete(response) {
                var properties = {};
                angular.forEach(response.data, function (val, key) {
                    var vals = [];
                    angular.forEach(val, function (v, k) {
                        vals.push({key: k, val: v});
                    });
                    properties[key] = vals;
                });
                return properties;
            }
        }

        function hotReloadShiro() {
            //console.log("Run hotReloadShiro");
            return $http.get('api/shiro/reload').then(function (result, status) {
                return "Success";
            });
        }
    }
})();
