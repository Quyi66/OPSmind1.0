/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict';

    angular
        .module('oplus.jao')
        .controller('CleanLogController', CleanLogController);

    CleanLogController.$inject = ['$scope', '$stateParams', '$uibModalInstance', 'jaoJobService', 'messageService', '$translate', '$state'];

    function CleanLogController($scope, $stateParams, $uibModalInstance, jaoJobService, messageService, $translate, $state) {
        var vm = this;
        vm.clear = clear;
        vm.save = save;

        vm.clean_policies = [{
            "policy": "1",
            "desc": $translate.instant('jao.job.runlogs.clean.policies.1_hour')
        }, {
            "policy": "24",
            "desc": $translate.instant('jao.job.runlogs.clean.policies.24_hours')
        }, {
            "policy": "7",
            "desc": $translate.instant('jao.job.runlogs.clean.policies.7_days')
        }, {
            "policy": "30",
            "desc": $translate.instant('jao.job.runlogs.clean.policies.30_days')
        }, {
            "policy": "0",
            "desc": $translate.instant('jao.job.runlogs.clean.policies.all')
        }];

        vm.choose_clean_policy = "1";

        function clear() {
            $uibModalInstance.close({action: "cancel"});
            $uibModalInstance.dismiss({action: "cancel"});
        }


        function save() {
            messageService.confirm($translate.instant("jao.job.runlogs.clean.confirm.title"), $translate.instant("jao.job.runlogs.clean.confirm"), function () {
                jaoJobService.cleanLogs(vm.choose_clean_policy).then(function (result) {
                    messageService.toast('success', $translate.instant("jao.job.runlogs.clean.success"));
                    onSaveSuccess(result);
                    $state.go('app.jao.runlogs', null, {reload: true});
                }).catch(function (err) {
                    messageService.toast('failed', 'Clean logs Failed' + err);
                });
            });
        }

        function onSaveSuccess(result) {
            $uibModalInstance.close();
        }

        function onSaveError() {
        }
    }
})();
