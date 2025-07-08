/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').service('CacCheckLogService', CacCheckLogService);

    CacCheckLogService.$inject = ['restUtils','$q','$http'];

    function CacCheckLogService(restUtils,$q,$http) {
        var MODULE = "cac";

        this.runCheckLog = runCheckLog;
        this.runCheckLogTemplateId = runCheckLogTemplateId;
        this.getCheckLog = getCheckLog;
        this.isItRunning = isItRunning;
        //执行单项巡检
        function runCheckLog(threeCheckLog){
            return restUtils.callApi(MODULE, 'POST', '/api/cac/v3/check-log/run', null, threeCheckLog);
        }

        //执行巡检模板
        function runCheckLogTemplateId(templateId) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/check-log/run/{templateId}',{templateId: templateId});
        }

        function getCheckLog(logId) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/check-log/{logId}', {logId: logId})
        }

        function isItRunning(id) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/check-item-result/is-it-running/{id}', {id: id})
        }





    }


})();
