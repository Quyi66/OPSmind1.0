/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/13/2018
 */
(function () {
    'use strict';
    /**
     * @ngdoc directive
     * @name udpStateControl
     * @description
     * Control element states of enable and visibility
     * @restrict A
     * @example
     * <ANY udp-state-control="string"/>
     */
    angular.module('oplus.udp').directive('udpStateControl', ['widgetUiHelper', 'dataEx', 'widgetDataUtil', widgetStateControl]);

    /**
     * @param {widgetUiHelper} widgetUiHelper
     * @param {dataEx} dataEx
     * @param {widgetDataUtil} widgetDataUtil
     */
    function widgetStateControl(widgetUiHelper, dataEx, widgetDataUtil) {
        return {
            restrict: 'A',
            bindToController: {
                config: '<udpStateControl'
            },
            controller: ['$scope', '$element', WidgetStateControlCtrl],
            controllerAs: '$ctrl',
            link: linkFn
        };

        /**
         * Controller for widget state control
         */
        function WidgetStateControlCtrl($scope, $element) {
            // var config = this.config;
            // console.log($element);
            // widgetUiHelper.changeElementState($element, config);

        }

        function linkFn(scope, element, attrs, ctrl) {
            var config = ctrl.config;
            var target = element;
            if (target.hasClass('uw-body')){
                target = target.parent(); //Change state for parent
            }
            if (!widgetUiHelper.isEditMode() && config.enabled && config.allow) {
                widgetUiHelper.changeElementState(target, config, scope);
                var varsGroup = extractVars(config.allow);
                scope.$watchGroup(varsGroup, function (newVal, oldVal) {
                    widgetUiHelper.changeElementState(target, config, scope);
                });
            }

            function extractVars(expr) {
                var result = [];
                var matches = expr.match(/\${(.+?)}/g);
                if (matches) {
                    matches.forEach(function (v) {
                        var name = v.replace(/\${@\.(.+?)}/, '$widget.$pageScope.pageParams.$1')
                            .replace(/\${#\.(.+?)}/, '$widget.$pageScope.globalParams.$1');
                        if (result.indexOf(name) < 0)
                            result.push(name);
                    })
                }
                return result;
            }
        }
    }
})();
