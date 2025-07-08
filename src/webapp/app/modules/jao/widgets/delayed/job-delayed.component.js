(function () {
    'use strict';

    angular.module('oplus.jao')
        .component('jobDelayedCtrl', {
            templateUrl: 'app/modules/jao/widgets/delayed/job-delayed.html',
            controller: JobDelayedCtrl,
            bindings: {
                // resolve:
                // --- job 作业详情
                // --- params 作业执行参数
                resolve: '<',
                close: '&',
                dismiss: '&'
            }
        });

    JobDelayedCtrl.$inject = ['$state', 'jaoJobService', 'messageService', 'jaoUtil', 'currentUser', '$translate', '$uibModal', 'cronJobService'];

    /**
     *
     * @param $state
     * @param $translate
     * @param {jaoJobService} jaoJobService
     * @param {messageService} messageService
     * @param {jaoUtil} jaoUtil
     * @param {currentUser} currentUser
     * @param {$uibModal} $uibModal
     * @param cronJobService cronJobService
     * @constructor
     */
    function JobDelayedCtrl($state, jaoJobService, messageService, jaoUtil, currentUser, $translate, $uibModal, cronJobService) {
        var that = this;

        that.cronTime = "";
        that.pushJobToSchedule = pushJobToSchedule;
        that.rungOnce = rungOnce;

        /**
         * 提交到定时任务
         * @returns {*}
         */
        function pushJobToSchedule() {

            var cronRequest = {
                jobDesc: that.resolve.job.title,
                cronTime: that.cronTime,
                jobType: that.resolve.job.type,
                jobId: that.resolve.job.id,
                jobParam: that.resolve.params,
                triggerStatus: "1", // 默认状态启动
                logOutput: true   // 默认需要记录日志
            };

            if (!that.resolve.params.hosts) {
                messageService.toast('error', $translate.instant("jao.job.detail.host_error_delayed"));
                return;
            }

            if (!that.cronTime) {
                // that.close();
                messageService.toast('error', $translate.instant("jao.job.detail.cron_error_delayed"));
                return;
            }
            return cronJobService.cronRestInterface('add', cronRequest).then(function (result) {
                if ("200" === result.code) {
                    that.close({$value: 'schedule'});
                    messageService.toast('success', $translate.instant("jao.job.detail.push_schedule_success"));
                }
                else
                    messageService.toast('error', result);
            });
        }


        /**
         * 不提交到定时任务，直接执行一次
         */
        function rungOnce() {
            that.close({$value: 'now'});
        }


    }


})();
