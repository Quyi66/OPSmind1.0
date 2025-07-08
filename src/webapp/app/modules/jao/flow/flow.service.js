/**
 *
 * @author chenrongji, created on 2021-2-20
 */
(function () {
    'use strict';

    angular.module('oplus.jao').service('jaoFlowService', jaoFlowService);


    jaoFlowService.$inject = ['$q', '$http', '$interval', '$uibModal', '$state', 'restUtils', 'jaoUtil', '$translate'];

    /**
     * @ngdoc service
     * @name jaoFlowService
     * @param {$q} $q
     * @param {$interval} $interval
     * @param $uibModal
     * @param $state
     * @param {restUtils} restUtils
     */
    function jaoFlowService($q, $http, $interval, $uibModal, $state, restUtils, jaoUtil, $translate) {
        var module = "jao";
        var that = this;
        this.findFlowById = findFlowById;
        this.getRunStatusDef = getRunStatusDef;
        this.allRunStatusDefs = allRunStatusDefs;
        this.findAllFlows = findAllFlows;
        that.saveFlow = saveFlow;
        that.deleteFlow = deleteFlow;
        that.createInstance = createInstance;
        that.getFlowInstanceViewById = getFlowInstanceViewById;
        that.getStepAndHostStatus = getStepAndHostStatus;
        that.runStep = runStep;
        that.getHostStatusByStepIdAndHostKey = getHostStatusByStepIdAndHostKey;
        that.getRunLogsByRunIds = getRunLogsByRunIds;
        that.findFlowInstances = findFlowInstances;
        that.findAllFlowsByPermission = findAllFlowsByPermission;
        that.exportFlowListByIds = exportFlowListByIds;
        that.importFlow = importFlow;
        // this.saveFlow = saveFlow;
        // this.deleteFlow = deleteFlow;
        // this.runFlowById = runFlowById;
        // this.runFlow = runFlow;
        // this.getRunResult = getRunResult;
        // this.viewFlowRunResult = viewFlowRunResult;
        // this.gotoEditFlow = gotoEditFlow;
        // this.getAtaRunningHosts = getAtaRunningHosts;
        var HOST_STATUS = {
            RUNNING: {
                name: 'running',
                color: 'primary',
                title: jaoUtil.jobStatusDefs.RUNNING.title,
                icon: 'fa-cog fa-spin',
                _fa: ''
            },
            COMPLETED: {
                name: 'completed',
                color: 'success',
                title: jaoUtil.jobStatusDefs.COMPLETED.title,
                icon: 'fa-check',
                _isFinished: true,
                _fa: 'f00c'
            },
            ERROR: {
                name: 'error',
                color: 'warning',
                title: jaoUtil.jobStatusDefs.ERROR.title,
                icon: 'fa-exclamation',
                _isError: true,
                _isFinished: true,
                _fa: 'f12a'
            },
            FAILED: {
                name: 'failed',
                color: 'danger',
                title: jaoUtil.jobStatusDefs.FAILED.title,
                icon: 'fa-times',
                _isFinished: true,
                _isError: true,
                _fa: 'f00d'
            },
            CALLBACK: {
                name: 'running',
                color: 'primary',
                title: jaoUtil.jobStatusDefs.CALLBACK.title,
                icon: 'fa-cog fa-spin',
                _fa: ''
            },
            WAITING: {
                name: 'waiting',
                color: 'secondary',
                title: jaoUtil.jobStatusDefs.WAITING.title,
                icon: 'fa-equals',
                _fa: 'f52c'
            }
        };

        restUtils.addErrorTranslator('jao', function (err) {
            if (err.message.indexOf('[NoHostError]') > 0) {
                err.message = $translate.instant('jao.messages.no_host_data');
            }
        });

        function allRunStatusDefs() {
            return JOB_STATUS;
        }

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

        /**
         *
         * TODO: return only id, title, code, params, description
         * @returns {promise}
         */
        function findAllFlows(applet) {
            if (applet) {
                return restUtils.callApi(module, 'GET', '/api/jao/flows?appCode=' + applet);
            }
            return restUtils.callApi(module, 'GET', '/api/jao/flows');
        }

        function importFlow(params) {
            var url = restUtils.getApiUrl(module, '/api/jao/flows/import');
            return restUtils.callUpload(url, params);
        }


        function exportFlowListByIds(flowIds) {
            return restUtils.callApi(module, 'GET', '/api/jao/flows/export/' + flowIds);
        }

        function getRunLogsByRunIds(runIds) {
            return restUtils.callApi(module, 'POST', '/api/jao/jobs/runlogs', null, runIds);
        }

        function findAllFlowsByPermission(appCode) {
            return restUtils.callApi(module, 'GET', '/api/jao/flow/permission/team/table?appCode=' + appCode);
        }

        function runStep(stepJob) {
            return restUtils.callApi(module, 'POST', '/api/jao/flows/steps/run', null, stepJob);
        }

        function getStepAndHostStatus(id) {
            return restUtils.callApi(module, 'GET', '/api/jao/flows/steps/{id}', {id: id});
        }

        function findFlowById(id) {
            return restUtils.callApi(module, 'GET', '/api/jao/flows/{id}', {id: id});
        }

        function getFlowInstanceViewById(id) {
            return restUtils.callApi(module, 'GET', '/api/jao/flow-instances/{id}/view', {id: id});
        }

        function deleteFlow(id) {
            return restUtils.callApi(module, 'DELETE', '/api/jao/flows/{id}', {id: id});
        }

        function getHostStatusByStepIdAndHostKey(stepId, hostKey) {
            return restUtils.callApi(module, 'GET', "/api/jao/flows/{stepId}/hosts/{hostkey}/result", {
                stepId: stepId,
                hostkey: hostKey
            });
        }

        /**
         *
         * @param flow
         * @returns {promise}
         */
        function saveFlow(flow) {
            if (!flow.id) {
                return restUtils.callApi(module, 'POST', '/api/jao/flows', null, flow);
            } else {
                return restUtils.callApi(module, 'PUT', '/api/jao/flows', null, flow);
            }
        }

        function createInstance(flow) {
            return restUtils.callApi(module, 'PUT', '/api/jao/flow-instances', null, flow)
        }

        function testScriptFlow(hosts, filepath, argline, params) {
            var flow = {
                params: params,
                tasks: [{
                    scripts: [{
                        location: filepath,
                        argline: argline
                    }],
                    hosts: hosts
                }]
            };
            return restUtils.callApi('jao', 'POST', '/api/jao/run/script', {}, flow);
        }

        /**
         * Run a dynamic flow by request
         * @param flow Flow request
         * @returns {promise}
         */
        function runFlowByRequest(flow) {
            return restUtils.callApi(module, 'POST', '/api/jao/run', null, flow);
        }

        /**
         *
         * @param id
         * @param options
         * @returns {promise}
         */
        function runFlowById(id, options) {
            return restUtils.callApi(module, 'POST', '/api/jao/flows/{id}/run', {id: id}, options);
        }

        /**
         *
         * @param {string} flowId
         * @param {object} params
         * @returns {promise}
         */
        function runFlowWithUpload(flowId, params) {
            var url = restUtils.getApiUrl(module, '/api/jao/flows/{flowId}/upload-to-run', {flowId: flowId});
            return restUtils.callUpload(url, params);
        }


        /**
         * Run a flow and check result at intervals.
         * @param {string|object} flow A flow ID string or flow request object. If a request object, it will call runFlowByRequest.
         * @param {object=} params Used with flow ID.
         * @param {function({runId:string, status:string, detail:{}}, Error=, number)} fnHandleResult
         * A function to handle result
         * @return {promise<{runId:string, status:string}|Error>} A promise of immediate flow run result.
         */
        function runFlow(flow, params) {
            // var d = $q.defer();
            var promise;
            var isMultipart = restUtils.containsMultipart(params);
            // console.log('startFlow', flowId, callId, params, isMultipart);
            if (angular.isString(flow)) {
                if (isMultipart) {
                    promise = runFlowWithUpload(flow, params);
                } else {
                    promise = runFlowById(flow, {params: params});
                }
            } else {
                promise = runFlowByRequest(flow);
            }
            return promise;
            // checkFlowResult(promise, fnHandleResult);
        }

        /**
         *
         * @param {{status:string}} result Flow result
         * @returns {{isError: boolean, isFinished: boolean, name: string}}
         */
        function parseResultStatus(result) {
            var out = {name: 'running', isFinished: false, isError: false};
            if (result.status === 'COMPLETED') {
                out.name = 'completed';
                out.isFinished = true;
            } else if (result.status === 'ERROR' || result.status === 'FAILED') {
                out.name = 'error';
                out.isError = true;
                out.isFinished = true;
            }
            return out;
        }

        /**
         *
         * @param {promise} promise A promise of flow call
         * @param {function({runId:string, status:string, detail:{}}, Error=)} fnHandleResult Argument result and error (if happens)
         * @param {string} checkElement A selector to check if an element exists. If not exists, will stop the interval
         */
        function checkFlowResult(promise, fnHandleResult, checkElement) {
            if ($(checkElement).length === 0) {
                throw new Error('[ProgramError] Must specify a valid element to check "' + checkElement + '"');
            }
            promise.then(function (result) {
                // console.log('promise.then');
                var resultStatus = parseResultStatus(result);
                fnHandleResult(result, undefined);
                // console.log('checkFlowResult', {runId: result.runId, resultStatus: resultStatus})
                if (result.runId && !resultStatus.isFinished) {
                    repeatCheckAsyncFlowRun(result.runId, fnHandleResult, checkElement);
                }
            }).catch(function (err) {
                fnHandleResult(undefined, err);
            });

            /**
             * https://stackoverflow.com/questions/1280263/changing-the-interval-of-setinterval-while-its-running/7445863
             * @param runId
             * @param fnHandleResult
             * @param checkElement
             */
            function repeatCheckAsyncFlowRun(runId, fnHandleResult, checkElement) {
                // To reduce load to server, use a ramp down plan to check result
                var checkPlan = [
                    {interval: 10, times: 6},
                    {interval: 5, times: 10},
                    {interval: 20, times: 10},
                    {interval: 30, times: 0}
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
                        checkAsyncRunStatus(runId).then(function (result) {
                            result.runId = runId;
                            var resultStatus = parseResultStatus(result);
                            if (resultStatus.isFinished === true) {
                                console.log('Cancel interval on run finished');
                                $interval.cancel(stop);
                            }
                            fnHandleResult(result, undefined);
                        }).catch(function (err) {
                            $interval.cancel(stop);
                            fnHandleResult(undefined, err);
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

        function findBriefLogsByFlowId(flowId) {
            return restUtils.callApi(module, 'GET', '/api/jao/flows/{flowId}/runlogs', {flowId: flowId});
        }

        function findFlowInstances(flowId) {
            return restUtils.callApi(module, 'GET', '/api/jao/flows/{flowId}/instances', {flowId: flowId});
        }
    }
})();
