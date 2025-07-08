/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').service('CacAssetConfigureExportService', CacAssetConfigureExportService);

    CacAssetConfigureExportService.$inject = ['restUtils'];

    function CacAssetConfigureExportService(restUtils) {
        var module = "cac";

        this.saveAssetConfigureData =saveAssetConfigureData;
        this.getAssetConfigureTypes=getAssetConfigureTypes;
        this.getAssetConfigureData =getAssetConfigureData;

        function saveAssetConfigureData(data) {
            return restUtils.callApi(module, 'POST', '/api/cac/v3/save/asssets-configure-data',null,data);

        }

        function getAssetConfigureTypes() {
            return restUtils.callApi(module, 'POST', '/api/cac/v3/get/asssets-configure-types', null, null);
        }

        function getAssetConfigureData(){
            return restUtils.callApi(module, 'POST', '/api/cac/v3/get/asssets-configure-data', null, null);
        }

    }

})();