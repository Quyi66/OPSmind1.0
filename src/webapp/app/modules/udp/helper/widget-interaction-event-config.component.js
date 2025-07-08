/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/9/2018
 */
(function ($) {
    'use strict';

    /**
     * @param props {string}
     *
     */
    angular.module('oplus.udp').component('udpWidgetInteractionEventConfig', {
        bindings: {
            props: '='
        },
        templateUrl: 'app/modules/udp/helper/widget-interaction-event-config.html',
        controller: ['$scope', function ($scope) {
        }]
    });
})(jQuery);
