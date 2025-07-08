/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/22/2017
 */
(function () {
    'use strict';

    var app = angular.module('oplus.udp');

    app.run(['$translate', 'widgetFactory', '$interval', '$filter', '$compile', clockWidget]);

    /**
     *
     * @param $translate
     * @param widgetFactory {widgetFactory}
     * @param $interval
     * @param $filter
     * @param $compile
     */
    function clockWidget($translate, widgetFactory, $interval, $filter, $compile) {
        widgetFactory.defineWidget({
            type: 'clock',
            group: 'text',
            configController: 'WidgetConfigCtrl',
            controlRenderer: {
                getTemplateForCompilation: function (props) {
                    var html = '<h4 style="font-weight: bold;color:#7CC0C4">{{currentDateAsString}}</h4>';
                    return html;
                },
                renderDynamicData: renderDynamicData
            }
        });

        function renderDynamicData(scope, element, props) {
            var format = $translate.instant('udp.w.clock.config.date_format');
            scope.currentDateAsString = $filter('date')(new Date(), format);
            scope.toggleTimer = toggleTimer;
            if (props.autoStart === true) {
                toggleTimer();
            }
            scope.$on('$destroy', function () {
                if (angular.isDefined(scope.timer)) {
                    $interval.cancel(scope.timer);
                }
            });

            function toggleTimer() {
                if (angular.isDefined(scope.timer)) {
                    $interval.cancel(scope.timer);
                    scope.timer = undefined;
                } else {
                    scope.timer = $interval(function () {
                        scope.$widget.fireWidgetEvent(props.event);
                        scope.currentDateAsString = $filter('date')(new Date(), format);
                    }, props.interval * 1000);
                }
            }
        }
    }
})();
