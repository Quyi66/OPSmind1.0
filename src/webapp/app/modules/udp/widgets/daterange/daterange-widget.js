/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/04/2017
 */
(function () {
    'use strict';
    var app = angular.module('oplus.udp');
    app.run(['$translate', '$timeout', 'i18nService', 'dataEx', 'widgetFactory', 'widgetValues', 'widgetInteraction',  'widgetDataUtil', daterangeWidget]);

    /**
     * http://www.daterangepicker.com/
     * @param $translate
     * @param $timeout
     * @param {i18nService} i18nService
     * @param {dataEx} dataEx
     * @param {widgetFactory} widgetFactory
     * @param {widgetInteraction} widgetInteraction
     * @param {widgetValues} widgetValues
     * @param {widgetDataUtil} widgetDataUtil
     */
    function daterangeWidget($translate, $timeout, i18nService, dataEx, widgetFactory, widgetValues, widgetInteraction,  widgetDataUtil) {
        widgetFactory.defineWidget({
            type: 'daterange',
            group: 'control',
            configController: DaterangeWidgetConfigCtrl,
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                renderDynamicData: renderDynamicData,
                makePrintable: makePrintable
            }
        });

        function DaterangeWidgetConfigCtrl($scope) {
            $scope.units = [
                {key: 'minutes', label: 'minute'},
                {key: 'hours', label: 'hour'},
                {key: 'days', label: 'day'},
                {key: 'weeks', label: 'week'},
                {key: 'months', label: 'month'}
            ];
            i18nService.translateWithPrefixAndKey($scope.units, 'common.term.', 'label', 'label');
        }

        function makePrintable(element) {
            return element.find('input').val();
        }

        function renderDynamicData(scope, element, props) {
            var nameofstart = props.nameofstart,
                nameofend = props.nameofend;
            if (useSlider(props)) {
                renderJqRangeSlider();
            } else {
                renderDaterangePicker();
            }
            scope.$watch('$widget.wParams', function (newVal, oldVal) {
                if (isEqual(newVal, oldVal))
                    return;
                if (angular.isDefined(nameofstart)) {
                    var beginDate = newVal[nameofstart],
                        endDate = newVal[nameofend];
                    var params = {};
                    params[nameofstart] = scope.$widget.$pageScope.pageParams[nameofstart] = beginDate;
                    scope.$widget.$pageScope.pageParams[nameofend] = endDate;
                    params[nameofend] = endDate;
                    widgetInteraction.changePageParams(scope, {
                        _source: element.attr('id'),
                        event: props.eventbychange,
                        params: params
                    }, null);
                }
            }, true);

            function assignWparams(start, end) {
                $timeout(function () {
                    scope.$widget.wParams[nameofstart] = transData(start);
                    scope.$widget.wParams[nameofend] = transData(end);
                });
            }

            function parseInitvals(props) {
                var vals = {start: new Date(), end: new Date()};
                if (angular.isDefined(props.initvalofstart)) {
                    vals.start = dataEx.evalVarExpr(props.initvalofstart, widgetDataUtil.getPageScopeValues(scope), {ignores: [props.initvalofstart, props.initvalofend]});
                }
                if (angular.isDefined(props.initvalofend)) {
                    vals.end = dataEx.evalVarExpr(props.initvalofend, widgetDataUtil.getPageScopeValues(scope), {ignores: [props.initvalofstart, props.initvalofend]});
                }
                return vals;
            }

            function renderDaterangePicker() {
                var options = buildPickerOptions();
                var picker = element.find('input');
                picker.daterangepicker(options, function (start, end, label) {
                    assignWparams(start.toDate(), end.toDate());
                });
                // Init control value
                assignWparams(options.startDate, options.endDate);

                function buildPickerOptions() {
                    var options = {
                        parentEl: element.parent(),
                        showDropdowns: true
                        // autoApply: true
                    };
                    var datelimit = props.datelimit || {};
                    if (datelimit.enabled === true &&
                        datelimit.maxunit && datelimit.maxspan) {
                        options.dateLimit = {};
                        options.dateLimit[datelimit.maxunit] = datelimit.maxspan;
                    }
                    var initvals = parseInitvals(props);
                    options.startDate = initvals.start;
                    options.endDate = initvals.end;
                    if (props.formatter) {
                        if (props.formatter.indexOf('hh:mm:ss')) {
                            options.timePicker = true;
                            options.timePicker24Hour = true;
                        }
                        options.locale = {
                            format: props.formatter
                        }
                    }
                    if (props.ranges) {
                        options.ranges = {};
                        options.ranges[$translate.instant('udp.w.daterange.attrs.predefined.today')] = [
                            moment().startOf('day'),
                            moment().endOf('day')
                        ];
                        options.ranges[$translate.instant('udp.w.daterange.attrs.predefined.yesterday')] = [moment().add(-1, 'days').startOf('day'),
                            moment().add(-1, 'days').endOf('day')];
                        options.ranges[$translate.instant('udp.w.daterange.attrs.predefined.last_7days')] = [moment().add(-7, 'days').startOf('day'),
                            moment().endOf('day')];
                        options.ranges[$translate.instant('udp.w.daterange.attrs.predefined.last_30days')] = [moment().add(-30, 'days').startOf('day'),
                            moment().endOf('day')];
                        options.ranges[$translate.instant('udp.w.daterange.attrs.predefined.this_month')] = [moment().startOf('month'),
                            moment().endOf('day')];
                        options.ranges[$translate.instant('udp.w.daterange.attrs.predefined.last_month')] = [moment().add(-1, 'months').startOf('month'),
                            moment().add(-1, 'months').endOf('month')];

                        options.showCustomRangeLabel = false;
                        options.alwaysShowCalendars = true;
                    }
                    return options;
                }
            }

            function renderJqRangeSlider() {
                var options = buildSliderOptions();
                var slider = $('.js-range-slider', element);
                slider.dateRangeSlider(options);
                scope.$on('$destroy', function () {
                    slider.dateRangeSlider('destroy');
                });
                slider.on("valuesChanged", function (e, data) {
                    assignWparams(data.values.min, data.values.max);
                });

                function buildSliderOptions() {
                    var initvals = parseInitvals(props);
                    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
                    var options = {
                        enabled: !props.readonly,
                        bounds: {
                            min: moment().add(-1, 'days').toDate(),
                            max: moment().endOf('hour').toDate()
                        },
                        defaultValues: {
                            min: initvals.start,
                            max: initvals.end
                        },
                        formatter: function (val) {
                            return moment(val).format(props.formatter);
                        }
                    };
                    var datelimit = props.datelimit || {};
                    if (datelimit.enabled === true &&
                        datelimit.maxunit && datelimit.maxspan) {
                        var max = {};
                        max[datelimit.maxunit] = datelimit.maxspan;
                        options.range = {max: max};
                    }
                    return options;
                }

            }

            function isEqual(newVal, oldVal) {
                return newVal === oldVal ||
                    (oldVal[nameofstart] && oldVal[nameofend]
                        && newVal[nameofstart].valueOf() === oldVal[nameofstart].valueOf
                        && newVal[nameofend].valueOf() === oldVal[nameofend].valueOf());
            }

            /**
             *
             * Transform control value to model output value.
             * @param {Date} value Control value
             * @returns {null|*} null for invalid date
             */
            function transData(value) {
                var result = value, dt;
                var format = props.format, formatter = props.formatter;
                if (format === 'date') {
                    if (!value) {
                    } else {
                        dt = moment(value).toDate();
                    }
                    result = dt;
                } else if (format === 'string') {
                    dt = moment(value);
                    result = dt.format(formatter);
                } else if (format === 'custom') {
                    dt = moment(value).toDate();
                    result = dataEx.evalVarExpr(props.converter, {value: dt});
                    console.log('result', result, props.converter);
                }
                return result;
            }
        }

        function useSlider(props) {
            var display = props.display || {};
            return !!display.style;
        }

        function getTemplateForCompilation(props) {
            var el, w;
            var display = props.display || {};
            if (useSlider(props)) {
                el = angular.element('<div></div>');
                el.addClass('js-range-slider');
                setWidth(el);
                var width = '30em';
                if (props.width) {
                    width = props.width + 'em';
                }
                return '<div class="js-range-slider" style="width:' + width + '"></div>';
            } else {
                el = angular.element('<input type="text">');
                if (props.width) {
                    el.css('width', props.width + 'em');
                }
                el.attr({
                    'class': "form-control",
                    // 'ng-model': getModelName(props),
                    // '_modeloptions': '{updateOn:"blur"}',
                    'format': props.format,
                    'formatter': props.formatter,
                    // 'nameofstart': props.nameofstart,
                    // 'nameofend': props.nameofend,
                    'label': props.label,
                    'showlabel': props.showlabel,
                    'showdesc': props.showdesc,
                    // 'control': props.control,
                    // 'initval': props.initval,
                    'readonly': props.readonly,
                    // 'source': props.source,
                    // 'sourcedef': props.sourcedef,
                    'eventbychange': props.eventbychange,
                    'eventtorefresh': props.eventtorefresh
                });
                setWidth(el);
                var html = el.prop('outerHTML')/* + '<i class="udp-daterange-icon fa fa-calendar"></i>'*/;
                return wrapLabel(html);
            }

            function setWidth(el) {
                var display = props.display || {};
                if (display.width) {
                    w = parseInt(display.width);
                    if (w) {
                        el.css('width', w + 'em');
                    }
                }
            }

            function wrapLabel(content) {
                if (props.label && props.showlabel === true) {
                    return '<div class="form-group"><label class="control-label">' +
                        (props.label || '') + '</label><div class="form-control-wrapper">' + content + '</div></div>'
                }
                return content;
            }
        }
    }
})();
