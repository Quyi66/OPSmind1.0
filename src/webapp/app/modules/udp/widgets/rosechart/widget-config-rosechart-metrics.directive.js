/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/29/2017
 */
(function () {
    /**
     * @ngdoc directive
     * @name udpWidgetConfigAxis
     * @description
     * Config widget axis.
     * @attr axis-options {{xAxis:{},yAxis:{}}}
     * ```js
     * {
     *     xAxis: {
     *         name: 'X轴',
     *         allowSort: false
     *     },
     *     yAxis: {
     *         name: 'Y轴',
     *         multiple: false,
     *         allowPosition: false
     *     }
     * }
     * ```
     * @attr uw-props {*}
     */
    angular.module('oplus.udp').directive('udpWidgetConfigRosechartMetrics', widgetConfigRosechartMetricsDirective);

    function widgetConfigRosechartMetricsDirective() {
        return {
            restrict: 'E',
            scope: {
                chartType: '@',
                axisOptions: '<',
                theModel: '=uwProps',
                fields: '<'
            },
            templateUrl: 'app/modules/udp/widgets/rosechart/widget-config-rosechart-metrics.html',
            controller: ['$scope', 'themeService', WidgetAxisConfigCtrl]
            // controllerAs: '$ctrl'
        };

        /**
         *
         * @param $scope
         * @param themeService {themeService}
         * @constructor
         */
        function WidgetAxisConfigCtrl($scope, themeService) {
            var that = $scope;
            var defaultOptions = {

            };

            var options = _.merge({}, defaultOptions, that.axisOptions);
            that.axisOptions = options;
            that.current = {index: -1, yAxis: undefined};
            that.addYAxis = addYAxis;
            that.removeYAxis = removeYAxis;
            that.selectYAxis = selectYAxis;
            that.configurables = {};
            // console.log(that.colors);

            that.theModel.yAxes = that.theModel.yAxes || [];
            if (that.theModel.yAxes.length === 0) {
                addYAxis();
            } else {
                selectYAxis(0);
            }
            // $scope.$watch('uwProps.display.yaxes', function (newVal, oldVal) {
            //
            // });

            function selectLegend(index){
                this.current.index = index;
            }
            function selectYAxis(index) {
                that.current.index = index;
                that.current.yAxis = that.theModel.yAxes[that.current.index];
            }

            function addYAxis() {
                that.theModel.yAxes.push({});
                selectYAxis(that.theModel.yAxes.length - 1);
            }

            function removeYAxis(index) {
                that.theModel.yAxes.splice(index, 1);
                selectYAxis(index > 0 ? index - 1 : that.theModel.yAxes.length - 1);
            }
        }
    }
})();
