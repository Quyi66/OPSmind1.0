/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/30/2017
 */

(function () {
    angular.module('oplus.dts', ['oplus.commons', 'oplus.uaa']);
})();

/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/30/2017.
 */
(function () {
    'use strict';
    angular.module('oplus.dts').config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('app.dts', {
                    url: '/dts',
                    views: {
                        'mainView': {
                            templateUrl: 'app/modules/dts/dts-index.html'
                        }
                    }
                })
                .state('app.dts.datasource', {
                    url: '/datasource',
                    views: {
                        'dts_main': {
                            template: '<datasource-list></datasource-list>'
                        }
                    }
                })
                .state('app.dts.datasource.edit', {
                    url: '/:id/edit',
                    views: {
                        'dts_main_datasource_content': {
                            controller: 'DatasourceEditCtrl',
                            templateUrl: 'app/modules/dts/datasource-edit.html'
                        }
                    }
                })
                .state('app.dts.dataset', {
                    url: '/dataset',
                    views: {
                        'dts_main': {
                            templateUrl: 'app/modules/dts/dataset-list.html'
                            // controller: 'DatasetListCtrl'
                        }
                    }
                })
                .state('app.dts_datasource_new', {
                    url: '/dts/datasources/new',
                    views: {
                        'mainView': {
                            templateUrl: 'app/modules/dts/datasource-new.html',
                            controller: 'DatasourceNewCtrl',
                            controllerAs: 'ctrl'
                        }
                    }
                })
                .state('app.dts_datasource_new.type', {
                    url: '/:type',
                    templateUrl: 'app/modules/dts/datasource-edit.html',
                    controller: 'DatasourceEditCtrl'
                })

                .state('app.dts.datasource_datasets', {
                    url: '/:tempType/datasources/:datasourceName',
                    views: {
                        'dataset_list': {
                            templateUrl: 'app/modules/dts/dataset-list.html',
                            // controller: 'DatasetListCtrl'
                        }
                    }
                })

            ;
        }]);
})();
/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/31/2017
 */
