/**
 *
 * @author chenrongji, created on 2021-2-20
 */
(function () {
    'use strict';

    angular.module('oplus.jao').controller('jaoFlowInstanceViewCtrl', JaoFlowInstanceViewCtrl);

    JaoFlowInstanceViewCtrl.$inject = ['$q', '$scope', '$rootScope', '$state', '$timeout', '$uibModal', 'messageService', 'jaoFlowService', '$stateParams', '$compile', 'gfileService', '$translate'];

    function JaoFlowInstanceViewCtrl($q, $scope, $rootScope, $state, $timeout, $uibModal, messageService, jaoFlowService, $stateParams, $compile, gfileService, $translate) {
        var that = this;
        that.clickRunStep = clickRunStep;
        that.clickSkipStep = clickSkipStep;
        that.clickStepRunLogs = clickStepRunLogs;
        that.clickHost = clickHost;
        // that.refreshTable = refreshTable;
        // that.selectHost = selectHost;
        that.statusView = null;
        that.$onInit = onInit;
        // that.isRefreshing = false;
        // that.refreshClass = "";
        //主机选择状态集合
        // that.hostSelectedList = [];
        // var tableInstance = null;
        that.statusMap = {
            "running": {iconClass: 'fa fa-running', class: 'btn btn-sm opx-btn-icon btn-info'},
            "finished": {iconClass: 'fa fa-check', class: 'btn btn-sm opx-btn-icon btn-success'},
            "unexecuted": {iconClass: 'fa fa-exclamation', class: 'btn btn-sm opx-btn-icon btn-warning'},
            "skip": {iconClass: 'fa fa-minus', class: 'btn btn-sm opx-btn-icon cac-bg-grey"'},
            "failed": {iconClass: 'fa fa-times', class: 'btn btn-sm opx-btn-icon btn-danger'}
        };

        // function selectHost(stepIndex, hostId) {
        //     that.hostSelectedList[stepIndex][hostId] = !that.hostSelectedList[stepIndex][hostId];
        // }

        // function refreshTable() {
        //     that.dataTableConfig = {};
        // if (that.isRefreshing) {
        //     return;
        // }
        // that.isRefreshing = true;
        // that.refreshClass = "icon-spining";
        // onInit();
        // }

        function onInit() {
            var id = $stateParams.id;
            jaoFlowService.getFlowInstanceViewById(id).then(function (result) {
                that.flowInstance = result.instance;
                that.statusView = result.statusView;
                // initTable();
                var defaultHostSelectedMap = {};
                that.statusView.forEach(function (item) {
                    defaultHostSelectedMap[item.hostId] = false;
                });
                that.dataTableConfig = initTableOption();
                that.dataTableConfig.data = [function () {
                    return new Promise(function (resolve, reject) {
                        jaoFlowService.getFlowInstanceViewById(id).then(function (result) {
                            that.flowInstance = result.instance;
                            that.statusView = result.statusView;
                        });
                        //做一些异步操作
                        resolve(that.statusView);
                    });
                    // var ad = $q.defer();
                    // that.statusView = undefined;
                    // jaoFlowService.getFlowInstanceViewById(id).then(function (result) {
                    //     that.flowInstance = result.instance;
                    //     that.statusView = result.statusView;
                    // });
                    // ad.resolve(that.statusView);
                    // ad.promise
                    // return ad.promise;
                }];
                // if (that.isRefreshing === false) {
                $timeout(function () {
                    that.flowInstance.steps.forEach(function (step, index) {
                        var html = "<div class='flow-turn-front'><span>" + step.name + "</span></div>\n" +
                            "<a ng-click='$ctrl.clickRunStep(\"" + index + "\")' class='flow-turn-back'>" +
                            "<i class='fa fa-play-circle'></i> " +
                            "<span>{{\'jao.flow.detail.step.run\' | translate}}</span>" +
                            "</a>\n";
                        $compile(html)($scope).appendTo("#" + step.id);
                        //初始化主机选择状态集合[{hostKey1:false,hostKey2:false},{hostKey1:false,hostKey2:false}]
                        // that.hostSelectedList.push(JSON.parse(JSON.stringify(defaultHostSelectedMap)));
                    });
                });
                // }
                // that.isRefreshing = false;
                // that.refreshClass = "";
            }).catch(function (err) {
                messageService.toast('error', $translate.instant('jao.messages.cannot_get_flow_instance'), err.message);
            });
        }

        function initTableOption() {
            var tableOption = {
                columns: [
                    {data: 'hostkey', title: $translate.instant('jao.common.host')}
                ],
                scrollY: "400px",
                scrollX: true,
                fixedHeader: true,
                fixedColumns: {
                    leftColumns: 1
                },
                buttons: ['reload'],
                initComplete: function () {
                }
            };
            that.flowInstance.steps.forEach(function (step, index) {
                var column = {
                    data: step.id,
                    title: "<div class=\"flow-turn\" id='"+step.id+"'>\n" +

                        "</div>",
                    render: function (data, type, row, meta) {
                        var html = "<div style='width: 100%'  ng-click=\"$ctrl.clickHost('"+ index +"','"+ row['hostId'] +"')\" class=\"text-center opx-autocolor {{::$ctrl.statusMap['"+ data +"'].class}}\">" +
                            "<i class=\"fa {{::$ctrl.statusMap['"+ data +"'].iconClass}}\"></i>" +
                            "</div>";
                        return html;
                    }
                };

                tableOption.columns.push(column);
            });
            return tableOption;
        }

        // function initTable() {
        //     var tableOption = initTableOption();
        //     tableOption.ajax = function (data, callback, settings) {
        //         callback(
        //             {
        //                 aaData:that.statusView,
        //                 totalRecords:that.statusView.length
        //             }
        //         );
        //     };
        //     if (tableInstance != null) {
        //         tableInstance.destroy();
        //     }
        //     tableInstance = angular.element("#host-status-table").DataTable(tableOption);
        // }

        function clickSkipStep() {

        }

        function clickStepRunLogs() {

        }

        function clickRunStep(index) {
            var step = that.flowInstance.steps[index];
            // var selectedHosts = that.hostSelectedList[index];
            var selectedHosts = null;
            $state.go('app.jao.flow_list.step', {
                instanceId: that.flowInstance.id,
                stepId: step.id,
                selectedHosts: selectedHosts
            })
        }


        function clickHost(stepIndex, hostId) {
            // selectHost(stepIndex,hostId);
            jaoFlowService.getHostStatusByStepIdAndHostKey(that.flowInstance.steps[stepIndex].id, hostId).then(function (result) {
                if (result.resultType === "file") {
                    var filePath = result.result;
                    filePath = filePath.substring("/opt/oplus/assets/gfs/fs-repos/".length);
                    var repo_id = filePath.substring(0, filePath.indexOf("/"));
                    filePath = filePath.substring(filePath.indexOf("/") + 1);
                    gfileService.openFileContentViewer('staticfs', repo_id, filePath);
                } else {
                    viewHostDefault(result);
                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant('jao.messages.cannot_get_host_result'), err);
            });

        }

        function viewHostDefault(result) {
            $uibModal.open({
                templateUrl: 'app/modules/jao/flow/flow-host-view.html',
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'lg',
                controller: ['$uibModalInstance', 'host', 'jaoUtil', function ($uibModalInstance, host, jaoUtil) {
                    this.statusDefs = {
                        ok: {color: 'success', text: jaoUtil.taskStatusDefs.ok.text},
                        failed: {color: 'danger', text: jaoUtil.taskStatusDefs.failed.text},
                        unreachable: {color: 'warning', text: jaoUtil.taskStatusDefs.unreachable.text},
                        ignored: {color: 'secondary', text: jaoUtil.taskStatusDefs.ignored.text},
                        skipped: {color: 'secondary', text: jaoUtil.taskStatusDefs.skipped.text},
                        changed: {color: 'primary', text: jaoUtil.taskStatusDefs.changed.text}
                    };
                    this.hostKey = host.host;
                    this.hostResult = JSON.parse(host.result);
                    this.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                    this.confirm = function () {
                        $uibModalInstance.close();
                    };
                }],
                resolve: {
                    host: function () {
                        return result;
                    }
                }
            }).result.then(function (result) {

            }, function () {

            });
        }
    }

})();
