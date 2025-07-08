/**
 *
 * @author chenrongji, created on 2020-2-20
 */
(function () {
    'use strict';

    angular.module('oplus.jao').controller('jaoJobEditCtrl', JaoJobEditCtrl);

    JaoJobEditCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$uibModal', 'messageService', 'jaoJobService', '$stateParams', '$translate'];

    /**
     *
     * @param $scope
     * @param $rootScope
     * @param $state
     * @param $timeout
     * @param $uibModal
     * @param {messageService} messageService
     * @param {jaoJobService} jaoJobService
     * @param $stateParams
     * @constructor
     */
    function JaoJobEditCtrl($scope, $rootScope, $state, $timeout, $uibModal, messageService, jaoJobService, $stateParams, $translate) {
        var that = this;
        this.jobConfig = {};
        this.tags = [
            $translate.instant('jao.job.tags.0'),
            $translate.instant('jao.job.tags.1'),
            $translate.instant('jao.job.tags.2'),
            $translate.instant('jao.job.tags.3'),
            $translate.instant('jao.job.tags.4'),
            $translate.instant('jao.job.tags.5'),
            $translate.instant('jao.job.tags.6'),
            $translate.instant('jao.job.tags.7'),
            $translate.instant('jao.job.tags.8'),
        ];
        this.paramTypeList = [
            {type: 'string', title: $translate.instant('common.entity.variable.string')},
            {type: 'string_pwd', title: $translate.instant('common.entity.variable.string_pwd')},
            {type: 'number', title: $translate.instant('common.entity.variable.number')},
            {type: 'date', title: $translate.instant('common.entity.variable.date')},
            {type: 'boolean', title: $translate.instant('common.entity.variable.boolean')},
            {type: 'array', title: $translate.instant('common.entity.variable.array')},
            {type: 'host', title: $translate.instant('common.entity.variable.host')}
        ];
        this.runResult = null;
        this.deleteParam = deleteParam;
        this.checkCode = checkCode;
        this.addParam = addParam;
        this.save = save;
        this.addParamAuto = addParamAuto;
        this.runJob = runJob;
        this.editJob = editJob;
        this.deleteJob = deleteJob;
        this.$onInit = onInit;
        this.viewRunResult = viewRunResult;
        this.cancel = cancel;
        this.listRunLogs = listRunLogs;
        this.jobConfigInterceptor = {};
        //页面为view状态，则页面不可点击编辑
        //TODO: need refactor these or `||`
        this.isEditMode = $state.current.name === 'app.jao.job_list.job_edit' || $state.current.name === 'app.jao.job_list.job_new'
            // || $state.current.name === 'app.jao.job_new' || $state.current.name === 'app.jao.job_edit'
            || $state.current.name === 'app.appman.job.edit' || $state.current.name === 'app.appman.job.create';
        this.pagePermission = this.isEditMode ? 'jao:edit:*' : 'jao:view:*';
        if (this.isEditMode) {
            $scope.$watch('$ctrl.job.params', function (newVal, oldVal) {
                if (!that.job || !that.job.id) {
                    return;
                }
                var params = {};
                if (angular.isArray(newVal)) {
                    newVal.forEach(function (param) {
                        params[param.name] = param.defaultValue || '';
                    });
                }
                that.apiCurl = 'curl -X POST http://{oplus-url}/api/jao/jobs/' + that.job.id + '/run' +
                    ' -d \'' + angular.toJson({params: params}) + '\'' +
                    ' -H \'Content-Type:application/json;charset=UTF-8\'';
            });
        }

        function editJob() {
            $state.go('app.jao.job_list.job_edit', {id: that.job.id, status: 'edit'});
        }

        function cancel() {
            if (that.job.appletCode) {
                history.go(-1);
            }
            if (that.job.id) {
                $state.go('app.appman.job.view', {id: that.job.id});
            } else {
                $state.go('app.appman.job');
            }
        }

        function deleteJob() {
            messageService.confirmDanger(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('common.messages.operation.body', {
                    operation: $translate.instant('common.entity.action.delete'),
                    obj: $translate.instant('jao.common.job')
                }),
                function () {
                    jaoJobService.deleteJob(that.job.id).then(function () {
                        $state.go('app.jao.job_list_v2', {type: that.job.type}, {reload: true});
                    });
                },
                $translate.instant('common.messages.operation.ok_label', {operation: $translate.instant('common.entity.action.delete')}));
        }

        function onInit() {
            var jobId = $stateParams.id;
            console.log($stateParams);
            if (!jobId) {
                that.job = {
                    params: [],
                    type: $stateParams.type,
                    appletCode: $stateParams.appletCode ? $stateParams.appletCode : ''
                };
            } else {
                jaoJobService.findJobById(jobId).then(function (job) {
                    that.job = job;
                    var configJson = that.job.configJson;
                    that.jobConfig = JSON.parse(configJson || '{}');
                    if (!angular.isObject(that.jobConfig)) {
                        throw new FatalError($translate.instant('jao.messages.not_json', {configJson: configJson}));
                    }

                    // 如果是 AAP Template 并且已经定义 每次去拉详情
                    if (that.jobConfig.scriptType === "template" && 
                        that.jobConfig.tasks && that.jobConfig.tasks.length > 0 &&
                        that.jobConfig.tasks[0].template && that.jobConfig.tasks[0].template.id) {
                            jaoJobService.finAapTemplateById(that.jobConfig.tasks[0].template.id).then(function(template) {
                                that.jobConfig.tasks[0].template = template;
                            })
                        }
                        
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant('jao.messages.unable_obtain_job_info'), err.message);
                });
            }
            // $scope.$watch('$ctrl.jobConfig', function (newVal, oldVal) {
            //     if (newVal === oldVal) {
            //         return;
            //     }
            //     // // 20201113: Use angular.toJson instead of JSON.stringify to remove $$hashKey
            //     // // https://stackoverflow.com/questions/18826320/what-is-the-hashkey-added-to-my-json-stringify-result
            //     // that.job.configJson = angular.toJson(newVal);
            // }, true);
        }

        function listRunLogs() {
            jaoJobService.findBriefLogsByJobId(that.job.id).then(function (data) {
                that.runLogs = data;
            }).catch(function (err) {
                throw err;
            });
        }

        function isAsyncJob() {
            return that.job.type === 'script';
        }

        function setRunStatus(status) {
            that.jobStatus = jaoJobService.getRunStatusDef(status);
            if (!that.jobStatus) {
                throw new Error('ProgramError: Unsupported job run status "' + status + '"');
            }
            that.jobInRunning = status === 'RUNNING';
        }

        function toConfigJson() {
            // 20201113: Use angular.toJson instead of JSON.stringify to remove $$hashKey
            // https://stackoverflow.com/questions/18826320/what-is-the-hashkey-added-to-my-json-stringify-result
            return angular.toJson(that.jobConfig);
        }

        function runJob() {
            console.log("run job " + that.job.id);
            //TODO: simplify jobReqeust attrs.
            var jobRequest = {
                jobId: that.job.id,
                type: that.job.type,
                configJson: toConfigJson(),
                options: {
                    secretParams: [],
                    params: {}
                }
            };
            setRunStatus('RUNNING');
            that.runResult = undefined;
            that.job.params.forEach(function (param) {
                jobRequest.options.params[param.name] = param.defaultValue;
                if (param.secret === true) {
                    jobRequest.options.secretParams.push(param.name);
                }
            });
            var promise = jaoJobService.runJob(jobRequest, null);
            jaoJobService.checkJobResult(promise, fnHandleResult, '#js-job-edit-' + (jobRequest.jobId || 'new'));

            function fnHandleResult(res, err) {
                if (err) {
                    that.runResult = err._errorData;
                    if (that.runResult) {
                        setRunStatus(that.runResult.status);
                        that.runId = that.runResult.runId;
                    } else {
                        setRunStatus("ERROR");
                    }
                    messageService.alertError($translate.instant('jao.messages.run_error'), err.message);
                } else {
                    // var resultStatus = jaoJobService.parseResultStatus(res);
                    setRunStatus(res.status);
                    that.runResult = res;
                    that.runId = that.runResult.runId;
                }
            }
        }

        function addParam() {
            that.job.params.push({name: "", label: "", description: null, type: null, defaultValue: ""});
        }

        function addParamAuto() {
            var paramList = [];
            var jobConfigInterceptor = that.jobConfigInterceptor;
            if (jobConfigInterceptor && angular.isFunction(jobConfigInterceptor.parseParams)) {
                paramList = jobConfigInterceptor.parseParams(that.jobConfig);
            }
            that.job.params.forEach(function (param) {
                if (paramList.indexOf(param.name) > -1) {
                    paramList.splice(paramList.indexOf(param.name), 1);
                }
            });
            paramList.forEach(function (param) {
                that.job.params.push({"name": param});
            })
        }

        function checkCode() {
            var regex = /^[a-z][\_a-z0-9\-]*$/;
            var oldCode = that.job.code + "";
            if (regex.test(that.job.code || that.job.code == "")) {
                oldCode = that.job.code;
            } else {
                that.job.code = oldCode;
            }
        }

        function save() {
            var jobConfigInterceptor = that.jobConfigInterceptor;
            if (jobConfigInterceptor && angular.isFunction(jobConfigInterceptor.onPresave)) {
                jobConfigInterceptor.onPresave(that.jobConfig);
            }
            that.job.configJson = toConfigJson();

            jaoJobService.saveJob(that.job).then(function (result) {
                // $state.go('app.jao.job_list.job_edit',
                // $state.go('app.jao.job_list_v2',
                //     {type: that.job.type, id: (that.job.id || result.id)},
                //     {reload: true}
                // );
                messageService.toast("success", $translate.instant('common.messages.operation.success', {operation: $translate.instant('common.entity.action.save')}));
                // $state.go('app.jao.job_list_v2', null, {reload: true});
                if (!that.job.id) {
                    $state.go('app.appman.job.edit', {id: result.id});
                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.save')}), err.message);
            });
        }

        function deleteParam(param) {
            that.job.params.splice(that.job.params.indexOf(param), 1);
        }

        function viewRunResult(runId) {
            jaoJobService.viewJobRunResult(runId);
        }
    }
})();
