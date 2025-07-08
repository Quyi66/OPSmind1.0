/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/23/2017
 */
(function () {
    'use strict';
    angular.module('oplus.udp').component('udpWidgetConfigRosechartDisplay', {
        templateUrl: 'app/modules/udp/widgets/rosechart/widget-config-rosechart-display.html',
        bindings: {
            props: '=ngModel',
            chartType: '<',
            options: '<'
        },
        controller: ['themeService', WidgetConfigRosechartDisplayCtrl]
    });

    /**
     *
     * @param themeService {themeService}
     * @constructor
     */
    function WidgetConfigRosechartDisplayCtrl(themeService) {
        this.palettes = themeService.getChartPalettes();
    }
})();
