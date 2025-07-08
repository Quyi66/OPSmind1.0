/**
 * Widget for pie chart
 * <uwidget uw-type="piechart" uw-props='{"ds":"sampleDS","fields":[{"name":"a",label:"A",hidden:""},{"name":"b",label:"B"}]}''/>
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/20/2017
 */
(function () {
    'use strict';

    angular.module('oplus.udp').run(['$translate','echartsWidgetBuilder', 'widgetFactory', 'chartUpdater',
        function ($translate,echartsWidgetBuilder, widgetFactory, chartUpdater) {
            var chartType = 'pie';
            widgetFactory.defineWidget({
                type: 'piechart',
                name: $translate.instant('udp.w.piechart.name'),
                group: 'data',
                widthMode: 'wm-full',
                resizable: 'h',
                configController: function (scope, props) {
                    chartUpdater.upgradeProps(scope.uwProps);
                    scope.axisOptions = {
                        xAxis: {
                            customizable: ''
                        },
                        yAxis: {
                            customizable: ''
                        }
                    };
                },
                controlRenderer: echartsWidgetBuilder.getControlRenderer(chartType)
            });
        }]);
})();