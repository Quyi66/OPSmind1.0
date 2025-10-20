/**
 * @author yangbin
 * @date 2022-09-01 created
 */
(function () {
    'use strict';


    angular.module('oplus.udp').component('flowLayout', {
        bindings: {
            // flowId: '=flowId',
            // stepList: '=stepList',
            theFlow: '=theModel',
            _options: '=options'

            // onSelect: '<'
        },
        templateUrl: 'app/modules/udp/widgets/flow-layout/flow-layout.html',
        controller: ['$scope', 'messageService', '$rootScope', '$translate', '$state', 'dataEx', 'pageDataUtil', 'jaoFlowService', FlowLayoutCtrl]
    });


    function FlowLayoutCtrl($scope, messageService, $rootScope, $translate, $state, dataEx, pageDataUtil, jaoFlowService) {


        var that = this;
        that.$onInit = onInit;

        that.addStep = addStep;
        that.addTask = addTask;
        that.removeTask = removeTask;
        that.removeStep = removeStep;
        that.changeStepFold = changeStepFold;
        that.toggleParams = toggleParams;
        that.addParam = addParam;
        that.deleteParam = deleteParam;
        that.addParamAuto = addParamAuto;
        that.parseFlowId = parseFlowId;

        that.startFlow = startFlow;
        that.save = save;
        that.cancel = cancel;

        this.theFlow = this.theFlow ? this.theFlow : {};
        that.isInstance = this.theFlow ? this.theFlow.runJob : false;
        //Todo 优化代码块，设定默认值，使代码可以直接引用组件
        that.hostScope = that._options.hostScope;
        that.hostGroup = that._options.hostGroup;


        that.stepFoldList = [];
        that.isFoldAllSteps = true;
        that.isParamsCollapsed = false;
        that.fileSelectorConfig = {
            repoType: 'git',
            viewMode: 'dialog',
            multipleSelect: that._options.scriptsOption ? that._options.scriptsOption !== "single" : that._options.scriptsOption === "single",
            showFileConfig: true
        };
        that.fileModelConverter = {
            type: 'attrmap',
            attrmap: {
                'location': 'path',
                'argline': 'config',
                'tag': 'tag'
            },
            modelType: 'array'
        };
        that.paramTypeList = [
            {type: 'string', title: $translate.instant('common.entity.variable.string')},
            {type: 'string_pwd', title: $translate.instant('common.entity.variable.string_pwd')},
            {type: 'number', title: $translate.instant('common.entity.variable.number')},
            {type: 'date', title: $translate.instant('common.entity.variable.date')},
            {type: 'boolean', title: $translate.instant('common.entity.variable.boolean')},
            {type: 'array', title: $translate.instant('common.entity.variable.array')},
            {type: 'host', title: $translate.instant('common.entity.variable.host')}
        ];

        $rootScope.historyPageId = $rootScope.historyPageId || [];
        $rootScope.$on('$stateChangeSuccess', function parseLastPage(event, toState, toParams, fromState, fromParams) {
            $rootScope.historyPageId.push({
                toRouteName: toState.name,
                toParams: toParams
            });
        });

        //Todo  这里tag设定可能会有问题，需要反复测试
        $scope.$on("createFlow", function (event, data) {
            that._options = data;
            that.isInstance = false;
            onInit();
        });

        $scope.$on("editFlow", function (event, data) {
            that._options = data;
            that.isInstance = false;
            onInit();
        });

        $scope.$on("runFlow", function (event, data) {
            that._options = data;
            that.isInstance = true;
            onInit();
        });

        function initFileConfig() {
            if (that.hostScope === 'step') {
                that.fileModelConverter = {
                    type: 'attrmap',
                    //groups: [{"group":"group", "hosts":[{key:key,value:value,asset_type:asset_type}], "group_vars": group_vars}]
                    attrmap: {
                        'location': 'path',
                        'argline': 'config',
                        'tag': 'tag'
                    },
                    groups: [],
                    modelType: 'map',
                    hostGroup: true //Todo 此参数可以删除，需测试
                };
            }
        }

        function onInit() {
            //初始化file component
            initFileConfig();
            var flowId = undefined;
            var flowIdEx = that._options.flowTemplate;
            if (flowIdEx) {
                flowId = parseFlowId(flowIdEx);
            }
            if (!flowId) {
                var step = newScriptStep(1);
                that.theFlow = {
                    appletCode: that._options.appletCode,
                    globalParams: [],
                    steps: [step],
                    hosts: []
                };
                that.stepFoldList[0] = false;
                ensureGlobalParams();
            } else {
                jaoFlowService.findFlowById(flowId).then(function (flow) {
                    flow.steps.forEach(function (step) {
                        step.config = JSON.parse(step.configJson);
                        if (step.config) {
                            var verbosity = step.config.verbosity;
                            step.config.verbosity = verbosity ? verbosity : "0";
                            // step.config.verbosity = verbosity === 1;
                        }
                        that.stepFoldList.push(!that.isInstance);
                    });
                    if (flow.globalParams) {
                        flow.globalParamsJson = JSON.stringify(flow.globalParams);
                    } else {
                        flow.globalParams = undefined;
                        flow.globalParamsJson = undefined;
                    }
                    that.theFlow = flow;
                    ensureGlobalParams();
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant('jao.messages.cannot_get_flow'), err.message);
                });

            }
        }

        function parseFlowId(initval) {
            //Todo 判断传入的变量类型。
            var valueObj = pageDataUtil.getPageScopeValues($scope);
            return dataEx.evalVarExpr(initval, valueObj);
        }

        function newTask() {
            var task = {};
            var scripts = [];
            var groups = [];
            task.scripts = scripts;
            task.groups = groups;
            return task;
        }

        function newScriptStep(index) {
            var step_new = {};
            step_new.name = "步骤" + index;
            step_new.type = "script";
            step_new.flowId = that.flowId;
            step_new.autoNext = true;
            if (that.hostScope && that.hostScope === 'step') {
                step_new.config = {tasks: [{scripts: [], groups: []}], verbosity: "0", taskTimeout: 0};
            } else {
                step_new.config = {tasks: [{scripts: []}], verbosity: "0", taskTimeout: 0};
            }
            return step_new;
        }

        function addStep() {
            that.theFlow.steps.push(newScriptStep(that.theFlow.steps.length + 1));
            that.stepFoldList[that.theFlow.steps.length] = false;
        }

        function addTask(index) {
            that.theFlow.steps[index].config.tasks.push(newTask());
        }

        function removeTask(stepIndex, index) {
            that.theFlow.steps[stepIndex].config.tasks.splice(index, 1);
        }

        function removeStep(index) {
            that.theFlow.steps.splice(index, 1);
            that.stepFoldList.splice(index, 1);
        }

        function changeStepFold() {
            that.isFoldAllSteps = !that.isFoldAllSteps;
            for (var i = 0; i < that.stepFoldList.length; i++) {
                that.stepFoldList[i] = that.isFoldAllSteps;
            }
        }

        function toggleParams() {
            that.isParamsCollapsed = !that.isParamsCollapsed;
        }

        function ensureGlobalParams() {
            if (!that.theFlow) {
                that.theFlow = {};
            }
            if (!Array.isArray(that.theFlow.globalParams)) {
                that.theFlow.globalParams = [];
            }
            that.theFlow.globalParams.forEach(function (param) {
                if (!param) {
                    return;
                }
                if (typeof param.secret === 'undefined') {
                    param.secret = false;
                }
                if (typeof param.defaultValue === 'undefined') {
                    param.defaultValue = '';
                }
                if (typeof param.label === 'undefined') {
                    param.label = '';
                }
                if (typeof param.description === 'undefined') {
                    param.description = '';
                }
                if (typeof param.type === 'undefined') {
                    param.type = null;
                }
                if (typeof param.name === 'string') {
                    param.name = param.name.trim();
                }
            });
        }

        function addParam() {
            ensureGlobalParams();
            that.theFlow.globalParams.push({name: '', label: '', description: '', defaultValue: '', type: null, secret: false});
        }

        function deleteParam(param) {
            ensureGlobalParams();
            var index = that.theFlow.globalParams.indexOf(param);
            if (index > -1) {
                that.theFlow.globalParams.splice(index, 1);
            }
        }

        function addParamAuto() {
            ensureGlobalParams();
            var paramList = [];
            if (Array.isArray(that.theFlow.steps)) {
                that.theFlow.steps.forEach(function (step) {
                    if (step && step.config && Array.isArray(step.config.tasks)) {
                        step.config.tasks.forEach(function (task) {
                            if (task && Array.isArray(task.scripts)) {
                                task.scripts.forEach(function (script) {
                                    var args = script ? script.argline : undefined;
                                    if (!args && script && script.config) {
                                        args = script.config;
                                    }
                                    getParamList(args).forEach(function (item) {
                                        var name = (item || '').trim();
                                        if (name && paramList.indexOf(name) === -1) {
                                            paramList.push(name);
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
            that.theFlow.globalParams.forEach(function (param) {
                var existing = param && param.name ? ('' + param.name).trim() : '';
                var idx = existing ? paramList.indexOf(existing) : -1;
                if (idx > -1) {
                    paramList.splice(idx, 1);
                }
            });
            paramList.forEach(function (param) {
                if (!param) {
                    return;
                }
                that.theFlow.globalParams.push({name: param, label: '', description: '', defaultValue: '', type: null, secret: false});
            });
        }

        function getParamList(source) {
            var parsed = [];
            var str = source;
            while (str) {
                var start = str.indexOf('${');
                if (start < 0) {
                    break;
                }
                str = str.substring(start + 2);
                var endIndex = str.indexOf('}');
                if (endIndex < 0) {
                    break;
                }
                parsed.push(str.substring(0, endIndex));
                str = str.substring(endIndex + 1);
            }
            return parsed;
        }

        function startFlow() {
            for (var i in that.theFlow.steps) {
                var step = that.theFlow.steps[i];
                if (step.config.tasks[0].scripts.length === 0) {
                    messageService.toast('error', $translate.instant('common.messages.operation.failed'), $translate.instant('jao.messages.not_select_script', {step: step.name}));
                    return;
                }
            }
            var instance = JSON.parse(JSON.stringify(that.theFlow));
            instance.steps.forEach(function (step) {
                var verbosity = step.config.verbosity;
                step.config.verbosity = verbosity ? verbosity : "0";
                step.id = undefined;
            });

            if (instance.globalParams) {
                instance.globalParamsJson = JSON.stringify(instance.globalParams);
            } else {
                instance.globalParams = undefined;
                instance.globalParamsJson = undefined;
            }

            instance.jobFlowId = instance.id;
            instance.id = undefined;

            messageService.confirmDanger(
                $translate.instant('udp.w.flow.manager.run'),
                $translate.instant('common.messages.operation.body', {
                    operation: $translate.instant('jao.common.run'),
                    obj: $translate.instant('jao.common.flow')
                }),
                function () {
                    jaoFlowService.createInstance(instance).then(function (result) {
                        $scope.$emit("startFlow", that.theFlow);
                    }).catch(function (err) {
                        messageService.toast('error', $translate.instant('common.messages.operation.failed', {operation: $translate.instant('jao.common.run')}), err.message);
                        $state.reload();
                    });
                },
                null,
                $translate.instant('common.messages.operation.ok_label', {operation: $translate.instant('jao.common.run')}));
        }

        function save() {
            if (that.theFlow.hosts.length === 0 && that.hostScope !== "step") {
                messageService.toast('error', $translate.instant('common.messages.operation.failed'), $translate.instant('jao.messages.not_select_host'));
                return null;
            }

            for (var i in that.theFlow.steps) {
                var step = that.theFlow.steps[i];
                var tasks = step.config.tasks;
                if (tasks.length > 0) {
                    for (var j in tasks) {
                        var task = tasks[j];
                        if (task.scripts.length === 0) {
                            messageService.toast('error', $translate.instant('common.messages.operation.failed'), $translate.instant('jao.messages.not_select_script', {step: step.name}));
                            return null;
                        }
                    }
                }
            }
            var flow = JSON.parse(JSON.stringify(that.theFlow));
            flow.steps.forEach(function (step) {
                var verbosity = step.config.verbosity;
                step.config.verbosity = verbosity ? verbosity : "0";
                step.configJson = JSON.stringify(step.config);
                step.config = undefined;
            });
            if (flow.globalParams) {
                flow.globalParamsJson = JSON.stringify(flow.globalParams);
            } else {
                flow.globalParams = undefined;
                flow.globalParamsJson = undefined;
            }
            jaoFlowService.saveFlow(flow).then(function (result) {
                //Todo 刷新浏览器后会出现问题，BUG待修复
                // set linke source.
                // if ($rootScope.historyPageId.length >= 2) {
                //     $rootScope.historyPageId.pop();
                //     var history1 = $rootScope.historyPageId.pop(); // 移除并获取上一个页面记录
                //     $state.go(history1.toRouteName, history1.toParams.pageId);
                // } else {
                //     window.history.go(-1);
                // }
                if ($scope.$parent.createOptions) {
                    $scope.$parent.$parent.$ctrl.addTag = false;
                    $scope.$parent.$parent.$ctrl.$onInit();
                } else {
                    window.history.go(-1);
                }
                messageService.toast("success", $translate.instant('common.messages.operation.success', {operation: $translate.instant('common.entity.action.save')}));
            }).catch(function (err) {
                messageService.toast('error', $translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.save')}), err.message);
            });
        }

        function cancel() {
            //Todo set link source .
            if ($scope.$parent.createOptions) {
                $scope.$parent.$parent.$ctrl.addTag = false;
                $scope.$parent.$parent.$ctrl.editTag = false;
                $scope.$parent.$parent.$ctrl.runTag = false;
                $scope.$parent.$parent.$ctrl.$onInit();
            } else {
                window.history.go(-1);
            }
        }
    }
})();
