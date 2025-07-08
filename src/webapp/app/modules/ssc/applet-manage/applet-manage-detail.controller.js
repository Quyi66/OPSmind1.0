/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('appletManageDetailCtrl', appletManageDetailCtrl);

    appletManageDetailCtrl.$inject = ['$scope', '$state', '$stateParams', '$translate', '$uibModalInstance', 'messageService', 'entity'];

    function appletManageDetailCtrl($scope, $state, $stateParams, $translate, $uibModalInstance, messageService, entity) {
        var vm = this;
        vm.applet = entity;
        vm.showApplet = false;


        vm.$onInit = onInit;
        vm.clear = clear;

        function onInit() {
            dtsTable(vm.applet.aouDatasetList);
            dcModelTable(vm.applet.aouDcDataModelDTOList);
            jobFlowTable(vm.applet.aouFlowDTOList);
        }

        function clear() {
            $uibModalInstance.dismiss();
        }

        function dtsTable(list) {
            var tableColumnConfig = [
                {mData: 'code', title: $translate.instant('dts.dataset.attr.code')},
                {mData: 'name', title: $translate.instant('dts.dataset.attr.name')},
                {mData: 'datasource', title: $translate.instant('dts.dataset.attr.datasource')},
                {mData: 'createdBy', title: $translate.instant('common.attr.created_by')},
                {
                    data: 'createdAt',
                    title: $translate.instant('common.attr.created_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                }
            ];
            vm.dtsTableConfig = {
                data: list,
                columns: tableColumnConfig,
                order: [[1, 'desc']],
                buttons: ['reload'],
                selection: {
                    valueData: 'id', labelData: 'title'
                }
            };
        }


        function dcModelTable(list) {
            var tableColumnConfig = [
                {mData: 'code', title: $translate.instant('jao.dc.detail.code')},
                {mData: 'title', title: $translate.instant('ssc.applet.manage.detail.dc.name')},
                {mData: 'createdBy', title: $translate.instant('common.attr.created_by')},
                {
                    data: 'createdAt',
                    title: $translate.instant('common.attr.created_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                }
            ];
            vm.dcModelTableConfig = {
                data: list,
                columns: tableColumnConfig,
                order: [[1, 'desc']],
                buttons: ['reload'],
                selection: {
                    valueData: 'id', labelData: 'title'
                }
            };
        }


        function jobFlowTable(list) {
            var tableColumnConfig = [
                {mData: 'name', title: $translate.instant('jao.flow.detail.name')},
                {
                    data: 'stepIds',
                    title: $translate.instant('cmd.job.steps'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        var stepList = angular.fromJson(data);
                        if (stepList) {
                            return stepList.length;
                        }
                        return 0;
                    }
                },
                {mData: 'createdBy', title: $translate.instant('common.attr.created_by')},
                {
                    data: 'createdAt',
                    title: $translate.instant('common.attr.created_at'),
                    searchable: false,
                    render: function (data, type, row, meta) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    }
                }
            ];
            vm.jobFlowTableConfig = {
                data: list,
                columns: tableColumnConfig,
                order: [[1, 'desc']],
                buttons: ['reload'],
                selection: {
                    valueData: 'id', labelData: 'title'
                }
            };
        }
    }
})();
