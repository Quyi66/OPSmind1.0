/**
 * This is a pivot widget
 * @author Leo Liao (leoliaolei@gmail.com), created on 3/30/2018
 */

(function () {
        'use strict';

        angular.module('oplus.udp')
            .run(['$translate', '$timeout', 'widgetFactory', 'messageService', 'widgetDataUtil', 'widgetUiHelper', pivotWidget]);

        /**
         *
         *
         * @param $translate
         * @param {$timeout} $timeout
         * @param {widgetFactory} widgetFactory
         * @param {messageService} messageService
         * @param {widgetDataUtil} widgetDataUtil
         * @param {widgetUiHelper} widgetUiHelper
         */
        function pivotWidget($translate, $timeout, widgetFactory, messageService, widgetDataUtil, widgetUiHelper) {
            widgetFactory.defineWidget({
                type: 'pivot',
                group: 'data',
                resizable: null,
                configController: PivotWidgetConfigCtrl,
                configHtmlFile: '',
                controlRenderer: {
                    getTemplateForCompilation: getTemplateForCompilation,
                    onReloadData: onReloadData,
                    onInitControl: onInitControl,
                    makePrintable: makePrintable,
                    onResize: onResize
                }
            });

            function getTemplateForCompilation(props) {
                var html = '';
                // Make table overflow-x
                html += '<div class="js-pivot-container" __style="overflow-x:auto;"></div>';
                return html
            }

            function onReloadData(scope, element, props) {
                var pivotElem;
                widgetDataUtil.queryAndConvertData(scope, element, props, {debugKey: 'pivot'}).then(function (data) {
                    pivotElem = renderPivot(data);
                }).catch(function (err) {
                    console.error(err);
                });

                function renderPivot(data) {
                    var display = props.display || {},
                        pivotConfig = props.pivot || {},
                        isEditMode = widgetUiHelper.isEditMode();
                    var pivotElem = element.find('.js-pivot-container');
                    //About renderer i18n: https://github.com/nicolaskruchten/pivottable/issues/875
                    var options = {
                        showUI: isEditMode ? true : !display.disableUi,
                        // renderers: $.extend(
                        //     $.pivotUtilities.renderers,
                        //     $.pivotUtilities.c3_renderers
                        // ),
                        rendererOptions: {
                            table: {rowTotals: false},
                            c3: {
                                axis: {
                                    y: {
                                        label: display.axisYlabel,
                                        tick: {format: d3.format(',')}
                                    },
                                    x: {label: display.axisXlabel}
                                }
                                //NOTE: tooltip overriden in c3_renders.js
                                // tooltip: {
                                //     format: {
                                //         title: function (d) {
                                //             return 'Data ' + d;
                                //         },
                                //         value: function (value, ratio, id, index) {
                                //             var format = d3.format('$');
                                //             return format(value);
                                //             // return d3.format(',')(value);
                                //         }
                                //     }
                                // }
                            },
                            // Custom attribute
                            titleText: display.title,
                            chartContainer: pivotElem
                        },
                        onRefresh: function (config) {
                            element.find(".pvtVals select.pvtAttrDropdown").addClass('form-control');
                            if (widgetUiHelper.isEditMode()) {
                                saveConfig(config);
                            }
                        }
                    };
                    _.merge(options, pivotConfig);
                    // console.log('locales', $.pivotUtilities.locales, $translate.use());
                    var locale = $translate.use();
                    if (!$.pivotUtilities.locales[locale]) {
                        locale = 'en';
                    }
                    //https://github.com/nicolaskruchten/pivottable/wiki/Parameters#pivotuiinput-options-overwrite-locale
                    pivotElem.pivotUI(data.records, options, false, locale);
                    // pivotElem.find('table.pvtTable');
                    pivotElem.find('select,.pvtSearch').addClass('form-control form-control-sm');
                    pivotElem.find('.pvtAttr').addClass('badge bg-secondary');
                    pivotElem.find('.pvtAttrDropdown').addClass('form-control form-control-sm');
                    pivotElem.find('button').addClass('btn btn-sm');
                    pivotElem.find('.pvtColOrder').attr('title', $translate.instant('udp.w.pivot.config.col_order'));
                    pivotElem.find('.pvtRowOrder').attr('title', $translate.instant('udp.w.pivot.config.row_order'));
                    pivotElem.find('.pvtFilterBox > p > button:first-child').addClass('btn-primary');
                    pivotElem.find('.pvtFilterBox > p > button').not(':first-child').addClass('btn-default');
                    // $('html').click(function(){
                    //   $('.pvtFilterBox:visible').hide();
                    // });
                    return pivotElem;
                }

                function saveConfig(config) {
                    var attrs = ['cols', 'rows', 'vals', 'colOrder', 'rowOrder', 'aggregatorName', 'rendererName', 'exclusions'];
                    // var config = pivotElem.data("pivotUIOptions");
                    props.pivot = {};
                    attrs.forEach(function (attr) {
                        props.pivot[attr] = config[attr];
                    });
                    widgetUiHelper.upgradeWidgetProps(element, {pivot: props.pivot});
                }
            }

            function onInitControl(scope, element, props) {
                return onReloadData(scope, element, props);
            }

            function makePrintable(element, props, options) {
            }

            function onResize(element, size) {
            }
        }

        function PivotWidgetConfigCtrl(scope, props) {
        }
    }

)();