(function () {
    'use strict';

    angular.module('oplus.dts').service('datasourceService', datasourceService);


    datasourceService.$inject = ['datasourceDao', 'restUtils', '$translate'];

    /**
     * Service for datasource
     * @param datasourceDao {localDaoFactory}
     * @param $q
     * @param restUtils {restUtils}
     */
    function datasourceService(datasourceDao, restUtils, $translate) {

        this.getJdbcDrivers = getJdbcDrivers;
        this.findAllDatasources = datasourceDao.findAllDatasources;
        this.findDatasource = datasourceDao.findDatasource;
        this.saveDatasource = datasourceDao.saveDatasource;
        this.deleteDatasource = datasourceDao.deleteDatasource;
        this.testConnectivity = testConnectivity;
        this.doQuery = doQuery;

        /**
         *
         * @returns {[{className:string, urlTemplate:string}]} JDBC drivers
         */
        function getJdbcDrivers() {
            return [
                {
                    dbName: "MySQL 5.x, MariaDB",
                    className: "com.mysql.jdbc.Driver",
                    urlTemplate: "jdbc:mysql://<server>:<port>/<databaseName>",
                    validationQuery: "SELECT 1 from dual"
                },
                {
                    dbName: "Oracle 11g",
                    className: "oracle.jdbc.driver.OracleDriver",
                    urlTemplate: "jdbc:oracle:thin:@<server>:<port>:<sid_name>",
                    validationQuery: "SELECT 1 from dual"
                },
                {
                    dbName: "Microsoft SQL Server",
                    className: "com.microsoft.sqlserver.jdbc.SQLServerDriver",
                    urlTemplate: "jdbc:sqlserver://<server>:<port>;DatabaseName=<databaseName>",
                    validationQuery: "SELECT 'x'"
                },
                {
                    dbName: "IBM DB2",
                    className: "com.ibm.db2.jcc.DB2Driver",
                    urlTemplate: "jdbc:db2://<server>:<port>/<databaseName>",
                    validationQuery: "SELECT 1 FROM sysibm.sysdummy1"
                },
                {
                    dbName: "Voltdb",
                    className: "org.voltdb.jdbc.Driver",
                    urlTemplate: "jdbc:voltdb://<server>:<port>",
                    validationQuery: "SELECT 1"
                },
                {
                    dbName: "Apache Hive",
                    className: "org.apache.hive.jdbc.HiveDriver",
                    urlTemplate: "jdbc:hive2://<server>:<port>/<databaseName>",
                    validationQuery: "SELECT 1"
                },
                {
                    dbName: "Gauss",
                    className: "com.huawei.gauss.jdbc.ZenithDriver",
                    urlTemplate: "jdbc:zenith:@<server>:<port>",
                    validationQuery: "SELECT 1 from dual"
                }
                // {
                //     dbName: $translate.instant('dts.datasource.other'),
                //     className: "other",
                //     urlTemplate: $translate.instant('dts.datasource.fill_corresponding') + "jdbc" + $translate.instant('dts.datasource.connect'),
                //     validationQuery: "SELECT 1"
                // }
            ];
        }

        /**
         * Execute query on a datasource.
         * API:
         * `POST /api/dts/q/data/{datasetId}`
         * @param datasetId {string} ID of dataset
         * @param params
         * @returns {*|promise}
         */
        function doQuery(datasetId, params) {
            return restUtils.callApi('dts', 'post', '/api/dts/q/data/{datasetId}', {datasetId: datasetId}, {params: params})
        }

        /**
         * Test datasource connectivity
         * Call API
         * `POST /api/dts/datasources/test` or
         * `GET /api/dts/datasources/test/{id}`
         * @param datasource {string|object} Datasource ID or object.
         * @returns {promise}
         */
        function testConnectivity(datasource) {
            if (!datasource) {
                throw new Error('Empty argument `datasource`');
            }
            if (angular.isString(datasource)) {
                return restUtils.callApi('dts', 'GET', '/api/dts/datasources/test/{id}', {id: datasource}, null);
            } else {
                return restUtils.callApi('dts', 'POST', '/api/dts/datasources/test', null, datasource);
            }
        }
    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/31/2017
 */
(function () {
    'use strict';

    angular.module('oplus.dts').service('datasetService', datasetService);

    datasetService.$inject = ['$q', 'datasetDao', 'restUtils', 'messageService', 'errorHandler', 'currentUser', 'dataEx', '$translate', 'dcDataService'];

    /**
     * @ngdoc
     * @name datasetService
     * @param $q
     * @param {datasetDao} datasetDao
     * @param {restUtils} restUtils
     * @param {messageService} messageService
     * @param {errorHandler} errorHandler
     * @param {currentUser} currentUser
     * @param {dataEx} dataEx
     */
    function datasetService($q, datasetDao, restUtils, messageService, errorHandler, currentUser, dataEx, $translate, dcDataService) {
        var module = 'dts';
        /**
         * Find all dataset definitions including params
         * @return {Promise.<[{id:string,params:object}]>}
         */
        this.findAllDatasets = findAllDatasets;
        this.findByDatasource = findByDatasource;
        this.findDataset = datasetDao.findDataset;
        this.saveDataset = saveDataset;
        this.deleteDataset = datasetDao.deleteDataset;
        this.copyDataset = datasetDao.copyDataset;
        this.getParams = datasetDao.getParams;
        this.findDatasetsByApplet = findDatasetsByApplet;
        this.queryDatasetMeta = queryDatasetMeta;
        this.queryDataset = queryDataset;
        this.queryDataTable = queryDataTable;
        this.queryParams = queryParams;
        this.testQuery = testQuery;
        this.exportData = exportData;
        this.buildQueryFilter = buildQueryFilter;
        this.moveDataset = moveDataset;

        function moveDataset(datasetIds, appletCode) {
            return restUtils.callApi(module, 'PUT', '/api/dts/datasets/move/{appletCode}', {"appletCode": appletCode}, datasetIds);
        }

        function findAllDatasets() {
            return restUtils.callApi(module, 'GET', '/api/dts/datasets');
        }

        function findDatasetsByApplet(appletCode) {
            if (appletCode) {
                return restUtils.callApi(module, 'GET', '/api/dts/datasets/findby/applet?code={code}', {code: appletCode});
            }
            return findAllDatasets();
        }

        function findByDatasource(datasource, params) {
            return restUtils.callApi(module, 'GET', '/api/dts/datasets/datasource/{datasource}', {datasource: datasource}, params);
        }

        /**
         * Build query filter
         * @param {string} globalSearchValue
         * @param {[string]} searchableColumnNames
         * @param {object} columnSearchValues Key is column name, value is column search value
         */
        function buildQueryFilter(globalSearchValue, searchableColumnNames, columnSearchValues) {
            var filters = [];
            if (globalSearchValue && searchableColumnNames.length > 0) {
                filters.push(searchableColumnNames.join('|') + ':' + _.replace(globalSearchValue, /,/g, '\\,'));
            } else if (globalSearchValue) {
                // 此为rest api 后端分页, 暂时为全字段搜索
                filters.push(globalSearchValue);
            }
            if (columnSearchValues) {
                Object.keys(columnSearchValues).forEach(function (colName) {
                    var colValue = columnSearchValues[colName];
                    if (colValue) {
                        filters.push(colName + ':' + _.replace(colValue, /,/g, '\\,'));
                    }
                });
            }
            if (filters.length > 0) {
                return filters.join(',');
            }
            return '';
        }

        /**
         *
         * @param setting
         * @param {string} setting.dataset Id of dataset
         * @param {object} setting.params Query parameters of dataset
         * @param {[{label:string,value:string}]} setting.columns Definition of export excel columns.
         * `label` is excel column label, `value` is cell value. A value wrapped with '``', indicate this is a javscript.
         * @param {string} setting.filename Export filename
         * @param {string} setting.filter Query filter
         * @return {Promise}
         */
        function exportData(setting) {
            // console.log('exportData', {setting: setting});
            return restUtils.callApi('dts', 'POST', '/api/dts/export/excel',
                {}, {
                    dataset: setting.dataset,
                    filter: setting.filter,
                    params: setting.params,
                    filename: setting.filename,
                    columns: setting.columns
                });
        }

        function saveDataset(dataset) {
            assertAuthentication();

            if (!dataset.id) {
                dataset.createdBy = currentUser.loginId;
                dataset.creatorName = currentUser.displayName;
                dataset.modifiedBy = currentUser.loginId;
                dataset.modifierName = currentUser.displayName;
            } else {
                dataset.modifiedBy = currentUser.loginId;
                dataset.modifierName = currentUser.displayName;
            }
            return datasetDao.saveDataset(dataset);

        }

        function assertAuthentication() {
            if (!currentUser.isAuthenticated) {
                messageService.alertError($translate.instant('dts.datasource.program_error'), $translate.instant('dts.datasource.operation_must_logged'));
                throw new Error('401');
            }
        }

        /**
         *
         * @param {string} code
         * @param {object} params
         * @param {{page:number,size:number}} pagination
         * @returns {promise<{total:number,records:[]}>}
         */
        function queryDatasetOfCode(code, params, pagination) {
            var d = $q.defer();
            var key = JSON.stringify({code: code, params: params}),
                msg = $translate.instant('dts.datasource.dataset') + '[' + code + ']' + $translate.instant('dts.datasource.query_failures');
            errorHandler.stopOverError(key, msg, function (err) {
                d.reject(err);
                return d.promise;
            });
            datasetDao.queryDataset(code, params, pagination).then(function (data) {
                d.resolve(data);
                errorHandler.clearError(key);
            }).catch(function (err) {
                // messageService.alertError('数据集查询错误', err.message);
                errorHandler.accumulateError(key);
                d.reject(err);
            });
            return d.promise;
        }

        /**
         * 解析组合数据集
         * @author Li, Bobing
         * @param {object} params
         * @param {object} config
         *      joinx: {
         *          dses: [
         *              // code：数据集的code
         *              // relations：本数据集(right)和前数据集(left)的字段关联关系，relation之间是AND的关系
         *              // fields: 对该数据集的字段定义（可选），key是字段名，value是`{excluded:true|false, rename:string}`
         *              // fields.excluded: 是否将该字段从结果集中排除
         *              // fields.rename：字段重命名。如果和前一个数据集有重名字段，而没有定义重命名，该字段将忽略
         *              {
         *                  code: "dataset_1"
         *                  // NOTE：第一个数据集不支持relations，如果有也会被忽略
         *              },
         *              {
         *                  code: "dataset_2",
         *                  relations:[{left:"left_field",right:"right_field"}],
         *
         *                  fields:{"user_id":{excluded:false,rename:'newfield'}}
         *              },
         *              {
         *                  code: "dataset_3",
         *                  relations:[{left:"left_field",right:"right_field"},{left:"left_field2",right:"right_field3"}]
         *              }
         *         ]
         *      }
         *
         */
        function queryDatasetOfJoinx(config, params) {

            var d = $q.defer();

            var dses = config.dses;

            // 最终返回的数据集
            var resultData = [];
            // 未合并的数据集
            var dataSetList = [];
            var promiseQueryDataArray = [];
            // 得到所有的数据集
            for (var i = 0, size = dses.length; i < size; i++) {
                promiseQueryDataArray.push(queryDataset(dses[i].code, params));
            }
            $q.all(promiseQueryDataArray).then(function (data) {
                dataSetList = data;
            }).catch(function (err) {
                messageService.toast('error', $translate.instant('dts.datasource.query_dataset') + dses[i].code + $translate.instant('dts.datasource.times_error') + ':>>>' + err.message);
                d.reject(err);
            }).finally(function () {
                dataSetList = _.merge(dataSetList);
                // 重命名字段
                renameFields(dataSetList);

                resultData = dataSetList[0];
                var joinType = 'inner';
                // 以第一个数据集为基础开始依次合并
                for (var i = 1, size = dataSetList.length; i < size; i++) {
                    var relations = dses[i].relations;
                    // 合并数据
                    mergeRecords(dataSetList[i], joinType, relations);
                }
                resultData.total = resultData.records.length;
                d.resolve(resultData);
            });
            return d.promise;

            // 重命名数据集的字段
            function renameFields(dataSetList) {
                _.forEach(dataSetList, function (data, index) {
                    var fieldsConfig = dses[index].fields;
                    if (!_.isEmpty(fieldsConfig)) {
                        // data.records
                        for (var i = 0, size = data.records.length; i < size; i++) {
                            for (var oldField in fieldsConfig) {
                                var newFieldConfig = fieldsConfig[oldField];

                                // 当excluded为true时，删除此字段
                                if (newFieldConfig.excluded) {
                                    delete data.records[i][oldField];
                                    continue;
                                }
                                //当excluded为false且rename不为空时，进行重命名
                                if (!newFieldConfig.excluded && !_.isEmpty(newFieldConfig.rename)) {
                                    var value = data.records[i][oldField];
                                    var newField = newFieldConfig.rename;
                                    // 加入重命名的字段
                                    data.records[i][newField] = value;
                                    // 删除旧字段
                                    delete data.records[i][oldField];
                                }

                            }
                        }
                    }
                });
            }

            // 合并结果集，分为left join、inner join
            function mergeRecords(joinData, joinType, relations) {
                if (joinType == 'inner') {
                    var afterData = [],
                        equation = {};
                    _.forEach(resultData.records, function (obj, i) {
                        _.forEach(relations, function (relation, ii) {
                            equation[relation.right] = obj[relation.left];
                        });
                        var joinObj = _.find(joinData.records, equation);
                        if (!_.isEmpty(joinObj)) {
                            // 将两条数据合并为一条（存在重复字段名时只保留obj中的）
                            var afterObj = _.defaults(obj, joinObj);
                            afterData.push(afterObj);
                        }
                    })
                    if (!_.isEmpty(afterData)) {
                        // 内连接时，根据条件取两个结果集的并集
                        resultData.records = afterData;
                    }
                } else if (joinType == 'left') {
                    var equation = {};
                    _.forEach(resultData.records, function (obj, i) {
                        _.forEach(relations, function (relation, ii) {
                            equation[relation.right] = obj[relation.left];
                        });
                        var joinObj = _.find(joinData.records, equation);
                        if (!_.isEmpty(joinObj)) {
                            // 将两条数据合并为一条（存在重复字段名时只保留obj中的）
                            var afterObj = _.defaults(obj, joinObj);
                            //左连接时，以左边为基础，结果集数量不会改变，只将符合条件的两条记录合并为一条
                            resultData.records[i] = afterObj;
                        }
                    })
                }

            }


        }

        /**
         *
         * @param {object} config
         * @param {string} config.expr DataEx expression
         * @param {object} params
         * @returns {promise<{total:number,records:[]}>}
         */
        function queryDatasetOfDatax(config, params) {
            var d = $q.defer();
            var data = dataEx.evalVarExpr(config.expr, params);
            if (angular.isDefined(data) && angular.isFunction(data.then)) {
                // Result is promise
                data.then(function (res) {
                    // console.log('res', res);
                    buildDtData(res);
                }).catch(function (err) {
                    d.reject(err);
                });
            } else {
                buildDtData(data);
            }
            return d.promise;

            function buildDtData(data) {
                if (angular.isArray(data)) {
                    d.resolve({total: data.length, records: data});
                } else {
                    d.resolve({total: 1, records: [data]});
                }
            }
        }

        function queryDatasetOfDatamodel(dcCode) {
            var d = $q.defer();
            dcDataService.queryDataListByCode(dcCode).then(function (data) {
                var pageRecords = _.map(data, function (m) {
                    return angular.extend(m.dataJson && angular.fromJson(m.dataJson) || {}, {
                        _dataId: m.id,
                        _createTime: $$.formatDate(m.createTime, 'YYYY-MM-DD HH:mm:ss'),
                        _updateTime: $$.formatDate(m.updateTime, 'YYYY-MM-DD HH:mm:ss'),
                    })
                })

                d.resolve({total: pageRecords.length, records: pageRecords});
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        /**
         * NOTE: only support code query
         * @param {string|DatasetModelRef} dataset Dataset config
         * @param {object=} params
         * @param {{page:number,size:number,orderBy:string}=} queryConfig First page is 1
         * @param {string} queryConfig.orderBy String of "<fieldToSort> <direction>", eg. "name desc", "age asc"
         * @returns {promise<{total:number,records:[]}>}
         */
        function queryDataset(dataset, params, queryConfig) {
            var promise, d = $q.defer();
            if (angular.isString(dataset)) {
                promise = queryDatasetOfCode(dataset, params, queryConfig);
            } else if (dataset._type === 'joinx') {
                promise = queryDatasetOfJoinx(dataset.joinx, params);
            } else if (dataset._type === 'datax') {
                promise = queryDatasetOfDatax(dataset.datax, params);
            } else if (dataset._type === 'datamodel') {
                promise = queryDatasetOfDatamodel(dataset.id, params);
            } else if (dataset.id) {
                promise = queryDatasetOfCode(dataset.id, params, queryConfig);
            } else {
                throw new Error('Unknown dataset definition `' + JSON.stringify(dataset)) + '`';
            }
            promise.then(function (data) {
                // console.log('promise.data',data);
                if (dataset.trans) {
                    var mode = dataset.trans.mode;
                    var records;
                    if (mode === 'valcol' && dataset.trans['valcol']) {
                        var valcol = dataset.trans['valcol'];
                        records = dataEx.transform(data.records, valcol.keyAs, valcol.colAs, valcol.valAs, valcol.descAs);
                        return d.resolve({total: records.length, records: records});
                    } else if (mode === 'rotate' && dataset.trans['rotate']) {
                        var rotate = dataset.trans['rotate'];
                        records = dataEx.transpose(data.records, rotate.oldKeyCol, rotate.newKeyCol);
                        // console.log('transpose', data.records.length, rotate.newKeyCol, rotate.oldKeyCol, records);
                        return d.resolve({total: records.length, records: records});
                    }
                    // console.log('trans',data);
                    return d.resolve(data);
                }
                // console.log('data...',data);
                return d.resolve(data);
            }).catch(function (err) {
                return d.reject(err);
            });
            return d.promise;
        }

        /**
         * Query dataset and get a Datatables compatible result.
         * @param {object} dataset Dataset config
         * @param {string=} dataset.id Code to lookup the dataset. It cannot be empty if dataset is not dynamic.
         * @param {boolean=} dataset._type True to indicate the data is from custom function expression
         * @param {string=} dataset.dynaicFn Custom function expression
         * @param {object} params Query parameters. If dataset is dynamic, params used to interpolate variables in function expression
         * @param {object} dtData DataTable specific data sent to server
         * `{
         * draw:Number,
         * start:Number,
         * length:Number,
         * search:{value:String, regex:Boolean},
         * order:[{column:Number,dir:String}],
         * columns:[{
         * data:String,
         * name:String,
         * searchable:Boolean,
         * orderable:Boolean,
         * search:{value:String, regex:Boolean}}]
         * }`
         * @param ifAlertError
         * @see https://datatables.net/manual/server-side
         * @return {promise<{draw:number, recordsTotal:number, recordsFiltered:number, data:[object]}>} Datatables compatible data
         */
        function queryDataTable(dataset, params, dtData, ifAlertError) {
            var d = $q.defer(), code = dataset.id;
            var key = JSON.stringify({code: code, params: params}),
                msg = $translate.instant('dts.datasource.dataset') + '[' + code + ']' + $translate.instant('dts.datasource.query_failures');
            errorHandler.stopOverError(key, msg, function (err) {
                d.reject(err);
                return d.promise;
            });
            
            doQuery(dataset, params, dtData).then(function (data) {
                errorHandler.clearError(key);
                d.resolve(data);
            }).catch(function (err) {
                errorHandler.accumulateError(key);
                d.reject(err);
                if (ifAlertError) {
                    messageService.alertError($translate.instant('dts.datasource.dataset_query_error'), err.message);
                }
            });
            return d.promise;

            /**
             * Convert datatables server side request data to dts query config
             * @param {object} dtData https://datatables.net/manual/server-side
             * @returns {{size: number, page: number, orderBy: string, filter: string}}
             */
            function dtDataToQueryConfig(dtData) {
                var queryConfig;
                // console.log('dtDataToQueryConfig', dtData);
                if (dtData) {
                    if (angular.isNumber(dtData.length) && angular.isNumber(dtData.start)) {
                        queryConfig = {size: dtData.length, page: Math.floor(dtData.start / dtData.length) + 1};
                    }
                    if (angular.isArray(dtData.order) && dtData.order.length > 0) {
                        var order = dtData.order[0];
                        var fieldName = dtData.columns[order.column].name;
                        if (fieldName)
                            queryConfig.orderBy = fieldName + ' ' + order.dir;
                    }
                    // var filters = [];
                    // if (dtData.search) {
                    //     var value = dtData.search.value;
                    //     if (value) {
                    //         var cols = _.filter(dtData.columns, function (o) {
                    //             return o.searchable && o.name
                    //         });
                    //         var colNames = _.map(cols, 'name');
                    //         // console.log('colNames', colNames);
                    //         filters.push(colNames.join('|') + ':' + _.replace(value, /,/g, '\\,'));
                    //     }
                    // }
                    // if (dtData.columns) {
                    //     dtData.columns.forEach(function (col) {
                    //         var colValue = col.search.value;
                    //         if (colValue) {
                    //             filters.push(col.name + ':' + _.replace(colValue, /,/g, '\\,'));
                    //         }
                    //     });
                    // }
                    // if (filters.length > 0) {
                    //     queryConfig.filter = filters.join(',');
                    // }
                    var globalSearchValue, searchableColumnNames, columnSearchValues = {};
                    if (dtData.search) {
                        globalSearchValue = dtData.search.value;
                    }
                    searchableColumnNames = _.map(_.filter(dtData.columns, function (o) {
                        return o.searchable && o.name
                    }), 'name');
                    if (dtData.columns) {
                        dtData.columns.forEach(function (col) {
                            var colValue = col.search.value;
                            if (colValue && col.name) {
                                columnSearchValues[col.name] = colValue;
                            }
                        })
                    }
                    if (queryConfig)
                        queryConfig.filter = buildQueryFilter(globalSearchValue, searchableColumnNames, columnSearchValues);
                }
                return queryConfig;
            }


            function doQuery(dataset, params, dtData) {
                var d = $q.defer();
                var result = {};
                // console.log('doQuery', {dtData: dtData, params: params});
                var queryConfig = dtDataToQueryConfig(dtData);
                queryDataset(dataset, params, queryConfig).then(function (data) {
                    var pageRecords = data.records;
                    //TODO: this is a temp solution, need implement in serverside
                    // if (dtData.length > 0)
                    //     pageRecords = data.records.slice(dtData.start, dtData.start + dtData.length);
                    result.recordsTotal = data.total;
                    // result.recordsFiltered = data.records.length;
                    result.recordsFiltered = data.total;
                    result.data = pageRecords;
                    result.draw = dtData.draw;
                    d.resolve(result);
                }).catch(function (err) {
                    d.reject(err);
                });
                return d.promise;
            }
        }


        /**
         * Get dataset meta info.
         * @param datasetId {string}
         * @param params
         * @returns {promise<{
         * fields:[{name:string,type:string}],
         * paramsConfig:object<{defaultValue:string,required:boolean}>,
         * sampleRecord:object
         * }>}
         */
        function queryDatasetMeta(datasetId, params) {
            var d = $q.defer();
            var fieldTypesMapping = {
                'datetime,timestamp,time,date': 'date',
                'varchar,char,varchar2': 'string',
                'int,integer,float,double': 'number'
            };
            // console.log('queryDatasetMeta',{id:datasetId,params:params});
            datasetDao.queryDatasetMeta(datasetId, params).then(function (data) {
                d.resolve({
                    fields: parseFieldsDef(data.fields),
                    paramsConfig: data.paramsConfig,
                    sampleRecord: (data.records && data.records.length > 0) ? data.records[0] : {}
                });
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;

            /**
             *
             * @param fields {array|object}
             * @return {[{name:string,type:string}]}
             */
            function parseFieldsDef(fields) {
                var result;
                result = [];
                if (angular.isArray(fields)) {
                    // Old version for RDBMS table data
                    // result = fields;
                    fields.forEach(function (f) {
                        result = result.concat(parseField(f));
                    });

                } else {
                    // New support for RDBMS, NoSQL, etc
                    Object.keys(fields).forEach(function (key) {
                        var type = fields[key];
                        parseField({name: key, type: type}, '').forEach(function (ft) {
                            if (ft.type !== 'object')
                                result.push(ft);
                        });
                    });
                }
                return result;

                function convertFieldType(type) {
                    var dateTypes = ['datetime', 'timestamp', 'date', 'time'];
                    if (dateTypes.indexOf(type.toLowerCase()) >= 0) {
                        return 'date';
                    }
                    return type;
                }
            }

            /**
             *
             * @param {object} field Field definition
             * @param {string} field.name Field name
             * @param {string|object|array} field.type Field type
             * @param {string=} parentPath
             * @return {[{name:string, type:string}]}
             */
            function parseField(field, parentPath) {
                var result = [];
                var type = field.type, name = field.name, alias = field.alias,
                    childField;
                var theType, theName;
                if (!type || angular.isString(type)) {
                    theType = type.toLowerCase();
                    type = type.toLowerCase();
                    var keys = Object.keys(fieldTypesMapping);
                    for (var i = 0; i < keys.length; i++) {
                        if (keys[i].indexOf(type) >= 0) {
                            theType = fieldTypesMapping[keys[i]];
                            break;
                        }
                    }
                } else if (angular.isArray(type)) {
                    // console.warn('Array type is NOT well supported for now');
                    if (type.length > 0) {
                        theType = 'array';
                        childField = type[0];
                        if (type.length > 1) {
                            console.warn('Array type only support one definition');
                        }
                    } else {
                        console.warn('Cannot find field definition in array');
                    }
                } else if (angular.isObject(type)) {
                    theType = 'object';
                    childField = type;
                }

                if (parentPath) {
                    theName = parentPath + '.' + name;
                } else {
                    theName = name;
                }
                if (theType === 'array') {
                    theName += '[]';
                    theType = 'array-' + $translate.instant('dts.datasource.not_supported')
                }
                result.push({name: theName, type: theType, alias: alias});
                if (childField) {
                    Object.keys(childField).forEach(function (name) {
                        parseField({name: name, type: childField[name]}, theName).forEach(function (fd) {
                            result.push(fd);
                        });
                    });
                }
                return result;
            }
        }

        /**
         * Executes query on a dataset and returns meta info and limited number of sample records.
         * Call API:
         * `POST /api/dts/datasets/test`
         * @param params {object}
         * @returns {promise<{fields:[],records:[]}>}
         */
        function testQuery(params) {
            return restUtils.callApi('dts', 'POST', '/api/dts/q/meta', null, params);
        }

        function queryParams(params) {
            return restUtils.callApi('dts', 'POST', '/api/dts/q/meta/param', null, params);
        }

    }
})();

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

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/20/2017
 */
(function () {
    'use strict';

    /**
     * @private
     */
    angular.module('oplus.dts').service('_datasourceLocalDao', datasourceLocalDao);

    datasourceLocalDao.$inject = [ 'localDaoFactory'];

    function datasourceLocalDao(localDaoFactory) {

        var dao = localDaoFactory.createDao('oplus.dts.datasources');

        this.findAllDatasources = dao.findAllEntities;
        this.findDatasource = dao.findEntity;
        this.saveDatasource = dao.saveEntity;
        this.deleteDatasource = dao.deleteEntity;


    }


})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/20/2017
 */
(function () {
    'use strict';

    /**
     * @ngdoc service
     * @description
     * @private
     */
    angular.module('oplus.dts').service('_datasourceRemoteDao', datasourceRemoteDao);

    datasourceRemoteDao.$inject = ['restUtils','currentUser'];

    /**
     * DAO for remote database
     * @param restUtils {restUtils}
     */
    function datasourceRemoteDao(restUtils,currentUser) {

        var module = "dts";
        
        this.findAllDatasources = function () {
            return restUtils.callApi(module,'GET', '/api/dts/datasources');
        };


         this.findDatasource = function (id) {
             return restUtils.callApi(module,'GET', '/api/dts/datasources/{id}', {id: id});
         };


         this.saveDatasource = function (datasource) {
             if(!datasource.id) {
                 datasource.createdBy = currentUser.loginId;
                 datasource.creatorName = currentUser.displayName;
                 datasource.modifiedBy = currentUser.loginId;
                 datasource.modifierName = currentUser.displayName;
                 return restUtils.callApi(module,'POST', '/api/dts/datasources', null, datasource);
             }else{
                 datasource.modifiedBy = currentUser.loginId;
                 datasource.modifierName = currentUser.displayName;
                 return restUtils.callApi(module,'PUT', '/api/dts/datasources', null, datasource);
             }

         };


         this.deleteDatasource = function (id) {
             return restUtils.callApi(module,'DELETE', '/api/dts/datasources/{id}', {id: id} );
         };


    }
})();

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

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/20/2017
 */
(function () {
    'use strict';

    /**
     * @ngdoc service
     * @description
     * @private
     */
    angular.module('oplus.dts').service('_datasetRemoteDao', datasetRemoteDao);

    datasetRemoteDao.$inject = ['$q', 'restUtils', 'currentUser'];

    /**
     * DAO for remote database
     * @param $q
     * @param restUtils {restUtils}
     */
    function datasetRemoteDao($q, restUtils, currentUser) {
        var that = this;
        var module = "dts";
        /**
         * Find available datasets for widget.
         *
         * @returns {promise.<[{id:string, name:string, desc:string, params:object}]>}
         */
        this.findAllDatasets = function () {
            return restUtils.callApi(module, 'GET', '/api/dts/datasets');
        };


        /**
         *
         * @param id
         * @returns {*}
         */
        this.findByDatasource = function (datasource, params) {
            return restUtils.callApi(module, 'GET', '/api/dts/datasets/datasource/{datasource}', {datasource: datasource}, params);
        };


        /**
         *
         * @param id
         * @returns {*}
         */
        this.findDataset = function (id) {
            return restUtils.callApi(module, 'GET', '/api/dts/datasets/{id}', {id: id});
        };

        /**
         *
         * @param dataset
         * @returns {*}
         */
        this.saveDataset = function (dataset) {
            if (!dataset.id) {
                return restUtils.callApi(module, 'POST', '/api/dts/datasets', null, dataset);
            } else {
                return restUtils.callApi(module, 'PUT', '/api/dts/datasets', null, dataset);
            }
        };

        /**
         *
         * @param id
         * @returns {*}
         */
        this.deleteDataset = function (id) {
            return restUtils.callApi(module, 'DELETE', '/api/dts/datasets/{id}', {id: id});
        };

        /**
         * copy dataset
         * @param id
         */
        this.copyDataset = function (id, code) {

            return restUtils.callApi(module, 'GET', '/api/dts/datasets/copy/{id}', {id: id}, {
                code: code, userId: currentUser.loginId, userName: currentUser.displayName
            });
        };

        /**
         *
         * @returns {string}
         */
        this.getParams = function (params) {
            return restUtils.callApi('dts', 'POST', '/api/dts/q/meta/param', null, params);
        }

        /**
         * Get fields definition of a dataset.
         * GET|POST /api/dts/q/meta/{code}
         * @param code {String}
         * @param params
         * @returns {promise.<{fields:[{name:string,type:string}], paramsConfig:{param_name:{defaultValue:string,required:boolean}}}>}
         */
        this.queryDatasetMeta = function (code, params) {
            //TODO: remove GET?
            if (!params) return restUtils.callApi(module, 'GET', '/api/dts/q/meta/{code}/', {code: code}); else return restUtils.callApi(module, 'POST', '/api/dts/q/meta/{code}/', {code: code}, {
                params: params, page: 1, size: 10
            });
        };

        /**
         * Get a dataset query result.
         * GET|POST /api/dts/q/data/{code}/
         * @param code {string} Dataset code
         * @param {object} params Query parameters
         * @param {{filter:filter,page:number,size:number}=} pagination Options of pagination
         */
        this.queryDataset = function (code, params, pagination) {
            /*params['tenant']  = currentUser.tenant;*/
            // Become a fuzzy search
            if (pagination && pagination.filter && pagination.filter.indexOf(":") !== -1) {
                pagination.filter = pagination.filter.replace(/([^:]+)$/, '*$1*');
            }
            var obj = angular.extend({params: params}, pagination);
            return restUtils.callApi(module, 'POST', '/api/dts/q/data/{code}/', {code: code}, obj);
        };


        //
        // /**
        //  *
        //  * @param code
        //  * @param params
        //  * @param dtData {{draw:Number,
        //  * start:Number,length:Number,
        //  * search:{value:String, regex:Boolean},
        //  * order:[{column:Number,dir:String}],
        //  * columns:[{data:String, name:String,
        //  *   searchable:Boolean, orderable:Boolean,
        //  *   search:{value:String, regex:Boolean}}]}} DataTable specific data sent to server
        //  * @see https://datatables.net/manual/server-side
        //  * @return {promise<{draw:number, recordsTotal:number, recordsFiltered:number, data:[object]}>}
        //  */
        // this.queryDataTable = function (code, params, dtData) {
        //     console.warn('TODO: this is a temp solution, need implement in serverside');
        //     var d = $q.defer();
        //     var result = {};
        //     that.queryDataset(code, params).then(function (data) {
        //         var pageRecords = data.records;
        //         if (dtData.length > 0)
        //             pageRecords = data.records.slice(dtData.start, dtData.start + dtData.length);
        //         result.recordsTotal = data.total;
        //         result.recordsFiltered = data.records.length;
        //         result.data = pageRecords;
        //         result.draw = dtData.draw;
        //         d.resolve(result);
        //     }).catch(function (err) {
        //         d.reject(err);
        //     });
        //     return d.promise;
        // };
    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/20/2017
 */
(function () {
    'use strict';

    var app = angular.module('oplus.dts');

    app.run(['mockJsDataset', 'localDatasetRepo','$translate', function (mockJsDataset, localDatasetRepo,$translate) {
        // if (window.$oplus.appConfig.modules.dts.useLocalDb) {
        //     localDatasetRepo.defineLocalDataset('JS_MOCK_DATASET', 'JS_MOCK_DATASET', 'mockJsDataset');
        // }
        if (window.$oplus.appConfig.modules.dts && window.$oplus.appConfig.modules.dts.enableDemoDataset) {
            localDatasetRepo.defineLocalDataset('DEMO_CATEGORY_DS', '[DEMO]' + $translate.instant('dts.mock.indicator_data'), 'mockJsDataset');
            localDatasetRepo.defineLocalDataset('DEMO_TIME_DS', '[DEMO]' + $translate.instant('dts.mock.time_series_data'), 'mockJsDataset');
            localDatasetRepo.defineLocalDataset('DEMO_REST_DS', '[DEMO]REST' + $translate.instant('dts.mock.datasource'), 'mockJsDataset');
        }
    }]);

    app.service('mockJsDataset', mockJsDataset);

    mockJsDataset.$inject = ['$q', '$http', 'dataEx', 'restUtils', '$translate'];

    /**
     * @ngdoc
     * @name mockJsDataset
     * @description
     * Generate mock data with javascript.
     * @param $q
     * @param $http
     * @param {dataEx} dataEx
     * @param {restUtils} restUtils
     */
    function mockJsDataset($q, $http, dataEx, restUtils, $translate) {
        this.queryDatasetMeta = queryMeta;
        this.queryDataset = queryData;

        function queryMeta(code, params) {
            // if (code === 'JS_MOCK_DATASET') {
            //     return new MockDevData().getMeta();
            // } else
            if (code === 'DEMO_CATEGORY_DS') {
                return new MockCategoryData().getMeta();
            } else if (code === 'DEMO_TIME_DS') {
                return new MockTimeSeriesData().getMeta();
            } else if (code === 'DEMO_REST_DS') {
                return new LocalRestCallDs().getMeta(code, params);
            }
            throw new ReferenceError('Cannot find dataset ' + code);
        }

        function queryData(datasetCode, params) {
            // if (datasetCode === 'JS_MOCK_DATASET') {
            //     return new MockDevData().getData(params);
            // } else
            if (datasetCode === 'DEMO_TIME_DS') {
                return new MockTimeSeriesData().getData(params);
            } else if (datasetCode === 'DEMO_CATEGORY_DS') {
                return new MockCategoryData().getData(params);
            } else if (datasetCode === 'DEMO_REST_DS') {
                return new LocalRestCallDs().getData(params);
            }
            throw new ReferenceError('Cannot find dataset ' + datasetCode);
        }

        function newDate(ms) {
            return moment().add(ms, 'ms');
        }

        function randomIp() {
            return (Math.floor(Math.random() * 255) + 1) + "." + (Math.floor(Math.random() * 255) + 0) + "." + (Math.floor(Math.random() * 255) + 0) + "." + (Math.floor(Math.random() * 255) + 0);
        }

        function randomNumber(baseline, range) {
            return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * range) + baseline;
        }


        /**
         * Dataset calls REST from browser
         * @constructor
         */
        function LocalRestCallDs() {
            this.getData = getData;
            this.getMeta = getMeta;

            function getMeta(code, params) {
                var d = $q.defer();
                var paramsConfig = {
                    'url': {
                        type: 'string',
                        desc: $translate.instant('dts.mock.to_request') + 'HTTP URL。' + $translate.instant('dts.mock.request_from_browser') + '，' + $translate.instant('dts.mock.this') + URL + $translate.instant('dts.mock.must_support_cross'),
                        required: true
                    },
                    'method': {
                        type: 'string',
                        desc: 'HTTP' + $translate.instant('dts.mock.request_method') + '，' + $translate.instant('dts.mock.default_is') + 'GET',
                        required: false

                    },
                    // 'metaUrl': {
                    //     type: 'string',
                    //     desc: '用于解析结果集字段的URL。这个参数目前无法通用。如果设置了sampleResultItem，那么不用metaUrl。',
                    //     required: false
                    // },
                    'sampleResultItem': {
                        type: 'string',
                        desc: 'JSON' + $translate.instant('dts.mock.format_represents_result_set') + '，' + $translate.instant('dts.mock.parse_result_filed') + '。' + $translate.instant('dts.mock.if_field_not_set') + '，' + $translate.instant('dts.mock.automatically_called_once') + URL + $translate.instant('dts.mock.parse_result') + '。',
                        required: false
                    },
                    'resultPath': {
                        type: 'string',
                        desc: $translate.instant('dts.mock.extract') + 'REST' + $translate.instant('dts.mock.return_path_result'),
                        required: false
                    }
                    // 'p1': {type: 'string', desc: '参数{p1}', required: false},
                    // 'p2': {type: 'string', desc: '参数{p2}', required: false},
                    // 'p3': {type: 'string', desc: '参数{p3}', required: false}
                };
                var fields = {};
                if (params.sampleResultItem) {
                    var obj = JSON.parse(params.sampleResultItem);
                    Object.keys(obj).forEach(function (key) {
                        fields[key] = typeof obj[key];
                    });
                    d.resolve({fields: fields, paramsConfig: paramsConfig});
                } else {
                    // Do a test ajax call to get meta info of fields
                    var config = params;
                    config.url = params.url;
                    restUtils.callAjax(config.method, config.url).then(function (data) {
                        var record = {};
                        if (data._fields) {
                            fields = data._fields;
                        } else {
                            if (data.records.length > 0) {
                                record = data.records[0];
                            }
                            Object.keys(record).forEach(function (key) {
                                fields[key] = typeof record[key];
                            });
                        }
                        d.resolve({fields: fields, paramsConfig: paramsConfig});
                    }).catch(function (err) {
                        d.reject(err);
                    });
                }
                return d.promise;
            }

            function getData(params) {
                // return callAjax(params);
                var d = $q.defer();
                var b = Date.now();
                restUtils.callAjax(params.method, params.url, null, null, {
                    successCallback: function (data) {
                        console.log('js.getData@callback', Date.now() - b);
                        d.resolve(data);
                    },
                    errorCallback: function (err) {
                        d.reject(err);
                    }
                })/*.then(function (data) {
                    console.log('js.getData', Date.now() - b);
                    d.resolve(data);
                }).catch(function (err) {
                    d.reject(err);
                })*/;
                return d.promise;
            }
        }

        /**
         * @constructor
         */
        function MockTimeSeriesData() {
            this.getData = getData;
            this.getMeta = getMeta;


            function getMeta() {
                var fields;
                fields = {
                    'timestamp': 'date',
                    'logins': 'number',
                    'randnum': 'number',
                    'time': {
                        'connection': 'number',
                        'server': 'number',
                        'download': 'number'
                    },
                    'ip': 'string',
                    'cpu': {
                        'server_01': 'number',
                        'server_02': 'number',
                        'server_03': 'number'
                    },
                    'memory': {
                        'server_01': 'number',
                        'server_02': 'number',
                        'server_03': 'number'
                    },
                    'request': {
                        'server_01': 'number',
                        'server_02': 'number',
                        'server_03': 'number'
                    }
                };
                var paramsConfig = {
                    'startTime': {
                        type: 'date',
                        desc: $translate.instant('dts.mock.start_time'),
                        required: false
                    },
                    'endTime': {
                        type: 'date',
                        desc: $translate.instant('dts.mock.end_time'),
                        required: false
                    },
                    'interval': {
                        type: 'number',
                        desc: $translate.instant('dts.mock.interval_seconds') + '，' + $translate.instant('dts.mock.default') + '（' + $translate.instant('dts.mock.least') + '）' +
                            $translate.instant('dts.mock.for') + 10,
                        required: false
                    },
                    'numOfRec': {
                        type: 'number',
                        desc: $translate.instant('dts.mock.from') + 'endTime' + $translate.instant('dts.mock.counted_sampling_points') + '，' + $translate.instant('dts.mock.if_set_then') + 'interval' + $translate.instant('dts.mock.and') + 'startTime' + $translate.instant('dts.mock.dot_work'),
                        required: false
                    },
                };
                return $q(function (resolve, reject) {
                    resolve({
                        fields: fields,
                        paramsConfig: paramsConfig
                    });
                });
            }

            function getData(params) {
                var result = {
                    total: 0,
                    records: []
                };
                var MAX_NUM_OF_POINTS = 10000,
                    START_TIME_OFFSET_MINUTES = 2 * 60;
                var numOfPoints = params.numOfRec;
                var intervalSecs, startTime, endTime;
                startTime = params.startTime ? moment(params.startTime) : moment().subtract(START_TIME_OFFSET_MINUTES, 'minutes');
                endTime = params.endTime ? moment(params.endTime) : moment();
                var spanSecs = (endTime.valueOf() - startTime.valueOf()) / 1000;
                if (numOfPoints > 0) {
                    intervalSecs = Math.ceil(spanSecs / numOfPoints);
                } else {
                    intervalSecs = params.interval || 10;
                    numOfPoints = Math.floor(spanSecs / intervalSecs);
                }

                if (numOfPoints > MAX_NUM_OF_POINTS) {
                    numOfPoints = MAX_NUM_OF_POINTS;
                    intervalSecs = Math.floor(spanSecs / numOfPoints);
                }

                for (var i = 0; i < numOfPoints; i++) {
                    result.records.push({
                        timestamp: startTime.toDate(),
                        logins: randomNumber(60, 10),
                        randnum: Math.floor(Math.random() * 10),
                        ip: randomIp(),
                        cpu: {
                            'server_01': randomNumber(10, 3),
                            'server_02': randomNumber(15, 3),
                            'server_03': randomNumber(20, 3)
                        },
                        memory: {
                            'server_01': randomNumber(30, 5),
                            'server_02': randomNumber(40, 5),
                            'server_03': randomNumber(50, 5)
                        },
                        request: {
                            'server_01': randomNumber(100, 10),
                            'server_02': randomNumber(150, 10),
                            'server_03': randomNumber(200, 10)
                        },
                        time: {
                            'connection': randomNumber(30, 2),
                            'server': randomNumber(130, 10),
                            'download': randomNumber(200, 10)
                        }
                    });
                    startTime.add(intervalSecs, 's');
                }
                result.total = result.records.length;
                return $q(function (resolve, reject) {
                    resolve(result);
                });
            }


        }

        /**
         * @constructor
         */
        function MockCategoryData() {
            this.getData = getData;
            this.getMeta = getMeta;

            function getMeta() {
                var fields;
                fields = {
                    'key': 'string',
                    'number': 'number',
                    'status': 'string'
                };
                var paramsConfig = {
                    'keys': {
                        type: 'string',
                        desc: $translate.instant('dts.mock.separated_keywords'),
                        required: true
                    }
                };
                return $q(function (resolve, reject) {
                    resolve({
                        fields: fields,
                        paramsConfig: paramsConfig
                    });
                });
            }

            function getData(params) {
                var result = {
                    total: 0,
                    records: []
                };
                var keys = params.keys;
                if (keys) {
                    keys.split(',').forEach(function (k) {
                        var item = {
                            key: k,
                            number: randomNumber(50, 50),
                            status: 'OK'
                        };
                        result.records.push(item);
                    });
                    result.total = result.records.length;
                }
                return $q(function (resolve, reject) {
                    resolve(result);
                });
            }


        }

        function MockDevData() {
            this.getData = getData;
            this.getMeta = getMeta;

            function getMeta() {
                var fields = [{
                    name: 'timestamp',
                    type: 'date'
                },
                    {
                        name: 'message',
                        type: 'string'
                    },
                    {
                        name: 'ip',
                        type: 'string'
                    },
                    {
                        name: 'cpu',
                        type: 'number'
                    },
                    {
                        name: 'memory',
                        type: 'number'
                    },
                    {
                        name: 'passIn',
                        type: 'string'
                    },
                    {
                        name: 'number',
                        type: 'number'
                    },
                    {
                        name: 'object',
                        type: 'object'
                    },
                    {
                        name: 'constantString',
                        type: 'string'
                    },
                    {
                        name: 'user',
                        type: {
                            name: 'string',
                            age: 'number',
                            friends: [{}]
                        }
                    }
                ];
                fields = {
                    'timestamp': 'date',
                    'message': 'string',
                    'ip': 'string',
                    'passIn': 'string',
                    'number': 'number',
                    'cpu': 'number',
                    'memory': 'number',
                    'tags': [{
                        name: 'string',
                        weight: 'number'
                    }],
                    'store': {
                        books: [{
                            title: 'string',
                            author: 'string',
                            price: 'number'
                        }],
                        bicycle: {
                            color: 'string',
                            price: 'number'
                        }
                    }
                };
                var paramsConfig = {
                    'param_date': {
                        defaultValue: '',
                        desc: 'fake parameter',
                        required: true
                    },
                    'param_query': {
                        desc: 'User input query',
                        required: false
                    },
                    'param_passIn': {
                        desc: $translate.instant('dts.mock.input_parameters_returned') + "," + $translate.instant('dts.mock.verify_parameters')
                    },
                    'param_numOfRecord': {
                        defaultValue: 1,
                        type: 'number',
                        desc: $translate.instant('dts.mock.number_of_data_return'),
                        required: true
                    }
                };
                return $q(function (resolve, reject) {
                    resolve({
                        fields: fields,
                        paramsConfig: paramsConfig
                    });
                });
            }

            function getData(params) {
                if (params['_streamLastUpdate']) {
                    return genDataForStream(params);
                }
                if (params['param_query'] === 'SIMULATE_QUERY_ERROR') {
                    return $q(function (resolve, reject) {
                        reject(new Error('SIMULATE_QUERY_ERROR'));
                    });
                }
                return genDataByNum(params);

                function genDataByNum(params) {
                    var numOfRec = params.param_numOfRecord || 10;
                    var result = {
                        total: 0,
                        records: []
                    };
                    var intervalSec = 10;
                    var start = moment().subtract(numOfRec * intervalSec, 's');
                    for (var i = numOfRec; i > 0; i--) {
                        result.records.push({
                            timestamp: start.toDate(),
                            passIn: params.param_passIn,
                            message: Date.now() + '',
                            ip: randomIp(),
                            cpu: randomNumber(60, 20),
                            memory: randomNumber(80, 10),
                            number: randomNumber(100, 100),
                            constantString: 'constant',
                            store: {
                                bicycle: {
                                    color: 'red',
                                    price: randomNumber()
                                }
                            }
                        });
                        start.add(intervalSec, 's');
                    }
                    result.total = result.records.length;
                    // console.log(result.records);
                    return $q(function (resolve, reject) {
                        resolve(result);
                    });
                }

                function genDataForStream(params) {
                    var intervalSec = 1;
                    var streamLastUpdate = params['_streamLastUpdate'];
                    var span = (Date.now() - streamLastUpdate);
                    // console.log('gap', gap);
                    var numOfRec = Math.floor(span / (intervalSec * 1000));
                    var result = {
                        total: numOfRec,
                        records: []
                    };
                    var now = moment(streamLastUpdate);
                    for (var i = 0; i < result.total; i++) {
                        now.add(intervalSec, 's');
                        // now = now.subtract( delaySec, 's');
                        result.records.push({
                            timestamp: now.toDate(),
                            passIn: params.param_passIn,
                            message: params.param_passIn + ' message',
                            ip: randomIp(),
                            number: randomNumber(100, 100)
                        })
                    }
                    return $q(function (resolve, reject) {
                        resolve(result);
                    });
                }
            }

        }
    }
})();
/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/20/2017
 */
(function () {
    'use strict';

    angular.module('oplus.dts').service('mockExcelDataset', mockExcelDataset);

    mockExcelDataset.$inject = ['excelMockData', 'localDatasetRepo'];

    // if (window.$oplus.appConfig.modules.dts && window.$oplus.appConfig.modules.dts.useLocalDb) {
    //     angular.module('oplus.dts').run(['mockExcelDataset', function (mockExcelDataset) {
    //         mockExcelDataset.registerDatasets();
    //     }]);
    // }

    function mockExcelDataset(excelMockData, localDatasetRepo) {
        var isRegistered = false;
        this.registerDatasets = registerDatasets;
        this.findAllDatasets = findAllDatasets;
        this.queryDatasetMeta = queryMeta;
        this.queryDataset = queryData;

        function registerDatasets() {
            if (isRegistered) {
                return;
            }
            findAllDatasets(function (all) {
                all.forEach(function (ds) {
                    localDatasetRepo.defineLocalDataset(ds.code, ds.name, 'mockExcelDataset');
                })
            });
            isRegistered = true;
        }

        function queryData(datasetCode, params) {
            return excelMockData.readWorksheet(datasetCode, params);
        }

        function queryMeta(datasetCode) {
            return excelMockData.getSheetColumnMeta(datasetCode);
        }

        function findAllDatasets(callback) {
            var all = [];
            excelMockData.readWorkbook().then(function (workbook) {
                workbook.SheetNames.forEach(function (s) {
                    all.push({code: s, name: s, desc: 'desc=' + s});
                });
                callback(all);
            });
        }
    }
})();
/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 11/8/2017
 */
(function () {
    'use strict';
    angular.module('oplus.dts').controller('DatasourceNewCtrl', DatasourceNewCtrl);
    DatasourceNewCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$translate'];

    function DatasourceNewCtrl($scope, $rootScope, $state, $stateParams, $translate) {
        var ctrl = this;
        ctrl.dsTypeList = [
            {type: 'jdbc', label: 'JDBC' + $translate.instant('dts.list.database'), icon: 'fa-database'},
            {type: 'join', label: $translate.instant('dts.list.multiple_datasets'), icon: 'fa-random'},
            // {type: 'es', label: 'ElasticSearch'},
            // {type: 'file', label: $translate.instant('dts.list.document')},
            // {type: 'mongo', label: 'MongoDB'},
            // {type: 'hbase', label: 'HBase'},
            {type: 'rest', label: 'REST API', icon: 'fa-cloud-download'}
            // {type: 'orientdb', label: 'orientdb'}
        ];
        ctrl.gotoState = gotoState;
        ctrl.dsTypes = [];
        initDsTypes();

        function initDsTypes() {
            angular.forEach(ctrl.dsTypeList, function (obj) {
                // if ($rootScope.dts.sourceTypes.indexOf(obj.type) != -1) {
                //     ctrl.dsTypes.push(obj);
                // }
            })
        }

        // type  标识进入当前页面的类型 方便跳转到不同 state 的 view 为空则做默认跳转
        // --  ssc  整合配置项后 小应用窗口化跳转 (app.ssc)
        ctrl.type = $stateParams['type'];
        ctrl.breadcrumbState = 'app.dts';
        ctrl.createState = 'app.dts_datasource_new.type';

        if (ctrl.type && ctrl.type === 'ssc') {
            ctrl.breadcrumbState = 'app.ssc.datasource';
            ctrl.createState = 'app.ssc.datasource_create.type';
        }

        function gotoState(state, params) {
            $state.go(state, params);
        }

    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/30/2017
 */
(function () {
    'use strict';
    angular.module('oplus.dts').controller('DatasourceEditCtrl', DatasourceEditCtrl);

    DatasourceEditCtrl.$inject = ['$scope', '$compile', '$timeout', '$state', '$stateParams', 'messageService', 'datasourceService', '$templateRequest', 'restUtils', '$translate'];

    /**
     *
     * @param $scope
     * @param $compile
     * @param $timeout
     * @param $state
     * @param $stateParams
     * @param messageService {messageService}
     * @param datasourceService {datasourceService}
     * @param $templateRequest0
     * @param restUtils {restUtils}
     * @constructor
     */
    function DatasourceEditCtrl($scope, $compile, $timeout, $state, $stateParams, messageService, datasourceService, $templateRequest, restUtils, $translate) {
        var id = $stateParams['id'];
        var datasourceType = $stateParams['type'];
        $scope.editing = false;
        var oldPass = "";
        // $scope.selected = {className:"com.ibm.db2.jcc.DB2Driver"};
        $scope.selected = {};

        $scope.saveDatasource = saveDatasource;
        $scope.testConnectivity = testConnectivity;
        $scope.cancel = cancel;

        var dsTypeHandler = {
            initProps: function () {

                if ($scope.datasource.type === 'jdbc') {


                    $scope.jdbcDrivers = datasourceService.getJdbcDrivers();
                    // $scope.datasource.config = $scope.datasource.config || {};

                    if ($scope.datasource.config) {
                        var driver = _.find($scope.jdbcDrivers, {className: $scope.datasource.config.driver});
                        if (driver) {
                            $scope.selected.className = angular.copy($scope.datasource.config.driver);
                        } else {
                            $scope.selected.className = "other";
                        }
                    } else {
                        $scope.datasource.config = {
                            driver: angular.copy($scope.selected.className)
                        }
                    }

                    $scope.changeJdbcDriver = function () {
                        $scope.datasource.config.driver = angular.copy($scope.selected.className);
                        var className = $scope.datasource.config.driver;
                        var driver = _.find($scope.jdbcDrivers, {className: className});
                        $scope.selectedDriver = driver;
                        $scope.datasource.config.validationQuery = $scope.selectedDriver.validationQuery;
                        if (!id) {
                            $scope.datasource.config.url = $scope.selectedDriver.urlTemplate;
                        }
                    }

                    oldPass = $scope.datasource.config.password;

                } else if ($scope.datasource.type === 'es') {
                    $scope.datasource.config = $scope.datasource.config || {query: '{"query":{"match_all":{}}}'};
                }

            },
            beforeSave: function () {
                if ($scope.datasource.type === 'jdbc') {
                    if (oldPass == $scope.datasource.config.password) {
                        delete $scope.datasource.config.password;
                    }
                }
            }
        };
        loadDatasource();

        function loadDatasource() {
            if (!id) {
                $scope.datasource = {type: datasourceType};
                dsTypeHandler.initProps();
            } else {
                $scope.editing = true;
                datasourceService.findDatasource(id).then(function (datasource) {
                    $scope.datasource = datasource;

                    dsTypeHandler.initProps();
                }).catch(function (err) {
                    throw err;
                });
            }
        }

        function saveDatasource() {

            dsTypeHandler.beforeSave();

            datasourceService.saveDatasource($scope.datasource).then(function (obj) {
                $scope.editing = true;
                $scope.datasource = obj;
                // oldPass = $scope.datasource.config.password;

                dsTypeHandler.initProps();
                messageService.toast('success', 'Saved');
                /*$state.go('app.dts_datasource_list');*/
            }).catch(function (err) {
                throw err;
            });

        }

        /**
         * 测试链接
         */
        function testConnectivity() {

            if (!$scope.datasource.id) {
                messageService.toast('info', $translate.instant('dts.datasource.please_save_dataset'));
                return;
            }


            datasourceService.testConnectivity($scope.datasource).then(function (data) {


                messageService.alertSuccess($translate.instant('dts.datasource.success'), $translate.instant('dts.datasource.test_success'));
                $scope.datasourceResponseData = data;


            }).catch(function (err) {
                messageService.alertError($translate.instant('dts.datasource.fail'), err.message);
            });

        }

        function cancel() {
            history.go(-1);
        }

        /**
         * the check of jdbc name
         * @type {RegExp}
         */
        var regex = /^[a-zA-Z0-9_]{1,}$/;
        $scope.$watch('datasource.name', function (name, oldName) {
            if (!id && $scope.datasource.type == "jdbc") {
                if (name) {
                    if (!regex.test(name)) {
                        $scope.datasource.name = oldName;
                    }
                }

            }

        })

    }
})();

/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
 */
(function () {
    'use strict';

    angular.module('oplus.dts').component('datasourceList', {
        templateUrl: 'app/modules/dts/datasource-list.component.html',
        controller: DatasourceCtrl,
        bindings: {
            datasetState: '<',
            uiViewUrl: '<',
            createState: '<',
            createParams: '<',
            editState: '<',
        }
    });

    DatasourceCtrl.$inject = ['$scope', '$rootScope', '$state', '$stateParams', '$timeout', '$uibModal', 'messageService', 'datasourceService', 'datasetService', 'apiService', 'currentUser', '$translate'];

    /**
     *
     * @param $scope
     * @param $state
     * @param $uibModal
     * @param messageService {messageService}
     * @constructor
     */
    function DatasourceCtrl($scope, $rootScope, $state, $stateParams, $timeout, $uibModal, messageService, datasourceService, datasetService, apiService, currentUser, $translate) {

        var datasourceName = $stateParams['datasourceName'];

        $scope.uiViewUrl = this.uiViewUrl || 'dataset_list';
        $scope.createState = this.createState || 'app.dts_datasource_new';
        $scope.createParams = this.createParams || {};
        $scope.editState = this.editState || 'app.dts.datasource.edit';
        $scope.datasetState = this.datasetState || 'app.dts.datasource_datasets';

        var activeKey = "";
        $scope.options = {
            // extensions: ["glyph", "wide"],
            source: [],
            selectMode: 3,
            glyph: {
                preset: "awesome5",
                map: {
                    doc: 'fa fa-table',
                    docOpen: 'fa fa-table',
                    folder: "fa fa-dice-d20",
                    folderOpen: "fa fa-dice-d20"
                }
            },
            activate: function (event, data) {
                console.log('activate', data.node);
                //     $state.go("app.dts");
                $scope.selectNode = data.node.data;
                if ($scope.selectNode.pName !== "") {
                    // findByDatasource($scope.selectNode.name);
                    $state.go($scope.editState, {
                        id: $scope.selectNode.id
                    });
                    // $state.go($scope.datasetState, {
                    //   datasourceName: $scope.selectNode.name,
                    //   tempType: $scope.selectNode.tempType
                    // });
                }
            }
        }


        $scope.sourceTypeList = [{
            "pId": "",
            "pName": "",
            "type": "jdbc",
            "name": "JDBC" + $translate.instant('dts.list.database'),
            "id": "jdbc",
            "title": "JDBC" + $translate.instant('dts.list.database'),
            "folder": true,
            "children": []
        },
            {
                "pId": "",
                "pName": "",
                "type": "join",
                "name": $translate.instant('dts.list.multiple_datasets'),
                "id": "join",
                "title": $translate.instant('dts.list.multiple_datasets'),
                "folder": true,
                "children": []
            },
            {
                "pId": "",
                "pName": "",
                "type": "es",
                "name": "ElasticSearch",
                "id": "es",
                "title": "ElasticSearch",
                "folder": true,
                "children": []
            },
            {
                "pId": "",
                "pName": "",
                "type": "file",
                "name": $translate.instant('dts.list.document'),
                "id": "file",
                "title": $translate.instant('dts.list.document'),
                "folder": true,
                "children": []
            },
            {
                "pId": "",
                "pName": "",
                "type": "mongo",
                "name": "MongoDB",
                "id": "mongo",
                "title": "MongoDB",
                "folder": true,
                "children": []
            },
            {
                "pId": "",
                "pName": "",
                "type": "hbase",
                "name": "HBase",
                "id": "hbase",
                "title": "HBase",
                "folder": true,
                "children": []
            },
            {
                "pId": "",
                "pName": "",
                "type": "rest",
                "name": "REST API",
                "id": "rest",
                "title": "REST API",
                "folder": true,
                "children": []
            },
            {
                "pId": "",
                "pName": "",
                "type": "orientdb",
                "name": "OrientDB",
                "id": "orient",
                "title": "OrientDB",
                "folder": true,
                "children": []
            }
        ];

        $scope.sourceType = [];


        $scope.createDatasource = createDatasource;

        init();

        function init() {
            initSourceType();
            initSource();
        }

        function initSourceType() {
            var sourceTypes=['jdbc','rest','join'];
            angular.forEach($scope.sourceTypeList, function (obj) {
                if (sourceTypes.indexOf(obj.type) !== -1) {
                    $scope.sourceType.push(obj);
                }
            })
        }

        function initSource() {
            initFancyTree();
            initDatasource();
        }


        function findByDatasource() {
            datasetService.findByDatasource($scope.selectNode.name).then(function (data) {
                $scope.datasets = data;
            });
        }

        function initDatasource() {

            datasourceService.findAllDatasources().then(function (data) {

                var jdbcList = [];
                var joinList = [];
                var esList = [];
                var fileList = [];
                var mongoList = [];
                var hbaseList = [];
                var restList = [];
                var orientdbList = [];

                angular.forEach(data, function (obj) {
                    obj['key'] = obj.id;
                    if (obj['type'] == 'jdbc') {
                        obj["pId"] = "jdbc";
                        obj["pName"] = $translate.instant('dts.list.database');
                        obj["tempType"] = "jdbc";
                        obj["title"] = obj.name;
                        jdbcList.push(obj);
                    } else if (obj['type'] == 'join') {
                        obj["pId"] = "join";
                        obj["pName"] = $translate.instant('dts.list.multiple_datasets');
                        obj["tempType"] = "join";
                        obj["title"] = obj.name;
                        joinList.push(obj);
                    } else if (obj['type'] == 'es') {
                        obj["pId"] = "es";
                        obj["pName"] = "ElasticSearch";
                        obj["tempType"] = "es";
                        obj["title"] = obj.name;
                        esList.push(obj);
                    } else if (obj['type'] == 'file') {
                        obj["pId"] = "file";
                        obj["pName"] = $translate.instant('dts.list.document');
                        obj["tempType"] = "file";
                        obj["title"] = obj.name;
                        fileList.push(obj);
                    } else if (obj['type'] == 'mongo') {
                        obj["pId"] = "mongo";
                        obj["pName"] = "MongoDB";
                        obj["tempType"] = "mongo";
                        obj["title"] = obj.name;
                        mongoList.push(obj);
                    } else if (obj['type'] == 'hbase') {
                        obj["pId"] = "hbase";
                        obj["pName"] = "HBase";
                        obj["tempType"] = "hbase";
                        obj["title"] = obj.name;
                        hbaseList.push(obj);
                    } else if (obj['type'] == 'rest') {
                        obj["pId"] = "rest";
                        obj["pName"] = "REST API";
                        obj["tempType"] = "rest";
                        obj["title"] = obj.name;
                        restList.push(obj);
                    } else if (obj['type'] == 'orientdb') {
                        obj["pId"] = "orientdb";
                        obj["pName"] = "OrientDB";
                        obj["tempType"] = "orientdb";
                        obj["title"] = obj.name;
                        orientdbList.push(obj);
                    }

                    if (datasourceName) {
                        if (obj["name"] == datasourceName) {
                            activeKey = obj.id;
                        }
                    }


                })

                angular.forEach($scope.sourceType, function (obj, index) {
                    if (obj['type'] == 'jdbc') {
                        $scope.sourceType[index].children = jdbcList;
                    } else if (obj['type'] == 'join') {
                        $scope.sourceType[index].children = joinList;
                    } else if (obj['type'] == 'es') {
                        $scope.sourceType[index].children = esList;
                    } else if (obj['type'] == 'file') {
                        $scope.sourceType[index].children = fileList;
                    } else if (obj['type'] == 'mongo') {
                        $scope.sourceType[index].children = mongoList;
                    } else if (obj['type'] == 'hbase') {
                        $scope.sourceType[index].children = hbaseList;
                    } else if (obj['type'] == 'rest') {
                        $scope.sourceType[index].children = restList;
                    } else if (obj['type'] == 'orientdb') {
                        $scope.sourceType[index].children = orientdbList;
                    }
                })


                // if (activeKey == "" && data.length != 0) {
                //     activeKey = data[0].id;
                // }

                changeFancyTree();

            }).catch(function (err) {
                throw err;
            })
        }

        function createDatasource() {
            $state.go($scope.createState, $scope.createParams);
        }


        function initFancyTree() {

            $scope.options["source"] = $scope.sourceType;

            $('#dts-datasource-tree').fancytree(_.merge({}, window.$oplus.fancytreeDefault, $scope.options));
            //$("#dts-datasource-tree").fancytree("getTree").activateKey(activeKey);
            $("#dts-datasource-tree").fancytree("getRootNode").visit(function (node) {
                node.setExpanded(true);
            });

            $.contextMenu({
                selector: "#dts-datasource-tree span.fancytree-title",
                events: {
                    show: function (opt) {
                        var node = $.ui.fancytree.getNode(opt.$trigger);
                        if (node.folder) {
                            return false;
                        }
                        return currentUser.hasPermission('dts:edit')
                    }
                },
                items: {
                    "edit": {
                        name: $translate.instant('dts.commons.edit'),
                        icon: "edit",
                        callback: function (key, opt) {
                            var node = $.ui.fancytree.getNode(opt.$trigger);
                            editDataResource(node.data.id);
                        }
                    },
                    "delete": {
                        name: $translate.instant('dts.commons.delete'),
                        icon: "delete",
                        callback: function (key, opt) {
                            var node = $.ui.fancytree.getNode(opt.$trigger);
                            delDataResource(node.data);
                        }
                    }
                }
            });

        }

        function editDataResource(id) {
            console.log('editDatasource', id);
            $state.go($scope.editState, {
                id: id
            })
        }

        function delDataResource(datasource) {
            activeKey = datasource.pId;
            messageService.confirm($translate.instant('dts.commons.delete'), $translate.instant('dts.commons.confirm_delete_datasource') + datasource.name + '？', function () {
                datasourceService.deleteDatasource(datasource.id).then(function () {
                    initSource();
                });

            }, function () {

            });
        }

        function changeFancyTree() {
            var tree = $("#dts-datasource-tree").fancytree("getTree");
            tree.options.source = $scope.sourceType;
            tree.reload();

            tree.activateKey(activeKey + "");
            $("#dts-datasource-tree").fancytree("getRootNode").visit(function (node) {
                node.setExpanded(true);
            });
        }

        $scope.isShowSourceType = function (sourceType) {
            console.log(sourceType);
            return true;
        }
    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/30/2017
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name datasetList
     */
    angular.module('oplus.dts').component('datasetList', {
        templateUrl: 'app/modules/dts/dataset-list.component.html',
        controller: DatasetListCtrl,
        bindings: {
            showApplet: '<',
            appletCode: '<',
            createState: '<',
            editState: '<',
            datasetState: '<',
            uiViewUrl: '<',
            options: '<'
        }
    });

    DatasetListCtrl.$inject = ['$scope', '$translate', '$rootScope', '$compile', '$state', '$stateParams', 'messageService', 'datasourceService', 'datasetService', 'apiService', '$uibModal', 'appletService','appletSecurity'];

    /**
     *
     * @param $scope
     * @param $translate
     * @param $rootScope
     * @param $compile
     * @param $state
     * @param $stateParams
     * @param messageService {messageService}
     * @param datasourceService {datasourceService}
     * @param datasetService {datasetService}
     * @param apiService
     * @param $uibModal
     * @param {appletService} appletService
     * @param {appletSecurity} appletSecurity
     * @constructor
     */
    function DatasetListCtrl($scope, $translate, $rootScope, $compile, $state, $stateParams, messageService, datasourceService, datasetService, apiService, $uibModal, appletService,appletSecurity) {
        var that = this;
        this.options = this.options || {};
        this.createDataset = createDataset;
        this.editDataset = editDataset;
        this.copyDataset = copyDataset;
        this.deleteDataset = deleteDataset;
        this.onAppletSelectorChange = onAppletSelectorChange;
        this.showRestApi = showRestApi;
        this.moveDataset = moveDataset;
        this.showApplet = this.showApplet || false;
        this.appletCode = this.appletCode || '';
        this.uiViewUrl = this.uiViewUrl || 'edit_dataset';
        this.createState = this.createState || 'app.dts.datasource_datasets.dts_dataset_new';
        this.editState = this.editState || 'app.dts.dataset.edit';
        this.datasetState = this.datasetState || 'app.dts.datasource_datasets';
        this.tableConfig = {
            tableId: 'dts-datasetlist',
            data: function () {
                // return datasetService.findByDatasource(datasourceName, {
                var appletCode = $stateParams.appletCode || that.appletCode;
                return datasetService.findDatasetsByApplet(appletCode);
            },
            columns: [{
                data: 'code',
                title: $translate.instant('dts.dataset.attr.code'),
                render: function (data, type, row, meta) {
                    var html = row.code;
                    return '<a class="d-block text-wrap"  ng-click="$ctrl.editDataset(\'' + row.id + '\')">' + html + '</a>';
                }
            },
                {data: 'name', title: $translate.instant('dts.dataset.attr.name')},
                {
                    data: 'datasource',
                    title: $translate.instant('dts.dataset.attr.datasource'),
                    _extra: {autoFilter: true}
                },
                {data: 'appletCode', title: $translate.instant('dts.dataset.attr.applet'), searchable: false},
                {data: 'createdBy', title: $translate.instant('common.attr.created_by')},
                {
                    data: 'modifiedAt',
                    title: $translate.instant('common.attr.updated_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                }
            ],
            selection: {labelData: 'title', valueData: 'id'},
            order: [[6, 'desc']]
        }

        var datasourceName = $stateParams['datasourceName'];
        var tempType = $stateParams['tempType'];
        var datasetId = $stateParams['id'];
        var isNew = $state.current.url.indexOf("new") !== -1;
        if (this.options.enableEdit) {
            this.tableConfig.columns.push({
                title: $translate.instant('common.action.action'),
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    if (!appletSecurity.canModifyAppletResource(row['appletCode'])){
                       return '';
                    }
                    var html = ' <button type="button" class="btn btn-default btn-sm opx-btn-icon opx-btn-table" ng-click="$ctrl.editDataset(\'' + row.id + '\')" title="{{\'common.action.modify\'|translate}}" uaa-has-permission="dts:edit"><i class="fa fa-pencil"></i></button>' +
                        // ' <button type="button" class="btn btn-default btn-sm opx-btn-icon opx-btn-table" ng-click="$ctrl.showRestApi(dataset)" title="API" uaa-has-permission="dts:view"><i class="fa fa-share-alt"></i></button>' +
                        ' <button type="button" class="btn btn-default btn-sm opx-btn-icon opx-btn-table" ng-click="$ctrl.copyDataset(\'' + row.id + '\',\'' + row.name + '\')" title="{{\'common.action.copy\'|translate}}" uaa-has-permission="dts:edit"><i class="fa fa-copy"></i></button>' +
                        ' <button type="button" class="btn btn-default btn-sm opx-btn-icon opx-btn-table" ng-click="$ctrl.deleteDataset(\'' + row.id + '\')" class="m-r-sm" title="{{\'dts.operate.delete\' | translate}}" uaa-has-permission="dts:edit"><i class="fa fa-trash-alt"></i></button>';
                    return html;
                }
            });
        }

        // findByDatasource(datasourceName);

        function findByDatasource(datasourceName) {
            datasetService.findAllDatasets(datasourceName, {
                appletCode: that.appletCode
            }).then(function (data) {
                that.datasets = data;
                if (!isNew) {
                    if (datasetId) {
                        angular.forEach(that.datasets, function (obj) {
                            if (datasetId == obj.id) {
                                setTimeout(function () {
                                    editDataset(obj);
                                }, 200)
                            }
                        })
                    } else {
                        if (that.datasets.length > 0) {
                            setTimeout(function () {
                                //       editDataset(that.datasets[0]);
                            }, 200)
                        }
                    }
                } else {
                    setTimeout(function () {
                        createDataset();
                    }, 200)
                }

            });
        }


        function createDataset() {
            var folders = [$translate.instant('dts.list.database'), $translate.instant('dts.list.server'), $translate.instant('dts.list.api'), ""];
            if (datasourceName && _.indexOf(folders, datasourceName) == -1) {
                $state.go(that.createState, {
                    type: tempType,
                    datasourceName: datasourceName
                });
            }
        }

        function editDataset(id) {
            var state = that.editState;
            console.log('editDataset', {state: state, id: id, appletCode: that.appletCode});
            $state.go(state, {id: id/*, appletCode: that.appletCode*/});
        }

        function moveDataset() {
            appletService.openAppletSelectorModal(function (applet) {
                messageService.confirm($translate.instant('dts.dataset.action.move_dataset'),
                    $translate.instant('dts.dataset.action.move_dataset_confirm', {
                        applet: applet.title,
                        recordNum: that.tableConfig.selectedItems.length
                    }),
                    function () {
                        var code = applet.code;
                        datasetService.moveDataset(that.tableConfig.selectedItems, applet.code).then(function () {
                            reloadData();
                        }).catch(function (err) {
                            throw err;
                        });
                    })
            });
        }

        function copyDataset(dataset_id, dataset_name) {
            messageService.prompt("", $translate.instant('dts.list.please_input') + "code", "", function (value) {
                datasetService.copyDataset(dataset_id, value).then(
                    function (obj) {
                        messageService.toast('success', dataset_name + $translate.instant('dts.list.copy_success'));
                        setTimeout(function () {
                            $state.go(that.editState, {
                                type: obj.type,
                                id: obj.id
                            }, {
                                reload: true
                            });
                        }, 200);
                    }
                )
            }, "");

        }

        function deleteDataset(datasetId) {
            messageService.confirm($translate.instant('dts.dataset.action.delete'), $translate.instant('dts.dataset.action.delete_confirm', {name: datasetId}), function () {
                datasetService.deleteDataset(datasetId).then(function () {
                    // messageService.toast('success', '删除成功');
                    reloadData();
                });
            });
        }

        function onAppletSelectorChange(applet) {
            that.appletCode = applet.name;
            reloadData();
        }

        function reloadData() {
            that.tableConfig.reloadData();
        }

        function showRestApi(dataset) {
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'app/modules/dts/rest-share.html',
                controller: ['dataset', '$scope', RestApiCtrl],
                controllerAs: '$ctrl',
                resolve: {
                    dataset: function () {
                        return dataset;
                    }
                },
                size: 'md'
            });

            function RestApiCtrl(dataset, $scope) {
                var prefix = window.$oplus.appConfig.apiBaseUrls.dts;
                if (prefix) {
                    prefix += "/";
                } else {
                    prefix = window.location.protocol + "//" + window.location.host + window.location.pathname;
                }
                that.restApi = prefix + "api/dts/query/data/" + dataset.code;

                var getUrl = that.restApi;
                var params = {};

                if (dataset.params) {
                    getUrl += "?params=%7B";
                    angular.forEach(dataset.params, function (detail, key) {
                        if (detail.type == "array") {
                            params[key] = detail.defaultValue.split(",");
                        } else {
                            params[key] = detail.defaultValue;
                        }

                    })
                    var paramsToString = angular.toJson(params);
                    getUrl += paramsToString.substring(1, paramsToString.length - 1);
                    getUrl += "%7D";
                }

                that.getUrl = getUrl;
                that.params = {
                    "params": params
                };

                that.curlGetUrl = 'curl -X GET --header "Accept: */*"  "' + encodeURI(getUrl) + '"';
                that.curlPostUrl = 'curl -X POST --header "Content-Type: application/json" --header "Accept: application/json" -d \'' + angular.toJson(that.params) + '\' "' + that.restApi + '"';


                that.dismissModal = function () {
                    modalInstance.close();
                }

                that.publish = function () {
                    console.log(dataset);

                    var path = "/api/dts/query/data/" + dataset.code;
                    var api = {
                        "get": {
                            "tags": [
                                dataset.tags
                            ],
                            "summary": dataset.name,
                            "description": dataset.description,
                            "operationId": "getMetaColumnUsingGET",
                            "consumes": [
                                "application/json"
                            ],
                            "produces": [
                                "*/*"
                            ],
                            "parameters": [{
                                "name": "orderBy",
                                "in": "query",
                                "description": $translate.instant('dts.list.sort'),
                                "required": false,
                                "type": "string"
                            },
                                {
                                    "name": "page",
                                    "in": "query",
                                    "description": $translate.instant('dts.list.which_page'),
                                    "required": false,
                                    "type": "integer",
                                    "format": "int32"
                                },
                                {
                                    "name": "size",
                                    "in": "query",
                                    "description": $translate.instant('dts.list.page_count'),
                                    "required": false,
                                    "type": "integer",
                                    "format": "int32"
                                },
                                {
                                    "name": "params",
                                    "in": "query",
                                    "description": $translate.instant('dts.list.request_param'),
                                    "required": false,
                                    "type": "string",
                                    "default": angular.toJson(params)
                                },
                                {
                                    "name": "filter",
                                    "in": "query",
                                    "description": $translate.instant('dts.list.search'),
                                    "required": false,
                                    "type": "string"
                                }
                            ],
                            "responses": {
                                "200": {
                                    "description": "OK",
                                    "schema": {
                                        "type": "object"
                                    }
                                },
                                "401": {
                                    "description": "Unauthorized"
                                },
                                "403": {
                                    "description": "Forbidden"
                                },
                                "404": {
                                    "description": "Not Found"
                                }
                            },
                            "x-auth-type": "Application & Application User",
                            "x-throttling-tier": "Unlimited"
                        },
                        "post": {
                            "tags": [
                                dataset.tags
                            ],
                            "summary": dataset.name,
                            "description": path,
                            "operationId": "queryMetaColumnUsingPOST",
                            "consumes": [
                                "application/json"
                            ],
                            "produces": [
                                "*/*"
                            ],
                            "parameters": [{
                                "in": "body",
                                "name": "options",
                                "description": "options",
                                "required": false,
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "filter": {
                                            "type": "string",
                                            "description": $translate.instant('dts.list.filter')
                                        },
                                        "orderBy": {
                                            "type": "string",
                                            "description": $translate.instant('dts.list.sort_column') + "：name desc, title asc"
                                        },
                                        "page": {
                                            "type": "integer",
                                            "format": "int32",
                                            "description": $translate.instant('dts.list.page_number')
                                        },
                                        "params": {
                                            "type": "object",
                                            "default": angular.toJson(params),
                                            "description": $translate.instant('dts.list.query_param') + "{'key'：'value'，'key1'：'value1'}"
                                        },
                                        "size": {
                                            "type": "integer",
                                            "format": "int32",
                                            "description": $translate.instant('dts.list.page_count')
                                        }
                                    },
                                }
                            }],
                            "responses": {
                                "200": {
                                    "description": "OK",
                                    "schema": {
                                        "type": "object"
                                    }
                                },
                                "201": {
                                    "description": "Created"
                                },
                                "401": {
                                    "description": "Unauthorized"
                                },
                                "403": {
                                    "description": "Forbidden"
                                },
                                "404": {
                                    "description": "Not Found"
                                }
                            },
                            "x-auth-type": "Application & Application User",
                            "x-throttling-tier": "Unlimited"
                        }
                    }

                    apiService.findSwaggerApi().then(
                        function (apiDocs) {
                            console.log("--------update before Api--------");
                            console.log(apiDocs);
                            apiDocs.paths[path] = api;
                            saveSwaggerApi(apiDocs);
                        }
                    ).catch(function (err) {
                        messageService.toast('error', dataset.name + $translate.instant('dts.list.publish_failed') + err);
                        throw err;
                    })

                }

                function findStoreApi() {
                    apiService.findStoreApi().then(
                        function (data) {

                        }
                    ).catch(function (err) {
                        throw err;
                    })
                }


                function saveSwaggerApi(apiDocs) {

                    apiService.saveSwaggerApi(apiDocs).then(
                        function (data) {
                            console.log("--------update after Api--------");
                            console.log(data);
                            messageService.toast('success', dataset.name + $translate.instant('dts.list.publish_success'));
                        }
                    ).catch(function (err) {
                        messageService.toast('error', dataset.name + $translate.instant('dts.list.publish_failed') + err);
                        throw err;
                    })
                }
            }
        }
    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/30/2017
 */
(function () {
    'use strict';
    /**
     * @ngdoc
     * @name DatasetEditCtrl
     */
    angular.module('oplus.dts').component('datasetEdit', {
        templateUrl: 'app/modules/dts/dataset-edit.component.html', controller: DatasetEditCtrl, bindings: {
            editState: '<', appletCode: '<'
        }
    });

    DatasetEditCtrl.$inject = ['$scope', '$rootScope', '$compile', '$state', '$stateParams', 'messageService', 'datasourceService', 'datasetService', '$templateRequest', 'restUtils', '$translate'];

    /**
     *
     * @param $scope
     * @param $rootScope
     * @param $compile
     * @param $state
     * @param $stateParams
     * @param messageService {messageService}
     * @param datasourceService {datasourceService}
     * @param datasetService {datasetService}
     * @param $templateRequest
     * @param restUtils
     * @constructor
     */
    function DatasetEditCtrl($scope, $rootScope, $compile, $state, $stateParams, messageService, datasourceService, datasetService, $templateRequest, restUtils, $translate) {
        var id = $stateParams['id'];
        var datasourceName = $stateParams['datasourceName'];
        var type = $stateParams['tempType'];

        $scope.appletCode = this.appletCode || '';
        $scope.editState = this.editState || 'app.dts.datasource_datasets.dts_dataset_edit';

        $scope.isAction = false;
        $scope.editAction = false;
        $scope.editing = false;
        $scope.isRunning = false;
        $scope.saveDataset = saveDataset;
        $scope.getParams = getParams;
        $scope.queryMeta = queryMeta;
        $scope.exportData = exportData;
        $scope.download = download;
        $scope.addQueryParam = addQueryParam;
        $scope.removeQueryParam = removeQueryParam;
        $scope.changeParam = changeParam;
        $scope.addColumns = addColumns;
        $scope.removeColumn = removeColumn;
        $scope.changeColumn = changeColumn;
        $scope.changeColumnDesc = changeColumnDesc;
        $scope.confirmChange = confirmChange;
        $scope.selectDatasets = {
            query: []
        };
        $scope.cmOption = {
            lineNumbers: true, lineWrapping: true, indentWithTabs: true, theme: 'opluscode', mode: 'sql'
        };

        if (type === "join") {
            loadDatasets();
        }

        loadDataset(id);

        function loadDatasources() {
            datasourceService.findAllDatasources().then(function (data) {
                $scope.datasources = data;
                angular.forEach($scope.datasources, function (v) {
                    if ($scope.dataset) {
                        if (v.name === $scope.dataset.datasource) {
                            $scope.selectedDatasource = v;
                        }
                    }
                })
            });
        }

        function loadDataset(id) {
            if (id) {
                $scope.editing = true;
                datasetService.findDataset(id).then(function (data) {
                    $scope.dataset = data;
                    if ($scope.dataset.options == null && $scope.dataset.type === "jdbc") {
                        $scope.dataset.options = {
                            proc: false
                        };
                    } else if ($scope.dataset.type === "join") {
                        $scope.selectDatasets.query = $scope.dataset.query.split(",");
                    }
                    loadDatasources();
                    $scope.editAction = true;
                }).catch(function (err) {
                    throw err;
                });
            } else {
                $scope.isAction = true;
                if (type === "jdbc") {
                    $scope.dataset = {
                        datasource: datasourceName, options: {
                            proc: false
                        }
                    };
                } else if (type === "join") {
                    $scope.dataset = {
                        datasource: datasourceName, options: {
                            joinKeys: "", joinType: "join"
                        }
                    };
                } else if (type === 'es') {
                    $scope.dataset = {
                        datasource: datasourceName, options: {
                            proc: false
                        }
                    };
                } else if (type === 'orientdb') {
                    $scope.dataset = {
                        datasource: datasourceName, options: {
                            proc: false
                        }
                    };
                } else if (type === "rest") {
                    $scope.dataset = {
                        datasource: datasourceName, options: {
                            encoder: "UTF-8", unicode: false
                        }
                    };

                }
                loadDatasources();
            }
        }

        function loadDatasets() {
            datasetService.findAllDatasets().then(function (data) {
                $scope.datasets = data;
            }).catch(function (err) {
                throw err;
            });
        }

        function saveDataset() {
            if ($scope.selectedDatasource) {
                try {
                    $scope.dataset.datasource = $scope.selectedDatasource.name;
                    $scope.dataset.type = $scope.selectedDatasource.type;
                    if ($stateParams.appletCode) $scope.dataset.appletCode = $stateParams.appletCode;
                    datasetService.saveDataset($scope.dataset).then(function (obj) {
                        $scope.dataset = obj;
                        messageService.toast('success', 'Saved');
                        setTimeout(function () {
                            $state.go($scope.editState, {
                                type: $scope.dataset.type, id: $scope.dataset.id
                            }, {
                                reload: true
                            });
                        }, 200);
                    }).catch(function (err) {
                        messageService.alert('error', err.message);
                    });
                } catch (e) {
                    messageService.alert($translate.instant('dts.status.fail'), e.message);
                }
            } else {
                messageService.alert('error', $translate.instant('dts.dataset.edit.choose_dataset'));
            }
        }

        function getParams() {
            var params = {};
            if (type === "join") {
                params = {
                    type: type, query: $scope.dataset.query
                }
            }

            datasetService.getParams(params).then(function (data) {
                $scope.dataset.params = data.paramsConfig;
            }).catch(function (err) {
                messageService.alert($translate.instant('dts.status.fail'), err.message);
            });
        }

        function download() {
            $state.go('app.gfs.staticfs_dir', {repo: '$tnt', dir: 'ASYNC_EXPORT_EXCEL'})
        }

        function exportData() {
            if (!$scope.dataset || !$scope.dataset.options.columns || !$scope.dataset.code || !$scope.dataset.name) {
                messageService.alert($translate.instant('dts.status.fail'), $translate.instant('udp.w.datatable.action.export_result_fail'));
            }
            var columns = []
            _.forEach($scope.dataset.options.columns, function (value, key) {
                var filed = {
                    "label": key, "value": key
                }
                columns.push(filed);
            });
            var queryParams = {
                "dataset": $scope.dataset.code,
                "filter": "",
                "params": {},
                "filename": $scope.dataset.name,
                "columns": columns
            }
            // console.log(queryParams)
            // console.log($scope.dataset)
            restUtils.callApi('dts', 'POST', '/api/dts/export/excel', null, queryParams).then(function (data) {
                download();
                messageService.toast("success", $translate.instant('udp.designer.actions.export_excel_success'));
                // messageService.alert($translate.instant('dts.datasource.success'), "后台异步导出Excel中，请至脚本库中下载，下载地址为：<br/><br/>" + data.path);
            }).catch(function (err) {
                messageService.alert($translate.instant('dts.status.fail'), err.message);
            });
        }

        function queryMeta(queryType, dataType) {
            type = dataType;
            var params = {};
            angular.forEach($scope.dataset.params, function (detail, key) {
                if (detail.type === "array") {
                    params[key] = detail.defaultValue.split(",");
                } else if (detail.type === "number") {
                    params[key] = Number(detail.defaultValue);
                } else if (detail.type === "date") {
                    params[key] = Date(detail.defaultValue);
                } else {
                    params[key] = detail.defaultValue;
                }
            });

            var queryParams = {};

            if (type === "jdbc") {
                queryParams = {
                    options: $scope.dataset.options,
                    type: $scope.dataset.type,
                    dataSource: $scope.selectedDatasource.name,
                    params: params,
                    query: $scope.dataset.query
                }
            } else if (type === "join") {
                queryParams = {
                    type: $scope.dataset.type,
                    params: params,
                    options: $scope.dataset.options,
                    query: $scope.dataset.query
                }
            } else if (type === "es") {
                queryParams = {
                    type: $scope.dataset.type,
                    params: params,
                    dataSource: $scope.selectedDatasource.name,
                    query: $scope.dataset.query,
                    options: $scope.dataset.options
                }
            } else if (type === "orientdb") {
                queryParams = {
                    params: params
                }
                restUtils.callApi('dts', 'POST', '/api/dts/q/meta/' + $scope.dataset.code + "/", null, queryParams).then(function (data) {
                    showData(data);
                }).catch(function (err) {
                    messageService.alert($translate.instant('dts.status.fail'), err.message);
                });
                return;
            } else if (type === "rest") {
                queryParams = {
                    type: $scope.dataset.type,
                    params: params,
                    dataSource: $scope.selectedDatasource.name,
                    query: $scope.dataset.query,
                    encoder: $scope.dataset.options.encoder,
                    options: $scope.dataset.options
                }

            }

            if (queryType === "param" && type === "jdbc") {
                datasetService.queryParams(queryParams).then(function (data) {
                    $scope.dataset.params = data.paramsConfig;
                }).catch(function (err) {
                    messageService.alert($translate.instant('dts.status.fail'), err.message);
                });
            } else {
                if (queryType === "data") {
                    $scope.isRunning = true;
                }

                datasetService.testQuery(queryParams).then(function (data) {
                    if (queryType === "param") {
                        $scope.dataset.params = data.paramsConfig;
                    } else if (queryType === "data") {
                        $scope.isRunning = false;
                        showData(data);
                    } else if (queryType === "field") {
                        $scope.dataset.options.columns = $scope.dataset.options.columns || {};
                        angular.forEach(data.fields, function (obj) {
                            $scope.dataset.options.columns[obj.name] = $scope.dataset.options.columns[obj.name] || "";
                        })
                    }

                }).catch(function (err) {
                    $scope.isRunning = false;
                    messageService.alert($translate.instant('dts.status.fail'), err.message);
                });
            }


        }

        function showData(data) {

            var columns = [];

            $scope.fields = {};

            angular.forEach(data.fields, function (obj) {
                columns.push({
                    "data": obj.name, "title": obj.name, "defaultContent": ''
                });
                $scope.fields[obj.name] = obj.name;
            })

            if (columns.length === 0) {
                $("#dataTable").html("");
                messageService.alert($translate.instant('dts.status.point'), $translate.instant('dts.status.not_get_data'));
                return;
            }

            $scope.tableOption = {
                data: data.records, columns: columns, searching: false, paging: true, scrollX: true, order: [], // Disable default ordering
                autoWidth: true, colResize: false
            };

            var table = '<table id="table" class="table table-striped"></table>';

            $("#dataTable").html($compile(table)($scope));

            callJQPlugin($("#table"), "DataTable", $scope.tableOption);

        }

        //根据插件名称，调用jquery插件
        function callJQPlugin(element, type, option) {

            var linkOptions = [];
            linkOptions.push(option);
            return element[type].apply(element, linkOptions);
        }

        function addQueryParam() {
            $scope.dataset.params = $scope.dataset.params || {};
            $scope.dataset.params[""] = {};
        }

        function removeQueryParam(name) {
            delete $scope.dataset.params[name];
        }

        function changeParam(index, name) {

            var i = 0;
            var params = {};

            angular.forEach($scope.dataset.params, function (detail, key) {


                if (index === i) {
                    params[name] = detail;
                } else {
                    params[key] = detail;
                }
                i++;

            })

            $scope.dataset.params = params;

        }

        function addColumns() {
            $scope.dataset.options.columns = $scope.dataset.options.columns || {};
            $scope.dataset.options.columns[""] = "";
        }


        function removeColumn(name) {
            delete $scope.dataset.options.columns[name];
        }

        function changeColumn(index, name) {
            var i = 0;
            var columns = {};
            angular.forEach($scope.dataset.options.columns, function (detail, key) {
                if (index === i) {
                    columns[name] = detail;
                } else {
                    columns[key] = detail;
                }
                i++;
            })
            $scope.dataset.options.columns = columns;
        }

        function changeColumnDesc(name, detail) {
            $scope.dataset.options.columns[name] = detail;
        }

        function confirmChange() {
            $scope.dataset.query = $scope.selectDatasets.query.join(",");
        }


        var regex = /^[a-zA-Z0-9_]{1,}$/;
        $scope.$watch('dataset.code', function (code, oldCode) {
            if (!id) {
                if (code) {
                    if (!regex.test(code)) {
                        $scope.dataset.code = oldCode;
                    } else {
                        $scope.dataset.code = angular.uppercase(code);
                    }
                }
            }
        })
    }
})();
