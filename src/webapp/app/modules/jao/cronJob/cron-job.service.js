/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.jao').service('cronJobService', cronJobService);

    cronJobService.$inject = ['restUtils'];

    function cronJobService(restUtils) {
        var module = "jao";

        this.cronRestInterface = cronRestInterface;
        this.getCacData = getCacData;

        function cronRestInterface(implement, data) {
            switch (implement) {
                case "query":
                    return restUtils.callApi(module, 'GET', '/api/jao/cron');
                    break;
                case "delete":
                    return restUtils.callApi(module, 'DELETE', '/api/jao/cron/{id}', {id: data});
                    break;
                case "update":
                    return restUtils.callApi(module, 'PUT', '/api/jao/cron', null, data);
                    break;
                case "add":
                    return restUtils.callApi(module, 'POST', '/api/jao/cron', null, data);
                    break;
                case "start":
                    return restUtils.callApi(module, 'GET', '/api/jao/cron/start/{id}', {id: data});
                    break;
                case "stop":
                    return restUtils.callApi(module, 'GET', '/api/jao/cron/stop/{id}', {id: data});
                    break;
                case "execute":
                    return restUtils.callApi(module, 'GET', '/api/jao/cron/execute/{id}', {id: data});
                    break;
                case "findId":
                    return restUtils.callApi(module, 'GET', '/api/jao/cron/{id}', {id: data});
                    break;
                case "appCode":
                    return restUtils.callApi(module, 'GET', '/api/jao/cron/app?appCode=' + data);
                    break;
                case "scheduleConf":
                    return restUtils.callApi(module, 'GET', '/api/jao/cron/nextTriggerTime?scheduleConf=' + data);
                    break;
                case "copyCron":
                    return restUtils.callApi(module, 'GET', '/api/jao/cron/copy/{id}', {id: data});
                    break;
                case "batchStartStop":
                    return restUtils.callApi(module, 'POST', '/api/jao/cron/start-stop', null, data);
                    break;
                case "batchScheduleConf":
                    return restUtils.callApi(module, 'POST', '/api/jao/cron/next-trigger-times', null, data);
                    break;
            }
        }

        function getCacData() {
            return restUtils.callApi("cac", 'GET', '/api/cac/v2/templates');
        }
    }

})();