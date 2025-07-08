/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
 */

(function ($) {
    'use strict';

    angular.module('oplus.udp')
        .directive('uwidget', uwidgetDirective);

    uwidgetDirective.$inject = ['$q', '$compile', 'widgetFactory', 'widgetValues', 'widgetDataUtil', 'themeService', 'widgetUiHelper', 'dataEx', 'widgetSecurity'];

    /**
     *
     * @ngdoc directive
     * @name uwidget
     * @description
     * Usage
     * ------------
     * A common directive to create content widget.
     * Layout widgets are created by directive `widget-layout`
     * ```html
     * <uwidget uw-type="string" uw-props="object"/>
     * ```
     * It has two key attributes: `uw-type` and `uw-props`
     * @attr {string} uw-type Mandatory, a registered widget type like `text-header`, `datatable`, `piechart` ...
     * @attr {object} uw-props Widget properties JSON object. Each widget type may have various properties.
     * There are some conventional properties like in {@see UwProps}
     *
     * @see UwProps
     *
     * @param $q
     * @param $compile
     * @param {widgetFactory} widgetFactory
     * @param {widgetValues} widgetValues
     * @param {widgetDataUtil} widgetDataUtil
     * @param {widgetUiHelper} widgetUiHelper
     * @param {themeService} themeService
     * @param {dataEx} dataEx
     * @param {widgetSecurity} widgetSecurity
     */
    function uwidgetDirective($q, $compile, widgetFactory, widgetValues, widgetDataUtil, themeService, widgetUiHelper, dataEx, widgetSecurity) {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {
                uwType: '@',
                uwProps: '<'
            },
            // DOM is not ready in execution of controller
            controller: 'WidgetCtrl',
            // NOTE: use controllerAs for a better scope isolation
            controllerAs: '$widget',
            link: linkFn
        };

        /**
         * Directive execution order:
         * 1. Template is parsed
         * 2. compile() (changes made to the template within compile are proliferated down to linking functions)
         * 3. controller()
         * 4. preLink()
         * 5. postLink()
         *
         * So do NOT manipulate DOM in controller!
         * @see https://stackoverflow.com/questions/16071676/order-of-execution-of-directive-functions-in-angularjs
         *
         */
        function linkFn(scope, element, attrs, ctrl) {
            element.data('$oplusScope', scope);
            var type = ctrl.uwType,
                props = ctrl.uwProps || {},
                widgetDef = widgetFactory.lookupWidgetDef(type);
            migrateProps(props);
            var displayProps = {
                cardMode: false,
                css: undefined,
                width: undefined,
                height: undefined,
                backColor: undefined,
                fontColor: undefined,
                theme: undefined
            };
            angular.extend(displayProps, props['display']);

            buildElementContent();

            $compile(element.contents())(scope);
            handleDisplayProps();
            ctrl.renderDynamicContent && ctrl.renderDynamicContent(scope, element, props);
            handleResizable();

            function buildElementContent() {
                // Some type widgets may contains inner widgets. Detach and save included content
                var includes = element.find('.uw-include-container');
                if (includes.length > 0) {
                    includes.detach();
                }
                generateWidgetTemplate(props, {widthMode: widgetDef.widthMode});
                // Replace placeholder defined in template with actual included content
                if (includes.length > 0) {
                    element.find('.uw-include-container').each(function () {
                        var elem = $(this);
                        var placeholder = elem.data('uwPlaceholder');
                        for (var i = 0; i < includes.length; i++) {
                            var inc = $(includes[i]);
                            if (inc.data('uwPlaceholder') === placeholder) {
                                elem.empty().append(inc.html());
                                break;
                            }
                        }
                    });
                }
            }

            function migrateProps(props) {
                var display = props.display || {};
                if (display.cardTheme) {
                    display.theme = display.cardTheme;
                    delete display.cardTheme;
                }
            }

            function handleDisplayProps() {
                if (displayProps.css) {
                    element.addClass(displayProps.css);
                }
                widgetUiHelper.adjustWidgetSize(element, displayProps);
            }

            function handleResizable() {
                if (!widgetDef.resizable) {
                    return;
                }
                var resizeFn;
                if (widgetDef.controlRenderer) {
                    resizeFn = widgetDef.controlRenderer.onResize;
                }
                // Resize function cannot be called in controller since DOM is not ready in controller
                // console.log('handleResizable', ctrl.uwProps);
                widgetUiHelper.makeWidgetResizable(element, function resizeStopCallback(size) {
                    // resizeFn && resizeFn(element, size);
                    var args = {
                        from: 'RESIZE_WIDGET',
                        reHeight: true,
                        needSave: true,
                        height: size.height,
                        width: size.width,
                        oldHeight: size.oldHeight,
                        oldWidth: size.oldWidth
                    };
                    scope.$broadcast('WIDGET_RESIZE', args);
                });

                if (resizeFn) {
                    scope.$on('WIDGET_RESIZE', onWidgetResize);
                }

                /**
                 *
                 * @param e
                 * @param {object} options
                 * @param {string} options.from
                 */
                function onWidgetResize(e, options) {
                    // console.log('WIDGET_RESIZE', options.from, options);
                    resizeFn(element, options);
                }
            }

            /**
             * Generate concrete HTML for the widget element.
             * It will change the element inner HTML content.
             * @param props Widget uw-props
             * @param config
             * @param {string=} config.widthMode Width mode "wm-inline", "wm-full"
             */
            function generateWidgetTemplate(props, config) {
                var isEditMode = widgetUiHelper.isEditMode();
                config = config || {};
                // Generate unique id for widget
                // jquery-ui's uniqueId will duplicate, use customized id generator
                if (isEditMode && !element.attr('id')) {
                    element.widgetUid();
                }
                element.addClass('uwidget uwtype-' + type/* + ' js-resize-container'*/);
                if (config.widthMode) {
                    element.addClass('udp-' + config.widthMode);
                } else {
                    element.addClass('udp-wm-full');
                }
                // If the directive has been generated,
                // do nothing for static widget body content,
                // remove generated content for dynamic data widget.
                var existingBody = $('> .uw-body', element).html();
                if (existingBody && widgetUiHelper.isTextWidget(type)) {
                    var tpl = getSkeletonTemplate(type, isEditMode, props, existingBody);
                    element.html(tpl);
                    if (!isEditMode) {
                        $('[contenteditable]', element).removeAttr('contenteditable');
                    }
                } else {
                    element.html(getSkeletonTemplate(type, isEditMode, props));
                }

                if (!isEditMode) {
                    widgetUiHelper.addStateControlAttr(element.find('.uw-body'), props);
                    widgetSecurity.changeAccessState(element.find('.uw-content'), props.accesscontrol);
                }

                /**
                 * Get static HTML template for generating widget skeleton.
                 *
                 * @param type
                 * @param {boolean} isEditMode
                 * @param props {*} angular element attributes in normalized camelCase form
                 * @param existingBody
                 * @see {widgetValues}
                 * @returns {*}
                 */
                function getSkeletonTemplate(type, isEditMode, props, existingBody) {
                    var html, uwButtons = '', uwBody, uwSymbol = '';
                    var widgetDef = widgetFactory.lookupWidgetDef(type);
                    var controlRenderer = widgetDef.controlRenderer;
                    var templateForCompilation;
                    try {
                        templateForCompilation = controlRenderer.getTemplateForCompilation(props, type, element);
                    } catch (err) {
                        if (err instanceof WidgetNotConfiguredError) {
                            templateForCompilation = widgetUiHelper.getTemplateForUndefinedWidget(err.message, 'fa-4x uw-icon uwtype-' + type);
                        } else {
                            //TODO: show error on UI
                            console.error(err);
                        }
                    }
                    var tc = {
                        configCode: controlRenderer.getConfig && controlRenderer.getConfig(props),
                        bodyCode: templateForCompilation
                    };

                    // HTML for .uw-buttons
                    var configCode = tc.configCode;
                    // if (place !== widgetValues.IN_PAGE) {
                    if (isEditMode) {
                        uwButtons = widgetUiHelper.buildWidgetButtons(type, configCode);
                    }

                    // HTML for .uw-body
                    var dbclick = isEditMode ? ' ng-dblclick="$widget.configWidget($event)"' : '';
                    var contentStyle = '';
                    // if (widgetDef.resizable && !widgetDef.resizeSelector && display.height) {
                    //     contentStyle = ' style="height:' + display.height + '"';
                    // }
                    var body = '<div class="uw-content ' + (displayProps.mainCss || '') + '"' + contentStyle + dbclick + '>' + tc.bodyCode + '</div>';
                    // body = body + "<code>{{$widget.wParams}}</code>";
                    if (props.dataset && props.dataset.params) {
                        if (props.dataset.hideParams === true && !props.dataset.paramView) {
                            // 20210611: To compatible with old version `hideParams`
                            props.dataset.paramView = 'hidden';
                        }
                        body = buildWidgetParamControls(props.dataset.params, {
                            paramView: props.dataset.paramView,
                            refreshBtn: props.dataset.refreshBtn
                        }) + body;
                    }
                    //TODO: rename cardMode to boxMode 20180830
                    if (displayProps.widthMode === 'wm-full') {
                        element.width('100%');
                    }
                    if (displayProps['boxMode'] || displayProps['cardMode']) {
                        element.addClass('udp-card-mode');
                        body = widgetUiHelper.generateCard(displayProps, body, props.title);
                    }
                    if (!isEditMode && existingBody && widgetUiHelper.isTextWidget(type)) {
                        existingBody = replaceVariable(existingBody);
                    }
                    uwBody = '<div class="uw-body" ' + /*(widgetUiHelper.isTextWidget(type) ? 'contenteditable="true"' : '') +*/ '>' + (existingBody ? existingBody : body) + '</div>';
                    html = uwButtons + uwSymbol + uwBody;
                    return html;


                    function replaceVariable(html) {
                        // var values = scope.$widget.$pageScope.pageParams;
                        // Use `@` for $widget.$pageScope.pageParams

                        // Variable in format of ${@.pageparam_name.pageparam_attr}
                        return dataEx.replaceVars(html, function (name) {
                            var paramPath = name;
                            if (/^@\./.test(name)) {
                                paramPath = name.substring('@.'.length);
                            }
                            var str = '<span>{{$widget.$pageScope.pageParams | pathValue: "' + paramPath + '"}}</span>';
                            return str;
                        });
                    }

                    /**
                     * Build HTML for parameter controls
                     * @param {{param_name:{label:string,control:string,value:string,source:string,sourcedef:string,format:string}}} params Dataset params
                     * @param {{paramView:string,refreshBtn:boolean=}} options
                     * @returns {string} HTML content
                     */
                    function buildWidgetParamControls(params, options) {
                        options = _.extend({}, {paramView: '', refreshBtn: false}, options);
                        var html = '';
                        if (!params || params.length === 0) {
                            return html;
                        }
                        var form = angular.element('<form class="uw-params op-smartform form-inline"></form>');
                        // form.append('<span>{{$widget.wParams}}</span>');
                        params.forEach(function (param) {
                            var el = widgetUiHelper.buildParamInputControl(param.name, param);
                            if (param.keepvis) {
                                el.addClass('js-keepvis');
                            }
                            form.append(el);
                        });
                        if (options.refreshBtn) {
                            var btnReload = $('<button class="btn btn-default opx-btn-icon opx-btn-flat js-reload" ng-click="$widget.reloadWidgetData($event)" title="{{\'common.action.delete\'|translate}}"><i class="far fa-sync-alt"></i></button>');
                            btnReload.appendTo(form);
                        }
                        if (options.paramView === 'dropdown') {
                            // form.removeClass('uw-params form-inline');
                            var dd = $('<div class="dropdown uw-params-dropdown">\n' +
                                '  <button class="btn btn-outline-default dropdown-toggle" type="button" data-bs-toggle="dropdown">' +
                                '    <i class="fal fa-fw fa-sliders-v"></i> <i class="far fa-fw fa-angle-down"></i>' +
                                '  </button>' +
                                '</div>');
                            var ddMenu = $('<div class="dropdown-menu js-inside-click p-3"></div>');
                            ddMenu.append($('<div class="form-vertical"></div>').append(form.children().not('.js-keepvis')));
                            dd.append(ddMenu);
                            form.prepend(dd);
                        } else {
                            if (options.paramView === 'hidden') {
                                form.addClass('hidden');
                            }
                        }
                        html = form.prop('outerHTML');
                        return html;
                    }
                }
            }
        }
    }

    jQuery.fn.extend({
        /**
         * Generate unique ID for element.
         * jquery-ui's uniqueId() (https://api.jqueryui.com/uniqueId/) always starts from 0
         * which will generate duplicate ID for new widget on existing page.
         * @returns {jQuery}
         */
        widgetUid: (function () {
            var index = 0;
            return function () {
                return this.each(function () {
                    if (!this.id) {
                        this.id = ('w-' + Date.now()) + (++index);
                    }
                })
            }
        })()
    })
})(jQuery);
