/**
 *
 * @author chenrongji, created on 2021-2-20
 */
(function () {
    'use strict';

    angular.module('oplus.jao').controller('jaoFlowEditCtrl', JaoFlowEditCtrl);

    JaoFlowEditCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$uibModal', 'messageService', 'jaoFlowService', '$stateParams', '$translate'];

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
    function JaoFlowEditCtrl($scope, $rootScope, $state, $timeout, $uibModal, messageService, jaoFlowService, $stateParams, $translate) {
        var that = this;
        that.deleteParam = deleteParam;
        that.addParam = addParam;
        that.save = save;
        that.addStep = addStep;
        that.addParamAuto = addParamAuto;
        that.$onInit = onInit;
        that.startFlow = startFlow;
        that.removeStep = removeStep;
        that.cancel = cancel;
        that.stepFoldList = [];
        that.changeStepFold = changeStepFold;
        that.isFoldAllSteps = true;
        that.fileSelectorConfig = {
            repoType: 'git',
            viewMode: 'dialog',
            multipleSelect: false,
            showFileConfig: true,
            verbosity: "0"
        };
        //页面为view状态，则页面不可点击编辑
        that.isInstance = $state.current.name === 'app.jao.flow_list.instance';
        that.isRunStep = $state.current.name === 'app.jao.flow_list.step_run';
        that.pagePermission = that.isEditMode ? 'jao:job-edit:*' : '';
        function cancel() {
            $state.go('app.jao.flow_list');
        }

        function changeStepFold() {
            that.isFoldAllSteps = !that.isFoldAllSteps;
            for (var i = 0; i < that.stepFoldList.length; i++) {
                that.stepFoldList[i] = that.isFoldAllSteps;
            }
        }

        function addStep() {
            that.flow.steps.push(newScriptStep(that.flow.steps.length + 1));
            that.stepFoldList[that.flow.steps.length] = false;
        }

        function removeStep(index) {
            that.flow.steps.splice(index, 1);
            that.stepFoldList.splice(index, 1);
        }

        function newScriptStep(index) {
            var step = {};
            step.name = $translate.instant('jao.flow.detail.step') + index;
            step.type = "script";
            step.flowId = that.id;
            step.autoNext = true;
            step.config = {tasks: [{scripts: []}], verbosity: "0", taskTimeout: 0};
            return step;
        }

        function onInit() {
            var flowId = $stateParams.id;
            if (!flowId) {
                var step = newScriptStep(1);
                that.flow = {
                    globalParams: [],
                    steps: [step],
                    hosts: []
                };
                that.stepFoldList[0] = false;
            } else if (that.isRunStep) {
                jaoFlowService.findInstanceById(flowId).then(function (flow) {
                    for (var i = 0; i < flow.steps.length; i++) {
                        that.stepFoldList.push(false);
                    }
                    that.flow = flow;
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant('jao.messages.cannot_get_flow_instance'), err.message);
                })
            } else {
                jaoFlowService.findFlowById(flowId).then(function (flow) {
                    flow.steps.forEach(function (step) {
                        step.config = JSON.parse(step.configJson);
                        that.stepFoldList.push(!that.isInstance);
                    });
                    flow.globalParams = JSON.parse(flow.globalParamsJson);
                    that.flow = flow;
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant('jao.messages.cannot_get_flow'), err.message);
                });
            }
        }

        function startFlow() {
            for (var i in that.flow.steps) {
                var step = that.flow.steps[i];
                if (step.config.tasks[0].scripts.length === 0) {
                    messageService.toast('error', $translate.instant('common.messages.operation.failed'), $translate.instant('jao.messages.not_select_script', {step: step.name}));
                    return null;
                }
            }
            var instance = JSON.parse(JSON.stringify(that.flow));
            instance.steps.forEach(function (step) {
                var verbosity = step.config.verbosity;
                step.config.verbosity = verbosity ? verbosity : "0";
                step.id = undefined;
            });
            instance.globalParamsJson = JSON.stringify(instance.globalParams);
            instance.globalParams = undefined;
            instance.jobFlowId = instance.id;
            instance.id = undefined;
            jaoFlowService.createInstance(instance).then(function (result) {
                $state.go("app.jao.flow_list.instance_view", {id: result.id});
            }).catch(function (err) {
                messageService.toast('error', $translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.save')}), err.message());
                $state.reload();
            })
        }

        function addParam() {
            that.flow.globalParams.push({name: "", label: "", description: null, type: null, defaultValue: ""});
        }

        function addParamAuto() {
            //TODO:暂不考虑脚本作业步骤
            var paramList = [];
            that.flow.steps.forEach(function (step) {
                step.config.tasks[0].scripts.forEach(function (script) {
                    var tmpList = getParamList(script.argline);
                    tmpList.forEach(function (item) {
                        if (paramList.indexOf(item) === -1) {
                            paramList.push(item);
                        }
                    });
                    // paramList = paramList.concat(getParamList(script.argline));
                });
            });
            that.flow.globalParams.forEach(function (param) {
                if (paramList.indexOf(param.name) > -1) {
                    paramList.splice(paramList.indexOf(param.name), 1);
                }
            });
            paramList.forEach(function (param) {
                that.flow.globalParams.push({"name": param});
            })
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

        function save() {
            if (that.flow.hosts.length === 0) {
                messageService.toast('error', $translate.instant('common.messages.operation.failed'), $translate.instant('jao.messages.not_select_host'));
                return null;
            }
            for (var i in that.flow.steps) {
                var step = that.flow.steps[i];
                if (step.config.tasks[0].scripts.length === 0) {
                    messageService.toast('error', $translate.instant('common.messages.operation.failed'), $translate.instant('jao.messages.not_select_script', {step: step.name}));
                    return null;
                }
            }
            var flow = JSON.parse(JSON.stringify(that.flow));
            flow.steps.forEach(function (step) {
                var verbosity = step.config.verbosity;
                step.config.verbosity = verbosity ? verbosity : "0";
                step.configJson = JSON.stringify(step.config);
                step.config = undefined;
            });
            flow.globalParamsJson = JSON.stringify(flow.globalParams);
            flow.globalParams = undefined;
            jaoFlowService.saveFlow(flow).then(function (result) {
                $state.go('app.jao.flow_list.flow_edit', {id: result.id}, {reload: true});
                messageService.toast("success", $translate.instant('common.messages.operation.success', {operation: $translate.instant('common.entity.action.save')}));
            }).catch(function (err) {
                messageService.toast('error', $translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.save')}), err.message());
            });
        }

        function createInstanct() {
            jaoFlowService.creatInstance(flow).then(function (result) {
                $state.go('app.jao.flow_list.instance_run');
            }).catch(function (err) {
                messageService.toast("error", $translate.instant('jao.messages.open_flow_failed'), err.message);
            });
        }

        function deleteParam(param) {
            that.flow.globalParams.splice(that.flow.globalParams.indexOf(param), 1);
        }
    }
})();
