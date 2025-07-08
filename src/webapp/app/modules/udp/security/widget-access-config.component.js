/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/17/2018
 */

(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name udpWidgetAccessConfig
     * @description
     * Config widget access control
     * ```
     * <udp-widget-access-config the-model="object"/>
     * ```
     */
    angular.module('oplus.commons').component('udpWidgetAccessConfig', {
        templateUrl: 'app/modules/udp/security/widget-access-config.html',
        bindings: {
            theModel: '='
        }
        // ,
        // controller: ['$scope', '$sce', 'widgetUiHelper', WidgetAccessConfigCtrl]
    });

    // /**
    //  *
    //  * @param $scope
    //  * @param $sce {$sce}
    //  * @param widgetUiHelper {widgetUiHelper}
    //  * @constructor
    //  */
    // function WidgetAccessConfigCtrl($scope, $sce, widgetUiHelper) {
    //     var that = this;
    // }
})();


