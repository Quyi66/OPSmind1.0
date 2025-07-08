/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 10/15/2017
 */
(function () {
    'use strict';
    angular.module('oplus.udp').component('udpWidgetConfigFormatRule', {
        templateUrl: 'app/modules/udp/widgets/widget-config-format-rule.html',
        transclude: true,
        bindings: {
            rules: '=theModel',
            formats: '<'
        },
        controller: ['messageService', '$translate', WidgetConfigDisplayRuleCtrl]
    });

    /**
     *
     * @param messageService {messageService}
     * @constructor
     */
    function WidgetConfigDisplayRuleCtrl(messageService, $translate) {
        var ctrl = this;
        this.selectRule = selectRule;
        this.removeRule = removeRule;
        this.addRule = addRule;
        ctrl.rules = ctrl.rules || [];
        ctrl.current = {rule: undefined, index: -1};

        function selectRule(index) {
            ctrl.currentRule = ctrl.rules[index];
            ctrl.current.index = index;
            ctrl.current.rule = ctrl.rules[index];
        }

        function removeRule(index) {
            messageService.confirmWarning('', $translate.instant('udp.wc.condfmt.remove_rule'), function () {
                ctrl.rules.splice(index, 1);
            });
        }

        function addRule() {
            var rule = {};
            ctrl.currentRule = rule;
            ctrl.rules.push(ctrl.currentRule);
            ctrl.current = {rule: rule, index: ctrl.rules.length - 1};
        }
    }
})();
