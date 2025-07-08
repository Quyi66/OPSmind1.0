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
     *         name: 'X Axis',
     *         allowSort: false
     *     },
     *     yAxis: {
     *         name: 'Y Axis',
     *         multiple: false,
     *         allowPosition: false
     *     }
     * }
     * ```
     * @attr uw-props {*}
     */
    angular.module('oplus.udp').directive('udpWidgetConfigChartMetrics', widgetConfigChartMetricsDirective);

    function widgetConfigChartMetricsDirective() {
        return {
            restrict: 'E',
            scope: {
                chartType: '@',
                axisOptions: '<',
                theModel: '=uwProps',
                fields: '<'
            },
            templateUrl: 'app/modules/udp/widgets/widget-config-chart-metrics.html',
            controller: ['$scope', '$translate', 'themeService', WidgetAxisConfigCtrl]
            // controllerAs: '$ctrl'
        };

        /**
         *
         * @param $scope
         * @param $translate
         * @param themeService {themeService}
         * @constructor
         */
        function WidgetAxisConfigCtrl($scope, $translate, themeService) {
            var that = $scope;
            var defaultOptions = {
                xAxis: {
                    name: $translate.instant('udp.w.echart.elem.x_axis'),
                    customizable: 'axisType'
                },
                yAxis: {
                    name:  $translate.instant('udp.w.echart.elem.y_axis'),
                    multiple: false,
                    allowPosition: false,
                    customizable: 'axisType,lineStyle,pointStyle,chartType'
                }
            };
            that.styles = {
                pointShapes: [{name: 'circle', label: $translate.instant('udp.w.echart.data_point.shapes.circle')},
                    {name: 'rect', label: $translate.instant('udp.w.echart.data_point.shapes.rect')},
                    {name: 'triangle', label: $translate.instant('udp.w.echart.data_point.shapes.triangle')},
                    {name: 'diamond', label:$translate.instant('udp.w.echart.data_point.shapes.diamond')}],
                lineTypes: [{name: 'solid', label: $translate.instant('udp.w.echart.line.type_solid')},
                    {name: 'dashed', label: $translate.instant('udp.w.echart.line.type_dashed')},
                    {name: 'dotted', label: $translate.instant('udp.w.echart.line.type_dotted')}]
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
                if (that.theModel.enabledYaxisHighlight) {
                    that.theModel.visualMap.splice(index, 1);
                }

                selectYAxis(index > 0 ? index - 1 : that.theModel.yAxes.length - 1);
            }
        }
    }
})();
