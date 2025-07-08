/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/29/2017
 */
(function () {
    angular.module('oplus.udp').run(['$translate', 'widgetFactory', 'widgetDataUtil', 'themeService', calendarWidget]);

    /**
     *
     * @param $translate
     * @param widgetFactory {widgetFactory}
     * @param widgetDataUtil {widgetDataUtil}
     * @param themeService {themeService}
     */
    function calendarWidget($translate, widgetFactory, widgetDataUtil, themeService) {
        widgetFactory.defineWidget({
            type: 'calendar',
            configController: CalendarWidgetConfigCtrl,
            group: 'data',
            resizable: 'h',
            controlRenderer: {
                reloadData: reloadData,
                getTemplateForCompilation: getTemplateForCompilation,
                renderDynamicData: renderDynamicData
            }
        });

        function CalendarWidgetConfigCtrl(scope, props) {
            scope.fieldProps = [
                {
                    name: 'title',
                    title: $translate.instant('udp.w.calendar.config.event_title')
                },
                {
                    name: 'start',
                    title: $translate.instant('udp.w.calendar.config.start')
                }
            ];
        }

        function getTemplateForCompilation(props) {
            return '<div class="js-calendar"></div>';
        }


        function reloadData(scope, element) {
            element.find('.js-calendar').fullCalendar('refetchEvents');
        }

        function renderDynamicData(scope, element, props) {
            // var colors = themeService.calcColors(scope);
            var options = {
                events: fetchEvents,
                lang: $translate.use(),
                header: {
                    center: 'title',
                    left: 'month,agendaWeek,agendaDay',
                    right: 'today,prev,next'
                },
                views: {
                    month: {
                        // titleFormat: $translate.instant('udp.w.calendar.config.month_title_format')
                    }
                },
                // eventColor: 'transparent',
                // eventTextColor: colors.fontColor,
                defaultView: 'month',
                themeSystem: 'bootstrap3',
                bootstrapGlyphicons: {
                    close: ' fa fa-times',
                    prev: ' fa fa-chevron-left',
                    next: ' fa fa-chevron-right',
                    prevYear: ' fa fa-angle-double-left',
                    nextYear: ' fa fa-angle-double-right'
                }
            };

            var theCalendar = element.find('.js-calendar').fullCalendar(options);

            function fetchEvents(start, end, timezone, callback) {
                var events = [];
                var display = props.display || {},
                    fieldDefs = props.attrs || {};
                //TODO: consider refactor with KipWidget
                widgetDataUtil.queryData(element, props).then(function (data) {
                    var rules = [],
                        fields = ['title', 'start'];
                    fields.forEach(function (field) {
                        if (fieldDefs[field]) {
                            rules.push({
                                source: fieldDefs[field].field,
                                target: field,
                                convertFn: fieldDefs[field].convertFn
                            });
                        }
                    });
                    var records = widgetDataUtil.convertFields(data.records, rules);
                    records.forEach(function (event, i) {
                        events.push(event);
                    });
                    callback(events);
                }).catch(function (err) {
                    throw err;
                });
            }
        }
    }
})();
