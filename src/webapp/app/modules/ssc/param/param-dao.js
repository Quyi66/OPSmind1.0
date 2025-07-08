/**
 * @author wuqiang@famessoft.com, created on 2020/08/10
 */
(function () {
    'use strict';

    /**
     * @ngdoc
     * @private
     */
    angular.module('oplus.ssc').service('paramDao', paramRemoteDao);

    paramRemoteDao.$inject = ['$http', 'restUtils'];

    /**
     * DAO for remote database
     * @param $http
     * @param restUtils {restUtils}
     */
    function paramRemoteDao($http, restUtils) {

        var module = "adm";

        this.findParamByTenantId = findParamByTenantId;
        this.findAllParam = findAllParam;
        this.findParamById = findParamById;
        this.saveParam = saveParam;
        this.deleteParam = deleteParam;

        function findParamByTenantId() {
            return restUtils.callApi(module, 'GET', '/api/adm/tenant-param');
        }

        function findAllParam(options) {
            return restUtils.callApi(module, 'GET', '/api/adm/tenant-param');
        }

        function saveParam(id) {
            if (!id) {
                return restUtils.callApi(module, 'POST', '/api/adm/tenant-param', null, id);
            } else {
                return restUtils.callApi(module, 'PUT', '/api/adm/tenant-param', null, id);
            }
        }

        function findParamById(id) {
            return restUtils.callApi(module, 'GET', '/api/adm/tenant-param/{id}', {id: id});
        }

        function deleteParam(id) {
            return restUtils.callApi(module, 'DELETE', '/api/adm/tenant-param/{id}', {id: id});
        }



    }
})();
