/**
 * @Auther: zml
 * @Date: 2018/5/18
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacResultExecuteRuleCtrl', CacResultExecuteRuleCtrl);
    CacResultExecuteRuleCtrl.$inject = ['$state', 'entity', '$timeout', 'cacService', '$uibModalInstance', '$translate'];

    function CacResultExecuteRuleCtrl($state, entity, $timeout, cacService, $uibModalInstance, $translate) {
        var vm = this;
        var ruleTemp = entity.rule;
        vm.views = {
            ruleValue: entity.rule,
            tableInstance: null,
            cancel: cancel,
            reset: reset,
            execute: execute
        };

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function reset() {
            vm.views.ruleValue = ruleTemp;
        }

        function execute() {
            vm.views.ruleValue = $translate.instant('common.messages.operation.success', { operation: $translate.instant('cac.common.run') });
        }

    }


})
();
