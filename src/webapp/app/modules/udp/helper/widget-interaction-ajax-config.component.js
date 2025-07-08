/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/6/2018
 */
(function ($) {
    'use strict';

    /**
     * @param props {string}
     *
     */
    angular.module('oplus.udp').component('udpWidgetInteractionAjaxConfig', {
        bindings: {
            props: '='
        },
        // transclude: true,
        templateUrl: 'app/modules/udp/helper/widget-interaction-ajax-config.html',
        controller: ['$scope', '$http', function ($scope, $http) {
            var that = this;
        }]
    });
})(jQuery);
