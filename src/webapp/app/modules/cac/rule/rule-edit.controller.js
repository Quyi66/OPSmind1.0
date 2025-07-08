/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //新建、编辑规则Controller
    cacModule.controller('CacRuleEditCtrl', CacRuleEditCtrl);
    CacRuleEditCtrl.$inject = ['$uibModalInstance', '$timeout', '$compile', '$scope', 'cacRuleService', 'messageService', 'entity', '$translate'];

    function CacRuleEditCtrl($uibModalInstance, $timeout, $compile, $scope, cacRuleService, messageService, entity, $translate) {

        var vm = this;
        vm.views = {
            rule: entity.rule,
            cancel: cancel,
            save: save,
            uniqueFlag: false,
            option: {},
            showApplicability: false,
            labels: [
                $translate.instant('cac.rule.labels.0'),
                $translate.instant('cac.rule.labels.1'),
                $translate.instant('cac.rule.labels.2'),
                $translate.instant('cac.rule.labels.3'),
                $translate.instant('cac.rule.labels.4'),
                $translate.instant('cac.rule.labels.5'),
                $translate.instant('cac.rule.labels.6'),
                $translate.instant('cac.rule.labels.7'),
                $translate.instant('cac.rule.labels.8'),
            ]
        };

        if (vm.views.rule == null){
            vm.views.rule = {label: []};
        } else if (vm.views.rule.label == null) {
            vm.views.rule.label = [];
        } else {
            vm.views.rule.label = JSON.parse(vm.views.rule.label);
        }

        $timeout(function () {
            vm.views.option = {
                mode: 'text/javascript',
                lineNumbers: true,
                theme: 'opluscode',
                lineWrapping: true
            }
        });

        function save() {
            vm.views.rule.label = JSON.stringify(vm.views.rule.label);
            cacRuleService.addRule(vm.views.rule).then(function () {
                messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.save') }));
                $uibModalInstance.close({action: "edit"});
            }).catch(function (err) {
                throw err;
            });
        }

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }


        //注意这里用的是cacRuleEditVm而不是vm!
        /*$scope.$watch('cacRuleEditVm.views.rule.ruleName', function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.views.uniqueFlag = false;
                return;
            }
            vm.views.uniqueFlag = cacRuleService.checkRuleName(newValue);
        }, true);*/


    }
})
();
