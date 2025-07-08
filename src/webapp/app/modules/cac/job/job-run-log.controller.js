/**
 * @Auther: zml
 * @Date: 2018/5/3
 */
(function () {
    var cacModule = angular.module('oplus.cac');
    cacModule.controller('CacJobRunLogCtrl', CacJobRunLogCtrl);
    CacJobRunLogCtrl.$inject = ['cacJobService', 'params', '$uibModalInstance'];

    function CacJobRunLogCtrl(cacJobService, params, $uibModalInstance) {
        var that = this;
        this.jobId = params.jobId;
        this.cancel = cancel;
        init();

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function init() {
            cacJobService.queryJob(that.jobId).then(function (cacJob) {
                that.runId = cacJob.taskId;
            });
        }
    }
})
();
