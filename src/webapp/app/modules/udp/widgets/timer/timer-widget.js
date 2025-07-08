/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/13/2017
 */
(function () {
    'use strict';

    var app = angular.module('oplus.udp');

    app.run(['$translate', 'widgetValues', 'widgetFactory', '$interval', 'widgetUiHelper', timerWidget]);

    /**
     * @param $translate
     * @param widgetValues {widgetValues}
     * @param $interval
     * @param widgetUiHelper {widgetUiHelper}
     * @param widgetFactory {widgetFactory}
     */
    function timerWidget($translate, widgetValues, widgetFactory, $interval, widgetUiHelper) {
        widgetFactory.defineWidget({
            type: 'timer',
            group: 'control',
            eventProperty: 'eventbytimer',
            configController: 'WidgetConfigCtrl',
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                renderDynamicData: renderDynamicData
            }
        });

        function getTemplateForCompilation(props) {
            var html;
            var display = props.display || {};
            var css = display.style || 'btn-default';
            if (display.style === 'hidden') {
                html = widgetUiHelper.isEditMode() ? $translate.instant('udp.w.timer.edit_placeholder') : '';
            } else if (display.style === 'switch') {
                html = '<label class="i-switch bg-info m-t-xs m-r">' +
                    '<input type="checkbox" ng-checked="timer" ng-click="toggleTimer()">' +
                    '<i></i>' +
                    '</label>';
            } else {
                var started = $translate.instant('udp.w.timer.started');
                var stopped = $translate.instant('udp.w.timer.stopped');
                html = '<button class="btn ' + css + '" ng-click="toggleTimer()" ng-class="timer?\'btn-info\':\'btn-default\'">{{timer?"' + started + '":"' + stopped + '"}}</button>';
            }
            return html;
        }

        /**
         *
         * @param scope
         * @param element {jQuery}
         * @param props {{name:string,autoStart:boolean,eventbytimer:string,interval:number}}
         */
        function renderDynamicData(scope, element, props) {
            scope.toggleTimer = toggleTimer;
            scope.$on('$destroy', function onDestroy() {
                stopTimer();
            });
            var autoStart = props.autoStart;
            if (props.name) {
                var val = scope.$widget.$pageScope.pageParams[props.name];
                if (val === true || val === 'true') {
                    autoStart = true;
                } else if (val === false || val === 'false') {
                    autoStart = false;
                }
                scope.$on(widgetValues.events.PageParamChanged, onPageParamChange);
            }
            if (autoStart && !widgetUiHelper.isEditMode()) {
                // In edit mode do not auto start timer
                startTimer();
            }

            function onPageParamChange(event, args) {
                var params = args.params || {}, paramValue;
                paramValue = params[props.name];
                if (angular.isDefined(paramValue)) {
                    if (paramValue === false || paramValue === 'false') {
                        stopTimer();
                    } else if (paramValue === true || paramValue === 'true') {
                        startTimer();
                    }
                }
            }

            function startTimer() {
                if (angular.isUndefined(scope.timer)) {
                    scope.timer = $interval(function () {
                        // Try to solve in some case that page crash but timer still working
                        if (isVisible())
                            scope.$widget.fireWidgetEvent(props.eventbytimer);
                    }, props.interval * 1000);
                }
            }

            function isVisible() {
                // var pv = element.closest('.udp-page-view');
                // return pv.length > 0 && pv.is(':visible');
                return element.length > 0 && element.is(':visible');
            }

            function stopTimer() {
                if (angular.isDefined(scope.timer)) {
                    // console.log('Timer widget stopped...');
                    $interval.cancel(scope.timer);
                    scope.timer = undefined;
                }
            }

            function toggleTimer() {
                if (angular.isDefined(scope.timer)) {
                    stopTimer();
                } else {
                    startTimer();
                }
            }
        }
    }
})();
