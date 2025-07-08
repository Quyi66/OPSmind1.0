/**
 * Widget for bar chart
 * <uwidget uw-type="barchart" uw-props='{"ds":"sampleDS","fields":[{"name":"a",label:"A",hidden:""},{"name":"b",label:"B"}]}''/>
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/23/2017
 */
(function () {
    'use strict';

    angular.module('oplus.udp').run(['$translate','echartsWidgetBuilder', 'widgetFactory', 'chartUpdater', 'echartsFactory',
        function ($translate,echartsWidgetBuilder, widgetFactory, chartUpdater, echartsFactory) {
            var chartType = 'bar';
            var builder = echartsFactory.createBuilder(chartType);
            widgetFactory.defineWidget({
                type: 'barchart',
                name: $translate.instant('udp.w.barchart.name'),
                group: 'data',
                resizable: 'hw',
                widthMode:'wm-full',
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
                controlRenderer: echartsWidgetBuilder.getControlRenderer(chartType)
            });
        }]);
})();
