/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 01/02/2018
 */
(function () {
    'use strict';

    angular.module('oplus.udp').run(['echartsWidgetBuilder', 'widgetFactory', 'themeService', gaugeWidget]);

    /**
     *
     * @param echartsWidgetBuilder {echartsWidgetBuilder}
     * @param widgetFactory {widgetFactory}
     */
    function gaugeWidget(echartsWidgetBuilder, widgetFactory, themeService) {
        var echartsType = 'gauge';
        widgetFactory.defineWidget({
            type: 'gauge',
            name: '仪表盘',
            group: 'data',
            resizable: 'h',
            // tag: 'dev',
            configController: function (scope) {
                // scope.axisOptions = {
                //     xAxis: {enabled: false, allowType: false},
                //     yAxis: {multiple: false, allowType: false, allowPosition: false}
                // };

                scope.axisOptions = {
                    xAxis: {
                        enabled: false,
                        customizable: ''
                    },
                    yAxis: {
                        chartType: 'gauge',
                        customizable: ''
                    }
                };

                this.palettes = themeService.getChartPalettes();

                scope.getGaugeColor = function () {
                    scope.uwProps.display = scope.uwProps.display || {};

                    scope.uwProps.display.gaugeColor = scope.uwProps.display.gaugeColor ||
                        [
                            [0.3, "#4e79a7"],
                            [0.7, "#59a14f"],
                            [1, "#9c755f"]
                        ];

                    return scope.uwProps.display.gaugeColor;
                };

                scope.changePalette = function () {
                    if (scope.uwProps.display.gaugeColor.length > 0) {
                        var selectedPalette = this.palettes[scope.uwProps.display.palette];
                        var total = scope.uwProps.display.gaugeColor.length > selectedPalette.colors.length ? selectedPalette.colors.length : scope.uwProps.display.gaugeColor.length;
                        for (var i = 0; i < total; i++) {
                            scope.uwProps.display.gaugeColor[i][1] = selectedPalette.colors[i];
                        }
                    }
                };

                //scope.uwProps.display.gaugeColor = null;// selected color
                scope.addGaugeColor = function () {
                    var newColor = "";
                    var selectedPalette = scope.uwProps.display.palette != null ? this.palettes[scope.uwProps.display.palette] : {colors: []};
                    if (scope.uwProps.display.gaugeColor.length < selectedPalette.colors.length) {
                        newColor = selectedPalette.colors[scope.uwProps.display.gaugeColor.length];
                    } else {
                        newColor = "#000";
                    }
                    scope.uwProps.display.gaugeColor.push([1, newColor]);
                };

                scope.removeGaugeColor = function (index) {
                    scope.uwProps.display.gaugeColor.splice(index, 1);
                };
            },
            controlRenderer: echartsWidgetBuilder.getControlRenderer(echartsType)
        });
    }
})();