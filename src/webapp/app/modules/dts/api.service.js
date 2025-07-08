/**
 *
 * @author chen,shu-bin, created on 08/02/2018
 */
(function () {
    'use strict';

    angular.module('oplus.dts').service('apiService', apiService);

    apiService.$inject = ['$q', 'restUtils'];

    /**
     * Service for api
     * @param $q
     * @param restUtils {restUtils}
     */
    function apiService($q, restUtils) {

        var module = "dts";

        /**
         * Get store apis query result.
         * GET /api/dts/store/apis
         * @returns {*}
         */
        this.findStoreApi = function() {
            return restUtils.callApi(module, 'GET', '/api/dts/store/apis');
        }

        /**
         * Get a publisher apis query result.
         * GET /api/dts/publisher/apis
         * @returns {*}
         */
        this.findSwaggerApi = function() {
            return restUtils.callApi(module, 'GET', '/api/dts/publisher/apis');
        }

        /**
         * Put a apis update result.
         * PUT /api/dts/publisher/apis
         * @param apis {object} update swagger object
         * @returns {*}
         */
        this.saveSwaggerApi = function(paths) {
            return restUtils.callApi(module, 'PUT', '/api/dts/publisher/apis', null, paths);
        }


    }

})();
