/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/20/2017
 */
(function () {
    'use strict';

    angular.module('oplus.dts').provider('datasetDao', datasetDaoProvider);

    /**
     * @ngdoc object
     * @name datasetDao
     * @description
     * Data Access Object for dataset.
     * @usage
     * ```
     * angular.module('oplus.udp')
     *   .config(['datasetDaoProvider', function(datasetDaoProvider){
     *     datasetDaoProvider.useLocalDb(true|false);
     *   }
     * ]);
     * ```
     */
    function datasetDaoProvider() {
        var isLocalDb = false;

        this.useLocalDb = function (value) {
            isLocalDb = value;
        };

        this.$get = ['$q', '_datasetRemoteDao', 'localDatasetRepo', datasetDaoFactory];

        function datasetDaoFactory($q, _datasetRemoteDao, localDatasetRepo) {
            // Use clone to prevent call itself
            var dao = _.clone(_datasetRemoteDao);

            dao.queryDataset = function (code, params, pagination) {
                return getDao(code).queryDataset(code, params, pagination);
            };
            dao.queryDatasetMeta = function (code, params) {
                return getDao(code).queryDatasetMeta(code, params);
            };
            dao.findAllDatasets = function () {
                if (isLocalDb) {
                    return $q(function (resolve, reject) {
                        resolve(localDatasetRepo.getAllDatasets());
                    });
                }
                return $q(function (resolve, reject) {
                    _datasetRemoteDao.findAllDatasets().then(function (data) {
                        resolve(data.concat(localDatasetRepo.getAllDatasets()));
                    }).catch(function (err) {
                        reject(err);
                    });
                });
            };
            return dao;

            function getDao(code) {
                var ins = localDatasetRepo.getDaoInstance(code);
                return ins || _datasetRemoteDao;
            }
        }
    }
})();
