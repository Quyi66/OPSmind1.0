/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/27/2017
 */

(function () {
    'use strict';

    angular.module('oplus.udp').run(['$translate','widgetFactory', 'widgetDataUtil', 'widgetUiHelper', 'themeService', 'echartsFactory', 'mapConfig', routeWidget]);

    /**
     *
     * @param $translate
     * @param widgetFactory {widgetFactory}
     * @param widgetDataUtil {widgetDataUtil}
     * @param themeService {themeService}
     * @param {widgetUiHelper} widgetUiHelper
     * @param {echartsFactory} echartsFactory
     * @param {mapConfig} mapConfig
     */
    function routeWidget($translate,widgetFactory,  widgetDataUtil, widgetUiHelper, themeService, echartsFactory, mapConfig) {
        var builderConfig = {multiCharts: false, defaultHeight: 400};
        var chartBuilder = echartsFactory.createBuilder('route', builderConfig);
        widgetFactory.defineWidget({
            type: 'route',
            resizable: 'hw',
            configController: RouteWidgetConfigCtrl,
            group: 'data',
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onInitControl: onInitControl,
                onResize: onResize
            }
        });

        function RouteWidgetConfigCtrl(scope, props) {
            scope.fieldOptions = {
                fieldDefs: [
                    {title: $translate.instant('udp.w.route.config.from'), name: 'from'},
                    {title: $translate.instant('udp.w.route.config.to'), name: 'to'},
                    {title: $translate.instant('udp.w.route.config.value'), name: 'value'}
                ]
            };
            scope.mapTypes = mapConfig.getMapTypes();
        }

        function onResize(element, args) {
            chartBuilder.onResize(element, args);
        }

        function getTemplateForCompilation(props) {
            return chartBuilder.getTemplateForCompilation(props);
        }

        // function renderError($elem, message) {
        //     var chartElem = $('div.op-map-chart', $elem)[0];
        //     $(chartElem).addClass('alert alert-warning').html('<div>' + message + '</div>');
        // }

        // function getSymbol() {
        //     var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
        //     return planePath;
        // }

        function getCoordinate(place, map) {
            return mapConfig.getGeoCoordMap('china')[place];
        }

        function onInitControl(scope, elem, props) {
            // return chartBuilder.onInitControl(scope, elem, props);
            var display = props.display || {},
                dataset = props.dataset,
                fields = props.fields || {};
            var from = fields.from, to = fields.to, value = fields.value;
            var mapType = display.mapType;
            //, useVisualMap = !display.visualMap;
            // if (!dataset || !to || !from) return renderError(elem, '数据源或数据字段没有设置好');
            // if (!mapType) return renderError(elem, '没有设定地图类型');
            mapConfig.registerMap(mapType).then(function () {
                return widgetDataUtil.queryAndConvertData(scope, elem, props);
            }).then(function (data) {
                renderMap(mapType, data.records);
            }).catch(function (err) {
                widgetUiHelper.showWidgetError(elem, err.message);
            });

            function renderMap(mapType, records) {
                //TODO: optimize it?
                var fields = [value.field], fns = [value.convertFn];
                // to.forEach(function (y) {
                //     fields.push(y.field);
                //     fns.push(y.convertFn);
                // });
                // console.log(records);
                widgetDataUtil.transDataFields(records, fields, fns);
                var fontFamily = themeService.getFontFamily();
                var series = [], legends = [], oneSeries;
                var visualMaps = [];
                // to.forEach(function (y, i) {
                var geoOpts = {
                    map: mapType,
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    roam: !!display.zoomable,
                    itemStyle: {
                        normal: {
                            areaColor: '#323c48',
                            borderColor: '#404a59'
                        },
                        emphasis: {
                            areaColor: '#2a333d'
                        }
                    }
                };
                var placeData = [], pathData = [], i = 1;
                records.forEach(function (record, i) {
                    var fromCoord = getCoordinate(record[from.field]);
                    var toCoord = getCoordinate(record[to.field]);
                    if (fromCoord && toCoord) {
                        placeData.push({
                            fromName: record[from.field],
                            toName: record[to.field],
                            coords: [fromCoord, toCoord]
                        });
                        pathData.push({
                            name: record[to.field],
                            value: getCoordinate(record[to.field]).concat(record[value.field])
                        });
                    }
                });
                var color = ['#a6c84c', '#ffa022', '#46bee9'];
                var seriesName = 'one-series';
                var fromSeries = {
                    name: seriesName,
                    type: 'lines',
                    data: placeData,
                    zlevel: 1,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0.4,
                        // color: '#fff',
                        symbolSize: 3
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 0,
                            curveness: 0.2
                        }
                    }
                };
                var toSeries = {
                    name: seriesName,
                    type: 'lines',
                    data: placeData,
                    zlevel: 2,
                    // http://echarts.baidu.com/option.html#series-effectScatter.symbol
                    symbol: ['none', 'none'],
                    symbolSize: 10,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        // symbol: getSymbol(),
                        symbol: 'circle',//getSymbol(),
                        symbolSize: 8
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 1,
                            opacity: 0.6,
                            curveness: 0.2
                        }
                    }
                };
                var pathSeries = {
                    name: seriesName,
                    type: 'effectScatter',
                    data: pathData,
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: function (val) {
                        return val[2] / 8;
                    },
                    itemStyle: {
                        normal: {
                            color: color[i]
                        }
                    }
                };
                series.push(fromSeries, toSeries, pathSeries);

                var option = {
                    // backgroundColor: '#404a59',
                    title: {
                        text: props.title,
                        show: false,
                        left: 'center'
                    },
                    tooltip: {
                        textStyle: {
                            fontFamily: fontFamily
                        },
                        trigger: 'item'
                    },
                    legend: {
                        data: legends,
                        orient: 'vertical',
                        top: 'bottom',
                        left: 'right',
                        selectedMode: 'single',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    geo: geoOpts,
                    series: series
                };
                var chartElem = $('div.js-chart-obj', elem)[0];
                echarts.init(chartElem).setOption(option);
            }
        }
    }
})();
