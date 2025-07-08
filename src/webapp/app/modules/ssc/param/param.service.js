/**
 *
 * @author wuqiang@famessoft.com, created on 2020/08/10
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').service('paramService', paramService);



    paramService.$inject = ['paramDao'];

    /**
     * Service for param
     * @param paramDao {localDaoFactory}
     * @param $q
     * @param restUtils {restUtils}
     */
    function paramService(paramDao) {

        this.findParamByTenantId = paramDao.findParamByTenantId;
        this.findAllParam = paramDao.findAllParam;
        this.findParamById = paramDao.findParamById;
        this.saveParam = paramDao.saveParam;
        this.deleteParam = paramDao.deleteParam;

    }

})();

