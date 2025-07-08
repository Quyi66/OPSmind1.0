/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-07-28
 */
(function () {
        'use strict';

        /**
         * @ngdoc component
         * @name jaoScriptTestRun
         * @description
         * Test run a script
         * ```html
         * <jao-script-test-run file="object" on-close="function" options="object"></jao-script-test-run>
         * ```
         * TODO: rename to jao-script-quick-run
         * @param {{repoType:string, repo:string, path:string}} file Script file to run
         * @param {function} onClose Function to invoke when click cancel
         */
        angular.module('oplus.jao').component('jaoScriptTestRun', {
            templateUrl: 'app/modules/jao/script-test-run.html',
            controller: ['$scope', 'restUtils', 'gfileService', 'messageService', 'jaoJobService', 'jaoUtil', 'userPref', ScriptTestRunCtrl],
            bindings: {
                file: '<',
                onClose: '<',
                options: '<'
            }
        });

        /**
         * Used with component.
         * @param $scope
         * @param {restUtils} restUtils
         * @param {gfileService} gfileService
         * @param {messageService} messageService
         * @param {jaoJobService} jaoJobService
         * @param {jaoUtil} jaoUtil
         * @param {userPref} userPref
         */
        function ScriptTestRunCtrl($scope, restUtils, gfileService, messageService, jaoJobService, jaoUtil, userPref) {
            var that = this;
            var ITEM_KEY = 'jao.testRunHosts';
            this.submit = submit;
            this.cancel = cancel;
            this.viewRunResult = viewRunResult;
            this.options = this.options || {};
            this.verbosity = this.verbosity || "3";
            this.hosts = userPref.readItem(ITEM_KEY, []);
            this.jobStatus = {};
            this.$onInit = $onInit;

            function $onInit() {
                gfileService.getFileInfo(that.file.repoType, that.file.repo, that.file.path).then(function (data) {
                    that.fileInfo = data;
                    that.fileParams = {};
                    var config = data.config;
                    if (config) {
                        var m, re = /\${(.*?)}/g;
                        do {
                            m = re.exec(config);
                            if (m) {
                                that.fileParams[m[1]] = '';
                            }
                        } while (m);
                    }
                }).catch(function (err) {
                    throw err;
                });
            }

            function viewRunResult() {
                jaoJobService.viewJobRunResult(that.runId);
            }

            function cancel() {
                angular.isFunction(that.onClose) && that.onClose();
            }

            function submit() {
                that.isRunning = true;
                var promise = jaoJobService.testScriptJob(that.hosts, that.fileInfo.path, that.fileInfo.config, that.fileParams, that.verbosity);
                promise.then(function (data) {
                    jaoJobService.openRealtimeConsole({runId: data.runId});
                });
                jaoJobService.checkJobResult(promise, fnHandleResult, '#js-script-test-run');
                var isFirst = true;

                //TODO: need code refactor to unified job run
                function fnHandleResult(res, err) {
                    if (err) {
                        that.jobStatus = jaoJobService.getRunStatusDef('ERROR');
                        that.isRunning = false;
                        if (err._errorData) {
                            that.runId = err._errorData.runId;
                        }
                    } else {
                        var resultStatus = jaoUtil.parseResultStatus(res);
                        that.jobStatus = jaoJobService.getRunStatusDef(res.status);
                        if (resultStatus.isFinished) {
                            that.isRunning = false;
                        }
                        if (isFirst) {
                            isFirst = false;
                            that.runId = res.runId;
                            userPref.saveItem(ITEM_KEY, that.hosts);
                        }
                    }
                }
            }
        }
    }
)();
