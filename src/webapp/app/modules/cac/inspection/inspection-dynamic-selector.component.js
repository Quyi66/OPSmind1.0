
(function () {
    'use strict';

    angular.module('oplus.cac').component('inspectionDynamicSelector', {
        templateUrl: 'app/modules/cac/inspection/inspection-dynamic-selector.html',
        controller: ['$scope','inspectionActions','CacInspectionService','messageService','$translate', InspectionDynamicSelectorCtrl],
        bindings: {
            threeCheckItemIds: '=theModel'
        }
    });


    function InspectionDynamicSelectorCtrl($scope, inspectionActions,CacInspectionService,messageService,$translate) {
        var vm = this;
        vm.$onInit = onInit;
        vm.inspectionListCi =inspectionListCi;
        vm.getViewsData -=getViewsData;
        vm.emptyItems = emptyItems;
        vm.removeItem = removeItem;


        vm.inspectionLists = [];//获取全量的巡检项数据
        vm.inspectionViewList = [];//通过获取到巡检项id映射出name

        function onInit() {
            CacInspectionService.getAllInspection().then(function (data) {
                vm.inspectionLists = data;
                if(vm.threeCheckItemIds.length > 0){
                    getViewsData();
                }
            }).catch(function (err) {
                throw err;
            });
        }


        function inspectionListCi(){
            inspectionActions.openInspectionSelector(vm.threeCheckItemIds,function (inspections) {
                vm.threeCheckItemIds = inspections;
                vm.inspectionViewList = [];
                getViewsData();
            })
        }
        
        function getViewsData() {
           /* vm.inspectionLists = _.filter(vm.inspectionLists,function(il){
                return vm.threeCheckItemIds.indexOf(il.id) > -1;
            });*/

            _.map(vm.inspectionLists,function(il){
                if(vm.threeCheckItemIds.indexOf(il.id) > -1){
                    vm.inspectionViewList.push({"id":il.id,"name":il.name});
                }
            });
        }

        function emptyItems() {
            messageService.confirm($translate.instant('acm.common.selector.confirm'), $translate.instant('cac3.information.prompt.confirmToRemoveAllPatrolItems'), function () {
                vm.threeCheckItemIds =[];
                vm.inspectionViewList =[];
            });
        }

        function removeItem(id) {

            for(let index in vm.inspectionViewList){
                if(id === vm.inspectionViewList[index].id){
                    vm.inspectionViewList.splice(index, 1);
                    break;
                }
            }

            for(let index in vm.threeCheckItemIds){
                if(id === vm.threeCheckItemIds[index]){
                    vm.threeCheckItemIds.splice(index, 1);
                    break;
                }
            }
        }


        vm.myFilter = function(item) {
            return !vm.filter || item['name'].indexOf(vm.filter) > -1;
        }

    }
})();
