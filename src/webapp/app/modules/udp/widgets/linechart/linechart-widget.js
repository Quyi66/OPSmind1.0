/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/23/2017
 */
(function () {
    'use strict';

    angular.module('oplus.udp').run(['$translate','echartsWidgetBuilder', 'widgetFactory', 'chartUpdater', 'echartsFactory', linechartWidget]);

    /**
     *
     * @param chartWidgetBuilder {echartsWidgetBuilder}
     * @param widgetFactory {widgetFactory}
     * @param chartUpdater {chartUpdater}
     * @param {echartsFactory} echartsFactory
     */
    function linechartWidget($translate,chartWidgetBuilder, widgetFactory, chartUpdater, echartsFactory) {
        var chartType = 'line';
        // var builder = echartsFactory.createBuilder(chartType);//, {CHART_OBJ_CSS: 'js-chart-obj'});

        widgetFactory.defineWidget({
            type: 'linechart',
            name: $translate.instant('udp.w.linechart.name'),
            group: 'data',
            widthMode: 'wm-full',
            resizable: 'hw',
            configController: function (scope) {
                chartUpdater.upgradeProps(scope.uwProps);
                scope.uwProps.display = scope.uwProps.display || {};
                // scope.uwProps.display.yaxes = scope.uwProps.display.yaxes || [];
                scope.axisOptions = {
                    xAxis: {allowType: true},
                    yAxis: {multiple: true, allowType: true, allowPosition: true},
                    multipleYAxes: [{index: 0, label: $translate.instant('common.term.left_side')}, {index: 1, label: $translate.instant('common.term.right_side')}]
                };
            },
            controlRenderer: chartWidgetBuilder.getControlRenderer(chartType)
        });
    }
})();