/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/28/2017
 */

(function () {
    /**
     * @ngdoc
     * @name widgetValues
     * @param events
     */
    angular.module('oplus.udp').value('widgetValues', {
        IN_PAGE: 'in_display',
        IN_CANVAS: 'in_design',
        events: {
            PageParamChanged: 'UDP_PAGEPARAM_CHANGED',
            WidgetEvent: 'UDP_WIDGET_EVENT'
        }
    });
})();
