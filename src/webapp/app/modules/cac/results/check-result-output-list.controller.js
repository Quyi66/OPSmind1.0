/**
 * @Auther: zml
 * @Date: 2018/7/19
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacCheckResultOutputListCtrl', CacCheckResultOutputListCtrl);
    CacCheckResultOutputListCtrl.$inject = ['$scope', '$timeout', 'CheckResultService', '$compile', '$uibModal', '$stateParams', '$translate','cacTemplateService','$state','messageService','CacFixLogService'];

    function CacCheckResultOutputListCtrl($scope, $timeout, CheckResultService , $compile, $uibModal, $stateParams, $translate,cacTemplateService,$state,messageService,CacFixLogService) {
        var vm = this;

        var logId = $stateParams.logId;
        vm.getCheckItemById =getCheckItemById;

        vm.fixSelectedIds = [];
        vm.runFix = runFix;

        function getCheckItemById(id,itemName) {
            $timeout(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/cac/results/check-result-to-rule.html',
                    controller: 'CheckResultToRuleCtrl',
                    controllerAs: 'checkResultToRuleCtrlVm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                id: id,
                                name: itemName,
                            };
                        }
                    }
                });
            }, 200);
        }

        function init() {

            var tableColumns = [
                {mData: 'hostKey', title: $translate.instant('cac.common.host')},
                {
                    mData: 'itemName',
                    title: $translate.instant('cac.template.detail.audit_params'),
                    render: function (data, type, row, meta) {
                        var checkItem = '';
                        if (row.itemName != null) {
                            checkItem = row.itemName;
                        }
                        var actionHtml = '<span title = "' + checkItem + '">' + checkItem + '</span>';
                        return actionHtml;
                    }

                },
                {
                    mData: 'fixPathIsNull', title: $translate.instant('cac3.title.fixScript'),
                    render: function (data, type, row, meta) {
                        if (row.fixPathIsNull) {
                            var actionHtml = '<span class="badge bg-secondary">' + $translate.instant('cac3.title.thing') + '</span>';
                        } else  {
                            var actionHtml = '<span class="badge bg-info">' + $translate.instant('cac3.title.have') + '</span>';
                        }
                        return actionHtml;
                    }
                },
                {
                    mData: 'status', title: $translate.instant('cac.common.result'),
                    render: function (data, type, row, meta) {
                        if (row.status == 'OK') {
                            var actionHtml = '<span class="badge bg-success">' + $translate.instant('cac.result.audit_result.pass') + '</span>';
                        } else if (row.status == 'FAILED') {
                            var actionHtml = '<span class="badge bg-danger">' + $translate.instant('cac.result.audit_result.failed') + '</span>';
                        } else if (row.status == 'CHECK') {
                            var actionHtml = '<span class="badge bg-warning">' + $translate.instant('cac.result.audit_result.check') + '</span>';
                        } else {
                            var actionHtml = '<span class="label cac-bg-light-grey">' + $translate.instant('common.messages.no_data') + '</span>';
                        }
                        return actionHtml;
                    }
                },
                {
                    mData: 'output',
                    title: $translate.instant('cac.result.output'),
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var actionHtml = "";
                        if (row.output == null || row.output == "") {
                            actionHtml = '<i class="fa fa-cog" style="cursor: pointer;" title="查看详情"></i>';
                        } else {
                            var outputText = (row.output || '').substr(0, 100);
                            actionHtml = '<span style="cursor: pointer;" title="' + outputText + '">' + outputText + '</span>';
                        }

                        return actionHtml;
                    },
                    createdCell: function (td, cellData, rowData, row, col) {
                        // 为单元格添加点击事件
                        $(td).off('click').on('click', function() {
                            vm.getCheckItemById(rowData.id, rowData.itemName);
                        });
                    }
                }

            ];


            vm.tableConfig = {
                data: [getPromise],
                columns: tableColumns,
                order: [[1, 'desc']],
                buttons: ['reload'],
                selection: {
                    valueData: 'id', labelData: 'name', preselected: vm.fixSelectedIds, stateFn: function (row) {
                        if(row.status === "FAILED" && !row.fixPathIsNull){
                            return '';
                        }else{
                            return 'disabled';
                        }
                    }
                },
            }

            function getPromise() {
                return CheckResultService.getBylogIdAllData(logId);
            }

        }

        init();

        function runFix(){
            messageService.confirm($translate.instant('cac3.title.confirmExecution'),$translate.instant('cac3.title.performRepairTour'), function () {
                var threeFixLog ={};
                threeFixLog.logId =logId;
                threeFixLog.itemResultJson=angular.toJson(vm.fixSelectedIds);
                CacFixLogService.fixItemList(threeFixLog).then(function () {
                    $state.go('app.cac3.fix.list', null, {reload: true});
                }).catch(function (err) {
                    messageService.alertError("danger", $translate.instant('common.messages.operation.failed'));
                    throw err;
                });
            });
        }

    }

})
();
