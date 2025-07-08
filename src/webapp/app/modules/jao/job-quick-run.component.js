/**
 * @author luohuanjiang created on 2021-04-28
 */
(function () {
    'use strict';

    /**
     Component routing jaoJobQuickRun
     */
    angular.module('oplus.jao').component('jaoJobQuickRun', {
        templateUrl: 'app/modules/jao/job-quick-run.html',
        controller: ['$scope', '$compile', 'messageService', '$uibModal', 'jaoJobService', 'jaoDemo', '$translate', JobQuickRunCtl],
        bindings: {
            jobId: '<',
            jobConfig: '<',
            // options: {
            //      approveParams: [{ name: '', value: '' }, ...]
            // }
            options: '<',
            // '' --- 正常执行
            // 'approveLimitParams' --- 作业审批限制参数模式执行
            runType: '<',
            dismiss: '&'
        }
    });

    /**
     * Used with component.
     * @param $scope
     * @param $compile
     * @param {messageService} messageService
     * @param $uibModal
     * @param {jaoJobService} jaoJobService
     * @param {jaoDemo} jaoDemo
     */
    function JobQuickRunCtl($scope, $compile, messageService, $uibModal, jaoJobService, jaoDemo, $translate) {
        var that = this;

        that.runType = that.runType || '';

        $scope.$watch('$ctrl.jobId', function (newVal, oldVal) {
            if (newVal) jobIdQueryData(newVal);
        });

        // $scope.$watch('$ctrl.jobConfig', function (newVal, oldVal) {
        //     if (newVal) console.log("数据", that.jobConfig);
        // });

        //通过jobId获取到对应的job信息
        function jobIdQueryData(id) {
            jaoJobService.findJobById(id).then(function (job) {
                that.job = job;
                that.params = job.params;

                // 作业审批中执行 (限定参数执行)
                if (that.runType && that.runType === 'approveLimitParams') {
                    // approveParams: [{ name: '', value: '' }, ...]
                    var approvedParams = that.options.approveParams || undefined;
                    if (approvedParams) {
                        approvedParams.forEach(function (item) {
                            var param = that.params.find(function (f) { return (f.label || f.name) === item.name });
                            if (param) param.defaultValue = item.value;
                        })
                    }
                }

                var configJson = that.job.configJson;
                that.jobConfig = JSON.parse(configJson || '{}');
                if (!angular.isObject(that.jobConfig)) {
                    throw new FatalError($translate.instant('jao.messages.not_json', { configJson: configJson }));
                }
                $('#js-param-list').append(paramsToCtrls(that.params));
            }).catch(function (err) {
                messageService.toast('error', $translate.instant('jao.messages.unable_obtain_job_info'), err.message);
            });
        }

        function paramsToCtrls(params) {
            var ctrls = $('<div></div>');
            params.forEach(function (param) {
                var item = $('<udp-input></udp-input>');
                item.attr({
                    'label': param.label || param.name,
                    'showlabel': true,
                    'desc': '<span class="badge bg-secondary">' + param.name + '</span> ' + param.description,
                    'showdesc': true,
                    'ng-model': 'param.defaultValue',
                    'disabled': that.runType === 'approveLimitParams'
                }).appendTo(ctrls);
            });
            return $compile(ctrls)($scope);
        }

        this.runJobJao = function () {
            // if (that.job.id === '0EXrwm' || that.job.id==='ZQGmPy') {
            //     jaoDemo.demoRunProcess(that.job.id);
            //     return;
            // }
            var jobRequest = {
                jobId: that.job.id,
                type: that.job.type,
                configJson: that.job.configJson,
                options: {
                    secretParams: [],
                    params: {}
                }
            };
            that.runResult = undefined;
            that.params.forEach(function (param) {
                jobRequest.options.params[param.name] = param.defaultValue;
                if (param.secret === true) {
                    jobRequest.options.secretParams.push(param.name);
                }
            });
            var promise = jaoJobService.runJob(jobRequest, null, setRunStatus, "RUNNING", !(that.runType === 'approveLimitParams'));
            jaoJobService.checkJobResult(promise, fnHandleResult, '#js-job-quick-run');
            
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
                }

                if (res) {
                    if (angular.isObject(res)) {
                        // var resultStatus = jaoJobService.parseResultStatus(res);
                        setRunStatus(res.status);
                        that.runResult = res;
                        that.runId = that.runResult.runId;
                    }
                    else if (res === 'closeModal')
                        that.dismiss();
                }
            }
        };

        function setRunStatus(status) {
            that.jobStatus = jaoJobService.getRunStatusDef(status);
            if (!that.jobStatus) {
                throw new Error('ProgramError: Unsupported job run status "' + status + '"');
            }
            that.jobInRunningState = status === 'RUNNING';
        }

        this.viewRunResult = function (runId) {
            jaoJobService.viewJobRunResult(runId);
        }

        //this.params = angular.copy(that.jobId.params);*///引用angularJS自带深拷贝

    }
})();