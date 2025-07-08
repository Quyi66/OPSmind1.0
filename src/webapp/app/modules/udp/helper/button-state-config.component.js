/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/11/2018
 */

(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name udpButtonStateConfig
     * @description
     * Config button state
     * ```
     * <udp-button-state-config the-model="object"/>
     * ```
     */
    angular.module('oplus.commons').component('udpButtonStateConfig', {
        templateUrl: 'app/modules/udp/helper/button-state-config.html',
        bindings: {
            theModel: '='
        }
    });
})();
