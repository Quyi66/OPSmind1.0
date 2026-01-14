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
            return restUtils.callApi(module, 'GET', '/api/dts/datasets/datasource/{datasource}', { datasource: datasource }, params);
        };


        /**
         *
         * @param id
         * @returns {*}
         */
        this.findDataset = function (id) {
            return restUtils.callApi(module, 'GET', '/api/dts/datasets/{id}', { id: id });
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
            return restUtils.callApi(module, 'DELETE', '/api/dts/datasets/{id}', { id: id });
        };

        /**
         * copy dataset
         * @param id
         */
        this.copyDataset = function (id, code) {

            return restUtils.callApi(module, 'GET', '/api/dts/datasets/copy/{id}', { id: id }, {
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
            if (!params) return restUtils.callApi(module, 'GET', '/api/dts/q/meta/{code}/', { code: code }); else return restUtils.callApi(module, 'POST', '/api/dts/q/meta/{code}/', { code: code }, {
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
            if (pagination && pagination.filter) {
                if (pagination.filter.indexOf(":") !== -1) {
                    // 如果 filter 包含字段名（如 template_name:根据），添加模糊搜索通配符
                    pagination.filter = pagination.filter.replace(/([^:]+)$/, '*$1*');
                }
                // else {
                //     // 模糊查询ACM_GET_CI_BY_SELECTOR和ACM_CI_BY_CIT时不需要转换filter
                //     if (code !== 'ACM_GET_CI_BY_SELECTOR' && code !== 'ACM_CI_BY_CIT') {
                //         // 如果 filter 是纯搜索值（没有字段名前缀），包装为模糊搜索格式
                //         pagination.filter = '*' + pagination.filter + '*';
                //     }
                // }
            }
            var obj = angular.extend({ params: params }, pagination);
            return restUtils.callApi(module, 'POST', '/api/dts/q/data/{code}/', { code: code }, obj);
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
