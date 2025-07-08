/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2021/08/20
 */
(function () {
    'use strict';
    /**
     * @usage
     * `<udp-page-and-param-config page-id="string" options="string"/>`
     * @param excluded {[string]} Page ids to be excluded
     */
    angular.module('oplus.udp').component('udpPageAndParamConfig', {
        bindings: {
            excluded: '<',
            pageId: '=',
            paramsJson:'=',
            onChange: '&',
            options: '<'
        },
        templateUrl: 'app/modules/udp/helper/page-and-param-config.html',
        controller: ['$scope', 'widgetDataInterface', function ($scope, widgetDataInterface) {
            var that = this;
        }]
    });
})();