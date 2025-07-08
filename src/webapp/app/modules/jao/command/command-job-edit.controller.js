/**
 *
 * @author chenrongji, created on 2020-2-20
 */
(function () {
    'use strict';

    angular.module('oplus.jao').controller('commandJobEditCtrl', CommandJobEditCtrl);

    CommandJobEditCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', '$uibModal', 'messageService', 'jaoJobService', '$stateParams','$translate'];

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
    function CommandJobEditCtrl($scope, $rootScope, $state, $timeout, $uibModal, messageService, jaoJobService, $stateParams,$translate) {
        var that = this;
        that.jobConfig = {};
        that.tags = [
            $translate.instant('jao.job.tags.0'),
            $translate.instant('jao.job.tags.1'),
            $translate.instant('jao.job.tags.2'),
            $translate.instant('jao.job.tags.3'),
            $translate.instant('jao.job.tags.4'),
            $translate.instant('jao.job.tags.5'),
            $translate.instant('jao.job.tags.6'),
            $translate.instant('jao.job.tags.7'),
            $translate.instant('jao.job.tags.8')
        ];
        that.paramTypeList = [
            $translate.instant('jao.command_job_edit.0'),
            $translate.instant('jao.command_job_edit.1'),
            $translate.instant('jao.command_job_edit.2'),
            $translate.instant('jao.command_job_edit.3')
        ];
        that.runResult = null;
        that.deleteParam = deleteParam;
        that.save = save;
        that.runJob = runJob;
        that.deleteJob = deleteJob;
        that.$onInit = onInit;
        that.cancel = cancel;
        //页面为view状态，则页面不可点击编辑
        that.isEditMode = $state.current.name === 'app.jao_cmd.job_list.edit' || $state.current.name === 'app.jao_cmd.job_list.create';

        function cancel() {
            if (that.job.id) {
                $state.go('app.jao_cmd.job_list.view', {id: that.job.id});
            } else {
                $state.go('app.jao_cmd.job_list', {type: that.job.type});
            }
        }

        function deleteJob() {
            messageService.confirmDanger($translate.instant("common.entity.delete.title"), that.job.title + '？', function () {
                jaoJobService.deleteJob(that.job.id).then(function () {
                    $state.go('app.jao_cmd.job_list', {type: that.job.type}, {reload: true});
                });
            }, function () {
            }, $translate.instant("common.entity.action.delete"));
        }

        function onInit() {
            var jobId = $stateParams.id;
            if (!jobId) {
                that.job = {
                    params: [],
                    type: $stateParams.type
                };
            } else {
                jaoJobService.findJobById(jobId).then(function (job) {
                    that.job = job;
                    var configJson = that.job.configJson;
                    that.jobConfig = JSON.parse(configJson || '{}');
                    if (!angular.isObject(that.jobConfig)) {
                        throw new FatalError($translate.instant("cmd.messages.create_job_error") + "'" + configJson + "'");
                    }
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant("cmd.messages.get_job_error"), err.message);
                });
            }
            $scope.$watch('$ctrl.jobConfig', function (newVal, oldVal) {
                if (newVal === oldVal) {
                    return;
                }
                that.job.configJson = angular.toJson(newVal);
            }, true);
        }

        function setRunStatus(status) {
            that.jobStatus = jaoJobService.getRunStatusDef(status);
            if (!that.jobStatus) {
                throw new Error('ProgramError: Unsupported job run status "' + status + '"');
            }
            that.jobInRunning = status === 'RUNNING';
        }

        function runJob() {
            var tasks = angular.fromJson(that.job.configJson);
            var commands = tasks.tasks[0].commands;
            if (commands.length === 0){
                messageService.toast('warning', $translate.instant("cmd.messages.not_null_error"));
                return;
            }
            //TODO: simplify jobReqeust attrs.
            var jobRequest = {
                jobId: that.job.id,
                type: that.job.type,
                configJson: that.job.configJson,
                options: {
                    secretParams: [],
                    params: {}
                }
            };
            setRunStatus('RUNNING');
            jaoJobService.runJob(jobRequest, null).then(function () {
                $state.go('app.jao_cmd.logs', {});
            });
        }

        function save() {
            //自定义command job.configJson的数据格式
            var tasks = angular.fromJson(that.job.configJson);
            var commandInfos = tasks.tasks[0].commands;
            var hosts = tasks.tasks[0].hosts;
            if (commandInfos.length === 0) {
                messageService.toast('error', $translate.instant("cmd.messages.select_command"));
                return;
            } else if (hosts.length === 0) {
                messageService.toast('error', $translate.instant("cmd.messages.select_host"));
                return;
            }
            var commands = [];
            commandInfos.forEach(function (command) {
                var id = command.id;
                commands.push({"id": id});
            });
            var list = [{"commands": commands,"hosts": hosts}];
            var newTask = {"tasks": list};
            that.job.configJson = angular.toJson(newTask);
            jaoJobService.saveJob(that.job).then(function (result) {
                $state.go('app.jao_cmd.job_list.view',
                    {type: that.job.type, id: (that.job.id || result.id)},
                    {reload: true}
                );
                messageService.toast("success", $translate.instant("cmd.messages.save_success"));
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("cmd.messages.save_failed"), err.measure());
            });
        }

        function deleteParam(param) {
            that.job.params.splice(that.job.params.indexOf(param), 1);
        }

    }
})();
