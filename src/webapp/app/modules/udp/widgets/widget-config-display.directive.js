/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/29/2017
 */
(function () {
    /**
     * @ngdoc directive
     * @name udpWidgetConfigDisplay
     * @description
     * Usage:
     * ```
     * <udp-widget-config-display options="object">
     * </udp-widget-config-display>
     * ```
     *
     * General widget display settings include:
     * - cardMode: if use card mode
     * - widthMode: override widget default width mode. rename to blockmode?
     * - css: add extra css to widget
     * - width/height: auto (determined by content), 100% (percentage relative to parent), 20px (absolute pixel)
     *
     * @param {object} options
     * @param {boolean=} options.cardMode default is true
     */
    var udpWidgetConfigDisplayDirective = [function () {
        return {
            restrict: 'E',
            transclude: true,
            // scope: {
            //     options: '<'
            // },
            templateUrl: 'app/modules/udp/widgets/widget-config-display.html',
            controller: ['$scope', 'themeService', WidgetConfigDisplayCtrl]
        };

        /**
         *
         * @param $scope
         * @param themeService {themeService}
         * @constructor
         */
        function WidgetConfigDisplayCtrl($scope, themeService) {
            $scope.options = angular.extend({cardMode: true}, $scope.options);
        }
    }];

    angular.module('oplus.udp').directive('udpWidgetConfigDisplay', udpWidgetConfigDisplayDirective);
})();
