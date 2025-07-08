
(function () {
    angular.module('oplus.cac').controller('CacAssetConfigureExportController', CacAssetConfigureExportController);

    CacAssetConfigureExportController.$inject = ['$scope', '$timeout', '$state', 'CacAssetConfigureExportService','$http', 'messageService', 'currentUser', '$translate'];


    function CacAssetConfigureExportController($scope, $timeout, $state, CacAssetConfigureExportService,$http, messageService, currentUser, $translate) {
        var vm = this;
        vm.assetsModelTypes = [];//资产模板类型
        vm.assetsModelData ={};
        vm.choice_data=choice_data;

        getAssetModel();//初始化
        function getAssetModel(){
            CacAssetConfigureExportService.getAssetConfigureTypes().then(function (data) {
                if(Object.keys(data).length > 0){
                    for (var key in data) {
                        vm.assetsModelTypes.push(key);
                        vm.assetsModelData[key] = data[key];
                    }
                    getSelectAssetModel();
                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
            });
        }

        function getSelectAssetModel(){//获取点击过的数据并回显
            CacAssetConfigureExportService.getAssetConfigureData().then(function (data) {
                if(Object.keys(data).length > 0){
                    for (var key in data) {
                       if(!vm.assetsModelData[key]){
                           continue;
                       }
                       for (var i =0 ; i < vm.assetsModelData[key].length ;i++){
                           for (var j = 0 ; j < data[key].length ;j++){
                               if(vm.assetsModelData[key][i].code == data[key][j].code){
                                   vm.assetsModelData[key][i].isChecked=true
                                   break;
                               }
                           }
                       }
                    }

                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
            });
        }




        function choice_data(modelData){//保存数据
            CacAssetConfigureExportService.saveAssetConfigureData(modelData).then(function () {
                console.log("save==",modelData);
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
            });
        }

    }
})
();
