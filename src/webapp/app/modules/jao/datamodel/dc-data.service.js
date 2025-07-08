/**
 * @author mr.kongqi@gmail.com,2021/9/3 14:00,created
 */
(function () {
    'use strict';

    angular.module('oplus.jao').service('dcDataService', dcDataService);
    angular.module('oplus.jao').run(['customFunctions', 'dcDataService', function (cf, dcDataService) {
        cf.defineFunction('delDcData', {
            func: function (id) {
                return dcDataService.deleteDataById(id);
            },
            group: 'data',
            sample: 'delDcData(dcDataId)',
            desc: ""
        });
    }]);

    dcDataService.$inject = ['restUtils'];

    function dcDataService(restUtils) {
        var module = "jao";

        this.saveDcModel = saveDcModel;
        this.updateDcModel = updateDcModel;
        this.queryModelByCode = queryModelByCode;
        this.queryModelById = queryModelById;
        this.dcModelList = dcModelList;
        this.deleteModelById = deleteModelById;
        this.deleteModels = deleteModels;

        this.saveDcData = saveDcData;
        this.queryDataListByCode = queryDataListByCode;
        this.queryDataListByModelId = queryDataListByModelId;
        this.queryDataById = queryDataById;
        this.deleteDataById = deleteDataById;

        function saveDcModel(dcModel) {
            return restUtils.callApi(module, 'POST', '/api/jao/dc/model', null, dcModel);
        }

        function updateDcModel(dcModel) {
            return restUtils.callApi(module, 'PUT', '/api/jao/dc/model', null, dcModel);
        }

        function queryModelByCode(dcCode) {
            return restUtils.callApi(module, 'GET', '/api/jao/dc/model', null, {code: dcCode});
        }

        function queryModelById(dcId) {
            return restUtils.callApi(module, 'GET', '/api/jao/dc/model', null, {id: dcId});
        }

        function dcModelList(appletCode) {
            return restUtils.callApi(module, 'GET', '/api/jao/dc/models/{appletCode}', {appletCode: appletCode});
        }

        function deleteModelById(id) {
            return restUtils.callApi(module, 'PUT', '/api/jao/dc/model/{id}', {id: id})
        }

        function deleteModels(ids) {
            return restUtils.callApi(module, 'PUT', '/api/jao/dc/models', null, ids)
        }



        function saveDcData(dcData) {
            return restUtils.callApi(module, 'POST', '/api/jao/dc/data', null, dcData);
        }

        function queryDataListByCode(dcCode) {
            return restUtils.callApi(module, 'GET', '/api/jao/dc/data', null, { code: dcCode });
        }

        function queryDataListByModelId(dcId) {
            return restUtils.callApi(module, 'GET', '/api/jao/dc/data', null, { id: dcId });
        }

        function queryDataById(dataId) {
            return restUtils.callApi(module, 'GET', '/api/jao/dc/data/{id}', { id: dataId });
        }

        function deleteDataById(dataId) {
            return restUtils.callApi(module, 'PUT', '/api/jao/dc/data/{id}', { id: dataId });
        }
    }
})();
