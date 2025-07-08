/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
 */

(function ($) {
    'use strict';

    /**
     * @ngdoc
     * @description
     *
     */
    angular.module('oplus.udp').controller('WidgetCtrl', WidgetCtrl);

    WidgetCtrl.$inject = ['$q', '$scope', '$element', '$timeout', '$translate', 'pageService',
        'messageService', 'widgetConfigHelper', 'widgetFactory', 'widgetDataUtil', 'widgetValues', 'widgetUiHelper'];

    /**
     * @param $q
     * @param $scope
     * @param $element
     * @param $timeout
     * @param pageService {pageService}
     * @param messageService {messageService}
     * @param widgetConfigHelper {widgetConfigHelper}
     * @param widgetFactory {widgetFactory}
     * @param widgetDataUtil {widgetDataUtil}
     * @param widgetValues {widgetValues}
     * @param widgetUiHelper {widgetUiHelper}
     */
    function WidgetCtrl($q, $scope, $element, $timeout, $translate, pageService, messageService,
                        widgetConfigHelper, widgetFactory, widgetDataUtil, widgetValues, widgetUiHelper) {
        var ctrl = this;
        var props = ctrl.uwProps = ctrl.uwProps || {},
            type = ctrl.uwType;
        var isDynamicInited = false;
        ctrl.configWidget = configWidget;
        ctrl.copyWidget = copyWidget;
        ctrl.cutWidget = cutWidget;
        ctrl.pasteWidget = pasteWidget;
        ctrl.deleteWidget = deleteWidget;
        ctrl.moveWidget = moveWidget;
        ctrl.pinWidget = pinWidget;
        ctrl.reloadWidgetData = reloadWidgetData;
        ctrl.fireWidgetEvent = fireWidgetEvent;
        ctrl.renderDynamicContent = renderDynamicContent;
        ctrl.zoomIn = zoomIn;
        ctrl.$onInit = onInit;
        if (widgetUiHelper.isStaticWidget(type)) {
            return;
        }

        function onInit() {
            // Copy page scope pageParams to widget scope wParams
            ctrl.wParams = {};
            ctrl.$pageScope = widgetUiHelper.findPageScope($scope) || {};
            var pageParams = ctrl.$pageScope.pageParams || {};
            // angular.extend(ctrl.wParams, pageParams);
            // TODO: Migrate props.dateset.params to props.wparams
            var params;
            if (props.wparams) {
                params = props.wparams;
            } else if (props.dataset && props.dataset.params) {
                params = props.dataset.params;
            } else if (props.job && props.job.params) {
                params = props.job.params;
            } else if (props.name) {
                // For input that has no dataset but has name as wParams
                params = [{name: props.name}];
            }
            if (angular.isArray(params)) {
                params.forEach(function (param) {
                    // If page has a defined param which equals to widget param `name` or `binding`,
                    // assign the page param to widget param
                    var val = pageParams[param.name] || pageParams[param.binding];
                    if (angular.isDefined(val)) {
                        ctrl.wParams[param.name] = val;
                    }
                });
            }
            onEventToRefresh($scope, $element, props);
        }


        function zoomIn() {
            var container = $element.find('.uw-body .card-body');
            var elem = container.find('.card-body').children();//eq(0);
            elem = container.find('.uw-content');
            widgetUiHelper.zoomIn(elem, container, {title: props.title}, function (result) {
                $scope.$broadcast('WIDGET_RESIZE', {
                    from: 'ZOOM_OPEN',
                    reHeight: true,
                    contentElem: '#' + result.modalId + ' .uw-content'
                });
            }, function (size) {
                $scope.$broadcast('WIDGET_RESIZE', {from: 'ZOOM_RESTORE', reHeight: true});
            });
        }

        /**
         * Listen and watch events to refresh widget data
         */
        function onEventToRefresh(scope, element, props) {
            if (!props || (!props.dataset && !props.eventtorefresh))
                return;
            var event = (props.dataset || {}).eventtorefresh || props.eventtorefresh;
            if (event) {
                // console.log('onEventToRefresh',element.attr('uw-type'))
                scope.$on(widgetValues.events.WidgetEvent, function (evt, args) {
                    // console.log('got_widget_refresh_event', args, element.attr('uw-type'));
                    if (args.eventName === event) {
                        reloadWidgetData(null, element);
                    }
                });
            }
        }

        /**
         *
         * Render dynamic content after all params are evaluated.
         * Widget parameters are initiated by initval in input directive, page scope parameters.
         * @param scope
         * @param element
         * @param props
         */
        function renderDynamicContent(scope, element, props) {
            // var d = $q.defer();
            var expectedParams;
            if (props.dataset)
                expectedParams = _.map(props.dataset.params, 'name');
            // console.log('expectedParams', expectedParams);
            if (_.isEmpty(expectedParams)) {
                return renderWidgetControl(scope, element, props);
            }
            // Use `true` as third argument for deep watch
            var unregister = scope.$watch('$widget.wParams', function (newVal, oldVal) {
                // console.log('$watch($widget.wParams): newVal=%o,oldVal=%o',newVal,oldVal);
                var wParams = newVal;
                if (!isDynamicInited) {
                    // initWidgetControlWithParams(newVal);
                    var allParamsReady = _.difference(expectedParams, Object.keys(wParams)).length === 0;
                    // console.log('checkParamsReady', type, allParamsReady, 'expected', expectedParams, 'actual', Object.keys(wParams), wParams);
                    if (allParamsReady) {
                        renderWidgetControl(scope, element, props);
                        isDynamicInited = true;
                        // $q.when(renderWidgetControl(scope, element, props)).then(function () {
                        //     d.resolve();
                        // }).catch(function (err) {
                        //     console.error(err);
                        // });
                    }
                } else {
                    // d.resolve();
                    if (wParams['_NO_RELOAD']) return;
                    // console.log('WidgetParamsChangedToReloadWidgetData [%s] %o', type, {
                    //     newVal: wParams,
                    //     oldVal: oldVal
                    // });
                    reloadWidgetData(null, element);
                }
                // Reload widget data as wParams changes, use unregister to disable it
                // unregister();
            }, true);
            // return d.promise;

            // /**
            //  * Render dynamic content for the first time
            //  * @param wParams
            //  */
            // function initWidgetControlWithParams(wParams) {
            //     var allParamsReady = _.difference(expectedParams, Object.keys(wParams)).length === 0;
            //     // console.log('checkParamsReady', type, allParamsReady, 'expected', expectedParams, 'actual', Object.keys(wParams), wParams);
            //     // if (!_.isEmpty(wParams) && newVal !== oldVal && allParamsReady) {
            //     if (allParamsReady) {
            //         renderWidgetControl(scope, element, props);
            //         isDynamicInited = true;
            //     }
            // }

            function renderWidgetControl(scope, element, props) {
                // console.log('renderWidgetControl');
                widgetDataUtil.setWidgetParamValues(element, ctrl.wParams);
                var widgetDef = widgetFactory.lookupWidgetDef(type);
                var builder = widgetDef.controlRenderer;
                var initFn = builder.onInitControl || builder.renderDynamicData;
                if (angular.isFunction(initFn)) {
                    // console.debug('renderDynamicData [%s] %s', type, JSON.stringify(ctrl.wParams));
                    var result = initFn(scope, element, props);
                    // If result is a promise
                    if (result && angular.isFunction(result.then)) {
                        // var $loader = $('<div class="udp-wdiget-loading-indicator"><i class="fa fa-cog fa-spin"></i><p>加载中</p></div>');
                        var $loader = $('<div style="opacity: .25; text-align: center"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>');
                        element.addClass('udp-widget-loading');
                        // var $data = element.find('.uw-content .uw-content-data');
                        // if ($data.length === 0) {
                        var $data = element.find('.uw-content');
                        // }
                        $data.prepend($loader);
                        result.catch(function (err) {
                            if (err instanceof WidgetDataError) {
                                widgetUiHelper.showWidgetError(element, err.message, err.title);
                            } else {
                                widgetUiHelper.showWidgetError(element, err.message, $translate.instant('udp.wc.error.unknown'));
                            }
                        }).finally(function () {
                            $loader.remove();
                            element.removeClass('udp-widget-loading');
                        });
                    }
                    return result;
                }
            }
        }

        function moveWidget(direction, clickEvent) {
            // console.log('moveWidget', direction);
            var $elem = getWidgetElement(clickEvent);
            if (direction < 0) {
                $elem.insertBefore($elem.prev());
            } else if (direction > 0) {
                $elem.insertAfter($elem.next());
            }
        }

        function pinWidget(clickEvent) {
            var $elem = getWidgetElement(clickEvent);
            $elem.toggleClass('udp-pd-widget-pinned');
            $elem.addClass('hover');
            var pinIcon = $elem.find('.uw-pin i');
            if ($elem.hasClass('udp-pd-widget-pinned')) {
                pinIcon.removeClass('far fa-circle').addClass('fas fa-thumbtack');
            } else {
                pinIcon.removeClass('fas fa-thumbtack').addClass('far fa-circle');
            }
        }

        function deleteWidget(clickEvent) {
            var $elem = getWidgetElement(clickEvent);
            var type = $elem.attr('uw-type');
            messageService.confirmWarning($translate.instant('udp.designer.actions.delete_widget'), $translate.instant('udp.designer.actions.delete_widget_confirm', {type: type}), function () {
                $elem.remove();
            });
        }

        function pasteWidget() {
            if ($scope.$root['pasteWidgetEnabled'] === 'copy') {
                pageService.pasteWidget($element, ctrl.$pageScope);
            } else if ($scope.$root['pasteWidgetEnabled'] === 'cut') {
                pageService.pasteWidget($element, ctrl.$pageScope, true);
            }
        }

        function copyWidget() {
            pageService.copyWidget($element);
        }

        function cutWidget() {
            pageService.cutWidget($element);
        }


        /**
         * Method to invoke widget configuration view in page designer.
         * @param clickEvent {jQuery.Event=}
         */
        function configWidget(clickEvent) {
            var elem;
            if (clickEvent) {
                elem = getWidgetElement(clickEvent);
            } else {
                elem = $element;
            }
            // console.debug('widget.controller: configWidget');
            widgetConfigHelper.showConfigModal(elem, null);
        }

        /**
         * Broadcast event of {@link widgetValues.events.WidgetEvent}.
         * @param {string} name Event name to fire
         * @param {string=} args Event arguments in JSON string
         */
        function fireWidgetEvent(name, args) {
            var _scope = ctrl.$pageScope;
            var _args;
            if (args) {
                try {
                    _args = JSON.parse(args);
                } catch (err) {
                    console.error('Cannot parse event arguments with json ', args);
                }
            }
            // console.debug('$broadcast', widgetValues.events.WidgetEvent, name, _args);
            _scope.$broadcast(widgetValues.events.WidgetEvent, {eventName: name, eventArgs: _args});
        }

        /**
         *
         * @param event Click event
         * @returns {jquery}
         */
        function getWidgetElement(event) {
            var el = $(event.currentTarget);
            var elem = el.closest('.uwidget');
            if (elem.length === 0) {
                elem = el.closest('.widget-layout');
            }
            return elem;
        }

        /**
         * Reload widget data with dataset parameters
         * @param clickEvent {jQuery.Event}
         * @param element {jQuery}
         */
        function reloadWidgetData(clickEvent, element) {
            var elem;
            if (clickEvent)
                elem = getWidgetElement(clickEvent);
            else
                elem = element;

            var params = ctrl.wParams;
            widgetDataUtil.setWidgetParamValues(elem, params);
            // console.log('widgetDirective.reloadWidgetData', params);
            var type = ctrl.uwType;//elem.attr('uw-type');
            var builder = widgetFactory.lookupWidgetDef(type).controlRenderer;
            if (builder) {
                var reloadFn = builder.onReloadData || builder.reloadData;
                if (angular.isFunction(reloadFn)) {
                    // Widget data may rely on $widget.wParams
                    // In some cases we reload data by changing `wParams`
                    // So use `$timeout` to ensure reload after wParams digested
                    $timeout(function () {
                        reloadFn($scope, elem, props);
                    });
                }
            }
        }
    }

    /**
     * Just for data structure.
     * @constructor
     */
    function UwProps() {
        // For chart
        this.xAxis = {};
        this.yAxes = [];
        var unifiedProps = {
            dataset: {
                id: '',
                params: []
            },
            fields: [
                {
                    field: 'string',
                    convertFn: '',
                    label: ''
                }
            ],
            display: {
                height: 0, // The height of resizable area, default is uw-content
                width: 0,
                boxMode: false,//cardMode
                theme: '',
                backColor: '',
                fontColor: '',
                rules: [{}]
            },
            interaction: {
                actions: ['ajax', 'page', 'job', 'event', 'func', 'param'],
                ajax: {},
                page: {},
                job: {},
                event: {},
                func: {},
                param: {}
            },
            accesscontrol: {
                enabled: false,
                by: '',
                allow: ''
            },
            title: ''
        }
    }
})(jQuery);