/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/8/2018
 */
(function ($) {
    'use strict';

    /**
     * @param props {string}
     *
     */
    angular.module('oplus.udp').component('udpWidgetInteractionLinkConfig', {
        bindings: {
            props: '='
        },
        templateUrl: 'app/modules/udp/helper/widget-interaction-link-config.html',
        controller: ['$scope', function ($scope) {
            var that = this;
        }]
    });
})(jQuery);
