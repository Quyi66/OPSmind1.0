/**
 * @author yangbin
 * @date 2022-09-17 created
 */
(function () {
    'use strict';

    angular.module('oplus.udp').component('flowExport', {
        bindings: {
            appletCode: '=appletCode'
        },
        templateUrl: 'app/modules/udp/widgets/flow-manager/flow-export.html',
        controller: ['$scope', '$translate', '$filter', 'pageDataUtil', 'jaoFlowService', 'messageService', flowExportCtrl],
        controllerAs: '$ctrl'
    });


    function flowExportCtrl($scope, $translate, $filter, pageDataUtil, jaoFlowService, messageService) {
        var that = this;

        that.$onInit = init;
        that.appletCode = this.appletCode ? this.appletCode : undefined;

        that.exportFlow = exportFlow;


        function init() {
            initTable(that.appletCode);
        }

        $scope.$on("exportFlow", function (event, data) {
            $scope.tableConfig.reloadData();
            $scope.tableConfig.data = [function () {
                return jaoFlowService.findAllFlows(that.appletCode);
            }];
        });


        function exportFlowSave(flowList) {
            var blob = new Blob([angular.toJson(flowList)], {type: 'text/plain;charset=utf-8'});
            var currentTime = $filter('date')(new Date(), "yyyyMMddHHmmss");
            var title = "oplus-" + that.appletCode + "-flow-" + currentTime + ".json";
            return saveAs(blob, title);
        }


        function exportFlow() {
            if ($scope.tableConfig.selectedItems && $scope.tableConfig.selectedItems.length > 0) {
                var ids = $scope.tableConfig.selectedItems;
                jaoFlowService.exportFlowListByIds(ids).then(function (result) {
                    exportFlowSave(result);
                });
            } else {
                messageService.toast('warning', $translate.instant('udp.w.flow-manager.export.tips'));
            }
        }


        //Todo 补充说明，需要新增模板对应得操作权限团队列表
        function initTableCol() {
            return [
                {mData: 'name', title: "模板名称"},
                {
                    mData: 'stepIds', title: "步骤数",
                    render: function (data, type, row, meta) {
                        var stepIds = angular.fromJson(row.stepIds);
                        return stepIds.length;
                    }
                },
                {
                    mData: 'createdAt', title: $translate.instant('jao.flow.detail.start_time'), type: 'html',
                    render: function (data, type, row, meta) {
                        return $filter('date')(row.createdAt, 'yyyy-MM-dd HH:mm:ss');
                    }
                },
                {mData: 'createdBy', title: $translate.instant('jao.flow.detail.create_by')},
                {
                    mData: 'updatedAt', title: "最后一次更新时间", type: 'html',
                    render: function (data, type, row, meta) {
                        return $filter('date')(row.updatedAt, 'yyyy-MM-dd HH:mm:ss');
                    }
                },
            ];
        }

        function initTable(applet) {
            $scope.tableConfig = {
                data: [function () {
                    return jaoFlowService.findAllFlows(applet);
                }],
                columns: initTableCol(),
                order: [[3, 'desc']],
                buttons: ['reload'],
                selection: {
                    valueData: "id",
                    labelData: "name"
                    // selectedDatatype: "String",

                }
            };
        }
    }
})();
