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
                            var actionHtml = '<span class="badge bg-secondary">{{\'cac3.title.thing\' | translate}}</span>';
                        } else  {
                            var actionHtml = '<span class="badge bg-info">{{\'cac3.title.have\' | translate}}</span>';
                        }
                        return actionHtml;
                    }
                },
                {
                    mData: 'status', title: $translate.instant('cac.common.result'),
                    render: function (data, type, row, meta) {
                        if (row.status == 'OK') {
                            var actionHtml = '<span class="badge bg-success">{{\'cac.result.audit_result.pass\' | translate}}</span>';
                        } else if (row.status == 'FAILED') {
                            var actionHtml = '<span class="badge bg-danger">{{\'cac.result.audit_result.failed\' | translate}}</span>';
                        } else if (row.status == 'CHECK') {
                            var actionHtml = '<span class="badge bg-warning">{{\'cac.result.audit_result.check\' | translate}}</span>';
                        } else {
                            var actionHtml = '<span class="label cac-bg-light-grey">{{\'common.messages.no_data\' | translate}}</span>';
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
                        var id = "'" + row.id + "'";
                        var itemName = "'" + row.itemName + "'";
                        var actionHtml = "";
                        if (row.output == null || row.output == "") {
                            actionHtml = '<span ng-click="cacCheckResultOutputListCtrlVm.getCheckItemById(' + id + ',' + itemName + ')">{{\'common.term.none\' | translate}}</span>';
                        } else {
                            actionHtml = '<span ng-click="cacCheckResultOutputListCtrlVm.getCheckItemById(' + id + ',' + itemName + ')">' +
                                (row.output || '').substr(0, 100) +
                                '</span>';
                        }

                        return actionHtml;
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
