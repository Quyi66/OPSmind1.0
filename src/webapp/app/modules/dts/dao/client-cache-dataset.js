/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/20/2017
 */
(function () {
    'use strict';
    angular.module('oplus.dts').service('clientCacheDataset', clientCacheDataset);

    clientCacheDataset.$inject = ['$q', 'localDatasetRepo', 'datasetDao', '$translate'];

    angular.module('oplus.dts').run(['localDatasetRepo', 'clientCacheDataset', '$translate',
        function (localDatasetRepo, clientCacheDataset, $translate) {
            clientCacheDataset.defineDataset('CACHE_UP_REALTIME', 'UP_' + $translate.instant('dts.cache.realtime_transaction_volume'), 'UP_' + $translate.instant('dts.cache.realtime_transaction_volume') + '（' + $translate.instant('dts.cache.cache') + '）');
        }]);

    /**
     *
     * @param {datasetDao} datasetDao
     * @param {localDatasetRepo} localDatasetRepo
     */
    function clientCacheDataset($q, localDatasetRepo, datasetDao, $translate) {
        var cache = {records: [], lastRead: 0}, registry = {};
        this.queryData = queryData;
        this.queryMeta = queryMeta;
        this.defineDataset = defineDataset;

        // function isDatasetDefined(key) {
        //     return registry[key] && registry[key].dataset;
        // }
        //
        // function getAllDatasets() {
        //     var all = [];
        //     Object.keys(registry).forEach(function (k) {
        //         all.push({code: k, name: registry[k].dataset + '（缓存）'});
        //     });
        //     return all;
        // }

        function queryData(key, params) {
            var d = $q.defer();
            cache[key] = cache[key] || {records: [], numOfGroups: 0, cursor: 0};
            if (needPullData(key)) {
                pullDataFromDao(key, params).then(function (result) {
                    cache[key] = {records: result.records, numOfGroups: result.numOfGroups, cursor: 0};
                    d.resolve({records: filterByGroup()});
                }).catch(function (err) {
                    throw err;
                });
            } else {
                var data = {records: filterByGroup()};
                d.resolve(data);
            }
            return d.promise;

            function filterByGroup() {
                var cursor = cache[key].cursor;
                cache[key].cursor++;
                return _.filter(cache[key].records, function (r) {
                    return r._group === cursor;
                }) || [];
            }
        }

        function needPullData(key) {
            // var leadGroup = 1;
            // console.log('needPullData', cache[key].cursor, cache[key].numOfGroups);
            return (cache[key].cursor + 1) >= (cache[key].numOfGroups || 0);
        }

        /**
         *
         * @param {string} datasetCode Code of cache dataset
         * @param {string} actualDatasetCode Code of actual dataset
         * @param {string} name Name of cache dataset
         */
        function defineDataset(datasetCode, actualDatasetCode, name) {
            registry[datasetCode] = {dataset: actualDatasetCode};
            localDatasetRepo.defineLocalDataset(datasetCode, name, 'clientCacheDataset');
        }

        function getActualDatasetCode(key) {
            return (registry[key] || {}).dataset;
        }

        function queryMeta(key) {
            var d = $q.defer();
            var datasetCode = getActualDatasetCode(key), meta;
            datasetDao.queryDatasetMeta(datasetCode).then(function (result) {
                meta = result;
                // meta.paramsConfig.DATASET = {type: 'string', required: true};
                // meta.paramsConfig.PULL_SECONDS = {type: 'number', required: true, desc: '每隔多少秒从服务器读取一次数据'};
                meta.paramsConfig.GROUPBY = {
                    type: 'string',
                    required: true,
                    desc: $translate.instant('dts.cache.group_conditions') + '，' + $translate.instant('dts.cache.support') + 'AMOUNT、BATCH、FIELD'
                };
                meta.paramsConfig.GROUPBY_ARG = {
                    type: 'string',
                    required: true,
                    desc: $translate.instant('dts.cache.parameter_grouping_condition') + '，' + $translate.instant('dts.cache.group_count') + '，' + $translate.instant('dts.cache.several_groups')
                        + '，' + $translate.instant('dts.cache.filed_name')
                };
                d.resolve(meta);
            }).catch(function (err) {
                throw err;
            });
            return d.promise;
        }

        function pullDataFromDao(key, params) {
            console.log('pullDataFromDao', key, params);
            var d = $q.defer();
            var datasetCode = getActualDatasetCode(key);
            datasetDao.queryDataset(datasetCode, params).then(function (result) {
                var numOfGroups = groupRecords(result.records, params.GROUPBY, params.GROUPBY_ARG);
                result.numOfGroups = numOfGroups;
                // console.log('pullDataFromDao', result);
                d.resolve(result);
            }).catch(function (err) {
                throw err;
            });
            return d.promise;
        }

        function groupRecords(records, groupBy, groupByArg) {
            var GROUP_BY_AMOUNT = 'AMOUNT',
                GROUP_BY_BATCH = 'BATCH',
                GROUP_BY_FIELD = 'FIELD';
            var amountPerGroup;
            var numOfGroups = 0;
            if (groupBy === GROUP_BY_BATCH) {
                amountPerGroup = Math.ceil(records.length / parseInt(groupByArg));
                // console.log('amountPerGroup', amountPerGroup);
            } else if (groupBy === GROUP_BY_AMOUNT) {
                amountPerGroup = parseInt(groupByArg);
            }
            var keys = [];
            for (var idx = 0; idx < records.length; idx++) {
                var record = records[idx];
                if (groupBy === GROUP_BY_FIELD) {
                    var key = record[groupByArg];
                    var index = keys.indexOf(key);
                    if (index >= 0) {
                        record._group = index;
                    } else {
                        keys.push(key);
                        record._group = keys.length - 1;
                    }
                } else if (groupBy === GROUP_BY_AMOUNT || groupBy === GROUP_BY_BATCH) {
                    record._group = Math.floor(idx / amountPerGroup);
                }
                numOfGroups = record._group + 1;
            }
            return numOfGroups;
        }
    }
})();
