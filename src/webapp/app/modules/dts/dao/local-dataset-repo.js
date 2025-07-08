"use strict";
/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 02/06/2018
 */
(function () {
    'use strict';

    /**
     * @ngdoc service
     * @description
     * Client dataset repository.
     */
    angular.module('oplus.dts').service('localDatasetRepo', localDatasetRepo);

    localDatasetRepo.$inject = ['$injector'];

    function localDatasetRepo($injector) {
        var localDatasets = [];
        this.defineLocalDataset = defineLocalDataset;
        this.getDaoInstance = getDaoInstance;
        this.getAllDatasets = getAllDatasets;

        function getAllDatasets() {
            return localDatasets;
        }

        /**
         *
         * @param {string} datasetCode Dataset code
         * @param {string} name Dataset name
         * @param {string} service Angular service name for actual DAO implementation
         */
        function defineLocalDataset(datasetCode, name, service) {
            localDatasets.push({code: datasetCode, name: name, service: service});
        }

        /**
         *
         * @param {string} datasetCode
         * @returns {*} Angular service
         */
        function getDaoInstance(datasetCode) {
            var def = _.find(localDatasets, {code: datasetCode});
            if (def) {
                if (!def.service) {
                    throw new ReferenceError('Local dataset "' + datasetCode + '" has no service');
                }
                var dao = $injector.get(def.service);
                if (!dao) {
                    throw new ReferenceError('Cannot find service instance for local dataset "' + datasetCode + '"');
                }
                return dao;
            }
            return null;
        }
    }
})();
