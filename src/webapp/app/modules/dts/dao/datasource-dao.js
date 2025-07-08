/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/20/2017
 */
(function () {
    'use strict';

    /**
     * @ngdoc object
     * @description
     * Data Access Object for dataset.
     * @usage
     * ```
     * angular.module('oplus.udp')
     *   .config(['datasetDaoProvider', function(datasetDaoProvider){
     *     datasetDaoProvider.useExcelData(true|false);
     *   }
     * ]);
     * ```
     */
    angular.module('oplus.dts').provider('datasourceDao', datasourceDaoProvider);

    datasourceDaoProvider.$inject = [];

    function datasourceDaoProvider() {

        var useLocalDb = false;
        this.useLocalDb = function (value) {
            useLocalDb = value;
        };

        this.$get = ['_datasourceLocalDao', '_datasourceRemoteDao', datasourceDaoFactory];

        function datasourceDaoFactory(datasourceLocalDao, datasourceRemoteDao) {
            return useLocalDb ? datasourceLocalDao : datasourceRemoteDao;
        }

    }
})();
