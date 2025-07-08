/**
 *
 * @author chenrongji, created on 2021-2-20
 */
(function () {
    'use strict';

    angular.module('oplus.jao').controller('jaoFlowStepCtrl', JaoFlowStepCtrl);

    JaoFlowStepCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$uibModal', 'messageService', 'jaoFlowService', '$stateParams', '$translate'];

    /**
     *
     * @param $scope
     * @param $rootScope
     * @param $state
     * @param $timeout
     * @param $uibModal
     * @param {messageService} messageService
     * @param {jaoFlowService} jaoFlowService
     * @param $stateParams
     * @constructor
     */
    function JaoFlowStepCtrl($scope, $rootScope, $state, $timeout, $uibModal, messageService, jaoFlowService, $stateParams, $translate) {
        var that = this;
        that.addParam = addParam;
        that.cancel = cancel;
        that.$onInit = onInit;
        that.runStep = runStep;
        that.hostStatusList = [];
        that.runHosts = [];

        that.fileSelectorConfig = {
            repoType: 'git',
            viewMode: 'dialog',
            multipleSelect: false,
            showFileConfig: true
        };

        function cancel() {
            $state.go('app.jao.flow_list.instance_view', {id: that.step.flowId});
        }

        function onInit() {
            jaoFlowService.getStepAndHostStatus($stateParams.stepId).then(function (result) {
                that.step = result.step;
                that.step.config = JSON.parse(result.step.configJson);
                var paramList = [];
                that.globalParams = [];
                that.step.config.tasks[0].scripts.forEach(function (script) {
                    paramList = paramList.concat(getParamList(script.argline));
                });
                result.params.forEach(function (param) {
                    if (paramList.indexOf(param.name) > -1) {
                        that.globalParams.push(param);
                    }
                });
                result.hostList.forEach(function (hostStatus) {
                    hostStatus.key = hostStatus.hostId;
                    if (($stateParams.selectedHosts || {})[hostStatus.hostId]) {
                        that.runHosts.push(hostStatus);
                    }
                });
                that.hostStatusList = result.hostList.filter(function (host) {
                    return host.status !== "running";
                });
            });

            // that.step.config = JSON.parse(that.step.configJson);
        }

        function addParam() {
            that.flow.globalParams.push({name: "", label: "", description: null, type: null, defaultValue: ""});
        }
        
        function runStep() {
            if (that.runHosts.length === 0) {
                messageService.toast("warn", $translate.instant('common.messages.operation.failed'), $translate.instant('jao.messages.pls_select_host'));
                return;
            }
            setRelatedParams();
            var verbosity = that.step.config.verbosity;
            that.step.config.verbosity = verbosity? verbosity : "0";
            that.step.configJson = JSON.stringify(that.step.config);
            var stepJob = {flowStep: that.step, hosts: that.runHosts};
            jaoFlowService.runStep(stepJob).then(function (result) {
                $state.go('app.jao.flow_list.instance_view', {id: that.step.flowId});
            }).catch(function (err) {
                messageService.toast("error", $translate.instant('jao.messages.run_step_failed'), err.message);
            });
        }

        function setRelatedParams() {
            var argline = that.step.config.tasks[0].scripts[0].argline;
            that.globalParams.forEach(function (param) {
                argline = argline.replace("${"+param.name+"}",param.defaultValue);
            });
            that.step.config.tasks[0].scripts[0].argline = argline;
        }

        function getParamList(s) {
            var i = 0;
            var paramList = [];
            while (s && s.lastIndexOf("}") >= i) {
                if (s.indexOf("${") < 0) {
                    break;
                }
                s = s.substring(s.indexOf("${") + 2);
                var paramName = s.substring(0, s.indexOf("}"));
                paramList.push(paramName);
                i = s.indexOf("}") + 1;
            }
            return paramList;
        }

        function openDynamicHosts() {
            var modal = $uibModal.open({
                templateUrl: 'app/modules/jao/widgets/hostselector/host-dynamic-selector.html',
                controller: ['$scope', 'theDate', 'theHosts', '$uibModalInstance', '$compile', '$timeout', DynamicHostSelectorCtrl],
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    theDate: function () {
                        return that.theDate;
                    },
                    theHosts: function () {
                        return that.theHosts;
                    }
                }
            });
            modal.result.then(function close(result) {
                that.theHosts = result;
            }, function dismiss() {
            });
        }

        function DynamicHostSelectorCtrl($scope,theDate,theHosts,$uibModalInstance,$compile,$timeout) {
            var _ctrl = this;
            _ctrl.selectedStatus = {name: 'all', title: $translate.instant('common.term.all')};
            _ctrl.tableHosts = [];
            _ctrl.theDate = theDate;
            var selectedHosts = [];
            function refreshTable(){
                angular.element("#selectAllHost").off("click");
                angular.element("#cm-host-table").off("page.dt");
                init();
            }
            $scope.$watch('$ctrl.selectedStatus', function (newVal, oldVal) {
                if (newVal === oldVal)
                    return;
                refreshTable();
            });
            _ctrl.theDate.forEach(function (host) {
                host._selected = false;
                theHosts.forEach(function (item) {
                    if (item.key == host.key) {
                        host._selected = true;
                    }
                })
            });
            _ctrl.statusList = [
                {name: 'all', title: $translate.instant('jao.status.flow.all')},
                {name: 'failed', title: $translate.instant('jao.status.flow.failed')},
                {name: 'finished', title: $translate.instant('jao.status.flow.finished')},
                {name: 'skip', title: $translate.instant('jao.status.flow.skip')},
                {name: 'unexecuted', title: $translate.instant('jao.status.flow.unexecuted')}
            ];

            //初始化创建表格
            var tableOption = {
                // order: [[1, 'asc']],
                aoColumns: [
                    {
                        mData: 'key',
                        width: '3rem',
                        title: '<div class="checkbox checkbox-inline checkbox-primary" title="{{\'common.entity.detail.select_all\' | translate}}"><input type="checkbox" id="selectAllHost"><label for="selectAllHost"></label></div>',
                        className: 'text-center',
                        searchable: false,
                        orderable: false,
                        render: function (data, type, row, meta) {
                            var index = _.findIndex(_ctrl.tableHosts,row);
                            var actionHtml = '<div class="checkbox checkbox-inline">' +
                                '<input  type="checkbox" class="checkboxHost" ' +
                                'ng-model="$ctrl.tableHosts['+index+']._selected "' +
                                'ng-click="$ctrl.selectHost('+index+')"' +
                                '>' +
                                '<label for="check_host_' + row.key + '"></label></div>';
                            return actionHtml;
                        },
                        createdCell: function (nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    },
                    {mData: 'key', title: $translate.instant('jao.common.host')},
                    {mData: 'status', title: $translate.instant('common.entity.detail.status')}
                ],
                autoWidth: false,
                deferRender: true,
                processing: true,
                lengthMenu: [10, 25, 50, 100],
                colReorder: true,
                stateSave: true,//datatable分页刷新后 固定在当前页
                retrieve: true,//和destroy一起，用于屏蔽Cannot reinitialise DataTable提示的
                destroy: true,
                serverSide: false,//true表示服务器端分页，false表示前端分页
                pagingType: "simple_numbers",
                dom: '<"dataTables_header"<"dataTables_toolbar" <"dataTables_controls" >f>>t<"dataTables_footer row"<"col-md-6 m-t" <"pull-left" l><"pull-left" i>><"col-md-6 m-t"p>><"clearfix">',
                createdRow: function (row, data, dataIndex) {
                },
                initComplete: function () {
                },
                //每一次绘datatables时候调用的方法
                fnPreDrawCallback: function (oSettings) {
                }
            };
            var tableInstance = null;
            _ctrl.checkSelectAllHost = function () {
                var pageData = tableInstance.rows( {page:'current'} ).data();
                var selectedData = _.filter(pageData,{_selected:true});
                // 如果选中的主机数量等于当前页主机数量，设置全选按钮状态为true;否则为false
                if (pageData.length == selectedData.length){
                    angular.element("#selectAllHost").prop("checked",true);
                } else {
                    angular.element("#selectAllHost").prop("checked",false);
                }
            };
            function init(){
                if (_ctrl.selectedStatus.name == 'all') {
                    _ctrl.tableHosts = _ctrl.theDate;
                }  else {
                    _ctrl.tableHosts = [];
                    _ctrl.theDate.forEach(function (item) {
                        if (item.status == _ctrl.selectedStatus.name) {
                            _ctrl.tableHosts.push(item);
                        }
                    });
                }
                tableOption.ajax = function (data, callback, settings) {
                    callback(
                        {
                            aaData:_ctrl.tableHosts,
                            totalRecords:_ctrl.tableHosts.length
                        }
                    );
                };
                if (tableInstance != null) {tableInstance.destroy();}
                tableInstance = angular.element("#flow-host-table").DataTable(tableOption);
                _ctrl.checkSelectAllHost();
                //为全选框绑定单击事件
                angular.element("#selectAllHost").on("click", function () {
                    var checkedAll = angular.element("#selectAllHost").prop("checked");
                    if (checkedAll) {
                        angular.element("#flow-host-table tbody :checkbox:not(:checked)").click();
                    } else {
                        angular.element("#flow-host-table tbody :checkbox:checked").click();
                    }
                });
                angular.element("#flow-host-table").on("draw.dt",function(){
                    _ctrl.checkSelectAllHost();
                });
            }

            _ctrl.selectHost = function (index){
                var host = _ctrl.tableHosts[index];
                var _index = _.findIndex(selectedHosts,{key:host.key});
                if (_index == -1) {
                    selectedHosts.push(host);
                } else {
                    selectedHosts.splice(_index,1);
                }
                _ctrl.checkSelectAllHost();
            };

            _ctrl.selected = selectedHosts;
            _ctrl.cancel = function () {
                $uibModalInstance.dismiss();
            };
            _ctrl.confirm = function () {
                $uibModalInstance.close(_ctrl.selected);
            };
            init();
        }

    }
})();