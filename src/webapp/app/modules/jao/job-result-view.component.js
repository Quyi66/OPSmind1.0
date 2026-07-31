/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-08-31
 */

(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name jaoJobResultView
     * @usage
     * View one job run result or the result of latest job run.
     * ```html
     * <jao-job-result-view run-id="string" job-id="string" options="object">
     * ```
     * @param {string} runId ID of job run. If specified, view result of this run.
     * @param {string=} jobId ID of job. If `runId` not specified, view last run result of this job.
     * @param {object=} options Not used now
     */
    angular.module('oplus.jao').component('jaoJobResultView', {
        templateUrl: 'app/modules/jao/job-result-view.html',
        controller: ['$scope', '$q', '$interval', '$timeout', 'messageService', 'jaoJobService', 'jaoUtil', '$translate', 'currentUser', JobResultViewCtrl],
        bindings: {
            runId: '<',
            jobId: '<',
            resultData: '<',
            options: '<'
        }
    });

    /**
     * Used with component.
     * @param $scope
     * @param $q
     * @param $interval
     * @param $timeout
     * @param {messageService} messageService
     * @param {jaoJobService} jaoJobService
     * @param {jaoUtil} jaoUtil
     */
    function JobResultViewCtrl($scope, $q, $interval, $timeout, messageService, jaoJobService, jaoUtil, $translate, currentUser) {
        var that = this;
        var REFRESH_MS = 5000;
        this.JOB_STATUS = jaoUtil.jobStatusDefs;
        this.STEP_NAMES = {
            ata: $translate.instant('jao.result.step.ata'),
            callback: $translate.instant('jao.result.step.callback')
        };
        this.modeler;
        this.intervals = [];
        this.refresh = refresh;
        this.toggleAutoRefresh = toggleAutoRefresh;
        this.downloadAnsibleOutput = downloadAnsibleOutput;
        this.$onInit = onInit;
        this.registerModeler = function ($modeler) {
            that.modeler = $modeler;
        };
        this.rerunJob = rerunJob;
        this.changeRawOutputBatch = changeRawOutputBatch;

        function onInit() {
            $timeout(function () {
                if (!that.runId && !that.jobId && !that.resultData) {
                    that.error = $translate.instant('jao.messages.no_id_data');
                }
            });
            $scope.$watch('$ctrl.runId', function (newVal, oldVal) {
                if (newVal) loadLog({ runId: newVal });
            });
            $scope.$watch('$ctrl.jobId', function (newVal, oldVal) {
                if (newVal) loadLog({ jobId: newVal });
            });
            $scope.$watch('$ctrl.resultData', function (newVal, oldVal) {
                if (newVal) {
                    processJobResult(newVal);
                }
            });
            $scope.$on('$destroy', function () {
                that.intervals.forEach(function (stop) {
                    $interval.cancel(stop);
                    stop = undefined;
                });
            });
        }

        function toggleAutoRefresh() {
            this.autoRefresh = this.autoRefresh === REFRESH_MS ? 0 : REFRESH_MS;
            if (this.autoRefresh === REFRESH_MS) {
                var stop = $interval(function () {
                    refresh();
                }, REFRESH_MS);
                that.intervals.push(stop);
            }
        }

        function refresh() {
            loadLog({ runId: that.runId });
        }

        function downloadAnsibleOutput() {
            // 使用 JAO 服务代理接口下载，避免跨域问题
            var url = '/oplus-portal/jao/api/jao/runlogs/ansible/' + that.runId;
            var filename = 'ansible_output_' + that.runId + '.txt';

            // 使用 fetch + Blob 下载，添加 Authorization header
            fetch(url, {
                headers: {
                    'Authorization': 'Bearer ' + currentUser.authToken
                }
            })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Download failed: ' + response.status);
                    }
                    return response.blob();
                })
                .then(function (blob) {
                    var downloadUrl = window.URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = filename;
                    a.style.display = 'none';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(downloadUrl);
                })
                .catch(function (error) {
                    console.error('Download failed:', error);
                    messageService.alert($translate.instant('common.error'), $translate.instant('jao.messages.download_failed') || 'Download failed');
                });
        }

        /**
         * Process job run result data
         * @param {object} result
         * @param {string} result.jobType
         * @param {string} result.statsJson
         * @param {string} result.status
         * @param {string=} result.configJson When script job
         * @param {string=} result.paramsJson When script job
         * @param {[{output:string}]} result.data
         */
        function processJobResult(result) {
            if (result.status === 'RUNNING' || result.status === 'CALLBACK') {
                that.autoRefreshEnabled = true;
                that.autoRefresh = REFRESH_MS;
            } else {
                that.autoRefreshEnabled = false;
                that.autoRefresh = 0;
            }
            that.includeTask = [];
            includeTasks(result)
            that.result = result;
            that.result._stats = jaoUtil.formatStats(result.statsJson);
            that.dateNow = Date.now();
            if (that.result.status === 'RUNNING') {
                that.result.endTime = Date.now();
            }
            that.batchIds = [];
            if (result.data) {
                result.data.forEach(function (batch) {
                    if (batch.batchId && that.batchIds.indexOf(batch.batchId) === -1) {
                        that.batchIds.push(batch.batchId);
                    }
                });
            }
            if (that.batchIds.length > 0) {
                that.selectedBatchId = that.batchIds[0];
            } else {
                that.selectedBatchId = undefined;
            }

            if (result.jobType === jaoUtil.jobType.SCRIPT
                || result.jobType === jaoUtil.jobType.COMMAND
                || result.jobType === jaoUtil.jobType.PROCESS) {
                var rawOutputs = {};
                var contents = [];
                if (result.data) {
                    var batches = result.data;
                    batches.forEach(function (batch) {
                        if (batch.output) {
                            try {
                                var parsed = JSON.parse(batch.output);
                                parsed._batchId = batch.batchId;
                                contents.push(parsed);
                                rawOutputs[batch.batchId] = JSON.stringify(parsed, null, 2);
                            } catch (err) {
                                console.warn("Cannot parse output {}", batch.output);
                            }
                        }
                    });
                }
                that.rawOutputs = rawOutputs;
                if (that.batchIds.length > 1) {
                    that.ansibleRawOutput = rawOutputs[that.selectedBatchId];
                } else {
                    that.ansibleRawOutput = JSON.stringify(contents, null, 2);
                }

                if (result.jobType === jaoUtil.jobType.COMMAND) {
                    replaceCommandId(contents);
                } else if (result.jobType === jaoUtil.jobType.PROCESS/* || result.configJson.indexOf('demo/容灾切换')>=0*/) {
                    handleProcessModel();
                }
                // 隐藏以[HIDE]开头的task
                replaceHideTask(contents);
                that.ansibleContents = contents;
            }

            function includeTasks(result) {
                if (result["jobType"] === "command") {
                    var config = JSON.parse(result["configJson"].replace(/\n/g, "\\n").replace(/\r/g, "\\r"));
                    config["tasks"].forEach(function (task) {
                        task["commands"].forEach(function (command) {
                            if (command["type"] === "playbook") {
                                try {
                                    jsyaml.load(command["cmd"]).forEach(function (c) {
                                        for (var key in c) {
                                            that.includeTask.push(key)
                                            that.includeTask.push(c[key])
                                        }
                                    })
                                } catch (error) {
                                    console.log(error)
                                }
                            }
                        })
                    })
                }
                // console.log("match task names is " + that.includeTask)
            }

            function handleProcessModel() {
                // console.log('handleProcessModel',that.processModel);
                if (that.result.configJson && !that.processModel) {
                    var jobConfig = JSON.parse(that.result.configJson);
                    that.processModel = jobConfig.processModel;
                    that.emptyCount = 0;
                    var stop = $interval(function () {
                        getCurrentTaskId().then(function (hosts) {
                            var taskIds = Object.keys(hosts);
                            that.modeler.highlightTask(taskIds);
                            if (taskIds.length === 0) {
                                that.emptyCount++;
                            } else {
                                that.emptyCount = 0;
                            }
                            if (that.result.status !== 'RUNNING' || that.emptyCount >= 5) {
                                $interval.cancel(stop);
                            }
                        });
                    }, REFRESH_MS);
                    that.intervals.push(stop);
                }

                /**
                 *
                 * @returns {Promise<{taskId:[]}>} Key is task id, value is array of host keys
                 */
                function getCurrentTaskId() {
                    var d = $q.defer();
                    jaoJobService.ansibleProgress("query", that.runId).then(function (runningHosts) {
                        var hostsByTask = {};
                        runningHosts.forEach(function (host) {
                            var match = /\[(.*)]/.exec(host['taskName']);
                            var taskId;
                            if (match) {
                                taskId = match[1];
                                if (!hostsByTask[taskId]) {
                                    hostsByTask[taskId] = [];
                                }
                                hostsByTask[taskId].push(host['key']);
                            }
                        });
                        d.resolve(hostsByTask);
                    }).catch(function (err) {
                        d.reject(err);
                    });
                    return d.promise;
                }
            }

            function replaceHideTask(contents) {
                contents.forEach(function (content) {
                    content.plays.forEach(function (play) {
                        play.tasks.forEach(function (task, index, array) {
                            var taskName = task.task.name;
                            if (taskName.startsWith("[HIDE]")) {
                                task.task = null;
                            }
                        })
                        _.remove(play.tasks, { task: null });
                    });
                });
            }

            function replaceCommandId(contents) {
                var commandMap = {};
                if (that.result.configJson) {
                    var jobConfig = JSON.parse(that.result.configJson);
                    //TODO: to config.tasks
                    var tasks = jobConfig.tasks || jobConfig.task;
                    tasks.forEach(function (task) {
                        task.commands.forEach(function (command) {
                            var commandId = command.id;
                            if (!commandMap[commandId]) {
                                commandMap[commandId] = {
                                    cmd: command.cmd,
                                    name: command.name
                                };
                            }
                        });
                    });
                }
                contents.forEach(function (content) {
                    content.plays.forEach(function (play) {
                        play.tasks.forEach(function (task, index, array) {
                            var taskName = task.task.name;
                            if (commandMap[taskName]) {
                                task.task.name = commandMap[taskName].name;
                            } else if (filter(taskName)) {
                                task.task.name = taskName;
                            } else {
                                task.task = null;
                            }
                        })
                        // console.log(JSON.stringify(play.tasks))
                        _.remove(play.tasks, { task: null });
                    });
                });
            }
        }

        function filter(taskName) {
            // console.log("task name is " + taskName)
            var isRemove = false;
            that.includeTask.forEach(function (inTask) {
                if (taskName === inTask) {
                    isRemove = true;
                }
            })
            return isRemove;
        }

        function loadLog(config) {
            var runResult;
            // console.log('loadLog', config);
            if (config.runId) {
                runResult = jaoJobService.getRunResult(config.runId);
            } else if (config.jobId) {
                runResult = jaoJobService.getLastRunResult(config.jobId);
            } else {
                throw new Error('ProgramError: Illegal config parameter');
            }
            runResult.then(function (result) {
                processJobResult(result);
                that.error = undefined;
            }).catch(function (err) {
                that.error = err.message;
            });
        }
        function rerunJob(runId) {
            messageService.confirm($translate.instant('jao.log.rerun'), '', function () {
                jaoJobService.rerunJob(runId).then(function (result) {
                    var newRunId = result[0].runId;
                    that.runId = newRunId;
                });
            });
        }
        function changeRawOutputBatch(batchId) {
            that.selectedBatchId = batchId;
            that.ansibleRawOutput = that.rawOutputs[batchId];
        }
    }
})();
