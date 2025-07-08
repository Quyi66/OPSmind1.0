/**
 * @Auther: zml
 * @Date: 2018/5/24
 */
(function () {
    'use strict';

    angular.module("oplus.cac").service("CheckResultService", CheckResultService);

    CheckResultService.$inject = ["restUtils"];

    function CheckResultService(restUtils) {
        var MODULE = "cac";

        this.getCheckResultsByJobId =getCheckResultsByJobId;
        this.getBylogIdAllData =getBylogIdAllData;
        this.getByIdCheckResult =getByIdCheckResult;

        function getCheckResultsByJobId(logId, start, length) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/check-item-result/map/{logId}?start=' + start + '&length=' + length, {logId: logId});
        }

        function getBylogIdAllData(logId) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/check-item-result/v3/{logId}', {logId: logId});
        }

        function getByIdCheckResult(id){
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/check-item-result/{id}', {id: id});

        }

    }


})();
