(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacFixLogController', CacFixLogController);
    CacFixLogController.$inject = [];

    function CacFixLogController() {

    }

    //模型控制器
    cacModule.controller('CacFixLogListController', CacFixLogListController);
    CacFixLogListController.$inject = ['$q', '$scope', '$http', '$timeout', '$state', '$uibModal', '$filter', '$translate','CacFixLogService'];

    function CacFixLogListController($q, $scope, $http, $timeout, $state, $uibModal, $filter, $translate,CacFixLogService) {
        var vm = this;
        vm.scope = $scope;

        vm.findFixLogStatus = findFixLogStatus;
        vm.fixDataShow =fixDataShow;


        var columnDefs = [
            {
                data: 'name',
                title: $translate.instant('common.entity.detail.name')
            },
            {
                data: 'hostJson',
                title: $translate.instant('cac3.table_fields.repairItems'),
                render: function (data, type, row, meta) {
                    var fix = angular.fromJson(row.itemResultJson);
                    var html = '{{\'cac3.table_fields.repairItems\' | translate}}: <strong>' + fix.length + '</strong>' +
                        '<br/>';
                    return '<span class="cac_table_col_project" style="line-height: 15px!important;">' + html + '</span>';
                }
            },
            {
                data: 'createdAt',
                title: $translate.instant('common.entity.detail.start_at'),
                render: function (data, type, row, meta) {
                    return $filter('date')(row.createdAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {
                data: 'endAt',
                title: $translate.instant('common.entity.detail.end_at'),
                render: function (data, type, row, meta) {
                    return $filter('date')(row.endAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {
                data: 'createdBy',
                title: $translate.instant('cac.job.detail.create_at'),
            },
            {
                data: 'id',
                title: $translate.instant('cac.job.detail.status'),
                render: function (data, type, row, meta) {
                    var taskId = "'" + row.taskId + "'";
                    var status = row.status;
                    var actionHtml = "";
                    if (status === "ERROR") {
                        actionHtml = '<button type="button" class="btn btn-danger rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacFixLogListCtrlVm.findFixLogStatus(' + taskId + ')">' +
                            '{{\'cac.result.status.error\' | translate}}</button>';
                    } else if (status === "SUCCESS") {
                        actionHtml = '<button type="button" class="btn btn-success rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacFixLogListCtrlVm.findFixLogStatus(' + taskId + ')">' +
                            '{{\'cac.result.status.ok\' | translate}}</button>';
                    } else {
                        actionHtml = '<button type="button" class="btn btn-primary rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacFixLogListCtrlVm.findFixLogStatus(' + taskId + ')">' +
                            '{{\'cac.result.status.running\' | translate}}</button>';
                    }
                    return actionHtml;
                }
            },
            {
                data: 'id',
                title: $translate.instant('common.entity.detail.operation'),
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    var isEnbled = '';
                    if (row.status !== "SUCCESS") {
                        isEnbled = 'disabled';
                    }
                    return '<button type="button" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat"  ' + isEnbled + ' title="{{\'cac.index.job\' | translate}}" ng-click="cacFixLogListCtrlVm.fixDataShow(\'' + row.id + '\')"><i class="fa fa-grip-horizontal"></i></button>';
                }
            }
        ];
        this.tableConfig = {
            columns: columnDefs,
            data: [getPromise],
            order: [[2, 'desc']],
            buttons: ['reload']
        };

        function getPromise() {
            return CacFixLogService.getAllFixItem();
        }

        function findFixLogStatus(taskId) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/fix/fix-log-result.html',
                controller: 'CacFixLogResultCtrl',
                controllerAs: 'cacFixLogResultVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    params: function () {
                        return {
                            jobId: taskId
                        }
                    }
                }
            }).result.then(function (result) {
            }).catch(function (err) {
                throw err;
            });
        }

        function fixDataShow(fixLogId){
            $uibModal.open({
                templateUrl: 'app/modules/cac/fix/fix-data-show.html',
                controller: 'FixDataShowController',
                controllerAs: 'fixDataShowControllerVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    fix: function () {
                        return {
                            fixLogId: fixLogId
                        }
                    }
                }
            }).result.then(function (result) {
            }).catch(function (err) {
                throw err;
            });
        }

    }
})
();
