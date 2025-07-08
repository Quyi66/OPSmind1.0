/**
 * @Auther: zml
 * @Date: 2018/5/3
 */
(function () {
    var cacModule = angular.module('oplus.cac');
    cacModule.controller('CacFixLogResultCtrl', CacFixLogResultCtrl);
    CacFixLogResultCtrl.$inject = ['params', '$uibModalInstance'];

    function CacFixLogResultCtrl(params, $uibModalInstance) {
        var that = this;

        that.runId = params.jobId;
        this.cancel = cancel;

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

    }
})
();
