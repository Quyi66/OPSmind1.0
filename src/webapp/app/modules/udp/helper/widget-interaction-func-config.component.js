/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/10/2018
 */
(function ($) {
    'use strict';

    /**
     * @param props {string}
     *
     */
    angular.module('oplus.udp').component('udpWidgetInteractionFuncConfig', {
        bindings: {
            props: '='
        },
        templateUrl: 'app/modules/udp/helper/widget-interaction-func-config.html',
        controller: ['$scope', function ($scope) {
        }]
    });
})(jQuery);
