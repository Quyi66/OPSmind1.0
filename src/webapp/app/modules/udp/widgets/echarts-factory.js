/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/27/2018
 */
(function () {
    'use strict';

    angular.module('oplus.udp')
        .service('echartsFactory', ['$q', '$translate', 'widgetDataUtil', 'widgetUiHelper', 'messageService', 'themeService', echartsFactory]);

    /**
     * @ngdoc service
     * @name echartsFactory
     * @description
     * A new echarts builder intended to gradually replace complicated echartsWidgetBuilder.
     * NOTE: now only work for circle widget
     * @param $q
     * @param {widgetDataUtil} widgetDataUtil
     * @param {widgetUiHelper} widgetUiHelper
     * @param {messageService} messageService
     * @param {themeService} themeService
     */
    function echartsFactory($q, $translate, widgetDataUtil, widgetUiHelper, messageService, themeService) {
        this.createBuilder = createBuilder;

        /**
         * Create a new chart builder
         * @param {string} widgetType
         * @param {object=} config Specific chart builder config
         * @returns {EchartsBuilder}
         */
        function createBuilder(widgetType, config) {
            return new EchartsBuilder(widgetType, config);
        }

        /**
         * @param widgetType
         * @param config
         * @constructor
         */
        function EchartsBuilder(widgetType, config) {
            var builderConfig = config || {};
            this.getTemplateForCompilation = getTemplateForCompilation;
            this.onInitControl = onInitControl;
            this.onReloadData = onReloadData;
            this.onResize = onResize;
            var CHART_OBJ_CSS = builderConfig.CHART_OBJ_CSS || 'js-chart-obj',
                RESIZE_HANDLER_CSS = 'udp-resize-handler',
                MIN_HEIGHT = builderConfig.defaultHeight || 80,
                CHART_LIST_CSS = builderConfig.CHART_LIST_CSS || 'js-chart-list';

            function getTemplateForCompilation(props) {
                var success;
                if (angular.isFunction(builderConfig.checkWidgetProps)) {
                    success = builderConfig.checkWidgetProps(props);
                } else {
                    success = (props['dataset'] || {}).id;
                }
                if (!success) {
                    throw new WidgetNotConfiguredError($translate.instant('udp.wc.error.missing_dataset_or_field'));
                }
                var display = props.display || {};
                if (builderConfig.multiCharts) {
                    return '<div class="row ' + CHART_LIST_CSS + '"></div>';
                } else {
                    var height = Math.max(display.height || 0, MIN_HEIGHT);
                    return '<div class="' + CHART_OBJ_CSS + '" style="width:100%;height:' + height + 'px"></div>';
                }
            }

            function onReloadData(scope, element) {
                var props = scope.$widget.uwProps;
                queryAndConfig(scope, element, props, false);
            }

            function onResize(widgetElem, args) {
                args = args || {};
                // Widget uw-content element
                var contentElem = widgetElem.find('.uw-content');
                if (args.contentElem) {
                    contentElem = $(args.contentElem);
                }
                // Chart elements
                var chartElems = contentElem.find('.' + CHART_OBJ_CSS);
                // Use ratio to resize multi charts
                if (args.reHeight) {
                    var chartHeight;
                    if (builderConfig.multiCharts) {
                        if (args.height && args.oldHeight) {
                            chartHeight = chartElems.height() * args.height / args.oldHeight;
                        }
                        // Content and widget height are determined by child items
                        contentElem.css('height', '');
                        widgetElem.css('height', '');
                    } else {
                        // if (!args.height) {
                        //     contentElem.css('height', widgetUiHelper.calcWidgetContentHeight(contentElem.parent()));
                        // }
                    }
                    // Change size of chart DOM element
                    chartElems.css('height', chartHeight || '100%');
                }
                // Chart DOM should be 100% of its parent
                chartElems.css('width', '100%');
                // Change size of chart instance to match DOM element
                getAllChartInstances(contentElem).forEach(function (inst) {
                    inst.resize();
                });
                // Save item size in widget properties
                if (widgetUiHelper.isEditMode() && args.needSave && builderConfig.multiCharts) {
                    var height = chartElems.height(),
                        width = chartElems.width();
                    var display = {};
                    display.itemHeight = height;
                    display.itemWidth = width;
                    widgetUiHelper.upgradeWidgetProps(widgetElem, {display: display});
                }
            }

            function onInitControl(scope, element, props) {
                scope.$on('$destroy', function onDestroy() {
                    getAllChartInstances(element).forEach(function (obj) {
                        obj.dispose();
                    });
                });
                return queryAndConfig(scope, element, props, true);
            }

            /**
             *
             * @returns {[object]} Array of echarts instance object
             */
            function getAllChartInstances(element) {
                var objs = [];
                $(element).find('.' + CHART_OBJ_CSS).each(function () {
                    var dom = this;
                    var o = echarts.getInstanceByDom(dom);
                    if (o) {
                        objs.push(o);
                    }
                });
                return objs;
            }

            /**
             * Query data and configure chart option
             * @param {angular.scope} scope
             * @param {jQuery|angular.element} element
             * @param {object} props
             * @param {boolean} newDom `true` will create new DOM and init chart control, `false` will get chart instance from existing DOM
             */
            function queryAndConfig(scope, element, props, newDom) {
                var display = props.display || {};
                element.find('.uw-content').css('overflow', 'hidden');
                widgetDataUtil.queryAndConvertData(scope, element, props).then(function (data) {
                    if (data.records.length === 0) {
                        widgetUiHelper.showWidgetError(element, $translate.instant('udp.wc.error.no_data'), $translate.instant('udp.wc.error.no_data'))
                    }
                    data.records.forEach(function (record, index) {
                        renderOneChart(record, index);
                    });
                }).catch(function (err) {
                    throw err;
                });

                function renderOneChart(record, index) {
                    var dom = getChartDom();
                    var option = buildChartOption(record);
                    var chartObj = getChartInstance(dom);
                    chartObj.setOption(option);

                    function getChartInstance(dom) {
                        if (newDom)
                            return echarts.init(dom, display.palette || 'default');
                        var inst = echarts.getInstanceByDom(dom);
                        if (!inst) {
                            console.error('Cannot get echarts instance from DOM', dom);
                        }
                        return inst;
                    }

                    /**
                     *
                     * @returns {HTMLElement} DOM element
                     */
                    function getChartDom() {
                        var wrapper = element.find('.' + CHART_LIST_CSS);
                        if (newDom) {
                            var rowNum = display.rowNum || 1;
                            var height = display.itemHeight || builderConfig.DEFAULT_HEIGHT;
                            var elem = angular.element('<div></div>'), col = angular.element('<div></div>');
                            col.addClass('col-even-' + rowNum).appendTo(wrapper);
                            elem.appendTo(col)
                                .addClass(CHART_OBJ_CSS)
                                .addClass(RESIZE_HANDLER_CSS)
                                // .css('min-width', '80px')
                                .css('height', height);
                            if (display.rowSpace) {
                                elem.css('margin-bottom', display.rowSpace);
                            }
                            // .css('background-color', display.bgcolor);
                            // var html = '<div class="col-even-' + rowNum + '">' +
                            //     '<div class="' + CHART_OBJ_CSS + '" style="height:' + height + ';"'+'></div></div>';
                            // var chartElem = angular.element(html).appendTo(wrapper);
                            // return chartElem.find('div')[0];
                            return elem[0];
                        } else {
                            return wrapper.find('.' + CHART_OBJ_CSS)[index];
                        }
                    }
                }

                function queryAndConvertData() {
                    var d = $q.defer();
                    widgetDataUtil.queryAndConvertData(scope, element, props).then(function (data) {
                        // widgetDataUtil.queryData(element, props).then(function (data) {
                        d.resolve(data);
                    }).catch(function (e) {
                        d.reject(e);
                    });
                    return d.promise;
                }

                /**
                 *
                 * @param {object} record Data record
                 * @param {object} field Data attribute
                 * @param {string} field.field
                 * @param {string} field.convertFn
                 * @returns {*}
                 */
                function getFieldValue(record, field) {
                    if (field) {
                        return record[field.__valueKey];
                        // var data = widgetDataUtil.convertFields([record], [{
                        //     source: field.field,
                        //     target: 'converted',
                        //     convertFn: field.convertFn
                        // }]);
                        // return data[0]['converted'];
                    }
                }

                function buildChartOption(record) {
                    var fields = props.fields || {};
                    var oneSeries = {colors: [], data: []};
                    // var themeColors = themeService.calcColors(scope);
                    var paletteColors = themeService.getColorValuesByChartPalette(display.palette);
                    var radiusInner, radiusOut, centerX, centerY;
                    var unit = display.sizeUnit || '%';
                    if (angular.isObject(display.radius)) {
                        radiusInner = display.radius.inner || 90;
                        radiusOut = display.radius.radiusOut || 10;
                    } else {
                        radiusOut = display.radius || 90;
                        radiusInner = radiusOut - 10;
                    }
                    // if (display.radius.inner) {
                    //     radiusInner = display.radius.inner || 90;
                    //     radiusOut = display.radius.radiusOut || 10;
                    // } else {
                    //     radiusOut = display.radius || 90;
                    //     radiusInner = radiusOut - 10;
                    // }

                    if (display.center) {
                        centerX = display.center.x || 50;
                        centerY = display.center.y || 50;
                    } else {
                        centerX = display.radius.x || 50;
                        centerY = display.radius.y || 50;
                    }


                    var chartOption = {
                        backgroundColor: display.bgcolor,
                        graphic: {
                            elements: []
                        },
                        legend: {
                            data: [],
                            textStyle: {rich: {}}
                            // right: 0,
                            // bottom: '0%'
                        },
                        series: [
                            {
                                name: 'single-series',
                                type: 'pie',
                                radius: [radiusInner + unit, radiusOut + unit],
                                center: [centerX + unit, centerY + unit],
                                hoverAnimation: false, /*控制圆环点击不会放大*/
                                color: oneSeries.colors,
                                label: {
                                    normal: {
                                        show: false
                                    },
                                    emphasis: {
                                        show: false
                                    }
                                },
                                data: oneSeries.data
                            }
                        ]
                    };
                    configLegendSeries(fields.metrics || []);
                    if (angular.isFunction(builderConfig.configGraphic))
                        builderConfig.configGraphic(chartOption, record, props, getFieldValue);
                    return chartOption;

                    /**
                     * Config `option.legend` and `option.series`
                     * @param {[{legend:string,field:string=,color:string=}]} allSeries
                     */
                    function configLegendSeries(allSeries) {
                        var legendValues = {};
                        display.legend = display.legend || {};
                        if (display.legend.position === 'right') {
                            chartOption.legend.orient = 'vertical';
                            chartOption.legend.top = 'middle';
                            chartOption.legend.right = 0;
                        } else if (display.legend.position === 'left') {
                            chartOption.legend.orient = 'vertical';
                            chartOption.legend.top = 'middle';
                            chartOption.legend.left = 0;
                        } else if (display.legend.position === 'none') {
                            chartOption.legend.show = false;
                        } else if (display.legend.position === 'custom') {
                            chartOption.legend.orient = 'vertical';
                            chartOption.legend.bottom = '25%';
                            chartOption.legend.left = display.legend.positionCustom;
                        } else {
                            chartOption.legend.orient = 'horizontal';
                            chartOption.legend.bottom = 0;
                        }
                        // console.log('orient', chartOption.legend.orient);
                        // Iterator all series/metrics/measures/values
                        var sum = 0;
                        allSeries.forEach(function (series, index) {
                            var seriesName = series.label || series.field;
                            var fieldValue = getFieldValue(record, series);
                            var formatKey = 'l' + index;
                            var color = series.color || paletteColors[index % paletteColors.length];
                            legendValues[seriesName] = {formatKey: formatKey, value: fieldValue};
                            chartOption.legend.data.push({
                                name: seriesName,
                                icon: display.legend.positionIcon === 'yes' ? 'none' : 'circle',
                                textStyle: {color: series.fontColor}
                            });
                            chartOption.legend.textStyle.rich[formatKey] = {
                                fontSize: 16,
                                color: color
                            };
                            oneSeries.colors.push(color);
                            oneSeries.data.push({
                                name: seriesName,
                                value: fieldValue
                            });
                            if (angular.isNumber(fieldValue))
                                sum += fieldValue;
                        });
                        var totalValue = getFieldValue(record, fields.total);
                        if (angular.isNumber(totalValue)) {
                            oneSeries.data.push({name: '__total', value: totalValue - sum});
                            oneSeries.colors.push(fields.total.color || 'transparent');
                        }

                        if (chartOption.legend.show !== false) {
                            chartOption.legend.formatter = function (name) {
                                return '' + name + ' {' + legendValues[name].formatKey + '|' + legendValues[name].value + '}';
                            };
                        }
                    }

                    function onPointDragging(event) {
                        console.log(event.target.position, event.offsetX, event.offsetY, event);
                    }


                }
            }
        }
    }
})();
