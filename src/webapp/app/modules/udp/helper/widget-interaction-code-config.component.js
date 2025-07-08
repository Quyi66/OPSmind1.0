/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/10/31
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name udpWidgetInteractionCodeConfig
     * @param props {string}
     */
    angular.module('oplus.udp').component('udpWidgetInteractionCodeConfig', {
        bindings: {
            props: '='
        },
        templateUrl: 'app/modules/udp/helper/widget-interaction-code-config.html',
        controller: ['$scope', function ($scope) {
        }]
    });
})();
