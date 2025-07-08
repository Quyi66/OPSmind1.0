/**
 * @Auther: zml
 * @Date: 2018/5/17
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacResultListCtrl', CacResultListCtrl);
    CacResultListCtrl.$inject = ['$scope', '$timeout', 'cacService', '$compile', '$uibModal', '$stateParams', '$filter', 'cacResultService', 'currentUser', '$translate'];

    function CacResultListCtrl($scope, $timeout, cacService, $compile, $uibModal, $stateParams, $filter, cacResultService, currentUser, $translate) {
        var vm = this;
        var jobId = $stateParams.jobId;
        var scriptType = $stateParams.scriptType;

        vm.views = {
            findMetric: findMetric,
            tableInstance: null,
            executeRule: executeRule,
            playbookScripType: cacService.playbookScripType,
            isPlaybookType: scriptType == cacService.playbookScripType ? true : false,
            ruleExpressionList: []
        };

        var tableOption = {
            id: 'cacResultTable',
            order: [[2, 'desc']],
            serverSide: true,
            stateSave: false,
            aoColumns: [
                {mData: 'hostKey', title: $translate.instant('cac.common.host'), width: '15%'},
                {
                    mData: 'ruleName', title: $translate.instant('cac.template.detail.audit_params'), width: '25%', className: 'cac-text-overflow',
                    render: function (data, type, row, meta) {
                        var actionHtml = '<span class="cac-td-hover" title=\'' + row.ruleName + '\' >' + row.ruleName + '</span>';
                        return actionHtml;
                    }
                },
                {
                    mData: 'ruleExpression',
                    title: $translate.instant('cac.common.rule'),
                    width: '40%',
                    className: 'cac-text-overflow',
                    render: function (data, type, row, meta) {
                        var rule = encodeURI(angular.toJson(row));
                        /*ng-click="cacResultListCtrlVm.views.executeRule($event)"*/
                        var actionHtml = '<span class="cac-td-hover" title=\"' + row.ruleExpression + '\"  rule="' + rule + '" >' + row.ruleExpression + '</span>';
                        return actionHtml;
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                },
                {
                    mData: 'auditResult', title: $translate.instant('cac.common.result'), width: '10%',
                    render: function (data, type, row, meta) {
                        if (row.auditResult == 'true') {
                            var actionHtml = '<span class="badge bg-success">{{\'cac.result.audit_result.pass\' | translate}}</span>';
                        } else if (row.auditResult == 'false') {
                            var actionHtml = '<span class="badge bg-danger">{{\'cac.result.audit_result.failed\' | translate}}</span>';
                        } else if (row.auditResult == $translate.instant('cac.result.audit_result.check')) {
                            var actionHtml = '<span class="badge bg-warning">{{\'cac.result.audit_result.check\' | translate}}</span>';
                        } else if (row.auditResult ==  $translate.instant('cac.result.audit_result.skipping')) {
                            var actionHtml = '<span class="badge bg-secondary">{{\'cac.result.audit_result.skipping\' | translate}}</span>';
                        } else {
                            var actionHtml = '<span class="label cac-bg-light-grey">{{\'common.messages.no_data\' | translate}}</span>';
                        }

                        return actionHtml;
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                },
                /*{
                    mData: 'endedAt', title: '结束时间',
                    render: function (data, type, row, meta) {
                        var endedAt = $filter('date')(row.endedAt, 'yyyy-MM-dd HH:mm:ss');
                        return endedAt;
                    }
                },*/
                {
                    mData: 'id',
                    title: $translate.instant('common.entity.detail.operation'),
                    className: 'text-center',
                    width: '10%',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var hostKey = "'" + row.hostKey + "'";
                        var ruleName = "'" + row.ruleName + "'";
                        var auditResult = "'" + row.auditResult + "'";
                        vm.views.ruleExpressionList.push(row.ruleExpression);
                        var indexOfRuleExpression = vm.views.ruleExpressionList.indexOf(row.ruleExpression);
                        //var result = encodeURI(angular.toJson(row));
                        var actionHtml = '<div class="btn-group">' +
                            '<button type="button" class="btn btn-default btn-sm" ng-click="cacResultListCtrlVm.views.findMetric(' + hostKey + ',' + ruleName + ',' + auditResult + ',' + indexOfRuleExpression + ')">' +
                            '{{\'cac.result.detail.view_metric\' | translate}}</button>' +
                            '</div>';
                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }
            ]
        };

        function init() {
            //console.log(vm.views.isPlaybookType);
            if (vm.views.isPlaybookType) {
                var columnDefs = [
                    {mData: 'hostKey', title: $translate.instant('cac.common.host')},
                    {
                        mData: 'checkItem', title: $translate.instant('cac.result.detail.check_item')
                    },
                    {
                        mData: 'auditResult', title: $translate.instant('cac.common.result'),
                        render: function (data, type, row, meta) {
                            if (row.auditResult == 'true') {
                                var actionHtml = '<span class="badge bg-success">{{\'cac.result.audit_result.pass\' | translate}}</span>';
                            } else if (row.auditResult == 'false') {
                                var actionHtml = '<span class="badge bg-danger">{{\'cac.result.audit_result.failed\' | translate}}</span>';
                            } else if (row.auditResult == $translate.instant('cac.result.audit_result.check')) {
                                var actionHtml = '<span class="badge bg-warning">{{\'cac.result.audit_result.check\' | translate}}</span>';
                            } else if (row.auditResult == $translate.instant('cac.result.audit_result.skipping')) {
                                var actionHtml = '<span class="badge bg-secondary">{{\'cac.result.audit_result.skipping\' | translate}}</span>';
                            } else {
                                var actionHtml = '<span class="label cac-bg-light-grey">{{\'common.messages.no_data\' | translate}}</span>';
                            }

                            return actionHtml;
                        },
                        createdCell: function (nTd) {
                            $compile(nTd)($scope);
                        }
                    },
                    {
                        mData: 'id',
                        title: $translate.instant('common.entity.detail.operation'),
                        className: 'text-center',
                        searchable: false,
                        orderable: false,
                        render: function (data, type, row, meta) {
                            // var hostKey = "'" + row.hostKey + "'";
                            // var checkItem = "'" + row.checkItem + "'";
                            // var auditResult = "'" + row.auditResult + "'";
                            var id = "'" + row.id + "'";
                            var actionHtml = '<div class="btn-group">' +
                                '<button type="button" class="btn btn-default btn-sm" ng-click="cacResultListCtrlVm.views.findMetric(' + id + ')">' +
                                '{{\'cac.result.detail.view_metric\' | translate}}</button>' +
                                '</div>';
                            return actionHtml;
                        },
                        createdCell: function (nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }
                ];
                tableOption = {
                    id: 'cacResultTable',
                    order: [[2, 'desc']],
                    serverSide: true,
                    stateSave: false,
                    aoColumns: columnDefs
                };
            }

            //window.$oplus.appConfig.modules.cac.useLocalDb
            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     tableOption.ajax = {
            //         url: 'app/modules/cac/api/history-result.json',
            //         dataSrc: "aaData"
            //     };
            // } else {
                /* tableOption.ajax = cacService.assembleDataTableUrl('/api/cac/audit/results/list/' + jobId);
                 $timeout(function () {
                     vm.views.tableInstance = cacService.prepareDatatable(".cac-result-table-list", tableOption);
                 }, 10);*/

                var token = currentUser.authToken;
                var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/results/list/' + jobId + '/' + scriptType;

                tableOption.ajax = {
                    url: url,
                    dataSrc: "data",
                    type: "get",
                    dataType: "json",
                    async: false,
                    headers: {
                        "Authorization": 'Bearer ' + token
                        // "X-JWT-Authorization": 'Bearer ' + token
                    }
                };
                $timeout(function () {
                    //初始化datatables，并保存实例
                    vm.views.tableInstance = cacService.prepareDatatable(".cac-result-table-list", tableOption);
                }, 100);


            }
        // }

        function findMetric(hostKey, checkItem, resultStatus, indexOfRuleExpression) {
            cacResultService.getCheckItemById({id:id});
            // var ruleExpression = vm.views.ruleExpressionList[indexOfRuleExpression];
            // if (vm.views.isPlaybookType) {
            //     cacResultService.getMetricByJobIdAndHostKey(jobId, hostKey, null, checkItem, resultStatus, ruleExpression);
            // } else {
            //     cacResultService.getMetricByJobIdAndHostKey(jobId, hostKey, checkItem, null, resultStatus,ruleExpression);
            // }
        }

        function executeRule(event) {
            var ruleJson = $(event.currentTarget).attr("rule");
            $uibModal.open({
                templateUrl: 'app/modules/cac/result/result-execute-rule.html',
                controller: 'CacResultExecuteRuleCtrl',
                controllerAs: 'cacResultExecuteVm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    entity: function () {
                        return {
                            rule: decodeURI(ruleJson)
                        };
                    }
                }
            });
        }

        init();

    }

})
();
