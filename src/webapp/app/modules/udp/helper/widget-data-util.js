/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/28/2017
 */
(function () {
    angular.module('oplus.udp').service('widgetDataUtil', widgetDataUtil);

    widgetDataUtil.$inject = ['datasetService', 'dataEx', 'debugTimer', '$translate', '$q', 'widgetUiHelper', 'currentUser', 'pageDataUtil'];


    /**
     * @ngdoc service
     * @name widgetDataUtil
     * @description
     * Utilities for widget data
     * @param {datasetService} datasetService
     * @param {dataEx} dataEx
     * @param {debugTimer} debugTimer
     * @param $q
     * @param {widgetUiHelper} widgetUiHelper
     * @param {currentUser} currentUser
     * @param {pageDataUtil} pageDataUtil
     */
    function widgetDataUtil(datasetService, dataEx, debugTimer, $translate, $q, widgetUiHelper, currentUser, pageDataUtil) {
        /**
         * @deprecated use {@link widgetDataUtil#convertFields}
         */
        this.transDataFields = transDataFields;
        this.convertFields = convertFields;
        this.getWidgetParamValues = getWidgetParamValues;
        this.setWidgetParamValues = setWidgetParamValues;
        //TODO: merge with queryAndConvertData?
        this.queryData = queryData;
        this.queryAndConvertData = queryAndConvertData;
        this.isDatasetConfigGood = isDatasetConfigGood;
        this.setWidgetCache = setWidgetCache;
        this.getWidgetCache = getWidgetCache;
        /**
         * @deprecated use {@link pageDataUtil.getPageScopeValues}
         */
        this.getPageScopeValues = pageDataUtil.getPageScopeValues;
        var localCache = new LocalCache('oplus.udp.wdata');

        /**
         * Cache data saved as an object.
         * @param storageKey Default is `oplus.cache`
         * @constructor
         */
        function LocalCache(storageKey) {
            var values = readAll();
            this.storageKey = storageKey || 'oplus.cache';
            this.readItem = readItem;
            this.saveItem = saveItem;

            function readAll() {
                return JSON.parse(localStorage.getItem(storageKey) || '{}');
            }

            function saveAll() {
                localStorage.setItem(storageKey, JSON.stringify(values));
            }

            /**
             * Get item value from cache data.
             * @param id
             * @returns {*}
             */
            function readItem(id) {
                return values[id];
            }

            /**
             * Persist item value to cache data.
             * @param id
             * @param value
             */
            function saveItem(id, value) {
                values[id] = value;
                saveAll();
            }
        }

        function getWidgetCache(element) {
            return localCache.readItem(element.attr('id'));
        }


        function setWidgetCache(element, value) {
            return localCache.saveItem(element.attr('id'), value);
        }

        /**
         * Check if a dataset configuration is good.
         * @param dataset
         * @returns {boolean}
         */
        function isDatasetConfigGood(dataset) {
            if (!dataset) {
                return false;
            } else if (dataset._type === 'datax') {
                return !!dataset.datax;
            } else if (dataset._type === 'joinx') {
                return !!dataset.joinx;
            } else {
                return !!dataset.id;
            }
        }

        // /**
        //  * Now only support 1 row, 1 column, 1 value
        //  * @param {[object]} records
        //  * @param {object} options
        //  * @param {[string]} options.rows
        //  * @param {[string]} options.columns
        //  * @param {[string]} options.values
        //  * @return {[object]}
        //  */
        // function pivotData(records, options) {
        //     return jsonToPivotjson(records, {
        //         row: options.rows[0],
        //         column: options.columns[0],
        //         value: options.values[0]
        //     });
        // }

        // function jsonToPivotjson(data, options) {
        //
        //     var ndx = crossfilter(data);
        //
        //     var pivotCol = options.column;
        //     var pivotVal = options.value;
        //     var pivotRow = options.row;
        //
        //     var out = [];
        //
        //     var pivotRowDimension = ndx.dimension(function (d) {
        //         return d[pivotRow];
        //     });
        //
        //     var pivotColDimension = ndx.dimension(function (d) {
        //         return d[pivotCol];
        //     });
        //
        //     var totalByPivotRow = pivotRowDimension.group().reduceSum(function (d) {
        //         return d[pivotVal];
        //     });
        //
        //     var allRecs = totalByPivotRow.all();
        //
        //     allRecs.forEach(function (rec) {
        //         // console.log(rec);
        //
        //         pivotRowDimension.filter();
        //         pivotRowDimension.filter(rec.key);
        //
        //         var totalByPivotCol = pivotColDimension.group().reduceSum(function (d) {
        //             return d[pivotVal]
        //         });
        //
        //         var data = totalByPivotCol.all();
        //         // console.log(data);
        //
        //         var doc = {};
        //
        //         doc[pivotRow] = rec.key;
        //
        //         data.forEach(function (d) {
        //             doc[d.key] = d.value;
        //         });
        //
        //         out.push(doc);
        //     });
        //
        //     return out;
        // }

        /**
         * Query and convert data for widget
         * @param scope
         * @param element
         * @param props
         * @param {object=} options
         * @param {string} options.vkeyPrefix Virtual field name prefix used to field in array
         * @returns {promise<{total:number,records:[]}>}
         */
        function queryAndConvertData(scope, element, props, options) {
            options = options || {};
            var d = $q.defer();
            var VIRTUAL_KEY_PREFIX = options.vkeyPrefix || '__vf';

            queryData(element, props, scope).then(function (data) {
                var rules = [];
                var fields = props.fields || {};
                var toConvert = [];
                if (angular.isArray(fields)) {
                    handleArray(fields, toConvert);
                } else {
                    Object.keys(fields).forEach(function (key) {
                        if (angular.isArray(fields[key])) {
                            handleArray(fields[key], toConvert);
                        } else {
                            var f = fields[key];
                            if (f.field) {
                                f.__valueKey = f.field
                            } else {
                                f.__valueKey = key;
                                toConvert.push(f);
                            }
                        }
                    });
                }
                toConvert.forEach(function (field) {
                    rules.push({source: field.field, convertFn: field.convertFn, target: field.__valueKey});
                });
                var values = pageDataUtil.getPageScopeValues(scope);
                data.records = convertFields(data.records, rules, values, {includeAllFields: ''});
                d.resolve(data);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;

            function handleArray(fields, toConvert) {
                fields.forEach(function (f, index) {
                    if (f.field) {
                        f.__valueKey = f.field;
                    } else {
                        f.__valueKey = VIRTUAL_KEY_PREFIX + index;
                        toConvert.push(f);
                    }
                });
            }
        }


        /**
         * Query dataset. If error happens, it will display error message in widget.
         * @param {angular.element|jQuery} element
         * @param {{dataset:{id:string}}} props Widget properties
         * @param scope Widget scope
         * @returns {promise.<{total:number,records:[]}>} Dataset query result
         */
        function queryData(element, props, scope) {
            var params = getWidgetParamValues(element);
            var dataset = props.dataset;
            // console.log('queryData ', params, dataset, scope);
            var d = $q.defer();
            if (dataset/* && dataset.id*/) {
                Object.keys(params).forEach(function (name) {
                    if (params[name] === '') {
                        params[name] = null;
                    }
                });
                // 2020/03/01: If dataset._type is datax, need pass page scope params
                // 2020/03/03: Assigning page scope params to widget params will trigger widget reload data
                // 2023/05/12 :TODO Need to fix it or use merge?
                if (dataset._type === 'datax' && scope) {
                    // _.assign(params, pageDataUtil.getPageScopeValues(scope));
                    _.merge(params, pageDataUtil.getPageScopeValues(scope));
                }

                datasetService.queryDataset(dataset, params).then(function (data) {
                    // To compatible with bad java code
                    if (!angular.isArray(data.records)) {
                        console.warn('Dataset query result not compatible with {total:number,records:[]}', dataset);
                        data = {records: [], total: 0};
                    }
                    if (dataset.limit > 0) {
                        data.records.length = Math.min(data.records.length, props.dataset.limit);
                    }
                    d.resolve(data);
                    widgetUiHelper.removeWidgetError(element);
                }).catch(function (e) {

                    var msg = $translate.instant('udp.wc.dataset.error_detail', {
                        params: JSON.stringify(params),
                        message: e.message
                    });
                    var title = $translate.instant('udp.wc.dataset.error_title', {dataset: (dataset.id || dataset._type)});
                    widgetUiHelper.showWidgetError(element, msg, title);
                });
            } else {
                d.resolve({total: 0, records: []});
            }
            return d.promise;
        }

        /**
         * Look up widget dataset parameter values from
         * 1. user set value from udp-input control (in widget data attribute)
         * 2. TODO: localStorage for this widget
         * 3. default value from uw-props
         * @param $elem
         * @returns {{param_name1:string,param_name2:string}}
         */
        function getWidgetParamValues($elem) {
            var params = $elem.data('dsParams');
            return params || {};
        }

        function setWidgetParamValues($elem, params) {
            $elem.data('dsParams', params);
        }

        /**
         * Transform fields of data records with conversion functions.
         * Conversion function can take `${fieldName}` as variables.
         * @param records {[{field1:*,field2:*,...}]} Mutable records to be converted
         * @param fields {[string]} Fields need conversion
         * @param convertFns {[string]} Function expressions to convert fields
         * @see {@link dataEx.evalVarExpr}
         * @deprecated
         * Use {@link widgetDataUtil.convertFields}
         */
        function transDataFields(records, fields, convertFns) {
            records.forEach(function (record) {
                fields.forEach(function (field, i) {
                    var convertFn = convertFns[i];
                    if (convertFn) {
                        record[field] = dataEx.evalVarExpr(convertFn, record);
                        // console.log(convertFn, field, record[field]);
                    }
                });
            });
        }

        /**
         * Convert data from source fields to target fields.
         * When both source field and conversion function specified, convertFn takes priority.
         * @param {[]} data Data items
         * @param {[]} rules Conversion rules
         * @param {string=} rules[].source  Source field name
         * @param {string=} rules[].target  Target field name. If empty, use '!v'+index
         * @param {string=} rules[].convertFn  Conversion function
         * @param {object=} extraValues Extra field values added to data items for evaluation
         * @param {object=} options
         * @param {string=} options.includeAllFields If defined, to include all raw fields even not in rules.
         * This parameter to specify which property shall all fields be placed in.
         * An empty string will include all fields in data. A non-empty string will include all fields in that property.
         * @param {boolean=} options.keepLinkAsIs
         * @return {[object]} Converted data
         */
        function convertFields(data, rules, extraValues, options) {
            // console.time('convertFields');
            var result = [], _timer = {}, beginall = Date.now();
            options = options || {};
            debugTimer.newDebugVar('printedUndefinedVars', []);
            data.forEach(function (record) {
                var converted = {};
                rules.forEach(function (rule, i) {
                    var begin = Date.now();
                    var value, target = rule.target;
                    if (rule.convertFn) {
                        target = target || '__v' + i;
                        begin = Date.now();
                        var opts = _.merge({}, options, {debugKey: 'dataex-debug'});
                        var obj = _.merge({}, record, extraValues);
                        // value = dataEx.evalVarExpr(rule.convertFn, record, opts);
                        value = dataEx.evalVarExpr(rule.convertFn, obj, opts);
                        // console.log('..........',value,rule.convertFn);
                        // _timer.evalVarExpr = (_timer.evalVarExpr || 0) + (Date.now() - begin);
                        debugTimer.add('convertFields.evalVarExpr', begin);
                    } else if (rule.source) {
                        target = target || rule.source;
                        // console.log(record,rule.source);
                        value = dataEx.pathValue(record, rule.source);
                        // _timer.pathValue = (_timer.pathValue || 0) + (Date.now() - begin);
                        debugTimer.add('convertFields.pathValue', begin);
                    }
                    converted[target] = value;
                });
                // if (options.includeAllFields) {
                //     converted = _.assign({}, record, converted);
                // }
                if (angular.isString(options.includeAllFields)) {
                    if (options.includeAllFields.trim()) {
                        converted[options.includeAllFields] = record;
                    } else {
                        converted = _.assign({}, record, converted);
                    }
                }
                // var b = Date.now();
                result.push(converted);
                // _timer.push = (_timer.push || 0) + (Date.now() - b);
            });
            debugTimer.add('convertFields', beginall);
            // _timer.all = Date.now() - beginall;
            // console.log('convertFields.timers', _timer, data.length, 'records');
            // console.timeEnd('convertFields');
            return result;
        }

        //
        // /**
        //  * If a function expr body not empty
        //  * @param fnExp
        //  */
        // function hasConvertFn(fnExp) {
        //     return /[a-z]+?:.*[^\s]+/.test(fnExp);
        // }
        //
        // /**
        //  * Convert one field
        //  * @param records {[{field1:*,field2:*,...}]}
        //  * @param field {String}
        //  * @param convertFn {String}
        //  * @returns {Array}
        //  */
        // function convertOneField(records, field, convertFn) {
        //     var result = [];
        //     records.forEach(function (record) {
        //         var value = dataEx.evalVarExpr(convertFn, field, record);
        //         result.push(value);
        //     });
        //     return result;
        // }
    }
})();
