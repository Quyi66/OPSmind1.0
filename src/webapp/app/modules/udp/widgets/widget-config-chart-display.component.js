/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/23/2017
 */
(function () {
    'use strict';
    // TODO: rename to udpWidgetConfigAxisChartDisplay
    angular.module('oplus.udp').component('udpWidgetConfigChartDisplay', {
        templateUrl: 'app/modules/udp/widgets/widget-config-chart-display.html',
        bindings: {
            props: '=ngModel',
            chartType: '<',
            options: '<'
        },
        controller: ['themeService', WidgetConfigChartDisplayCtrl]
    });

    /**
     *
     * @param themeService {themeService}
     * @constructor
     */
    function WidgetConfigChartDisplayCtrl(themeService) {
        this.palettes = themeService.getChartPalettes();
    }
})();
