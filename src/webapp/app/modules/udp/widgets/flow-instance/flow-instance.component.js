/**
 * @author yangbin
 * @date 2022-09-17 created
 */
(function () {
    'use strict';

    angular.module('oplus.udp').component('flowInstance', {
        bindings: {
            theFlow: '=theModel',
            _options: '<options'
            // onSelect: '<'
        },
        templateUrl: 'app/modules/udp/widgets/flow-instance/flow-instance.html',
        controller: ['$scope', 'messageService', '$interval', '$translate', '$timeout', '$compile', 'dataEx', 'pageDataUtil', 'jaoFlowService', FlowInstanceCtrl]
    });


    function FlowInstanceCtrl($scope, messageService, $interval, $translate, $timeout, $compile, dataEx, pageDataUtil, jaoFlowService) {
        var that = this;

        this.$onInit = onInit;
        this.refreshComponent = refreshComponent;


        this.statusView = [];
        this.statusMap = {
            "running": {iconClass: 'fa fa-running', class: 'btn btn-sm opx-btn-icon btn-info'},
            "finished": {iconClass: 'fa fa-check', class: 'btn btn-sm opx-btn-icon btn-success'},
            "unexecuted": {iconClass: 'fa fa-exclamation', class: 'btn btn-sm opx-btn-icon btn-warning'},
            "skip": {iconClass: 'fa fa-minus', class: 'btn btn-sm opx-btn-icon cac-bg-grey"'},
            "failed": {iconClass: 'fa fa-times', class: 'btn btn-sm opx-btn-icon btn-danger'}
        };


        $scope.$on("instanceView", function (event, data) {
            that._options = data;
            onInit();
        });


        function totalHosts() {
            var hosts = that.flowInstance.hosts;
            if (!hosts || hosts.length === 0) {
                var steps = that.flowInstance.steps;
                if (steps) {
                    that.flowInstance.steps.forEach(function (step, index) {
                        var configJson = step.configJson;
                        if (configJson) {
                            var config = angular.fromJson(configJson);
                            var taskArray = config.tasks;
                            taskArray.forEach(function (task, index) {
                                var scriptArray = task.scripts;
                                scriptArray.forEach(function (script, index) {
                                    var hostArray = script.hosts;
                                    if (hostArray) {
                                        hostArray.forEach(function (host, index) {
                                            hosts.push(host);
                                        });
                                    }
                                });
                            });
                        }
                    });
                }
                that.flowInstance.hosts = hosts;
            }
        }


        function onInit() {
            var flowInstanceId = undefined;
            var initval = that._options.flowInstanceId;
            if (initval) {
                flowInstanceId = parseFlowId(initval)
            }
            if (flowInstanceId) {
                jaoFlowService.getFlowInstanceViewById(flowInstanceId).then(function (result) {
                    that.flowInstance = result.instance;
                    if (that.flowInstance.globalParamsJson && that.flowInstance.globalParamsJson === 'null') {
                        that.flowInstance.globalParamsJson = undefined
                    }
                    angular.forEach(that.flowInstance.steps, function (value, key) {
                        var configJson = value.configJson;
                        value.config = angular.fromJson(configJson);
                    });
                    totalHosts();
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant('jao.messages.cannot_get_flow_instance'), err.message);
                });
            }
        }

        that.refreshEvent = $interval(function () {
            autoRefreshComponent();
        }, 5000);

        //停止自动刷新
        $scope.stopAutoRefresh = function () {
            if (that.refreshEvent) {
                $interval.cancel(that.refreshEvent);
                that.refreshEvent = null;
            }
        };

        //当退出这个组件时候，销毁定时任务
        $scope.$on('$destroy', function () {
            $scope.stopAutoRefresh();
        });

        this.selectedTaskLogId;
        this.startSteps;
        this.selectedTaskRunLogIds = [];
        this.selectedTaskNodes = [];
        this.selectedTasks = {};

        $scope.$on("that.selectedTaskNodes", function (event, data) {
            that.selectedTasks = data;
            that.selectedTaskRunLogIds = [];
            var runId = angular.fromJson(data.runId);
            if (runId.length > 1) {
                jaoFlowService.getRunLogsByRunIds(JSON.stringify(runId)).then(function (result) {
                    angular.forEach(result, function (value, key) {
                        var map = {};
                        map.jobTitle = value.jobTitle;
                        map.id = value.id;
                        map.startTime = $$.formatDate(value.startTime, 'YYYY-MM-DD HH:mm:ss');
                        that.selectedTaskRunLogIds.push(map);
                    });
                    that.selectedTaskRunLogIds = _.reverse(_.sortBy(that.selectedTaskRunLogIds, function (o) {
                        return o.startTime;
                    }));
                    that.selectedTaskLogId = that.selectedTaskRunLogIds[0].id;
                });
            } else {
                that.selectedTaskLogId = runId[0];
            }
        });


        $scope.$on("that.startSteps", function (event, data) {
            if (data === "success") {
                refreshComponent();
            }
        });


        function autoRefreshComponent() {
            //刷新flow-record组件信息
            //failed, unexecuted,running
            var failedList = that.flowInstance.steps.find(e => e.status === "failed");
            var finishedList = [];
            angular.forEach(that.flowInstance.steps, function (v, k) {
                if (v.status === "finished") {
                    finishedList.push(v);
                }
            });
            var stepsLength = that.flowInstance.steps.length;
            if (failedList || (finishedList && finishedList.length === stepsLength)) {
                // that.selectedTaskLogId = undefined;
                that.flowInstance = undefined;
                onInit();
                $scope.stopAutoRefresh();
            } else {
                // that.selectedTaskLogId = undefined;
                that.flowInstance = undefined;
                onInit();
            }
        }


        function refreshComponent() {
            //刷新flow-record组件信息
            //failed, unexecuted,running

            var failedList = that.flowInstance.steps.find(e => e.status === "failed");
            var finishedList = [];
            angular.forEach(that.flowInstance.steps, function (v, k) {
                if (v.status === "finished") {
                    finishedList.push(v);
                }
            });
            var stepsLength = that.flowInstance.steps.length;
            if (failedList || (finishedList && finishedList.length === stepsLength)) {
                that.selectedTaskLogId = undefined;
                that.flowInstance = undefined;
                onInit();
                $scope.stopAutoRefresh();
            } else {
                that.selectedTaskLogId = undefined;
                that.flowInstance = undefined;
                onInit();
            }
        }

        function parseFlowId(initval) {
            //Todo 判断传入的变量类型。
            var valueObj = pageDataUtil.getPageScopeValues($scope);
            return dataEx.evalVarExpr(initval, valueObj);
        }

    }
})();
