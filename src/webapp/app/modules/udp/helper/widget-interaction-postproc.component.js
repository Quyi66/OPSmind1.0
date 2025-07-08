/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/02/22
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name udpWidgetInteractionPostproc
     * @desc Configuration of post process on interaction completion
     * @usage
     * ```
     * <udp-widget-interaction-postproc proc-props="">
     * ```
     * @param procProps {string} Properties for post process
     *
     */
    angular.module('oplus.udp').component('udpWidgetInteractionPostproc', {
        bindings: {
            procProps: '='
        },
        templateUrl: 'app/modules/udp/helper/widget-interaction-postproc.html',
        controller: ['widgetInteraction',
            /**
             *
             * @param {widgetInteraction} widgetInteraction
             * @constructor
             */
            function UdpWidgetInteractionPostprocCtrl(widgetInteraction) {
                this.postProcs = widgetInteraction.POST_PROCS;
            }]
    });
})();
