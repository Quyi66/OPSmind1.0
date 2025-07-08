/**
 * @author yangbin@famessoft.com, created on 2020/09/10
 */
(function () {
    'use strict';

    /**
     * @ngdoc
     * @private
     */
    angular.module('oplus.adm').service('tenantConfigDao', tenantConfigDao);

    tenantConfigDao.$inject = ['$http', 'restUtils'];

    /**
     * DAO for remote database
     * @param $http
     * @param restUtils {restUtils}
     */
    function tenantConfigDao($http, restUtils) {

        var module = "adm";

        this.exportPages = exportPages;
        this.exportConfigRelation = exportConfigRelation;
        this.exportConfigAnalysis = exportConfigAnalysis;
        this.importPagesRelation = importPagesRelation;
        this.importPagesAnalysis = importPagesAnalysis;
        this.findTenantConfigsById = findTenantConfigsById;
        this.findAllTenantConfigs = findAllTenantConfigs;

        function importPagesRelation(obj) {
            return restUtils.callApi(module, 'POST', '/api/adm/tenant-config/import/relation', null, obj);
        }

        function importPagesAnalysis(obj) {
            return restUtils.callApi(module, 'POST', '/api/adm/tenant-config/import/analysis', null, obj);
        }


        function findTenantConfigsById(id) {
            return restUtils.callApi(module, 'GET', '/api/adm/tenant-config/tree/{id}', {id: id});
        }

        function findAllTenantConfigs() {
            return restUtils.callApi(module, 'GET', '/api/adm/tenant-configs');
        }

        function exportConfigRelation(obj) {
            return restUtils.callApi(module, 'POST', '/api/adm/tenant-config/export/relation', null, obj);
        }

        function exportConfigAnalysis(obj) {
            return restUtils.callApi(module, 'POST', '/api/adm/tenant-config/export/analysis', null, obj);
        }

        function exportPages(tenantConfig) {
            var blob = new Blob([angular.toJson(tenantConfig)], {type: 'text/plain;charset=utf-8'});
            return saveAs(blob, 'oplus-tenant-config.json');
        }


    }
})();
