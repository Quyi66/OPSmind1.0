/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2021/09/13
 */
(function () {
    'use strict';

    angular.module('oplus.acm').service('acmService', acmService);

    acmService.$inject = ['$q', 'restUtils'];

    /**
     * @ngdoc service
     * @name acmService
     * @param $q
     * @param {restUtils} restUtils
     */
    function acmService($q, restUtils) {
        var that = this;

        this.calcDynamicFieldsForTableView = calcDynamicFieldsForTableView;
        this.findCitByCode = findCitByCode;
        this.findCiByAttr = findCiByAttr;
        this.findCitTitle = findCitTitle;
        this.getCitByCITid = getCitByCITid;
        this.getCitByTenant = getCitByTenant;
        this.saveAcmCIData = saveAcmCIData;
        this.getAcmCITByCId = getAcmCITByCId;
        this.getAcmCIByCId = getAcmCIByCId;
        this.getTablePermission = getTablePermission;
        this.saveAcmData = saveAcmData;
        this.getJobRecently = getJobRecently;

        function findCitTitle(ciTypes) {
            var d = $q.defer();
            var result = {};
            ciTypes.split(',').forEach(function (type) {
                result[type] = {};
            });
            that.tabTitle('list').then(function (cits) {
                Object.keys(result).forEach(function (type) {
                    result[type] = {icon: cits[type].icon, title: cits[type].title};
                });
                d.resolve(result);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }


        /**
         * Find assets by values of specified attribute.
         * @param {string} assetType Asset type
         * @param {string} attrCode Attribute code to look up
         * @param {[]} attrValues Values to match the attribute
         */
        function findCiByAttr(assetType, attrCode, attrValues) {
            return restUtils.callApi('acm', 'POST', '/api/acm/ci/search/attr', {}, {
                assetType: assetType,
                attrCode: attrCode,
                attrValues: attrValues
            });
        }

        //TODO: for what purpose?
        this.tabTitle = function (type) {
            return restUtils.callApi('acm', 'GET', '/api/acm/cit/get/all/{type}', {type: type});
        };

        //TODO: for what purpose?
        this.tabTitleAuto = function (type) {
            return restUtils.callApi('acm', 'GET', '/api/acm/cit/get/auto/{type}', {type: type});
        };

        /**
         *
         * @param {string} modelCode
         * @param {string} viewType
         * @return {Promise<[{field:string,label:string,convertFn:string}]>}
         */
        function calcDynamicFieldsForTableView(modelCode, viewType) {
            var d = $q.defer();
            findCitByCode(modelCode).then(function (model) {
                var viewDef = _.find(model.views, {type: viewType});
                var fields = [];
                if (viewDef && viewDef.config) {
                    fields = _.map(viewDef.config.columns, function (col) {
                        var attr = _.find(model.attrs, {code: col.attr});
                        if (!attr) {
                            return null;
                        }
                        var field = {
                            field: attr.code,
                            label: attr.title || attr.code
                        };
                        if (attr.display && attr.display.converter) {
                            field.convertFn = attr.display.converter;
                        }
                        return field;
                    });
                }
                d.resolve(_.filter(fields, function (e) {
                    return e;
                }));
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        function findCitByCode(code) {
            return restUtils.callApi('acm', 'GET', '/api/acm/cit/code/{code}', {code: code});
        }

        /**
         *
         * @param citId model id
         * @returns {promise}
         */
        function getCitByCITid(citId) {
            return restUtils.callApi('acm', 'GET', '/api/acm/cit/vo/citid/{id}', {id: citId});
        }

        /**
         * get model by tenantId
         */
        function getCitByTenant() {
            return restUtils.callApi('acm', 'GET', '/api/acm/cit');
        }


        /**
         * save model attr
         * @param acmCIData
         * @returns {Promise}
         */
        function saveAcmCIData(acmCIData) {
            return restUtils.callApi('acm', 'POST', '/api/acm/cit/modify/batch', null, acmCIData);
        }


        /**
         *
         * @param id acm id
         * @returns {promise}
         */
        function getAcmCITByCId(id) {
            return restUtils.callApi('acm', 'GET', '/api/acm/cit/vo/cid/{cid}', {cid: id});
        }

        /**
         *
         * @param id acm id
         * @returns {promise}
         */
        function getAcmCIByCId(id) {
            return restUtils.callApi('acm', 'GET', '/api/acm/ci/attr/{id}', {id: id});
        }

        /**
         *
         * @returns {promise}
         */
        function getTablePermission() {
            return restUtils.callApi('acm', 'GET', '/api/acm/permission/team/table');
        }


        function saveAcmData(acmData) {
            return restUtils.callApi('acm', 'POST', '/api/acm/ci/modify/batch', null, acmData);
        }

        function getJobRecently(runLogRecentlyBO) {
            return restUtils.callApi('jao', 'POST', '/api/jao/jobs/recently', null, runLogRecentlyBO);
        }

    }
})();
