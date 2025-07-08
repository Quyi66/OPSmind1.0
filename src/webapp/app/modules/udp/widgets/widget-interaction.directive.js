/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/8/2018
 */
(function () {
    'use strict';
    /**
     * @ngdoc
     *
     * @usage
     * <ANY udp-widget-interaction="object" variables="object"></ANY>
     *
     * @attr {object} variables Variable values
     * @attr {object} udpWidgetInteraction
     *
     * @description
     * Directive to handle widget interaction
     */
    angular.module('oplus.udp').directive('udpWidgetInteraction', widgetInteractionDirective);

    widgetInteractionDirective.$inject = ['widgetInteraction', 'widgetUiHelper'];

    /**
     *
     * @param widgetInteraction {widgetInteraction}
     * @param widgetUiHelper {widgetUiHelper}
     */
    function widgetInteractionDirective(widgetInteraction, widgetUiHelper) {
        return {
            restrict: 'A',
            scope: {
                // udpWidgetInteraction: '<',
                variables: '<'
            },
            link: function (scope, elem, attrs) {
                // var config = scope.udpWidgetInteraction;
                var config, intxAttr = attrs.udpWidgetInteraction;
                if (!intxAttr || intxAttr === 'disabled') {
                    return;
                }
                try {
                    config = JSON.parse(intxAttr || '{}');
                } catch (err) {
                    console.warn('Cannot parse', intxAttr, err);
                    config = {};
                }
                elem.on('click.widgetIntx', function (e) {
                    // console.log('click.widgetIntx in scope', scope, elem);
                    var values = scope.variables || {};
                    Object.keys(values).forEach(function (key) {
                        var value = values[key];
                        // Replace __PAGEPARAMS with page params
                        if (value === '__PAGEPARAMS') {
                            var pageScope = widgetUiHelper.findPageScope(scope);
                            if (pageScope)
                                values[key] = pageScope.pageParams;
                        }
                    });
                    //STRANGE 20180901: in oplus-portal-web, elem.scope() is undefined
                    // var widgetScope = widgetUiHelper.findWidgetScope(elem.scope());
                    var widgetScope = widgetUiHelper.findWidgetScope(scope);
                    // console.log('widget-interaction-directive', config, values);
                    widgetInteraction.handleInteraction(widgetScope, config, values, {element: e.currentTarget});
                    e.preventDefault();
                });
                scope.$on('$destroy', function () {
                    elem.off('click.widgetIntx');
                })
            }
        }
    }
})();
