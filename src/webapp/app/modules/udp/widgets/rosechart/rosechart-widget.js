/**
 * Widget for bar chart
 * <uwidget uw-type="barchart" uw-props='{"ds":"sampleDS","fields":[{"name":"a",label:"A",hidden:""},{"name":"b",label:"B"}]}''/>
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/23/2017
 */
(function () {
    'use strict';

    angular.module('oplus.udp').run(['echartsWidgetBuilder', 'widgetFactory', 'chartUpdater', 'widgetUiHelper', 'widgetDataUtil','themeService',
        function (chartWidgetBuilder, widgetFactory, chartUpdater, widgetUiHelper, widgetDataUtil,themeService) {
            widgetFactory.defineWidget({
                type: 'rosechart',
                name: '玫瑰图',
                group: 'data',
                resizable: 'h',
                configController: function (scope) {
                    chartUpdater.upgradeProps(scope.uwProps);
                    scope.uwProps.display = scope.uwProps.display || {};
                    scope.axisOptions = {};
                },
                controlRenderer: {
                    getTemplateForCompilation: getTemplateForCompilation,
                    onInitControl: onInitControl
                }
            });

            function getTemplateForCompilation(props) {
                if (!(props.dataset || {}).id && !props._sampleData) {
                    throw new WidgetNotConfiguredError('数据源或数据字段没有设置好');
                }
                var display = props.display || {};
                var height = display.height ? '100%' : '400px';
                return '<div class="js-chart-obj" style="width: 100%;height:' + height + ';"></div>';
            }


            function onInitControl(scope, elem, props) {
                var option = initDefaultOption();

                widgetDataUtil.queryData(elem, props).then(function (data) {
                    angular.forEach(props.yAxes,function(obj){
                        option.series.push({
                            type:"bar",
                            data:[],
                            coordinateSystem: 'polar',
                            name: obj.legend||obj.field,
                            originalName:obj.field,
                            stack: 'a'
                        });
                        option.legend.data.push(obj.legend||obj.field);
                    })
                    angular.forEach(data.records,function(obj){
                        for (var key in obj) {
                            if (key==="type") {
                                option.angleAxis.data.push(obj.type);
                            }
                            else {
                                var arr = _.find(option.series,{originalName:key});
                                if(arr){
                                    arr.data.push(obj[key]);
                                }
                            }
                        }
                    })


                    var chartWrapper = elem.find('div.js-chart-obj');
                    var paletteColors = themeService.getColorValuesByChartPalette(props.display.palette|| 'default');
                    var chartObj = echarts.init(chartWrapper[0]);
                    option.color = paletteColors;
                    chartObj.setOption(option);
                });

            }

            function initDefaultOption() {
                return {
                    angleAxis: {
                        type: 'category',
                        data: [],
                        z: 10
                    },
                    radiusAxis: {},
                    polar: {},
                    series: [],
                    // color: ['#0F6FC6', '#009DD9', '#0BD0D9', '#10CF9B', '#7CCA62', '#A5C249'],
                    legend: {
                        show: true,
                        data: []
                    }
                };
            }
        }]);
})();