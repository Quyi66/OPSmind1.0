/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/20/2017
 */

(function () {
    'use strict';

    angular.module('oplus.udp').run(['echartsWidgetBuilder', 'messageService', 'widgetFactory', 'widgetDataUtil', 'themeService', 'mapConfig', mapWidget]);

    /**
     * @param echartsWidgetBuilder {echartsWidgetBuilder}
     * @param messageService {messageService}
     * @param widgetFactory {widgetFactory}
     * @param widgetDataUtil {widgetDataUtil}
     * @param themeService {themeService}
     * @param {mapConfig} mapConfig
     */
    function mapWidget(echartsWidgetBuilder, messageService, widgetFactory, widgetDataUtil, themeService, mapConfig) {
        var chartType = 'map';
        widgetFactory.defineWidget({
            type: 'map',
            name: '地图',
            group: 'data',
            resizable: 'hw',
            configController: configController,
            controlRenderer: echartsWidgetBuilder.getControlRenderer(chartType)
        });

        function configController(scope) {
            scope.axisOptions = {
                xAxis: {
                    name: '地点',
                    customizable: ''
                },
                yAxis: {
                    name: '数值',
                    disableColor: true,
                    multiple: true,
                    customizable: 'chartType,pointStyle'
                }
            };
            scope.mapTypes =mapConfig.getMapTypes();
        }
    }
})();
