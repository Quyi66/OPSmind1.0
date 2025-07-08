/**
 *
 * @author wuqiang@famessoft.com, created on 2020/08/10
 */
(function () {
    'use strict';

    angular.module('oplus.adm').service('tenantConfigService', tenantConfigService);


    tenantConfigService.$inject = ['tenantConfigDao'];

    /**
     * Service for param
     * @param tenantConfigDao {localDaoFactory}
     * @param $q
     * @param restUtils {restUtils}
     */
    function tenantConfigService(tenantConfigDao) {
        this.exportConfigRelation = tenantConfigDao.exportConfigRelation;
        this.exportConfigAnalysis = tenantConfigDao.exportConfigAnalysis;
        this.exportPages = tenantConfigDao.exportPages;
        this.importPagesRelation = tenantConfigDao.importPagesRelation;
        this.importPagesAnalysis = tenantConfigDao.importPagesAnalysis;
        this.findTenantConfigsById = tenantConfigDao.findTenantConfigsById;
        this.findAllTenantConfigs = tenantConfigDao.findAllTenantConfigs;
        this.exportConfig = tenantConfigDao.exportConfig;

    }

})();

