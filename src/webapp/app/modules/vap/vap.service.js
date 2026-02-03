/**
 * VAP CVE Service
 * CVE 漏洞查询服务
 * @author Generated
 */
(function () {
    'use strict';

    angular.module('oplus.vap').service('vapCveService', vapCveService);

    vapCveService.$inject = ['$q', 'restUtils'];

    /**
     * @ngdoc service
     * @name vapCveService
     * @description CVE 漏洞查询服务
     */
    function vapCveService($q, restUtils) {
        var API_MODULE = 'vap';

        this.getCveList = getCveList;
        this.getCveDetail = getCveDetail;
        this.getStatistics = getStatistics;
        this.getAffectedHosts = getAffectedHosts;

        /**
         * 分页查询CVE列表
         * @param {object} params 查询参数
         * @param {string} params.source 数据源: redhat / kylin
         * @param {string} params.severity 严重等级: critical / important / moderate / low
         * @param {string} params.keyword 关键字（搜索CVE ID或描述）
         * @param {string} params.packageName 包名
         * @param {string} params.startDate 开始日期（格式：yyyy-MM-dd）
         * @param {string} params.endDate 结束日期（格式：yyyy-MM-dd）
         * @param {number} params.page 页码（从0开始）
         * @param {number} params.size 每页数量
         * @param {string} params.sortBy 排序字段: publicDate / severity / cveId
         * @param {string} params.sortDir 排序方向: asc / desc
         * @returns {Promise}
         */
        function getCveList(params) {
            var queryParams = {};
            
            // 只添加非空参数
            if (params.source) queryParams.source = params.source;
            if (params.severity) queryParams.severity = params.severity;
            if (params.keyword) queryParams.keyword = params.keyword;
            if (params.packageName) queryParams.packageName = params.packageName;
            if (params.startDate) queryParams.startDate = params.startDate;
            if (params.endDate) queryParams.endDate = params.endDate;
            if (params.page !== undefined) queryParams.page = params.page;
            if (params.size !== undefined) queryParams.size = params.size;
            if (params.sortBy) queryParams.sortBy = params.sortBy;
            if (params.sortDir) queryParams.sortDir = params.sortDir;

            console.log('=== vapCveService.getCveList 调用 ===');
            console.log('API_MODULE:', API_MODULE);
            console.log('queryParams:', queryParams);
            
            return restUtils.callApi(API_MODULE, 'GET', '/api/vap/v2/cve/list', null, queryParams).then(function(data) {
                console.log('getCveList API 返回:', data);
                return data;
            });
        }

        /**
         * 查询CVE详情
         * @param {string} cveId CVE编号，如 CVE-2025-26597
         * @returns {Promise}
         */
        function getCveDetail(cveId) {
            return restUtils.callApi(API_MODULE, 'GET', '/api/vap/v2/cve/detail/{cveId}', { cveId: cveId });
        }

        /**
         * 获取统计概览
         * @returns {Promise}
         */
        function getStatistics() {
            console.log('=== vapCveService.getStatistics 调用 ===');
            console.log('API_MODULE:', API_MODULE);
            return restUtils.callApi(API_MODULE, 'GET', '/api/vap/v2/cve/statistics').then(function(data) {
                console.log('getStatistics API 返回:', data);
                return data;
            });
        }

        /**
         * 查询CVE受影响主机列表
         * @param {string} cveId CVE编号，如 CVE-2025-26597
         * @returns {Promise}
         */
        function getAffectedHosts(cveId) {
            return restUtils.callApi(API_MODULE, 'GET', '/api/vap/v2/cve/affected-hosts/{cveId}', { cveId: cveId });
        }
    }
})();
