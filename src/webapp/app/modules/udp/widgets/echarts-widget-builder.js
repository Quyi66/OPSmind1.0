/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 10/12/2017
 */
(function () {
    'use strict';

    angular.module('oplus.udp').service('echartsWidgetBuilder', echartsWidgetBuilder);

    echartsWidgetBuilder.$inject = ['$q', '$translate', '$timeout', 'messageService', 'widgetUiHelper', 'widgetDataUtil', 'widgetInteraction', 'themeService', 'mapConfig', 'chartUpdater', 'echartsFactory', 'devel', '$localStorage'];

    /**
     * @ngdoc service
     * @name echartsWidgetBuilder
     * Chart builder with http://echarts.baidu.com
     * @param $timeout
     * @param messageService {messageService}
     * @param widgetUiHelper {widgetUiHelper}
     * @param widgetDataUtil {widgetDataUtil}
     * @param widgetInteraction {widgetInteraction}
     * @param themeService {themeService}
     * @param chartUpdater {chartUpdater}
     * @param {echartsFactory} echartsFactory
     * @param {devel} devel
     */
    function echartsWidgetBuilder($q, $translate, $timeout, messageService, widgetUiHelper, widgetDataUtil, widgetInteraction, themeService, mapConfig, chartUpdater, echartsFactory, devel, $localStorage) {
        var PIE_CHART = 'pie',
            RADAR_CHART = 'radar',
            MAP_CHART = 'map',
            GAUGE_CHART = 'gauge',
            DOUGHNUT_CHART = 'doughnut',
            SCATTER_CHART = 'scatter',
            BAR_CHART = 'bar',
            LINE_CHART = 'line',
            ROSE_CHART = 'rose';
        var VFIELD_X = '__vx', VFIELD_Y = '__vy';
        var datastreamKey = '_streamLastUpdate';
        this.getControlRenderer = getControlRenderer;

        /**
         *
         * @param {string} chartType
         * @returns {{getTemplateForCompilation: getTemplateForCompilation, renderDynamicData: (function(*=, *=, *=): *), reloadData: reloadData}}
         */
        function getControlRenderer(chartType) {
            return {
                getTemplateForCompilation: getTemplateForCompilation,
                renderDynamicData: function (scope, elem, props) {
                    return renderChart(chartType, scope, elem, props);
                },
                reloadData: reloadData,
                onResize: function onResize(widgetElem, size) {
                    echartsFactory.createBuilder(chartType, {}).onResize(widgetElem, size);
                }
            };
        }

        function checkDataset(props, chartType) {
            return ((props['dataset'] || {})._type === 'datax' || (props['dataset'] || {}).id) && ((chartType === GAUGE_CHART || props.xAxis) && props.yAxes);
        }

        function getTemplateForCompilation(props, chartType) {
            if (!checkDataset(props, chartType)) {
                throw new WidgetNotConfiguredError($translate.instant('udp.wc.error.missing_dataset_or_field'));
            }
            var display = props.display || {};
            //TODO: a minimum height of 50px
            var height = display.height || 400;//Math.max(display.height || 0, 50);
            // Use element to make sure height accept number and string
            var elem = angular.element('<div class="js-chart-obj h-100"></div>');
            // elem.css('height', height);//.css('width', '100%');
            return elem.prop('outerHTML');
        }


        /**
         * Update data in series[i].data
         * @param props
         * @param {[[object]]|[object]} records
         * @param chartOption
         * @param isStream {boolean} If this is stream data
         */
        function updateChartOption(props, records, chartOption, isStream) {
            var isMultiDatasets = records.length > 0 && angular.isArray(records[0]);
            // console.log(records);
            var xAxisType = props.xAxis.axisType || 'category';
            var xField = VFIELD_X;
            if (chartOption && chartOption.radar) {
                updateRadarData();
            } else if (xAxisType === 'category') {
                if (chartOption._maintype === PIE_CHART) {
                    var legendData = [];
                    records.forEach(function (obj) {
                        legendData.push({name: obj[VFIELD_X], icon: "circle"})
                    });
                    chartOption.legend.data = legendData;
                } else if (chartOption._maintype === GAUGE_CHART) {
                    // Do nothing
                } else if (chartOption._maintype === MAP_CHART) {
                    // Do nothing
                } else {
                    updateXData();
                }
            }
            updateYData();
            return;

            function updateXData() {
                var xdata = [], recs = records;
                if (isMultiDatasets) {
                    recs = records[0];
                }
                recs.forEach(function (record) {
                    xdata.push(record[xField]);
                });
                chartOption.xAxis[0].data = xdata;

                /**
                 *  双x轴配置, add by lbb 2019-07-29
                 */
                if (chartOption._maintype === LINE_CHART && props.enabledDoubleX) {
                    var x2Data = [];
                    recs.forEach(function (record) {
                        x2Data.push(record[VFIELD_X + 1]);
                    });

                    chartOption.xAxis[1].data = x2Data;

                }
            }

            function updateRadarData() {
                var recs = records;
                if (isMultiDatasets) {
                    recs = records[0];
                }
                chartOption.radar.indicator = [];
                recs.forEach(function (record) {
                    chartOption.radar.indicator.push({name: record[xField]});
                });
            }

            function updateYData() {
                var visualMapIndex = 0;
                // console.log(records);
                props.yAxes.forEach(function (yaxis, seriesIndex) {
                    var _records;
                    if (isMultiDatasets) {
                        if (angular.isDefined(yaxis.dsIndex)) {
                            _records = records[yaxis.dsIndex];
                            // console.log(yaxis, _records);
                        } else {
                            _records = records[0];
                        }
                    } else {
                        _records = records;
                    }
                    var yField = VFIELD_Y + seriesIndex;
                    var series = chartOption.series[seriesIndex];
                    if (isStream) {
                        series.data = chartOption.series[seriesIndex].data;
                    } else {
                        series.data = [];
                    }

                    var radarDatum = {value: [], name: series.name};
                    var limits = {};
                    var fieldForVisualMap;
                    var recordLength = _records.length;
                    if (axisNeedsVisualMap(yaxis)) {
                        if (yaxis.chartType === MAP_CHART) {
                            fieldForVisualMap = yField;
                        } else if (yaxis.chartType === SCATTER_CHART) {
                            var todoDimForColor = 1;
                            fieldForVisualMap = _getSubFieldName(yField, todoDimForColor);
                        }
                        // console.log('fieldForVisualMap', fieldForVisualMap);
                    }
                    // For time type line chart, use `contTime` to determine if
                    // there is one missing time point, shall we connect its neighbor
                    // points or break the line
                    var contTime = yaxis.contTime || {},
                        continuousTimeLimit;
                    if (contTime.enabled) {
                        continuousTimeLimit = moment.duration(contTime.limit, contTime.unit).asMilliseconds();
                    }
                    _records.forEach(function (record, _index) {
                        updateOneRecord(record, _index);
                    });

                    if (series.type === RADAR_CHART) {
                        series.data.push(radarDatum);
                    }
                    if (axisNeedsVisualMap(yaxis)) {
                        var vm = chartOption.visualMap[visualMapIndex++];
                        vm.min = Math.floor(limits.min);
                        vm.max = Math.ceil(limits.max);
                    }

                    /**
                     * 折线图组件支持双X轴配置 add by lbb 2019-07-18
                     */
                    if (chartOption._maintype === LINE_CHART && props.enabledDoubleX) {
                        props.yAxes2.forEach(function (yAxis, index) {
                            var _records;
                            if (isMultiDatasets) {
                                if (angular.isDefined(yAxis.dsIndex)) {
                                    _records = records[yAxis.dsIndex];
                                } else {
                                    _records = records[0];
                                }
                            } else {
                                _records = records;
                            }
                            var seriesIndex = props.yAxes.length + index;
                            var yField2 = VFIELD_Y + seriesIndex;
                            var xField2 = VFIELD_X + 1;
                            var series = chartOption.series[seriesIndex];
                            if (isStream) {
                                series.data = chartOption.series[seriesIndex].data;
                            } else {
                                series.data = [];
                            }

                            _records.forEach(function (record, _index) {
                                series.data.push(record[yField2]);

                            });
                            series.xAxisIndex = 1;
                        })


                    }

                    return;

                    function updateOneRecord(record, _index) {
                        if (isStream) {
                            series.data.shift();
                        }
                        if (fieldForVisualMap) {
                            var val = record[fieldForVisualMap];
                            // if (props.title === '世界地图' && fieldForVisualMap === '!vy0')
                            //     console.log(record, val);
                            if (angular.isUndefined(limits.min) || val < limits.min) {
                                limits.min = val;
                            }
                            if (angular.isUndefined(limits.max) || val > limits.max) {
                                limits.max = val;
                            }
                        }
                        if (series.type === MAP_CHART) {
                            // series.data.push({name: record[xField], value: val});
                            series.data.push({name: record[xField], value: record[yField]});
                        } else if (series.type === GAUGE_CHART) {
                            series.data.push({name: series.name, value: record[yField]});
                        } else if (series.type === SCATTER_CHART) {
                            var geoCoordMap = mapConfig.getGeoCoordMap(props.display.mapType);
                            // console.log(geoCoordMap);
                            var geoCoord = geoCoordMap[record[xField]];
                            if (geoCoord) {
                                var values = [];
                                if (_useAuxData(yaxis)) {
                                    // Put values of all aux data
                                    for (var m = 0; m < Object.keys(yaxis.auxData).length; m++) {
                                        var fieldName = _getSubFieldName(yField, m);
                                        // console.log(fieldName,record,record[fieldName]);
                                        values.push(record[fieldName]);
                                    }
                                } else {
                                    values.push(record[yField]);
                                }
                                series.data.push({
                                    name: record[xField],
                                    value: geoCoord.concat(values)
                                    // value: record[yField]
                                });
                            }
                        } else if (series.type === RADAR_CHART) {
                            radarDatum.value.push(record[yField]);
                        } else if (series.type === PIE_CHART) {
                            series.data.push({name: record[xField], value: record[yField]});
                            // chartOption.legend.data.push(record[xField]);
                        } else if (xAxisType === 'category') {
                            series.data.push(record[yField]);
                        } else {
                            series.data.push([record[xField], record[yField]]);
                            if (continuousTimeLimit > 0 && xAxisType === 'time' && series.type === LINE_CHART) {
                                if (_index < recordLength - 1) {
                                    var thisPoint = moment(record[xField]).valueOf(),
                                        nextPoint = moment(_records[_index + 1][xField]).valueOf();
                                    if (Math.abs(thisPoint - nextPoint) > continuousTimeLimit) {
                                        // console.log(record[xField], records[_index + 1]);
                                        series.data.push(nextPoint - 1, null);
                                    }
                                }
                            }
                        }
                    }
                });


            }
        }

        function axisNeedsVisualMap(axis) {
            if (axis.chartType === MAP_CHART) {
                return axis.auxData;
            }
            if (axis.chartType === SCATTER_CHART) {
                return axis.auxData;
            }
        }

        /**
         * Get the series, x-axis value, y-axis value of clicked point.
         * @returns {{S:string, X:string|date, Y:number|*}|null} For pie chart, `X` is label
         * `null` for no point clicked
         */
        function getClickedValues(params) {
            var type = params.seriesType;
            var clicked;
            if (type === 'line') {
                clicked = {
                    S: params.seriesName,
                    X: params.data[0] || params.name,
                    Y: params.data[1] || params.value
                };
            } else {
                clicked = {
                    S: params.seriesName,
                    X: params.name,
                    Y: params.value
                };
            }
            return clicked;
        }

        function registerEchartsThemes(paletteId) {
            var theme = {
                'color': themeService.getColorValuesByChartPalette(paletteId)
            };
            echarts.registerTheme(paletteId, theme);
        }

        /**
         *
         * @param chartType
         * @param scope
         * @param element
         * @param props
         * @returns {*}
         */
        function renderChart(chartType, scope, element, props) {
            var d = $q.defer();
            chartUpdater.upgradeProps(props);
            props = props || {};
            if (!checkDataset(props, chartType)) {
                return;
            }
            var chartWrapper = element.find('div.js-chart-obj');
            var chartOption, chartObj;
            var display = props.display || {};
            if (display.palette) {
                registerEchartsThemes(display.palette);
            } else {
                registerEchartsThemes('default');
            }
            before().then(function () {
                // LEO@20220106: disable y scroll.
                // In some case, the uw-content height is 246.5 but chart height is 247.
                element.find('.uw-content').css('overflow', 'hidden');
                // It's strange. When using min-height for wrapper, chart cannot be rendered without timeout
                $timeout(function () {
                    // console.log('initChartOption: chartWrapper=%o, html=%s,height=%s',chartWrapper,chartWrapper.prop('outerHTML'),chartWrapper.height());
                    chartObj = echarts.init(chartWrapper[0], display.palette || 'default');
                    chartOption = initChartOption(chartType, props);

                    function handleDatazoom(chartObj) {
                        var zoomEndTime;
                        chartObj.on('datazoom', function (params) {
                            zoomEndTime = Date.now();
                            // Use setTimeout to prevent saving datazoom props during zooming
                            var timeoutMs = 1000;
                            setTimeout(function () {
                                var now = Date.now();
                                if (now - zoomEndTime >= timeoutMs) {
                                    saveDataZoom(chartObj);
                                }
                            }, timeoutMs);
                        });

                        function saveDataZoom(chartObj) {
                            //https://blog.csdn.net/qq_32475739/article/details/79099898
                            var dz = chartObj.getModel().option.dataZoom[0];
                            var start = Math.round(dz.start);
                            var end = Math.round(dz.end);
                            var widgetElemId = element.attr('id');
                            if (!angular.isDefined($localStorage.chartDataZoom)) {
                                $localStorage.chartDataZoom = [];
                            }
                            var index = _.findIndex($localStorage.chartDataZoom, {'id': widgetElemId});
                            if (index == -1) {
                                $localStorage.chartDataZoom.push({'id': widgetElemId, 'start': start, 'end': end});
                            } else {
                                $localStorage.chartDataZoom[index].start = start;
                                $localStorage.chartDataZoom[index].end = end;
                            }
                        }
                    }

                    queryAndLoadData(scope, element, props, chartObj, chartOption).finally(function () {
                        d.resolve();
                        if (chartType === LINE_CHART && display.rangeSlider) {
                            handleDatazoom(chartObj);
                        }
                    });
                    // console.log('chartOption', JSON.stringify(chartOption));
                    // Save chart option to data
                    element.data('_theChart', chartOption);
                    chartObj.on('click', onClick);
                }, 0);
            }).catch(function (err) {
                messageService.alertError(err.message);
                d.reject(err);
            });
            return d.promise;

            function initChartOption(widgetChartType, props) {
                props.xAxis = props.xAxis || {};
                props.yAxes = props.yAxes || [];
                props.xAxis2 = props.xAxis2 || {};
                props.yAxes2 = props.yAxes2 || [];
                props.display = props.display || {};
                props.visualMap = props.visualMap || [];
                var visualMapPositions = {left: 0},
                    allSeries = [],
                    legends = [];
                var chartColors = themeService.calcColors(scope, props.display.theme);
                // console.log(props.title, chartColors);
                var chartOption = initDefaultOption();

                if (widgetChartType === MAP_CHART) {
                    initGeo();
                } else if (widgetChartType === RADAR_CHART) {
                    chartOption.radar = {};
                } else if (widgetChartType === PIE_CHART) {
                    // 设置饼图图例靠右侧
                    if (props.display.legend && props.display.legend.position === 'right') {
                        chartOption.legend.orient = 'vertical';
                        chartOption.legend.top = 20;
                        chartOption.legend.bottom = 20;
                        chartOption.legend.right = 0;
                    }
                } else if (widgetChartType === GAUGE_CHART) {
                    chartColors.borderColor = props.display.gaugeColor;
                } else {
                    chartOption.xAxis = initXAxis();
                    chartOption.yAxis = initYAxis();
                    if (widgetChartType === GAUGE_CHART) {
                        chartOption.legend.show = false;
                    }
                    if (display.hideAxisX) {
                        chartOption.xAxis.show = false;
                    }
                    if (display.hideAxisY) {
                        chartOption.yAxis.show = false;
                    }
                }


                if (widgetChartType === LINE_CHART && props.display.rangeSlider) {
                    initRangeSlider();
                }

                /**
                 *  折线图组件双X轴配置，add by lbb 2019-07-17
                 */
                if (widgetChartType === LINE_CHART && props.enabledDoubleX) {
                    var axisType2 = props.xAxis2.axisType || 'category';
                    var axis = {
                        type: axisType2,
                        axisLabel: {
                            show: true,
                            color: chartColors.fontColor
                        },
                        splitLine: {
                            show: !!props.display.showGridLineX,
                            lineStyle: {
                                color: chartColors.borderColor
                            }
                        }
                    };
                    if (axisType2 === 'category') {
                        axis.axisLabel.interval = 0;
                        axis.data = [];
                    }
                    if (props.xAxis2.labelAngle) {
                        axis.axisLabel.rotate = props.xAxis2.labelAngle;
                    }

                    chartOption.xAxis.push(axis);
                    props.yAxes2.forEach(function (yAxis, index) {
                        yAxis.legend = _.isEmpty(yAxis.legend) ? yAxis.field || 'Untitled' : yAxis.legend;
                        chartOption.legend.data.push({name: yAxis.legend, icon: "circle"});
                    })
                }


                initSeries();
                initColors(chartOption);

                /**
                 * 折线图Y轴指标区间高亮 add by lbb 2019-07-25
                 */
                if (props.enabledYaxisHighlight && widgetChartType === LINE_CHART) {
                    chartOption.visualMap = [];
                    props.visualMap.forEach(function (singleVisualMap, index) {
                        if (chartOption.series[index] && !_.isEmpty(singleVisualMap.pieces)) {
                            var singlePieces = [];
                            singleVisualMap.pieces.forEach(function (piece, index) {
                                singlePieces.push({
                                    gt: _.toFinite(piece.gt),
                                    lte: _.toFinite(piece.lte),
                                    color: piece.color
                                });
                            })
                            chartOption.visualMap.push({
                                show: false,
                                pieces: singlePieces,
                                seriesIndex: index,
                                outOfRange: {
                                    color: chartOption.series[index].lineStyle.normal.color || 'green'
                                }
                            });
                            // 不删除此属性会导致设置的区间颜色无法显示
                            delete chartOption.series[index].lineStyle.normal.color;
                        }

                    });
                }


                chartOption.toolbox.itemGap = 10;
                // chartOption.toolbox.right = 40;

                // 2022-05-27 Add Save Image Btn
                // 2022-08-30 Control export btn to udp palette
                if (props.display.showExport && props.display.showExport === 'noMark') {
                    chartOption.toolbox.feature.myToolExportNoMark = {
                        show: true,
                        title: $translate.instant('udp.w.echart.toolbox.export_no_mark'),
                        icon: 'path://M4.7,22.9L29.3,45.5L54.7,23.4M4.6,43.6L4.6,58L53.8,58L53.8,43.6M29.2,45.1L29.2,0',
                        onclick: function (model, api) {
                            var picInfo = api.getDataURL({
                                type: 'jpeg',
                                backgroundColor: $(api.getDom()).parents('udp-page-view').hasClass('op-theme-dark') ? '#212529' : '#fff',
                                pixelRatio: 2,
                                excludeComponents: ['toolbox']
                            });

                            var link = document.createElement('a');
                            link.download = "export_" + $$.formatDate(new Date(), 'YYYYMMDDHHmm');
                            link.style.display = 'none';
                            link.href = picInfo;
                            document.body.appendChild(link);
                            link.click();
                            URL.revokeObjectURL(link.href); // 释放URL 对象
                            document.body.removeChild(link)
                        }
                    };
                }

                if (props.display.showExport && props.display.showExport === 'mark') {
                    chartOption.toolbox.feature.myToolExportMark = {
                        show: true,
                        title: $translate.instant('udp.w.echart.toolbox.export_mark'),
                        icon: 'path://M4.7,22.9L29.3,45.5L54.7,23.4M4.6,43.6L4.6,58L53.8,58L53.8,43.6M29.2,45.1L29.2,0',
                        onclick: function (model, api) {
                            var instance = echarts.getInstanceByDom(api.getDom());
                            var optionTmp = _.cloneDeep(instance.getOption())
                            var option = instance.getOption()
                            for (var index in option.series) {
                                option.series[index].label.normal.show = true;

                                if (widgetChartType === LINE_CHART) {
                                    option.series[index].showSymbol = true;
                                    option.series[index].symbolSize = 1;
                                }
                                if (widgetChartType === PIE_CHART) {
                                    option.series[index].label.normal.position = 'inside';
                                    option.series[index].label.normal.formatter = '{b}: {c}';
                                }
                            }
                            instance.setOption(option);

                            var picInfo = api.getDataURL({
                                type: 'jpeg',
                                backgroundColor: $(api.getDom()).parents('udp-page-view').hasClass('op-theme-dark') ? '#212529' : '#fff',
                                pixelRatio: 2,
                                excludeComponents: ['toolbox']
                            });

                            var link = document.createElement('a');
                            link.download = "export_" + $$.formatDate(new Date(), 'YYYYMMDDHHmm');
                            link.style.display = 'none';
                            link.href = picInfo;
                            document.body.appendChild(link);
                            link.click();
                            URL.revokeObjectURL(link.href); // 释放URL 对象
                            document.body.removeChild(link)

                            setTimeout(function () {
                                for (var index in option.series) {
                                    option.series[index].label.normal.show = optionTmp.series[index].label.normal.show;

                                    if (widgetChartType === LINE_CHART) {
                                        option.series[index].showSymbol = optionTmp.series[index].showSymbol;
                                        option.series[index].symbolSize = optionTmp.series[index].symbolSize;
                                    }
                                    if (widgetChartType === PIE_CHART) {
                                        option.series[index].label.normal.position = optionTmp.series[index].label.normal.position;
                                        option.series[index].label.normal.formatter = optionTmp.series[index].label.normal.formatter;
                                    }
                                }
                                instance.setOption(option);
                            }, 500);
                        }
                    };
                }


                return chartOption;

                function initDefaultOption() {
                    var legendPosition = (props.display.legend || {}).position;
                    var chartOption = {
                        _maintype: widgetChartType,
                        // Set animation=true to enable hover effect for line
                        animation: true,
                        animationDuration: 0,
                        title: {
                            text: ''
                        },
                        grid: {
                            left: 8,
                            right: 8,
                            top: legendPosition === 'none' ? 8 : 24,
                            bottom: legendPosition === 'bottom' ? 24 : 8,
                            containLabel: true
                        },
                        tooltip: {
                            trigger: widgetChartType === GAUGE_CHART || widgetChartType === MAP_CHART || widgetChartType === PIE_CHART || widgetChartType === RADAR_CHART ? 'item' : 'axis'
                        },
                        legend: {
                            show: legendPosition !== 'none',
                            selected: {},
                            // 'scroll' is useful for small screen
                            type: 'scroll',
                            data: legends
                        },
                        series: allSeries,
                        toolbox: {
                            feature: {
                                magicType: {
                                    // type: props.display.stack ? ['stack', 'tiled'] : []
                                }
                            }
                        }
                    };
                    if (display.tooltip === 'none') {
                        chartOption.tooltip.show = false;
                    }
                    if (legendPosition === 'bottom') {
                        chartOption.legend.bottom = 0;
                    }
                    var tools = props.display.tools || {};
                    if (tools.saveImage === true) {
                        chartOption.toolbox.feature.saveAsImage =
                            {name: props.title || 'Chart'};
                    }
                    return chartOption;
                }

                function initGeo() {
                    var mapType = props.display.mapType,
                        locName = props.xAxis.locName;
                    chartOption.geo = [
                        {
                            map: mapType,
                            show: true,
                            zoom: 1.2,
                            nameMap: mapConfig.getNameMap(mapType, locName),
                            roam: props.display.zoomable,
                            label: {
                                normal: {
                                    show: !!props.display.showLabel,
                                    textShadowBlur: 8,
                                    textShadowColor: '#fff'
                                    // textBorderWidth: 1,
                                    // textBorderColor: '#fff'
                                },
                                emphasis: {
                                    textBorderWidth: 2,
                                    textBorderColor: '#fff',
                                    fontWeight: 'bold',
                                    textShadowBlur: 0
                                }
                            },
                            itemStyle: {
                                normal: {
                                    // Background color
                                    areaColor: props.display.mapBgColor || "rgba(128,128,128,0.5)",
                                    borderColor: props.display.mapBorderColor || chartColors.borderColor,//"rgba(128,128,128,0.8)"
                                },
                                emphasis: {
                                    areaColor: props.display.mapHiColor || '',
                                    borderColor: props.display.mapBorderHiColor || chartColors.borderColor,//"rgba(128,128,128,0.8)"
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                    shadowBlur: 30
                                }
                            }
                        }];
                }

                function initSeries() {
                    // Configure series for y-axes
                    props.yAxes.forEach(function (yaxis, i) {
                        var oneSeries = initOneSeries(yaxis, i);
                        if (yaxis.chartType === MAP_CHART || widgetChartType === GAUGE_CHART) {
                            // Do not put legend for main chart series
                        } else {
                            // if (yaxis.chartType !== PIE_CHART) {
                            legends.push({name: oneSeries.name, icon: 'circle'});
                            // }
                            if (yaxis.hidden === true) {
                                chartOption.legend.selected[oneSeries.name] = false;
                            }
                        }
                        allSeries.push(oneSeries);
                    });
                    /**
                     *  折线图组件支持双X轴配置，add by lbb 2019-07-18
                     */
                    if (props.enabledDoubleX) {
                        props.yAxes2.forEach(function (yAxis, index) {
                            var oneSeries = initOneSeries(yAxis, props.yAxes.length + index);
                            if (yAxis.hidden === true) {
                                chartOption.legend.selected[oneSeries.name] = false;
                            }
                            allSeries.push(oneSeries);
                        })

                    }
                }

                /**
                 *
                 * @param yaxis
                 * @param axisIndex
                 * @returns {object}
                 */
                function initOneSeries(yaxis, axisIndex) {
                    var series = {
                        name: yaxis.legend || yaxis.label || yaxis.field || 'Untitled',
                        type: yaxis.chartType || widgetChartType,
                        data: [],
                        label: {}
                    };
                    var other;
                    if (axisNeedsVisualMap(yaxis)) {
                        makeGeoColorVisualMap(yaxis);
                    }
                    var label = {
                        show: !!yaxis.pointLabel,
                        position: yaxis.pointLabel,
                        formatter: yaxis.labelFormatter || null
                    };

                    if (chartType === PIE_CHART || yaxis.chartType === PIE_CHART) {
                        // Do nothing for pie
                        other = {
                            center: ['40%', '50%'],
                            itemStyle: {
                                normal: {
                                    label: label
                                }
                            }
                        };
                    } else if (yaxis.chartType === MAP_CHART) {
                        // DO nothing for map
                    } else if (yaxis.chartType === SCATTER_CHART) {
                        initScatter();
                    } else if (chartType === GAUGE_CHART) {
                        // console.log("Run initOneSeries");
                        var maxValue = yaxis.maxValue || 100;
                        props.display.detail = props.display.detail || {};
                        props.display.title = props.display.title || {};
                        props.display.axisLine = props.display.axisLine || {};
                        props.display.axisLine.lineStyle = props.display.axisLine.lineStyle || {};

                        other = {
                            radius: '90%',
                            center: ['50%', '65%'],
                            startAngle: props.display.startAngle || 210,//轴线开始角度
                            endAngle: props.display.endAngle || -30,//轴线结束角度
                            min: 0,
                            max: maxValue,
                            splitNumber: 10,
                            axisLine: {            // 坐标轴线
                                show: false,
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    width: props.display.axisLine.lineStyle.width || 30
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                length: props.display.axisLine.lineStyle.width || 30,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    // color: 'auto'
                                }
                            },
                            splitLine: {
                                show: false,// 分隔线
                                length: props.display.axisLine.lineStyle.width || 30,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    // color: 'auto'
                                }
                            },
                            axisLabel: {//刻度标签
                                show: false,
                                // color: '#666'
                            },
                            detail: {//指标
                                // formatter: function (value) {
                                //     var num = (value * 100 / maxValue).toFixed(2);
                                //     var result = Math.round(num * 100) / 100;
                                //     return result + "%";
                                // },
                                fontSize: props.display.detail.fontSize || 15,
                                color: '#010104',
                                offsetCenter: [props.display.detail.offsetHorizontal || '0%', props.display.detail.offsetVertical || '20%']
                            },
                            title: {//标题
                                fontSize: props.display.title.fontSize || 15,
                                // color: '#0a0a0a',
                                offsetCenter: [props.display.title.offsetHorizontal || '0%', props.display.title.offsetVertical || '40%']
                            },
                            pointer: {//指针
                                width: 4,
                                length: '70%'
                            },
                            itemStyle: {//指针样式
                                // color: '#ff7f7f'
                            }
                        }
                    } else {
                        other = {
                            symbol: 'empty' + (yaxis.pointShape || 'circle'),
                            // symbol: yaxis.pointShape || 'circle',
                            itemStyle: {
                                normal: {
                                    label: label
                                }
                            },
                            barWidth: yaxis.barWidth || null,
                            lineStyle: {
                                normal: {
                                    width: yaxis.lineWidth || 2,
                                    type: yaxis.lineType
                                }
                            }
                        };
                        if (yaxis.smooth) {
                            other.smooth = true;
                        }
                        if (devel.needMobileView()) {
                            other.showSymbol = false;

                        } else if (angular.isNumber(yaxis.pointSize)) {
                            other.symbolSize = yaxis.pointSize;
                            other.showSymbol = yaxis.pointSize > 0;
                        }
                        var _color = yaxis.pointColor || yaxis.lineColor;
                        if (_color) {
                            other.itemStyle.normal.color = _color;
                        }
                        _color = yaxis.lineColor;
                        if (_color) {
                            other.lineStyle.normal.color = _color;
                            // var areaColor = tinycolor(yaxis.lineColor);
                            // // areaColor.setAlpha(0.1);
                            // other.areaStyle.normal.color = areaColor.toRgbString();
                            // // other.areaStyle.normal.color = 'red';//areaColor.toRgbString();
                        }
                        // 如果stack为true且fillOpacity的值为空时，将fillOpacity的值设置为3
                        yaxis.fillOpacity = props.display.stack ? (yaxis.fillOpacity ? yaxis.fillOpacity : 3) : yaxis.fillOpacity;
                        if (yaxis.fillOpacity) {
                            other.areaStyle = {
                                normal: {
                                    // color: tinycolor('red').setAlpha(yaxis.fillOpacity/10).toRgbString()
                                    opacity: yaxis.fillOpacity / 10
                                }
                            };
                        }
                    }

                    _.merge(series, other);
                    if (widgetChartType === MAP_CHART) {
                        series.geoIndex = 0;
                        if (yaxis.chartType === SCATTER_CHART) {
                            series.coordinateSystem = 'geo';
                        }
                    } else if (widgetChartType === PIE_CHART) {
                        if (props.display.chart === DOUGHNUT_CHART) {
                            series.radius = ['40%', '55%'];
                        } else if (props.display.chart === ROSE_CHART) {
                            series.radius = ['15%', '65%'];
                            series.roseType = 'radius';
                        }

                    } else if (widgetChartType === GAUGE_CHART) {

                    } else if (widgetChartType === RADAR_CHART) {
                    } else {
                        series.yAxisIndex = (yaxis.axisIndex < 0 || yaxis.axisIndex >= chartOption.yAxis.length) ? 0 : (yaxis.axisIndex || 0);//(yaxis.position === 'right' ? 1 : 0);
                    }
                    if (props.display.stack) {
                        series.stack = $translate.instant('udp.w.echart.sum');
                    }
                    return series;

                    function initScatter() {
                        series.symbolSize = determineScatterSymbolSize();
                        other = {
                            animation: true,
                            symbol: yaxis.pointShape || 'circle',
                            tooltip: {
                                formatter: function (params, ticket, callback) {
                                    return params.seriesName + '<br/>' +
                                        params.name + ': ' + params.value[2] + ' ' + params.value[3];
                                }
                            }
                        };
                        if (!_useAuxData(yaxis)) {
                            other.itemStyle = {
                                normal: {
                                    color: yaxis.pointColor,
                                    label: label
                                },
                                emphasis: {
                                    borderColor: chartColors.borderColor,//'#fff',
                                    borderWidth: 1
                                }
                            }
                        }
                    }

                    function determineScatterSymbolSize() {
                        if (!_useAuxData(yaxis)) {
                            return yaxis.pointSize || 10;
                        }
                        var auxData = yaxis.auxData || {};
                        var maxSize, maxSizeValue;
                        try {
                            maxSize = auxData.size.range[1].k;
                            maxSizeValue = auxData.size.range[1].v;
                        } catch (err) {
                            // Prevent TypeError in deep get
                        }
                        var maxPointSize = maxSize || yaxis.pointSize || 10;
                        return function (val) {
                            return Math.min(1, val[2] / maxSizeValue) * maxPointSize;
                        };
                    }

                    function makeGeoColorVisualMap(yaxis) {
                        var auxData = yaxis.auxData;
                        var minColor, maxColor, maxColorValue, showLegend;
                        try {
                            minColor = auxData.color.range[0].k;
                            // minColorValue = auData.color.range[0].v,
                            maxColor = auxData.color.range[1].k;
                            // showLegend = !!auxData.color.legend;
                            maxColorValue = auxData.color.range[1].v;
                        } catch (err) {
                            // Prevent TypeError in deep get
                        }
                        chartOption.visualMap = chartOption.visualMap || [];
                        var colorVm = {
                            type: 'piecewise',
                            seriesIndex: axisIndex,
                            show: !!yaxis.showVisualMap,
                            textStyle: {color: chartColors.fontColor}
                        };
                        if (angular.isDefined(maxColor) /*&& angular.isDefined(maxColorValue)*/) {
                            var dimOfColor = 0;
                            if (yaxis.chartType === SCATTER_CHART) {
                                Object.keys(auxData).forEach(function (k, index) {
                                    if (k === 'color') {
                                        dimOfColor = index;
                                    }
                                });
                                dimOfColor = 2 + dimOfColor;
                            }
                            colorVm.dimension = dimOfColor;
                            // colorVm.show = showLegend;
                            colorVm.inRange = {
                                color: [minColor, maxColor]
                            };
                            // var colorVm = {
                            //     type: 'piecewise',
                            //     dimension: dimOfColor,
                            //     show: showLegend,
                            //     // orient: 'horizontal',
                            //     // left: 'center',
                            //     // top: 'bottom',
                            //     seriesIndex: axisIndex,
                            //     textStyle: {color: chartColors.fontColor},
                            //     inRange: {
                            //         color: [minColor, maxColor]
                            //     }
                            // };
                            colorVm.left = visualMapPositions.left;
                            visualMapPositions.left += 120;
                            // chartOption.visualMap = chartOption.visualMap || [];
                        }
                        chartOption.visualMap.push(colorVm);
                    }
                }

                function initRangeSlider() {
                    var enableInsideZoom = display.insideZoom;
                    var labelFormatter = props.xAxis.axisLabel;
                    var formatter;
                    if (labelFormatter && props.xAxis.axisType === 'time') {
                        formatter = function (value) {
                            return moment(value).format(labelFormatter);
                        }
                    }
                    var dzProp = loadDataZoom();
                    chartOption.dataZoom = [
                        {
                            show: true,
                            realtime: true,
                            // handleIcon:"M0,0 v9.7h5 v-9.7h-5 Z",
                            start: dzProp.start,
                            end: dzProp.end,
                            // handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                            borderColor: 'transparent',
                            // handleSize: '80%',
                            fillerColor: 'rgba(167,183,204,0.2)',
                            handleStyle: {
                                color: '#fff',
                                shadowBlur: 3,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                shadowOffsetX: 0,
                                shadowOffsetY: 0
                            },
                            dataBackground: {
                                // areaStyle: {color: 'red'}
                            },
                            // showDataShadow:true,
                            // labelFormatter:formatter,
                            // bottom:0,
                            textStyle: {
                                color: chartColors.fontColor,
                                fontWeight: 'bold'
                                // TODO: text... not work
                                // textShadowColor: 'yellow',
                                // textShadowBlur: 2,
                                // textBorderColor: 'blue',
                                // textBorderWidth: 10
                            }
                        }
                    ];
                    if (enableInsideZoom) {
                        chartOption.dataZoom.push({
                            type: 'inside',
                            start: dzProp.start,
                            end: dzProp.end
                        });
                    }

                    function loadDataZoom() {
                        //TODO 设置datazoom后，触发刷新事件时，datazoom配置没有生效。
                        var prop = {start: 0, end: 100};
                        if (angular.isDefined($localStorage.chartDataZoom)) {
                            var widgetElemId = element.attr('id');
                            var index = _.findIndex($localStorage.chartDataZoom, {'id': widgetElemId})
                            if (index != -1) {
                                prop.start = $localStorage.chartDataZoom[index].start;
                                prop.end = $localStorage.chartDataZoom[index].end;
                            }
                        }
                        return prop;
                    }
                }

                function initXAxis() {
                    var axisType = props.xAxis.axisType || 'category';
                    var axis = {
                        type: axisType,
                        axisLabel: {
                            show: true,
                            color: chartColors.fontColor
                        },
                        splitLine: {
                            show: !!props.display.showGridLineX,
                            lineStyle: {
                                color: chartColors.borderColor
                            }
                        }
                    };
                    if (axisType === 'category') {
                        axis.axisLabel.interval = 0;
                    }
                    if (props.xAxis.labelAngle)
                        axis.axisLabel.rotate = props.xAxis.labelAngle;
                    // if (widgetChartType === GAUGE_CHART) {
                    //     axis.axisLabel.show = false;
                    // }
                    var labelFormatter = props.xAxis.axisLabel;
                    if (labelFormatter && props.xAxis.axisType === 'time') {
                        axis.axisLabel.formatter = function (value, index) {
                            return moment(value).format(labelFormatter);
                        }
                    }
                    return [axis];
                }


                // function getFontColor() {
                //     var fontColor;
                //     if (props.display.theme === '_CUSTOM') {
                //         fontColor = props.display.fontColor;
                //     } else {
                //         fontColor = themeService.calcFontColor(props.display.theme);
                //     }
                //     return fontColor;
                // }

                function initColors(options) {
                    var fontColor = chartColors.fontColor;//getFontColor();
                    var axisLineColor = chartColors.borderColor;//themeService.calcBorderColor(fontColor);
                    var axisLine = {
                        axisLine: {
                            lineStyle: {
                                color: axisLineColor
                            }
                        },
                        axisLabel: {
                            color: chartColors.fontColor
                        }
                    };

                    if (widgetChartType === GAUGE_CHART) {
                        var gaugeDefaultColor = {
                            axisTick: {            // 坐标轴小标记
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto'
                                }
                            },
                            splitLine: {
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    color: 'auto'
                                }
                            },
                            axisLabel: {//刻度标签
                                show: false,
                                color: 'auto'
                            },
                            detail: {//指标
                                color: '#23161d'
                            },
                            title: {//标题
                                color: '#0a0a0a'
                            },
                            itemStyle: {//指针样式
                                color: '#ff7f7f'
                            }
                        };

                        // if (axisLineColor == null) {
                        //     axisLine.axisLine.lineStyle.color = themeService.getDefaultGaugeColor();
                        // }
                        _.merge(axisLine, gaugeDefaultColor);

                        options.series.forEach(function (serie) {
                            _.merge(serie, axisLine);
                        })
                    }

                    var legend = {
                        textStyle: {
                            color: fontColor
                        }
                    };
                    var yAxis = options.yAxis, xAxis = options.xAxis;
                    if (yAxis) {
                        yAxis.forEach(function (y) {
                            _.merge(y, axisLine);
                        });
                    }
                    if (xAxis) {
                        xAxis.forEach(function (x) {
                            _.merge(x, axisLine);
                        })
                    }
                    _.merge(options, {legend: legend});
                }

                function initYAxis() {
                    var display = props.display || {},
                        yaxes = display.yaxes || [],
                        showGridLine = !!display.showGridLineY,
                        result = [];
                    var hasRightY = _.findIndex(props.yAxes, function (y) {
                        return y.axisIndex > 0;
                    }) >= 0;
                    // // Use scale:true to enable auto scale y-axis
                    // var left = {
                    //     position: 'left',
                    //     type: 'value',
                    //     // scale: true,
                    //     splitLine: {
                    //         show: showGridLine,
                    //         lineStyle: {
                    //             color: chartColors.borderColor
                    //         }
                    //     }
                    // };
                    // axes.push(left);
                    if (yaxes.length === 0) {
                        // A default left yaxis
                        yaxes.push({position: 'left'});
                    }
                    if (hasRightY && yaxes.length < 2) {
                        yaxes.push({position: 'right'});
                    }
                    // if (hasRightY) {
                    //     var right = _.merge({}, left, {position: 'right'});
                    //     // axes.push(right);
                    // }
                    yaxes.forEach(function (yaxis, index) {
                        if (index === 0 || hasRightY) {
                            result.push({
                                show: !props.hiddenYaxes,
                                poistion: yaxis.position || 'left',
                                type: yaxis.type || 'value',
                                // Use scale:true to enable auto scale y-axis
                                // scale: true,
                                min: yaxis.min || null,
                                max: yaxis.max || null,
                                name: !yaxis.labelPos ? null : yaxis.label,
                                nameLocation: yaxis.labelPos || 'center',
                                nameTextStyle: {color: chartColors.fontColor},
                                axisLabel: {
                                    formatter: yaxis.axisLabel || null
                                },
                                // nameGap:30,
                                splitLine: {
                                    show: showGridLine,
                                    lineStyle: {
                                        color: chartColors.borderColor
                                    }
                                }
                            });
                        }

                    });
                    // if (result.length === 0) {
                    // result.push(left);
                    // }
                    return result;
                }
            }

            function onClick(params, p) {
                var interaction = props.interaction;
                // if (!interaction || !interaction.click || !interaction.pageId) return;
                var values = getClickedValues(params);
                if (values) {
                    $timeout(function () {
                        // console.log('interaction', interaction, values);
                        widgetInteraction.handleInteraction(scope, interaction, values);
                        // widgetInteraction.openPage(interaction, values, {current: chartObj});
                    });
                }
            }

            function onDatazoom(params) {
                console.log('onDatazoom', params);
            }

            function before() {
                var d = $q.defer();
                if (chartType === MAP_CHART) {
                    var mapType = props.display.mapType;
                    $.get('app/modules/udp/assets/map-json/' + mapType + '.json', function (geoJson) {
                        echarts.registerMap(mapType, geoJson);
                        d.resolve();
                    }).fail(function () {
                        d.reject(new Error('Cannot load map data file: ' + mapType));
                    });
                } else {
                    d.resolve();
                }
                return d.promise;
            }
        }

        /**
         * Transform data with `convertFn`. It will add a `vfield` property to the axis.
         * @param {{total:number,records:[]}|[{total:number,records:[]}]} data Mutable, single or array of {total:number, records:[]}
         * @param {object} props
         * @param {object} props.xAxis
         * @param {[]} props.yAxes
         */
        function transformAxisData(data, props, scope) {
            var isMultiDatasets = angular.isArray(data);
            var allAxes = [props.xAxis].concat(props.yAxes);
            var rules = [];
            allAxes.forEach(function (axis, i) {
                var target = (i === 0 ? VFIELD_X : VFIELD_Y + (i - 1));
                rules.push({
                    source: axis.field,
                    target: target,
                    _isX: i === 0,
                    dsIndex: axis.dsIndex || 0,
                    convertFn: axis.convertFn
                });
                // Put aux data
                if (_useAuxData(axis)) {
                    var auxData = axis.auxData || {};
                    Object.keys(auxData).forEach(function (name, j) {
                        var ad = auxData[name];
                        rules.push({
                            source: ad.field,
                            target: _getSubFieldName(target, j),
                            dsIndex: axis.dsIndex || 0,
                            convertFn: ad.convertFn
                        });
                    });
                }
            });

            /**
             *  折线图组件支持双X轴配置，add by lbb 2019-07-18
             */
            if (props.enabledDoubleX && props.yAxes2 && props.xAxis2) {
                rules.push({
                    source: props.xAxis2.field,
                    target: VFIELD_X + 1,
                    _isX: true,
                    dsIndex: 0,
                    convertFn: props.xAxis2.convertFn
                });
                props.yAxes2.forEach(function (yAxis, index) {
                    var _index = props.yAxes.length + index;
                    rules.push({
                        source: yAxis.field,
                        target: VFIELD_Y + _index,
                        _isX: false,
                        dsIndex: 0,
                        convertFn: yAxis.convertFn
                    });
                });

            }
            // console.log(rules);
            if (isMultiDatasets) {
                var results = [];
                data.forEach(function (d, dsIndex) {
                    var _rules = _.filter(rules, function (o) {
                        return (o._isX === true) || (o.dsIndex === dsIndex);
                    });
                    // console.log('rules===', _rules, d.records);
                    results.push(widgetDataUtil.convertFields(d.records, _rules));
                });
                // console.log('results', results);
                return results;
            } else {
                return widgetDataUtil.convertFields(data.records, rules);
            }
        }

        function _useAuxData(axis) {
            return axis.dynamicPoint && axis.auxData;
        }

        function _getSubFieldName(field, i) {
            return field + '_' + i;
        }

        function queryAndLoadData(scope, element, props, chartObj, option) {
            var d = $q.defer();
            var display = props.display || {};
            var isHorizontal = display.horizontal;
            // var wrapper = element.find('.js-chart-obj');
            widgetDataUtil.queryData(element, props, scope).then(function (data) {
                var records = transformAxisData(data, props, scope);
                updateRecords(records);
                d.resolve();
            }).catch(function (e) {
                updateRecords([]);
                console.error(e);
                d.resolve();
            });
            return d.promise;

            function updateRecords(records) {
                updateChartOption(props, records, option, false);
                var opts;
                if (isHorizontal) {
                    opts = switchHorizontalAxis();
                } else {
                    opts = option;
                }
                chartObj.setOption(opts);
                // console.log('DEBUG\noption=' + JSON.stringify(opts));
                element.data(datastreamKey, Date.now());
                element.find('.js-chart-obj > div').show();
            }

            function switchHorizontalAxis() {
                var opts;
                if (option._isHorizontal) {
                    opts = option;
                } else if (angular.isArray(option.yAxis) && option.yAxis.length > 1) {
                    messageService.alertError($translate.instant('common.term.error'), $translate.instant('horizontal_axis_not_support_multiple_y'));
                    opts = option;
                } else {
                    opts = {};
                    Object.keys(option).forEach(function (key) {
                        if (key === 'yAxis') {
                            opts.xAxis = option[key];
                        } else if (key === 'xAxis') {
                            opts.yAxis = option[key];
                        } else {
                            opts[key] = option[key];
                        }
                    });
                    opts._isHorizontal = true;
                }
                return opts;
            }

        }

        function reloadData(scope, element) {
            var props = scope.$widget.uwProps;//JSON.parse(element.attr('uw-props') || '{}');
            var chartObj = echarts.getInstanceByDom(element.find('div.js-chart-obj')[0]);
            if (chartObj) {
                if ((props.datastream || {}).enabled) {
                    updateStreamData(scope, element, props, chartObj);
                } else {
                    var chartOption = element.data('_theChart');
                    queryAndLoadData(scope, element, props, chartObj, chartOption);
                }
            } else {
                console.warn('Cannot find echarts instance');
            }

            function updateStreamData(scope, element, props, chartObj) {
                var option = chartObj.getOption();
                var lastUpdate = element.data(datastreamKey);
                if (lastUpdate) {
                    // Changes of wParams._streamLastUpdate will cause widget data reload
                    scope.$widget.wParams['_NO_RELOAD'] = true;
                    scope.$widget.wParams[datastreamKey] = lastUpdate;
                    var now = Date.now();
                    widgetDataUtil.queryData(element, props.datastream, scope).then(function (data) {
                        if (data.records.length > 0) {
                            element.data(datastreamKey, now);
                            var records = transformAxisData(data, props, scope);
                            // console.log('udpateStreamData', records.length);
                            updateChartOption(props, records, option, true);
                            chartObj.setOption(option);
                        }
                    }).catch(function (e) {
                        console.error('Cannot render chart due to ' + e.message, option);
                    });
                }
            }
        }
    }
})
();
