/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/19/2017
 */
(function () {
    'use strict';

    angular.module('oplus.udp').run(['echartsWidgetBuilder', 'widgetFactory', linechartWidget]);

    /**
     *
     * @param chartWidgetBuilder {echartsWidgetBuilder}
     * @param widgetFactory {widgetFactory}
     */
    function linechartWidget(chartWidgetBuilder, widgetFactory) {
        var chartType = 'radar';
        widgetFactory.defineWidget({
            type: 'radarchart',
            name: '雷达图',
            group: 'data',
            resizable: 'h',
            configController: function (scope) {
                scope.axisOptions = {
                    xAxis: {
                        allowType: false,
                        customizable: ''
                    },
                    yAxis: {
                        multiple: true,
                        allowType: false,
                        allowPosition: false,
                        customizable: 'lineStyle,pointStyle'
                    }
                };
            },
            controlRenderer: chartWidgetBuilder.getControlRenderer(chartType)
        });
    }
})();