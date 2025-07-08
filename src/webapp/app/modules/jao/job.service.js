/**
 *
 * @author chenrongji, created on 2020-2-20
 */
(function () {
    'use strict';

    angular.module('oplus.jao').service('jaoJobService', jaoJobService);
    angular.module('oplus.commons').run(['customFunctions', 'jaoJobService', function (cf, jaoJobService) {
        cf.defineFunction('runJobWait', {
            func: function (jobId, params, ele, resultCallback, runJobCallback) {
                return jaoJobService.executeJob({
                    code: jobId,
                    evalObject: true,
                    params: params
                }, null, {}, $(ele)).then(resultCallback, undefined, runJobCallback);
            },
            group: 'data',
            sample: 'runJobWait(' +
                '"job12345",' +
                '{callId:"pms-1",params:{server:"server1"}},' +
                'element' +
                'function(res){' +
                '  return res.data;' +
                '}' +
                ')'
        });
    }]);


    jaoJobService.$inject = ['$q', '$http', '$interval', '$uibModal', '$state', 'restUtils', 'jaoUtil', 'dataEx', 'messageService', 'modalHelper', 'uaaUserService', '$translate'];

    /**
     * @ngdoc service
     * @name jaoJobService
     * @param {$q} $q
     * @param {$http} $http
     * @param {$interval} $interval
     * @param {$uibModal} $uibModal
     * @param {$state} $state
     * @param {restUtils} restUtils
     * @param {jaoUtil} jaoUtil
     * @param {dataEx} dataEx
     * @param {messageService} messageService
     * @param {modalHelper} modalHelper
     */
    function jaoJobService($q, $http, $interval, $uibModal, $state, restUtils, jaoUtil, dataEx, messageService, modalHelper, uaaUserService, $translate) {
        var module = "jao";
        var that = this;
        this.findAllJobs = findAllJobs;
        this.findJobsByAppletCode = findJobsByAppletCode;
        this.findJobById = findJobById;
        this.saveJob = saveJob;
        this.deleteJob = deleteJob;
        this.batchDeleteJob = batchDeleteJob;
        this.gotoEditJob = gotoEditJob;
        this.copyJob = copyJob;

        // Run result
        this.findBriefLogsByJobId = findBriefLogsByJobId;
        this.ansibleProgress = ansibleProgress;
        this.getRunResult = getRunResult;
        this.getLastRunResult = getLastRunResult;
        this.viewJobRunResult = viewJobRunResult;
        this.getRunlogWebsocketUrl = getRunlogWebsocketUrl;
        this.getRunStatusDef = getRunStatusDef;
        // this.allRunStatusDefs = allRunStatusDefs;

        // Run job
        this.executeJob = runJobAndWaitResult;
        this.openRealtimeConsole = openRealtimeConsole;
        this.checkJobResult = checkJobResult;
        this.testScriptJob = testScriptJob;
        this.runJob = runJob;
        this.runCommands = runCommands;
        this.runConsoleCommand = runConsoleCommand;
        this.runAnyCommand = runAnyCommand;
        this.quickRunJob = quickRunJob;
        this.rerunJob = rerunJob;

        // Job Approve Services
        this.findMyApproveJobs = findMyApproveJobs;
        this.findApproveJobsByStatus = findApproveJobsByStatus;
        this.checkNeedApprove = checkNeedApprove;
        this.submitApprove = submitApprove;
        this.getScriptPath = getScriptPath;
        this.turningApprove = turningApprove;
        this.checkNeedApproveHandler = checkNeedApproveHandler;
        this.moveJob = moveJob;
        this.cleanLogs = cleanLogs;

        //job delayed
        this.setCron = setCron;

        //console log
        this.findAllConsoleLog = findAllConsoleLog;

        //aap template
        this.finAllAapTemplate = finAllAapTemplate;
        this.finAapTemplateById = finAapTemplateById;

        this.jobType = {SCRIPT: 'script', COMMAND: 'command', REST: 'rest', PROCESS: 'process'};

        var JOB_STATUS = jaoUtil.jobStatusDefs;

        restUtils.addErrorTranslator('jao', function (err) {
            if (err.message.indexOf('[NoHostError]') > 0) {
                err.message = $translate.instant('jao.messages.no_host_data');
            }
        });

        /**
         *
         * @param {object} config Either runId or content
         * @param {string=} config.runId
         * @param {string=} config.content
         */
        function openRealtimeConsole(config) {
            if (!config || (!config.runId && !config.content)) {
                throw new TypeError('ProgramError: openRealtimeConsole must specify runId or content');
            }
            var options = {
                resizable: true,
                specSize: {height: '60vh'}
            };
            var modalConfig = {
                modaless: true,
                size: 'md',
                template:
                    '<div class="modal-header">' +
                    '<h4 class="modal-title">Console</h4>' +
                    '<button type="button" class="btn-default opx-btn-flat opx-btn-icon op-close-window" ng-click="$ctrl.close()" data-dismiss="modal"><i class="far fa-times"></i></button>' +
                    '</div>' +
                    '<div class="modal-body p-2">' +
                    '<ansible-log-viewer run-id="$ctrl.runId" content="$ctrl.logContent" class="h-100"></ansible-log-viewer>' +
                    '</div>',
                controller: ['$scope', '$timeout', function ($scope, $timeout) {
                    var that = this;
                    this.runId = config.runId;
                    this.logContent = config.content;
                    this.close = function () {
                        modalInstance.dismiss();
                    };
                }],
                controllerAs: '$ctrl'
            };
            var modalInstance = modalHelper.openModal(modalConfig, options);
        }

        // function allRunStatusDefs() {
        //     return JOB_STATUS;
        // }

        function getRunStatusDef(status) {
            var s = status;
            if (!status) s = '';
            // if (status === 'FAILED') s = 'ERROR';
            var out = JOB_STATUS[s];
            if (!out) {
                throw new Error('ProgramError: Unknown run status "' + status + '"');
            }
            return out;
        }

        function getRunlogWebsocketUrl(runId) {
            var wsGateway = window.$oplus.appConfig.apiBaseUrls.ws;
            // 如果是 https对应调用 wss
            var wsUrl = "";
            if (wsGateway.match(/^https:\/\//)) {
                wsUrl = _.replace(wsGateway, /^https/, "wss");
            } else if (wsGateway.match(/^http:\/\//)) {
                wsUrl = _.replace(wsGateway, /^http/, "ws");
            } else {
                // 如果没有网关，默认走ws协议
                wsUrl = 'ws://' + window.location.hostname + _.replace(wsGateway, window.$oplus.appConfig.apiBaseUrls.url, "");
            }
            return wsUrl + '/log/' + runId;
        }

        function gotoEditJob(jobId, appletCode) {
            //TODO: type is hardcoded!
            // var url = $state.href('app.jao.job_edit', {id: jobId}, {absolute: true});

            var param = { id: jobId }
            if (appletCode) param['appletCode'] = appletCode;
            var url = $state.href('app.appman.job.edit', param, { absolute: true });
            window.open(url, '_blank');
        }

        /**
         *
         * TODO: return only id, title, code, params, description
         * @param {string=} type Job type
         * @returns {promise}
         */
        function findAllJobs(type, appletCode) {
            var path = '/api/jao/jobs';
            if (type) {
                path += '?type=' + type;
            }

            if (appletCode) path += path.includes('?') ? '&' : '?' + 'appletCode=' + appletCode;

            return restUtils.callApi(module, 'GET', path);
        }

        /**
         *
         * TODO: return only id, title, code, params, description
         * @param {string=} type Job type
         * @returns {promise}
         */
        function findJobsByAppletCode(type, appletCode) {
            var path = '/api/jao/jobs/app';
            if (type) {
                path += '?type=' + type;
            }
            if (appletCode) path += path.includes('?') ? '&' : '?' + 'appletCode=' + appletCode;
            return restUtils.callApi(module, 'GET', path);
        }


        function findAllConsoleLog() {
            return restUtils.callApi(module, 'GET', '/api/jao/console-log');
        }

        function finAllAapTemplate(page, size) {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/unified_job_templates/{page}/{size}', {page: page, size: size});
        }

        function finAapTemplateById(id) {
            return restUtils.callApi(module, 'GET', '/api/jao/aap/unified_job_templates/{id}/', {id: id});
        }

        function findJobById(id) {
            return restUtils.callApi(module, 'GET', '/api/jao/jobs/{id}', {id: id});
        }

        function deleteJob(id) {
            return restUtils.callApi(module, 'DELETE', '/api/jao/jobs/{id}', {id: id});
        }

        function batchDeleteJob(ids) {
            return restUtils.callApi(module, 'DELETE', '/api/jao/jobs/delete-batch?ids=' + ids);
        }

        /**
         *
         * @param job
         * @returns {promise}
         */
        function saveJob(job) {
            if (!job.id) {
                return restUtils.callApi(module, 'POST', '/api/jao/jobs', null, job);
            } else {
                return restUtils.callApi(module, 'PUT', '/api/jao/jobs/{id}', {id: job.id}, job);
            }
        }

        function copyJob(id) {
            return restUtils.callApi(module, 'GET', '/api/jao/jobs/clone/{id}', {id: id});
        }

        function testScriptJob(hosts, filepath, argline, params, verbosity) {
            var job = {
                params: params,
                verbosity: verbosity,
                // Use default engine configured in server side
                // engine: 'ansible',
                // scriptType: 'adhoc',
                // callback: '',
                tasks: [{
                    scripts: [{
                        location: filepath,
                        argline: argline
                    }],
                    hosts: hosts
                }]
            };
            return restUtils.callApi('jao', 'POST', '/api/jao/run/script', {}, job);
        }

        /**
         * Run a dynamic job by request
         * @param job Job request
         * @returns {promise}
         */
        function runJobByRequest(job) {
            return restUtils.callApi(module, 'POST', '/api/jao/run', null, job);
        }

        /**
         * Run any command on specified hosts
         * @param {string} command
         * @param {[{key:string,assetType:string,value:string}]} hosts
         * @return {Promise<{runId:string,status:string}>}
         */
        function runAnyCommand(command, hosts) {
            console.warn('TODO: NotImplemented')
        }

        /**
         * Run pre-defined commands on hosts
         * @param {{commands:[string],hosts:[{key:string,assetType:string,value:string}]}} request
         * @param {string[]} request.commands Command IDs
         * @return {Promise<{runId:string,status:string}>}
         */
        function runCommands(request) {
            var openConsole = true;
            var d = $q.defer();
            restUtils.callApi(module, 'POST', '/api/jao/run/command', null, request).then(function (data) {
                // if (openConsole) {
                //     openRealtimeConsole({runId: data.runId});
                // }
                d.resolve(data);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        function runConsoleCommand(request) {
            var openConsole = true;
            var d = $q.defer();
            restUtils.callApi(module, 'POST', '/api/jao/console-log/run', null, request).then(function (data) {
                if (openConsole) {
                    openRealtimeConsole({runId: data.runId});
                }
                d.resolve(data);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        /**
         *
         * @param id
         * @param options
         * @returns {Promise}
         */
        function runJobById(id, options) {
            return restUtils.callApi(module, 'POST', '/api/jao/jobs/{id}/run', {id: id}, options);
        }

        /**
         *
         * @param day clean day
         * @returns {Promise}
         */
        function cleanLogs(day) {
            return restUtils.callApi(module, 'POST', '/api/jao/jobs/runlogs/clean/{day}', {day: day});
        }

        /**
         *
         * @param {string} jobId Job ID
         * @param {object} params Job params
         * @returns {Promise}
         */
        function runJobWithUpload(jobId, params) {
            var url = restUtils.getApiUrl(module, '/api/jao/jobs/{jobId}/upload-to-run', {jobId: jobId});
            return restUtils.callUpload(url, params);
        }

        /**
         * Open a modal to run job
         * @param {string|object} job
         */
        function quickRunJob(job, runType, options) {

            var instance = $uibModal.open({
                template: '<div class="modal-header">' +
                    '<h3 class="modal-title">{{\'jao.job.run\' | translate}}</h3>' +
                    '<button type="button" class="btn-close" data-dismiss="modal" ng-click="$ctrl.cancel()"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<jao-job-quick-run job-id="$ctrl.jobId" job-config="$ctrl.jobConfig" options="$ctrl.options" run-type="$ctrl.runType" dismiss="$ctrl.cancel()"></jao-job-quick-run>' +
                    '</div>',
                controller: ['$scope', function ($scope) {
                    this.runType = runType || '';
                    this.options = options || undefined;

                    this.cancel = function () {
                        instance.dismiss();
                    }
                    if (angular.isString(job)) {
                        this.jobId = job;
                    } else if (angular.isObject(job)) {
                        this.jobConfig = job;
                    }

                }],
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'lg'
            });
        }

        /**
         * Run a job and check result at intervals.
         * @param {string|object} job A job ID string or job request object. If a request object, it will call runJobByRequest.
         * @param {object=} params Used with job ID.
         * @param fnHandler
         * @param fnHandlerParams
         * @param needApprove
         * @return {promise<{runId:string, status:string}|Error>} A promise of immediate job run result.
         */
        function runJob(job, params, fnHandler, fnHandlerParams, needApprove) {
            console.log('runJob: job=%o', job);
            if (needApprove === undefined) needApprove = true;
            var jobId = angular.isString(job) ? job : job.jobId;
            if (jobId) {
                var promise = findJobById(jobId)
                    .then(function (result) {
                        if (result.needApprove && needApprove) {
                            return that.checkNeedApproveHandler(result, params || job.options.params).then(function (res) {
                                if (res === 'run') {
                                    if (fnHandler instanceof Function) fnHandler(fnHandlerParams);
                                    if (result.needDelayed) {
                                        return delayedRun(result, params);
                                    }
                                    return run();
                                } else if (res === 'closeModal')
                                    return new Promise(function (resolve) {
                                        resolve(res)
                                    })
                            })
                        }

                        if (result.needReview) {
                            console.log("current job need review");
                            return uaaUserService.openUserDoubleReviewDialog().then(function (data) {
                                if (fnHandler instanceof Function) fnHandler(fnHandlerParams);
                                // 复核人账号 = data.reviewUser = login_user
                                // job.reviewUser =
                                if (angular.isString(job)) {
                                    params.reviewUser = data.reviewUser
                                } else {
                                    job.reviewUser = data.reviewUser
                                }
                                if (result.needDelayed) {
                                    return delayedRun(result, params);
                                }
                                return run();
                            })
                        }

                        if (result.needDelayed) {
                            return delayedRun(result, params);
                        }

                        return run();
                        // return checkJobNeedReview(result.needReview)
                    });
                // .then(function(){
                //     console.log("current job need review");
                //     return uaaUserService.openUserDoubleReviewDialog().then(function(){
                //         return run();
                //     })
                // },function(){
                //     console.log("current job not need review");
                //     return run();
                // });
                return promise;
            } else {
                return run();
            }

            function delayedRun(result, params) {
                return that.setCron(result, params || job.options.params).then(function (res) {
                    if (res === 'now') {
                        return run();
                    } else {
                        return new Promise(function (resolve) {
                            resolve(res)
                        })
                    }
                })
            }

            /**
             * Run by
             * - jobId and upload
             * - jobId and params
             * - jobRequest
             * @return {promise|Promise}
             */
            function run() {
                var promise;
                if (angular.isString(job)) {
                    // var jobId = job;
                    var isMultipart = restUtils.containsMultipart(params);
                    if (isMultipart) {
                        promise = runJobWithUpload(jobId, params);
                    } else {
                        // console.log('run.runJobById: jobId=%o', jobId);
                        promise = runJobById(jobId, {params: params});
                    }
                } else {
                    promise = runJobByRequest(job);
                }
                return promise;
            }

            function checkJobNeedReview(needReview) {
                return new Promise(function (resolve, reject) {
                    if (needReview) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });

            }
        }


        function setCron(job, params) {
            var deferred = $q.defer();
            var modalInstance = $uibModal.open({
                component: 'jobDelayedCtrl',
                backdrop: 'static',
                size: 'xm',
                resolve: {
                    job: function () {
                        return job;
                    },
                    params: function () {
                        return params;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }

        function checkNeedApproveHandler(job, params, approve, approveType) {
            var deferred = $q.defer();
            that.checkNeedApprove(job.id).then(function (result) {
                if (result.canRun && approveType !== 'approve') deferred.resolve('run');
                else {
                    var modalInstance = $uibModal.open({
                        component: 'jobApproveModal',
                        backdrop: 'static',
                        // size: 'lg',
                        resolve: {
                            job: function () {
                                return job;
                            },
                            checkResult: function () {
                                return result;
                            },
                            params: function () {
                                return params;
                            },
                            approve: function () {
                                return approve;
                            },
                            approveType: function () {
                                return approveType;
                            },
                        }
                    });

                    modalInstance.result.then(function (modalResult) {
                        deferred.resolve(modalResult);
                    });
                }
            });

            return deferred.promise;
        }

        /**
         * Check a job run result.
         * @param {promise} runPromise A promise of job run call
         * @param {function({runId:string, status:string, detail:{}}, Error=)} fnHandleResult Argument result and error (if happens)
         * @param {string} checkElement A selector to check if an element exists. If not exists, will stop the interval
         */
        function checkJobResult(runPromise, fnHandleResult, checkElement) {
            if ($(checkElement).length === 0) {
                throw new Error('[ProgramError] Must specify a valid element to check "' + checkElement + '"');
            }
            runPromise.then(function (result) {
                // TODO(need refactor): 执行作业接口原返回数据格式为{}，加入作业分批逻辑后，现返回数据格式为[{},{},...]，
                //  导致之前的代码失效,暂时只取第一个数据
                if (angular.isArray(result)) {
                    result = result[0];
                }
                var resultStatus = jaoUtil.parseResultStatus(result);
                fnHandleResult(result, undefined);
                if (result.runId && !resultStatus.isFinished) {
                    repeatCheckAsyncJobRun(result.runId, fnHandleResult, checkElement);
                }
            }).catch(function (err) {
                // console.log('........',err);
                fnHandleResult(undefined, err);
            });

            /**
             * https://stackoverflow.com/questions/1280263/changing-the-interval-of-setinterval-while-its-running/7445863
             * @param runId
             * @param fnHandleResult
             * @param checkElement
             */
            function repeatCheckAsyncJobRun(runId, fnHandleResult, checkElement) {
                // To reduce load to server, use a ramp down plan to check result
                var checkPlan = [
                    {interval: 10, times: 6},
                    {interval: 5, times: 10},
                    {interval: 20, times: 10},
                    {interval: 20, times: 0}
                ];

                doCheck(0, 0, runId, fnHandleResult, checkElement);

                function doCheck(currentStage, stageChecks, runId, fnHandleResult, checkElement) {
                    var stop = $interval(intervalCheck, checkPlan[currentStage].interval * 1000);

                    function intervalCheck() {
                        if (angular.isString(checkElement)) {
                            if ($(checkElement).length === 0) {
                                console.log('cancel interval because "' + checkElement + '" not exist');
                                $interval.cancel(stop);
                                return;
                            }
                        }
                        var times = checkPlan[currentStage].times;
                        if (times > 0 && ++stageChecks > times) {
                            stageChecks = 0;
                            currentStage++;
                            $interval.cancel(stop);
                            stop = $interval(intervalCheck, checkPlan[currentStage].interval * 1000);
                            // console.log('Go to stage of ' + currentStage + ', interval is ' + checkPlan[currentStage].interval);
                        }

                        // Real stuff
                        getRunResult(runId).then(function (result) {
                            result.runId = runId;
                            var resultStatus = jaoUtil.parseResultStatus(result);
                            if (resultStatus.isFinished === true) {
                                console.log('Cancel interval on run finished');
                                $interval.cancel(stop);
                            }
                            fnHandleResult(result, undefined);
                        }).catch(function (err) {
                            //20210420: Error means there's network problem or temp service down.
                            // It does not mean job run error.
                            console.warn('Cannot check run status of [' + runId + '] due to ' + err.message);
                            // $interval.cancel(stop);
                            // fnHandleResult(undefined, err);
                        });
                    }
                }
            }
        }

        function checkAsyncRunStatus(runId) {
            return restUtils.callApi(module, 'GET', '/api/jao/runlogs/{runId}/check-result', {runId: runId});
        }

        function getRunResult(runId) {
            return restUtils.callApi(module, 'GET', '/api/jao/runlogs/{runId}/result', {runId: runId});
        }

        function getLastRunResult(jobId) {
            return restUtils.callApi(module, 'GET', '/api/jao/jobs/{jobId}/lastrunresult', {jobId: jobId});
        }

        function findBriefLogsByJobId(jobId) {
            return restUtils.callApi(module, 'GET', '/api/jao/jobs/{jobId}/runlogs', {jobId: jobId});
        }

        /**
         * View job result with data and detail log.
         * @param runId
         */
        function viewJobRunResult(runId) {
            if (!runId) return;
            var instance = modalHelper.openModal({
                templateUrl: 'app/modules/jao/job-result-modal.html',
                controller: ['$scope', function JobResultCtrl($scope) {
                    this.cancel = function () {
                        instance.dismiss();
                    };
                    this.runId = runId;
                }],
                controllerAs: '$ctrl',
                size: 'lg'
            }, {resizable: true});
        }

        /**
         * Run a job and wait for final result. It will check result and update style at interval.
         * @param {object} config
         * @param {string} config.code Job code
         * @param {object} config.params Params with variables
         * @param {object} config.postproc Post process after success call
         * @param {boolean=} config.waitJobCompletion Default is true
         * @param scope
         * @param {object} values Values to replace vars in config.params
         * @param {angular.element} element Element trigger the job. In most case this is a button.
         * @return {Promise<{runId:string,status:string}>} Final job result
         */
        function runJobAndWaitResult(config, scope, values, element) {
            var d = $q.defer();
            var code = config.code;
            var params = dataEx.evalVarJson(config.params, values, {
                toEvalObject: angular.isDefined(config.evalObject) ? config.evalObject : true
            });
            var statusIcon;
            var runStyle = 'OUTLINE';
            var promise = runJob(code, params);
            var fnCount = 0;
            var waitJobCompletion = config.waitJobCompletion !== false;
            checkJobResult(promise, fnHandleResult, element);
            return d.promise;

            /**
             *
             * @param result Result
             * @param {Error=} err Error
             */
            function fnHandleResult(result, err) {
                // console.log('fnHandleResult', {err: err, result: result});
                fnCount++;
                var status;
                if (err) {
                    // Count=1 means the sync call of job REST API failed
                    if (fnCount === 1) {
                        var errOutput = err.message;
                        if (err._errorData.message) {
                            errOutput = errOutput + " " + err._errorData.message;
                        }
                        messageService.toast('error', $translate.instant('common.term.error'), errOutput);
                    }
                    status = 'ERROR';
                } else {
                    status = result.status;
                }
                var runStatusDef = getRunStatusDef(status);
                if (err) {
                    d.reject(err);
                } else if ((waitJobCompletion && runStatusDef._isFinished) || (!waitJobCompletion && fnCount === 1)) {
                    console.log('resolved with waitJobCompleted=%o', waitJobCompletion)
                    d.resolve(result);
                }
                else if (!result.jobType) { 
                    d.notify(result);
                }
                // console.log('fnHandleResult', {runStyle: runStyle});
                if (runStyle === 'APPEND_ICON') {
                    if (statusIcon && result.runId) {
                        statusIcon.data('runId', result.runId);
                    }
                    statusIcon.removeClassMatch(/^status-.*/).addClass('status-' + runStatusDef.name);
                } else {
                    jaoUtil.changeRunStatusStyle(element, status, {style: runStyle});
                }
            }
        }

        function ansibleProgress(implement, urlData, value) {
            if ("termination" === implement) {
                return restUtils.callApi(module, 'post', "/api/jao/jobs/" + urlData + "/running-hosts/stop", null, value);
            } else if ("terminationAll" === implement) {
                return restUtils.callApi(module, 'delete', "/api/jao/jobs/" + urlData + "/stop");
            } else if ("query" === implement) {
                return restUtils.callApi(module, 'get', "/api/jao/jobs/" + urlData + "/running-hosts");
            }
        }

        function findMyApproveJobs() {
            return restUtils.callApi(module, 'GET', '/api/jao/jobs/approve/my');
        }

        function findApproveJobsByStatus() {
            return restUtils.callApi(module, 'GET', '/api/jao/jobs/approve/list');
        }

        function checkNeedApprove(jobId) {
            return restUtils.callApi(module, 'GET', '/api/jao/jobs/approve/check/{jobId}', {jobId: jobId});
        }

        function submitApprove(data) {
            return restUtils.callApi(module, 'POST', '/api/jao/jobs/approve/submit', null, data);
        }

        function getScriptPath(jobId) {
            return restUtils.callApi(module, 'GET', '/api/jao/jobs/approve/get-script-path/{jobId}', {jobId: jobId});
        }

        // types :
        // approve -- 1 -- 审批通过
        // refuse  -- 2 -- 审批拒绝
        // cancel  -- 3 -- 审批取消
        // discard -- 3 -- 审批作废
        function turningApprove(type, data) {
            var apiUrl = '/api/jao/jobs/approve';

            if (type === 'approve') {
            } else if (type === 'refuse') apiUrl += '/refuse'
            else if (type === 'cancel') apiUrl += '/cancel'
            else if (type === 'discard') apiUrl += '/discard'

            return restUtils.callApi(module, 'PUT', apiUrl, null, data);
        }

        function moveJob(jobIds, appletCode) {
            return restUtils.callApi(module, 'PUT', '/api/jao/jobs/move/{appletCode}', {"appletCode": appletCode}, jobIds);
        }

        function rerunJob(runId) {
            return restUtils.callApi(module, 'POST', '/api/jao/jobs/{runId}/rerun',{"runId": runId},null);
        }
    }
})();
