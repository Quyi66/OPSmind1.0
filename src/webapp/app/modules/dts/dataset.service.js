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

        var SCRIPT_ENGINE_DATASET_CODE = 'ACM_GET_SCRIPT_ENGINE';
        var SCRIPT_ENGINE_AAP = 'aap';
        var AAP_INSTANCE_GROUP_DATASET_CODE = 'AAP_QUERY_INSTANCE_GROUP';
        var scriptEngineCheckPromise;

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
            var d = $q.defer();
            var guardPromise = shouldGuardAAPInstanceGroup(dataset) ? ensureAAPInstanceGroupAllowed() : $q.when(true);

            guardPromise.then(function (allowQuery) {
                if (!allowQuery) {
                    return d.resolve({total: 0, records: []});
                }

                var promise;
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
                            return d.resolve({total: records.length, records: records});
                        }
                        return d.resolve(data);
                    }
                    return d.resolve(data);
                }).catch(function (err) {
                    return d.reject(err);
                });
            }).catch(function (err) {
                return d.reject(err);
            });
            return d.promise;
        }

        function shouldGuardAAPInstanceGroup(dataset) {
            if (!dataset) {
                return false;
            }
            if (angular.isString(dataset)) {
                return dataset === AAP_INSTANCE_GROUP_DATASET_CODE;
            }
            return dataset.id === AAP_INSTANCE_GROUP_DATASET_CODE;
        }

        function ensureAAPInstanceGroupAllowed() {
            if (!scriptEngineCheckPromise) {
                scriptEngineCheckPromise = datasetDao.queryDataset(SCRIPT_ENGINE_DATASET_CODE, null, null).then(function (data) {
                    var engine = _.get(data, 'records[0].result');
                    return engine === SCRIPT_ENGINE_AAP;
                }).catch(function (err) {
                    scriptEngineCheckPromise = null;
                    return $q.reject(err);
                });
            }
            return scriptEngineCheckPromise.then(function (isAAP) {
                return isAAP;
            });
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
