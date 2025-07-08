/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.cac').service('CacAssetModelService', CacAssetModelService);

    CacAssetModelService.$inject = ['restUtils'];

    function CacAssetModelService(restUtils) {
        var module = "cac";

        this.getAssetModel =getAssetModel;
        this.getSelectAssetModel=getSelectAssetModel;
        this.saveSelectAssetModel =saveSelectAssetModel;

        function getAssetModel() {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/get/asssets-model-types', null, null);
        }
        function getSelectAssetModel(){
            return restUtils.callApi(module, 'POST', '/api/cac/v2/get/assets-model-data', null, null);
        }

        function saveSelectAssetModel(data) {
            return restUtils.callApi(module, 'POST', '/api/cac/v2/save/assets-model-data',null,data);

        }
    }

})();