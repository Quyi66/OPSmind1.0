/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/20/2017
 */
(function () {
    'use strict';

    angular.module('oplus.dts').service('mockExcelDataset', mockExcelDataset);

    mockExcelDataset.$inject = ['excelMockData', 'localDatasetRepo'];

    // if (window.$oplus.appConfig.modules.dts && window.$oplus.appConfig.modules.dts.useLocalDb) {
    //     angular.module('oplus.dts').run(['mockExcelDataset', function (mockExcelDataset) {
    //         mockExcelDataset.registerDatasets();
    //     }]);
    // }

    function mockExcelDataset(excelMockData, localDatasetRepo) {
        var isRegistered = false;
        this.registerDatasets = registerDatasets;
        this.findAllDatasets = findAllDatasets;
        this.queryDatasetMeta = queryMeta;
        this.queryDataset = queryData;

        function registerDatasets() {
            if (isRegistered) {
                return;
            }
            findAllDatasets(function (all) {
                all.forEach(function (ds) {
                    localDatasetRepo.defineLocalDataset(ds.code, ds.name, 'mockExcelDataset');
                })
            });
            isRegistered = true;
        }

        function queryData(datasetCode, params) {
            return excelMockData.readWorksheet(datasetCode, params);
        }

        function queryMeta(datasetCode) {
            return excelMockData.getSheetColumnMeta(datasetCode);
        }

        function findAllDatasets(callback) {
            var all = [];
            excelMockData.readWorkbook().then(function (workbook) {
                workbook.SheetNames.forEach(function (s) {
                    all.push({code: s, name: s, desc: 'desc=' + s});
                });
                callback(all);
            });
        }
    }
})();