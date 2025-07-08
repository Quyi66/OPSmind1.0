/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').service('CacFixLogService', CacFixLogService);

    CacFixLogService.$inject = ['restUtils','$q','$http'];

    function CacFixLogService(restUtils,$q,$http) {
        var MODULE = "cac";

        this.getAllFixItem =getAllFixItem;
        this.fixItemList =fixItemList;
        this.getByFixLogIdAllData =getByFixLogIdAllData;

        function getAllFixItem() {
            return restUtils.callApi(MODULE, 'GET','/api/cac/v3/fix-item', null);
        }

        function fixItemList(list) {
            return restUtils.callApi(MODULE, 'POST', '/api/cac/v3/fix-log/run', null, list);
        }


        function getByFixLogIdAllData(fixLogId) {
            return restUtils.callApi(MODULE, 'GET', '/api/cac/v3/fix-item-result/v3/{fixLogId}', {fixLogId: fixLogId});
        }




    }


})();
