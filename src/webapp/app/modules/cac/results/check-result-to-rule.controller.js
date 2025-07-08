/**
 * @Auther: zml
 * @Date: 2018/5/18
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CheckResultToRuleCtrl', CheckResultToRuleCtrl);
    CheckResultToRuleCtrl.$inject = ['$http', 'entity', '$timeout', 'cacService', '$uibModalInstance', 'dataTable', 'CheckResultService', '$translate'];

    function CheckResultToRuleCtrl($http, entity, $timeout, cacService, $uibModalInstance, dataTable, CheckResultService, $translate) {
        var vm = this;
        vm.views = {
            id: entity.id,
            checkItemName: entity.name,
            tableInstance: null,
            cancel: cancel
        };
        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function init() {
            if (vm.views.id) {
                CheckResultService.getByIdCheckResult(vm.views.id).then(function (data) {
                    vm.views.metricStatus = data.status;
                    vm.views.metricName = data.itemName;
                    vm.views.metricValue = data.output;
                    if (vm.views.metricStatus == 'OK') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.pass');
                        vm.views.metricStatusClass = "badge bg-success";
                    } else if (vm.views.metricStatus == 'CHECK') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.check');
                        vm.views.metricStatusClass = "badge bg-warning";
                    } else if (vm.views.metricStatus == 'SKIPPING') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.skipping');
                        vm.views.metricStatusClass = "badge bg-default";
                    } else if (vm.views.metricStatus == 'FAILED') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.failed');
                        vm.views.metricStatusClass = "badge bg-danger";
                    } else {
                        vm.views.metricStatus = $translate.instant('common.messages.no_data');
                        vm.views.metricStatusClass = "label cac-bg-light-grey";
                    }
                }).catch(function (err) {
                    throw err;
                });
            } else {
                vm.views.metricStatus = $translate.instant('common.messages.no_data');
                vm.views.metricStatusClass = "label cac-bg-light-grey";
                vm.views.metricName = vm.views.checkItemName;
            }

        }

        init();
    }

})
();