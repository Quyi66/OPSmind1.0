/**
 * @author yangbin
 * @date 2022-09-01 created
 */
(function () {
    'use strict';


    angular.module('oplus.udp').component('flowRecord', {
        bindings: {
            theFlow: '=',
            selectedTaskNodes: '=',
            startSteps: '=',
            _options: '<options'
        },
        templateUrl: 'app/modules/udp/widgets/flow-record/flow-record.html',
        controller: ['$scope', '$timeout', '$interval', 'modalHelper', 'messageService', '$rootScope', '$translate', FlowRecordCtrl]
    });


    function FlowRecordCtrl($scope, $timeout, $interval, modalHelper, messageService, $rootScope, $translate) {
        var that = this;
        this.lines = [];
        this.sortableOptions;
        this.intervals = [];
        this.steps = [];
        this.theFlows = that.theFlow;
        this.clickTaskNode = clickTaskNode;
        this.selectedNode = selectedNode;
        this.validateModel = validateModel;
        this.drawLines = drawLines;
        this.$onInit = onInit;
        this.statusMap = {
            "running": {iconClass: 'fa fa-running', class: 'btn btn-sm opx-btn-icon btn-info'},
            "finished": {iconClass: 'fa fa-check', class: 'btn btn-sm opx-btn-icon btn-success'},
            "unexecuted": {iconClass: 'fa fa-exclamation', class: 'btn btn-sm opx-btn-icon btn-warning'},
            "skip": {iconClass: 'fa fa-minus', class: 'btn btn-sm opx-btn-icon cac-bg-grey"'},
            "failed": {iconClass: 'fa fa-times', class: 'btn btn-sm opx-btn-icon btn-danger'}
        };

        function onInit() {
            that.sortableOptions = {
                disabled: false,
                cursor: 'move',
                tolerance: "pointer",
                distance: 10,
                placeholder: "jao-pmd-task-placeholder jao-pmd-task-node card",
                start: function (event, ui) {
                    var itemIndex = ui.item.sortable.index;
                    $timeout(function () {
                        clickTaskNode(that.theFlow.steps[itemIndex], itemIndex);
                    });
                },
                update: function (event, ui) {
                    var itemIndex = ui.item.sortable.dropindex;
                    $timeout(function () {
                        clickTaskNode(that.theFlow.steps[itemIndex], itemIndex);
                    });
                }
            };
            if (that.theFlow) {
                buildDiagram();
            } else {
                var unregister = $scope.$watch('$ctrl.theFlow', function (newVal, oldVal) {
                    if (!oldVal && newVal) {
                        unregister();
                        buildDiagram();
                    }
                });
            }

        }


        function buildDiagram() {
            initProcessModelData(that.theFlow);
            $timeout(function () {
                // Use timeout to wait task node rendered
                drawLines({action: 'all'});
            });
            watchPositionAndSize();
            $scope.$on('$destroy', function () {
                that.intervals.forEach(function (stop) {
                    $interval.cancel(stop);
                    stop = undefined;
                });
                that.intervals = [];
            });

            /**
             * Leader-line use absolute coordinates related to browser viewport.
             * We need re-position lines in following cases:
             * - canvas size (width) changes
             * - canvas position (x) changes
             * - lines are drawn on invisible canvas (like in tab), and canvas becomes visible
             */
            function watchPositionAndSize() {
                var wrapper = $('#jao-pmd-line-wrapper');
                var isHidden = wrapper.is(':hidden');
                that.intervals.push($interval(function () {
                    var wrapper = $('#jao-pmd-line-wrapper');
                    if (isHidden && wrapper.is(':visible')) {
                        drawLines({action: 'all'});
                        isHidden = false;
                        return;
                    }
                    var rect = wrapper[0].getBoundingClientRect();
                    // When element is hidden, x,y,width,height is zero
                    if (rect.x === 0 && rect.y === 0 && rect.width === 0 && rect.height === 0) {
                        return;
                    }
                    if (!that.rect) {
                        that.rect = rect;
                    }
                    if (rect.x !== that.rect.x || rect.width !== that.rect.width) {
                        // console.log('redraw lines...', JSON.stringify(rect), JSON.stringify(that.rect));
                        drawLines({action: 'all'});
                        that.rect = rect;
                    }
                }, 500));
            }
        }

        function validateModel() {
            $('.jao-pmd-task-node').removeClass('error');
            try {
                var result = {
                    playbook: processBuilder.toPlaybook(that.theFlow),
                    inventory: processBuilder.toInventory(that.theFlow)
                };
                that.generatedPlaybook = result.playbook;
                that.generatedInventory = result.inventory;
                return result;
            } catch (err) {
                var taskId = err.message;
                $('#js-pm-tasknode-' + taskId).addClass('error');
                throw new Error('Task ' + taskId + ' not well defined');
            }
        }


        function initProcessModelData(pd) {
            pd.steps = pd.steps || [];
            // pd.params = pd.params || [];
            // pd.inventory = pd.inventory || [];
            pd.steps.forEach(function (step) {
                if (!step.id) {
                    step.id = uniqueId();
                }
            });
        }

        function uniqueId() {
            return _.uniqueId(Date.now() + '_');
        }


        function drawLines() {
            $('.leader-line').remove();
            that.lines = [];
            var tasks = that.theFlow.steps;
            for (var i = 0; i < tasks.length - 1; i++) {
                var startId = 'js-pm-tasknode-' + tasks[i].id;
                var endId = 'js-pm-tasknode-' + tasks[i + 1].id;
                var line = new LeaderLine({
                    start: document.getElementById(startId),
                    end: document.getElementById(endId),
                    element:document.getElementById('js-process-canvas'),
                    size: 2,
                    color: '#DCDCDC',
                    startSocket: 'right',
                    endSocket: 'left',
                    // endPlug:'arrow3',
                    // path: 'magnet'
                    path: 'grid'
                });
                that.lines.push(line);
            }
            fixScrollPosition();
        }

        function selectedNode(task, index) {
            that.selectedTaskNodes.length = 0;
            that.selectedTaskNodes.push(index);
            var map = {
                stepName: task.name,
                runId: task.runLogIds
            };
            $scope.$emit("that.selectedTaskNodes", map);
        }

        function fixScrollPosition() {
            var lines = that.lines;
            // Handle scroll
            // https://jsfiddle.net/2sfxvy8k/
            var wrapper = $('#jao-pmd-line-wrapper');
            // Reset wrapper
            wrapper.css('transform', 'none');
            var rect = wrapper[0].getBoundingClientRect();
            // Move to the origin of coordinates as the document
            wrapper.css('transform', 'translate(' +
                ((rect.left + window.pageXOffset) * -1) + 'px, ' +
                ((rect.top + window.pageYOffset) * -1) + 'px)');
            wrapper.append($('body > .leader-line'));
            lines.forEach(function (line) {
                line.position();
            });
        }

        function clickTaskNode(task, index) {
            var instance = modalHelper.openModal({
                templateUrl: 'app/modules/udp/widgets/flow-record/flow-record-step.html',
                size: 'lg',
                controllerAs: '$ctrl',
                controller: ['$scope', 'modalHelper', 'messageService', 'jaoFlowService', function ($scope, modalHelper, messageService, jaoFlowService) {
                    var that = this;
                    that.task = task;
                    that.statusMap = [];
                    that.hostStatusList = [];
                    that.runHosts = [];
                    that.startFlow = function () {
                        var toast = false;
                        _.forEach(that.step.config.tasks, function (value, key) {
                            var groups = value.groups;
                            value.scripts = that.task.config.tasks[key].scripts;
                            if (groups) {
                                _.forEach(groups, function (group, k) {
                                    var groupHosts = [];
                                    var hostList = group.hosts; //all
                                    angular.forEach(hostList, function (host, k) {
                                        var map = {};
                                        host.value = host.host;
                                        map.value = host.host;
                                        map.key = host.hostId;
                                        map.assetType = host.assetType;
                                        groupHosts.push(map);

                                    });
                                    if (groupHosts.length === 0) {
                                        toast = true;
                                    }
                                });
                            }
                        });
                        if (toast) {
                            messageService.toast("warn", $translate.instant('common.messages.operation.failed'), $translate.instant('jao.messages.pls_select_host'));
                            return;
                        }
                        var verbosity = that.task.config.verbosity;
                        that.step.config.verbosity = verbosity? verbosity : "0";
                        that.step.configJson = JSON.stringify(that.step.config);
                        var stepJob = {flowStep: that.step, hosts: that.runHosts};
                        jaoFlowService.runStep(stepJob).then(function (result) {
                            instance.close("success");
                        }).catch(function (err) {
                            messageService.toast("error", $translate.instant('jao.messages.run_step_failed'), err.message);
                        });
                    };

                    that.$onInit = function () {
                        jaoFlowService.getStepAndHostStatus(task.id).then(function (result) {
                            that.step = result.step;
                            that.step.config = angular.fromJson(result.step.configJson);

                            angular.forEach(that.step.config.tasks, function (value, key) {
                                var hostStatus = [];
                                var groups = value.groups;
                                if (groups) {
                                    angular.forEach(value.groups, function (group, k) {
                                        var groupMap = {};
                                        var groupHosts = [];
                                        var hostList = []; //all
                                        var hostResultList = [];
                                        if (group.hosts_info) {
                                            hostList = group.hosts_info; //all
                                            hostResultList = _.filter(hostList, function (host) {
                                                return host.status !== "running";
                                            });
                                        } else {
                                            hostResultList = group.hosts;
                                        }

                                        angular.forEach(hostResultList, function (host, k) {
                                            var map = {};
                                            map.host = host.value;
                                            map.value = host.value;
                                            map.hostId = host.key;
                                            map.key = host.key;
                                            map.assetType = host.assetType;
                                            if (host.status) {
                                                map.status = host.status;
                                            }else{
                                                map.status = 'unexecuted';
                                            }
                                            groupHosts.push(map);
                                        });
                                        groupMap[group.group] = groupHosts;
                                        hostStatus.push(groupMap);
                                        group.hosts = [];
                                    });
                                }
                                that.hostStatusList.push(hostStatus);
                            });
                        });

                    };

                    this.fileModelConverter = {
                        type: 'attrmap',
                        attrmap: {
                            'location': 'path',
                            'argline': 'config',
                            'tag': 'tag'
                        },
                        groups: [],
                        modelType: 'map',
                        hostGroup: false //Todo 此参数可以删除，需测试
                    };
                    this.fileSelectorConfig = {
                        repoType: 'git',
                        viewMode: 'dialog',
                        multipleSelect: true,
                        showFileConfig: true
                    };
                    this.cancel = function () {
                        instance.close("cancel");
                    };
                    this.openTextModal = function (parentIndex, index, param, param_type) {
                        var title;
                        if (param_type === "group_vars") {
                            title = "Group Vars";
                        } else if (param_type === "host_vars") {
                            title = "Host Vars";
                        }
                        var modal = modalHelper.openModal({
                                template: '<div class="modal-body">' +
                                    '<div class="modal-header"><h4 class="modal-title">' + title + '</h4></div>' +
                                    '<div class="modal-body" style="height:20rem;">' +
                                    '<textarea class="form-control h-100 ng-valid ng-dirty ng-valid-parse ng-empty ng-touched" ng-model="$ctrl.modelConfig" rows="20" aria-invalid="false" style=""></textarea>' +
                                    '    </div>' +
                                    '</div>' +
                                    '<div class="modal-footer">' +
                                    '<button class="btn btn-primary opx-btn-ok" ng-click="$ctrl.confirm()">确认</button>' +
                                    '<button class="btn btn-default opx-btn-cancel" ng-click="$ctrl.close()">取消</button>' +
                                    '</div>',
                                controller: ['$scope', function () {
                                    this.modelConfig = param;
                                    this.close = function () {
                                        modal.dismiss();
                                    };
                                    this.confirm = function confirm() {
                                        modal.close(this.modelConfig);
                                    };
                                }],
                                controllerAs: '$ctrl'
                            }, {
                                resizable: true, onOk: function (modelConfig) {
                                    if (param_type === "group_vars") {
                                        that.step.config.tasks[parentIndex]["groups"][index].group_vars = modelConfig;
                                    } else if (param_type === "host_vars") {
                                        that.step.config.tasks[parentIndex]["groups"][index].host_vars = modelConfig;
                                    }
                                }
                            }
                        );
                    }
                }]
            }, {resizable: true});
            instance.result.then(
                function close(result) {
                    that.startSteps = result;
                    $scope.$emit("that.startSteps", that.startSteps);
                }, function dismiss(result) {
                    that.startSteps = result;
                    $scope.$emit("that.startSteps", that.startSteps);
                }
            );
        }
    }
})();
