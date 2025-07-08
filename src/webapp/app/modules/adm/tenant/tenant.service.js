(function () {
    'use strict';
    angular
        .module('oplus.adm')
        .factory('Tenant', Tenant);

    Tenant.$inject = ['$resource', 'currentUser','restUtils','$http'];

    function Tenant($resource, currentUser,restUtils,$http) {
        var resourceUrl = 'api/tenants/:id';

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



        service.exportConfigRelation = function(obj) {
            return restUtils.callApi('adm', 'POST', '/api/adm/tenant-config/export/relation', null, obj);
        }

        service.exportConfigAnalysis = function(obj) {
            return restUtils.callApi('adm', 'POST', '/api/adm/tenant-config/export/analysis', null, obj);
        }

        service.importPagesRelation = function(obj) {
            return restUtils.callApi('adm', 'POST', '/api/adm/tenant-config/import/relation', null, obj);
        }

        service.importPagesAnalysis = function(obj) {
            return restUtils.callApi('adm', 'POST', '/api/adm/tenant-config/import/analysis', null, obj);
        }

        service.findAllTenantConfigs = function() {
            return restUtils.callApi('adm', 'GET', '/api/adm/tenant-configs');
        }

        service.findTenantConfigsById = function (id) {
            return restUtils.callApi('adm', 'GET', '/api/adm/tenant-config/tree/{id}', {id: id});
        }

        service.exportPages = function(tenantConfig) {
            var blob = new Blob([angular.toJson(tenantConfig)], {type: 'text/plain;charset=utf-8'});
            return saveAs(blob, 'oplus-tenant-config.json');
        }
        return service;

    }
})();
