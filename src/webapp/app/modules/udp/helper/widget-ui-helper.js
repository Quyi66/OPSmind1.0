/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/30/2017
 */
(function ($) {
    'use strict';

    angular.module('oplus.udp').service('widgetUiHelper', widgetUiHelper);

    widgetUiHelper.$inject = ['$uibModal', '$state', '$translate', 'widgetFactory', 'themeService', '$compile', 'currentUser', 'dataEx', 'pageDataUtil'];

    /**
     * @ngdoc service
     * @name widgetUiHelper
     * @description
     * Helper for widget UI.
     * @param $uibModal
     * @param $state
     * @param {$translate} $translate
     * @param {widgetFactory} widgetFactory
     * @param {themeService} themeService
     * @param $compile
     * @param {currentUser} currentUser
     * @param {dataEx} dataEx
     * @param {pageDataUtil} pageDataUtil
     */
    function widgetUiHelper($uibModal, $state, $translate, widgetFactory, themeService, $compile, currentUser, dataEx, pageDataUtil) {
        this.buildWidgetButtons = buildWidgetButtons;
        this.buildParamInputControl = buildParamInputControl;
        this.isEditMode = isEditMode;
        this.isLayoutWidget = isLayoutWidget;
        this.isColWidget = isColWidget;
        this.isStaticWidget = isStaticWidget;
        this.isTextWidget = isTextWidget;
        this.upgradeWidgetProps = upgradeWidgetProps;
        this.readWidgetProps = readWidgetProps;
        this.zoomIn = zoomIn;
        // this.restrictedMode = restrictedMode;
        /**
         * @deprecated
         * @type {findPageScope}
         */
        this.findPageScope = findPageScope;
        this.findWidgetScope = findWidgetScope;
        this.updateLayoutWidgetElementAttrs = updateLayoutWidgetElementAttrs;
        this.makeWidgetResizable = makeWidgetResizable;
        this.getTemplateForUndefinedWidget = getTemplateForUndefinedWidget;
        this.showWidgetError = showWidgetError;
        this.removeWidgetError = removeWidgetError;
        this.addStateControlAttr = addStateControlAttr;
        // this.calcFlexibleFullHeight = calcFlexBodyHeight;
        this.calcWidgetContentHeight = calcWidgetContentHeight;
        this.adjustWidgetSize = adjustWidgetSize;
        this.generateCard = generateCard;
        this.replacePageParamsVar = replacePageParamsVar;
        this.buildButton = buildButton;
        this.changeElementState = changeElementState;
        this.applyCustomWidgetCss = applyCustomWidgetCss;
        this.observeEmptyPlaceholder = observeEmptyPlaceholder;

        /**
         * Watch and add/remove placeholder to target element if target is empty
         * @param scope
         * @param {jQuery} target Target element to observe
         * @param {object} placeholder Placeholder appended to target when empty
         * @param {string} placeholder.css One CSS class added to the placeholder. It is used to query the placeholder.
         * @param {string} placeholder.text HTML text displayed in the placeholder
         */
        function observeEmptyPlaceholder(scope, target, placeholder) {
            var placeholderCss = placeholder.css;
            var observers = []
            target.each(function () {
                var container = $(this);
                handlePlaceholder(container);
                //https://stackoverflow.com/questions/15657686/jquery-event-detect-changes-to-the-html-text-of-a-div
                var observer = new MutationObserver(function (mutations) {
                    handlePlaceholder(container);
                });
                observer.observe(container[0], {childList: true, attributes: false, characterData: false});
                observers.push(observer);
            });
            scope.$on('$destroy', function () {
                // Disconnect and release observers
                observers.forEach(function (o) {
                    o.disconnect();
                    o = undefined;
                })
            })

            function handlePlaceholder(container) {
                if (container.children().length === 0) {
                    var placeholderHtml = '<div class="' + placeholderCss + '">' + placeholder.text + '</div>';
                    container.append(placeholderHtml);
                } else if (container.children().length > 1) {
                    container.find('>.' + placeholderCss).remove();
                }
            }
        }

        /**
         * Adjust layout widget size by its display properties
         * @param {angular.element|jQuery} widgetElem
         * @param {string} type Widget type
         * @param {object} display Widget display properties
         * @param {number|string} display.height Element height, value of jquery.css(height)
         */
        function adjustLayoutWidgetSize(widgetElem, type, display) {
            if (display.height) {
                // contentElem.addClass('scroll-y');
                //20200417 do not use height() which not include padding,margin and border
                widgetElem.css('height', display.height);
                widgetElem.addClass('udp-widget-fixed-height');
            } else {
                widgetElem.css('height', null);
            }
            if (display.width) {
                widgetElem.css('width', display.width);
                if (type === 'layout-flex' && display.width === 'fill') {
                    // Use scroll to ensure content to fit in widget width
                    widgetElem.addClass('scroll-x');
                    // Override max-width defined by col-sm
                    // widgetElem.css('max-width', 'unset');
                    widgetElem.css('flex', '1').css('max-width', 'unset');
                }
            } else {
                widgetElem.css('width', '').css('flex', '').removeClass('scroll-x');
            }
        }

        /**
         * Adjust widget and its content size
         * @param widgetElem Widget element
         * @param displayProps Widget display properties
         */
        function adjustWidgetSize(widgetElem, displayProps) {
            // var resizeConfig = getResizeConfig(widgetElem);
            var uwContent = widgetElem.find('.uw-content');
            // Height applied to widget content or widget element
            var useHeightOfContent = false;
            var height = displayProps.height;
            if (height) {
                widgetElem.addClass('udp-widget-fixed-height');
                if (useHeightOfContent) {
                    uwContent.css('height', roundHeight(height));
                } else {
                    // console.log('adjustWidgetSize', roundHeight(height));
                    widgetElem.css('height', roundHeight(height));
                }
            }
            // Width applied to widget
            var width = displayProps.width;
            if (width) {
                // Remove abs width and use percentage
                widgetElem.css('width', '');
                widgetElem.attr('class', function (i, c) {
                    return c.replace(/(^|\s)udp-wpct-\S+/g, '');
                });
                // Before 20200416, number is % width
                if (angular.isNumber(width) || _.endsWith(width, "%")) {
                    width = (width + '').replace('%', '');
                    widgetElem.addClass('udp-wpct-' + width);
                } else {
                    // if (width.endsWith('px')) {
                    widgetElem.css('width', width);
                    // }
                }
                // element.css('width', display.width);
            }
        }

        /**
         *
         * Change button state by attribute `udp-state-control` or deprecated `data-statecontrol`
         * @param element jQuery element
         * @param {object} sc Config for state control
         * @param {boolean} sc.enabled `true` to enable state control
         * @param {string} sc.allow Expression to check state
         * @param {string} sc.state `disabled` to disable element if fail
         * @param {object} values Value object for variables in state control expression
         * @param scope
         */
        function changeElementState(element, sc, scope, values) {
            if (!sc) {
                var str = element.attr('udp-state-control') || element.attr('data-statecontrol');
                if (str) {
                    try {
                        sc = JSON.parse(str);
                    } catch (err) {
                        console.warn('Cannot parse `udp-state-control` from ' + str);
                    }
                }
            }
            if (sc && sc.enabled && sc.allow) {
                var config = sc;
                values = values || {};
                pageDataUtil.getPageScopeValues(scope, values);
                var expr = dataEx.kinds.JS + ':' + config.allow;
                var check = dataEx.evalVarExpr(expr, values);
                // console.log('watch', scope, expr, check, values);
                if (config.state === 'disabled') {
                    if (check === true) {
                        element.removeClass('disabled').removeAttr('disabled');
                    } else {
                        element.addClass('disabled').attr('disabled', 'disabled');
                    }
                } else {
                    if (check === true)
                        element.show();
                    else
                        element.hide();
                }
            }
        }


        /**
         *
         * @param widgetElem
         * @param props
         * @return {object} Updated props
         */
        function upgradeWidgetProps(widgetElem, props) {
            var uwProps = readWidgetProps(widgetElem);
            // console.log('old',JSON.stringify(uwProps));
            //LEO@20181217: Use `merge` instead of `extend` or `assign`,
            // because we need copy properties recursively
            // _.extend({display:{height:100}},{display:{mode:'card'}}) --> {display:{mode:'card'}}
            // _.merge({display:{height:100}},{display:{mode:'card'}}) --> {display:{height:100,mode:'card'}}
            // _.extend(uwProps, props);
            _.merge(uwProps, props);
            // console.log('new',JSON.stringify(uwProps));
            widgetElem.attr('uw-props', JSON.stringify(uwProps));
            return uwProps;
        }

        /**
         * Simply read `uw-props` attribute from widget element
         * @param widgetElem
         * @returns {object} Object of uw-props
         */
        function readWidgetProps(widgetElem) {
            var props = widgetElem.attr('uw-props');
            try {
                return JSON.parse(props || '{}');
            } catch (err) {
                console.error('Cannot parse widget `uw-props` from `' + props + '`');
                return {};
            }
        }

        /**
         * Get button display config from a button element.
         * @param {HTMLElement} button
         * @return {{label:string,icon:string,layout:string,color:string,style:string}} Button display config
         * @see widgetUiHelper.buildButton
         */
        function getButtonDisplayConfig(button) {
        }

        /**
         * Build button element.
         * @param {object} display Button display options
         * @param {string} display.label Button label
         * @param {string} display.icon Fontawesome icon
         * @param {string} display.size Button size in "lg", "", "sm"
         * @param {string} display.layout Label and icon layout, "icon-left","icon-right","icon-only","icon-no"
         * @param {string} display.color Button color, "btn-default", "btn-primary", btn-success", "btn-warning", "btn-info", "btn-danger"
         * @param {string} display.style Space separated style list, "outline rounded flat"
         * @param {object=} accesscontrol Access control config
         * @return {jQuery} Button element
         */
        function buildButton(display, accesscontrol) {
            // console.log('buildButton', display);
            var button;
            var styles = [];
            if (display.style) {
                styles = display.style.split(/\s+/);
            }
            var isTextLink = styles.indexOf('text') >= 0;
            if (isTextLink) {
                button = $('<span class="btn-link"></span>');
            } else {
                button = $('<button class="btn"></button>');
            }
            var label = display.label || 'Button';
            var NO_ICON = 'icon-no',
                ICON_RIGHT = 'icon-right',
                ICON_LEFT = "icon-left",
                ICON_TOP = "icon-top",
                ICON_ONLY = 'icon-only';
            button.attr('title', label)
                .attr('ng-click', 'click($event)');
            var buttonColor = display.color || 'default';
            var btnClasses = ['js-op-button', display.layout];
            if (buttonColor.indexOf('btn-') === 0) {
                // 20200406: for compatible with old version which save btn-* as color
                buttonColor = buttonColor.substring(4);
            }
            if (styles.indexOf('flat') >= 0) {
                btnClasses.push('opx-btn-flat btn-' + buttonColor);
            } else if (styles.indexOf('outline') >= 0) {
                btnClasses.push('btn-outline-' + buttonColor);
            } else {
                btnClasses.push((isTextLink ? 'text-' : 'btn-') + buttonColor);
            }
            if (styles.indexOf('rounded') >= 0) {
                btnClasses.push('rounded-pill');
            }
            if (display.layout === ICON_ONLY) {
                btnClasses.push('opx-btn-icon');
            }
            if (display.size) {
                btnClasses.push('btn-' + display.size);
            }
            // console.log('classes', btnClasses);
            button.addClass(btnClasses.join(' '));
            if (display.layout !== ICON_ONLY) {
                button.html('<span>' + label + '</span>');
            }
            if (display.icon && display.layout !== NO_ICON) {
                var icon = ' <i class="fa ' + display.icon + '"></i> ';
                if (display.layout === ICON_RIGHT) {
                    button.append(icon);
                } else {
                    button.prepend(icon);
                }
            }

            // if (accesscontrol) {
            //     addUaaAttribute(button, accesscontrol);
            // }
            return button;
        }


        /**
         * Replace page and global parameters.
         * - `[[@.page_param_name]]` to `{{$widget.$pageScope.pageParams.page_param_name}}`
         * - `[[ @ | json ]]` to `{{ $widget.$pageScope.pageParams | json }}`
         * - `[[(50-@.page_param_name)/100]]` to `{{(50-$widget.$pageScope.pageParams.page_param_name)/100}}`
         * - `[[#.global_param_name]]` to `{{widget.$pageScope.globalParams.global_param_name}}`
         *
         * Characters allowed before `@` and `#`:
         * - white space: `\s`
         * - left bracket: `(`
         * - operator: `+`, `-`, `*`, `/`
         * Characters allowed after `@` and `#`:
         * - white space: `\s`
         * - path or filter: `.`, `|`
         * @param {string} text
         * @param {object=} options
         * @param {string=} options.left String to wrap new var, default is `{{`
         * @param {string=} options.right String to wrap new var, default is `}}`
         * @returns {string}
         */
        function replacePageParamsVar(text, options) {
            if (!text)
                return text;
            options = options || {};
            var leftWrapper = options.left || '{{',
                rightWrapper = options.right || '}}';
            var regPageParams = /\{\{(.*?[\(\+\-\*\/]*)@(\s*[\.\|]?)/g,
                regGlobalParams = /\{\{#([\.\|])/g,
                regVarExp,
                result;
            // if (options.notInTag) {
            //     regVarExp = />([^<]*?)\[\[(.*?)]]/g;
            //     result = text.replace(regVarExp, '>$1{{$2}}');
            // } else {
            regVarExp = /\[\[(.*?)]]/g;
            result = text.replace(regVarExp, '{{$1}}');
            // }
            // if (!options.keepVar) {
            result = result.replace(regPageParams, '{{$1$widget.$pageScope.pageParams$2')
                .replace(regGlobalParams, '{{$widget.$pageScope.globalParams$1');
            result = result.replace(/\{\{(.*?)\}\}/g, leftWrapper + '$1' + rightWrapper);
            // }
            return result;
        }

        /**
         * Generate card HTML for widget
         * @param {object} display Display property
         * @param {string} display.theme
         * @param {string} display.backColor
         * @param {string} display.fontColor
         * @param {string} body Body HTML
         * @returns {string} HTML
         */
        function generateCard(display, body, title) {
            var themeId = display.theme;
            var cardCss = '',
                buttons = '';
            var enableCardColor = themeService.isCardColorEnabled();
            var colors = {};
            if (!isEditMode())
                title = replacePageParamsVar(title);
            if (themeId) {
                if (themeId === '_CUSTOM') {
                    colors = {
                        headerBackColor: display.backColor,
                        bodyBackColor: display.backColor,
                        borderColor: '',
                        headerFontColor: display.fontColor,
                        bodyFontColor: display.fontColor
                    };
                } else {
                    // cardCss = themeService.findCardTheme(themeId).css;
                    if (themeId === 'dark' || themeId === 'black') {
                        cardCss = 'op-theme-dark';
                    } else {
                        cardCss = 'op-theme-light';
                    }
                    // cardCss = 'bg-' + themeId;
                }
            } else {
                // cardCss = 'op-theme-auto';
            }
            if (display.cardControls) {
                buttons = '<a ng-click="$widget.zoomIn()" class="pull-right"><i class="text-muted fa fa-window-maximize"></i></a>';
            }
            var cardStyle = '';
            var cardHeader = '';
            var cardBodyStyle = colorStyle(colors.bodyBackColor, colors.bodyFontColor);
            if (themeId === '_CUSTOM') {
                cardStyle = colorStyle('transparent', colors.bodyFontColor);
            }
            if (title) {
                cardHeader = '<div class="card-header" ' + colorStyle(colors.headerBackColor, colors.headerFontColor) + '>' + buttons + title + '</div>';
            }
            var cardHtml = '<div class="card udp-card-mode __opx-autocolor ' + (cardCss || '') + '" ' + cardStyle + '>' +
                cardHeader + '<div class="card-body" ' + cardBodyStyle + '>' + body + '</div></div>';
            return cardHtml;

            function colorStyle(backColor, fontColor) {
                var result = '';
                if (!enableCardColor) {
                    return result;
                }
                if (backColor || fontColor) {
                    result = ' style="';
                    if (backColor) {
                        result += 'background-color:' + backColor + ';';
                    }
                    if (fontColor) {
                        result += 'color:' + fontColor;
                    }
                    result += '"; ';
                }
                return result;
            }
        }

        /**
         * Show error info in widget
         * @param {angular.element} widgetElem
         * @param {string} body HTML text as message body
         * @param {string} title Message title
         */
        function showWidgetError(widgetElem, body, title) {
            var errorSection = widgetElem.find('.udp-widget-error');
            var type = widgetElem.attr('uw-type');
            var content = widgetElem.find('.uw-content').hide();
            var icon = 'fa-4x fa-times-circle';
            if (type) {
                icon = 'fa-4x uw-icon uwtype-' + type;
            }
            var html = genHtml(title, body, icon, 'udp-widget-error');
            var object = angular.element(html);
            var scope = widgetElem.scope();
            if (!scope) {
                console.warn('Cannot get scope() from element [' + widgetElem.attr('uw-type') + '] ' + widgetElem.attr('id'), widgetElem);
            } else {
                $compile(object)(scope);
            }
            if (errorSection.length === 0) {
                object.insertBefore(content);
            } else {
                errorSection.replaceWith(object);
            }

            function genHtml(title, body, icon, css) {
                var html = '<section class="op-blank-slate ' + (css || '') + '">';
                var useBs5 = true;
                html += '<div class="op-blank-slate-body">';
                if (icon) {
                    html += '<div class="op-blank-slate-icon"><i class="fa ' + icon + '"></i></div>';
                }
                html += '<p><a data-bs-toggle="popover" data-bs-content="' + _.escape(body || '') + '"' +
                    ' title="' + $translate.instant('common.term.error') + '"' +
                    ' data-bs-custom-class="udp-widget-error" opx-popdrop>' + title + '</a></p>';
                html += '</div>';
                html += '</section>';
                return html;
            }
        }

        function removeWidgetError(widgetElem) {
            widgetElem.find('.uw-content').show();
            widgetElem.find('.udp-widget-error').remove();
        }

        function applyCustomWidgetCss(widgetElem, css) {
            //Remove existing custom css and apply new css from display
            var customCssList = themeService.getNamedCssClasses();
            // console.log('removeClass...',customCssList.join(' '));
            widgetElem.removeClass(customCssList.join(' '));
            if (css) {
                //20200408: margin has no effect on content on card mode
                widgetElem.addClass(css);
            }
        }

        /**
         * Add state control properties to an element attribute
         * @param {jQuery} elem The element to add attribute
         * @param {{statecontrol:*}} props Properties of state control
         */
        function addStateControlAttr(elem, props) {
            if (props.statecontrol) {
                var value = JSON.stringify(props.statecontrol);
                elem.attr('udp-state-control', value);
            }
        }

        /**
         * Update layout widget HTML element attributes from widget configured properties.
         * @param {string} type widget type for 'uw-type'
         * @param {object} props
         * @param {jQuery} widgetElem Element of widget itself
         * @param {scope} scope Scope to broadcast WIDGET_RESIZE event
         */
        function updateLayoutWidgetElementAttrs(type, props, widgetElem, scope) {
            props = props || {};
            var useGridForFlex = !false;
            var displayProps = props.display || {};
            var layouts = {
                'layout-col': {
                    content: '>.uw-column, >.card>.card-body>.uw-column'
                },
                'layout-flex': {
                    content: '>.uw-column, >.card>.card-body>.uw-column'
                },
                'layout-row': {
                    content: '>.uw-row'
                },
                'layout-float': {
                    content: '>.uw-float'
                }
            };
            widgetElem.attr('uw-type', type)
                .addClass('uwidget widget-layout')
                .addClass('uwtype-' + type);
            // addStateControlAttr(widgetElem, props);
            var layout = layouts[type];
            var contentElem = $(layout.content, widgetElem);
            applyCustomWidgetCss(widgetElem, displayProps.css);

            if (props.id) {
                contentElem.attr('id', props.id);
            }
            adjustLayoutWidgetSize(widgetElem, type, displayProps);
            if (type === 'layout-flex') {
                var flex = props.flex || {};
                updateColItemsAlignment(flex);
            }

            if (type === 'layout-col' || type === 'layout-flex') {
                // if (type === 'layout-flex' && useGridForFlex) {
                updateColSpan();
                // }
                if (displayProps.asform) {
                    contentElem.addClass('op-smartform form-' + displayProps.asform);
                }
                contentElem.removeClass(function (index, className) {
                    return (className.match(/(^|\s)with-cols-\S+/g) || []).join(' ');
                });
                if (displayProps.formcols === 2) {
                    contentElem.addClass('with-cols-' + displayProps.formcols);
                }
                handleCardModeForCol();
            } else if (type === 'layout-float') {
                // Float index should be greater than widget hover index (9)
                widgetElem.css('position', 'absolute')
                    .css('z-index', displayProps.zindex || '19');
                // console.log('zindex',display.zindex);
                if (displayProps.maxWidth) {
                    widgetElem.css('max-width', displayProps.maxWidth)
                        .css('overflow-x', 'auto');
                }
                if (displayProps.maxHeight) {
                    widgetElem.css('max-height', displayProps.maxHeight)
                        .css('overflow-y', 'auto');
                }
                if (displayProps.draggable) {
                    if (!widgetElem.is('.ui-draggable'))
                        widgetElem.draggable();
                }
                if (displayProps.resizable) {
                    if (!widgetElem.is('.ui-resizable'))
                        widgetElem.resizable({
                            stop: function (event, ui) {
                                // var args = {height: ui.size.height, width: ui.size.width};
                                scope.$broadcast('WIDGET_RESIZE', {
                                    from: 'RESIZE_FLOAT',
                                    reHeight: false
                                });
                            }
                        });
                }
            }

            function updateColItemsAlignment(flex) {
                contentElem.removeClassMatch(/(justify-content-.*)|(flex-.*)|(align-items-.*)|(align-content-.*)/);
                // .removeClassMatch('align-items')
                var isHFlex = flex.direction !== 'flex-column';
                if (flex.direction)
                    contentElem.addClass(flex.direction);
                if (flex.alignV === 'middle') {
                    contentElem.addClass(isHFlex ? 'align-items-center' : 'justify-content-center');
                } else if (flex.alignV === 'bottom') {
                    contentElem.addClass(isHFlex ? 'align-items-end' : 'justify-content-end');
                } else {
                    contentElem.addClass(isHFlex ? 'align-items-start' : 'justify-content-start');
                }
                if (flex.gap > 0) {
                    contentElem.css('gap', flex.gap + 'px');
                }
                if (flex.alignV) {
                    contentElem.css('align-content', 'unset');
                }
                if (flex.alignH === 'center') {
                    contentElem.addClass(isHFlex ? 'justify-content-center' : 'align-items-center align-content-center');
                } else if (flex.alignH === 'right') {
                    contentElem.addClass(isHFlex ? 'justify-content-end' : 'align-items-end align-content-end')
                } else if (flex.alignH === 'justify' && isHFlex) {
                    contentElem.addClass('justify-content-between')
                }
            }

            function updateColSpan() {
                // Handle css for col span and form display
                var span = props.span || "12";
                //https://stackoverflow.com/questions/2644299/jquery-removeclass-wildcard
                widgetElem.removeClass(function (index, className) {
                    return (className.match(/(^|\s)col-\S+/g) || []).join(' ');
                });
                widgetElem.addClass('col-sm-' + span);
                contentElem.removeClass(function (index, className) {
                    return (className.match(/(^|\s)form-\S+/g) || []).join(' ');
                });
            }

            function handleCardModeForCol() {
                // console.log('handleCardModeForCol');
                // Must remove card first, otherwise change card title will not work
                removeCard();
                if (displayProps.boxMode || displayProps.cardMode) {
                    addCard();
                }

                function addCard() {
                    var col = widgetElem.find('> .uw-column');
                    if (col.length === 1) {
                        var card = generateCard(displayProps, '', props.title);
                        widgetElem.append(card);
                        col.appendTo(widgetElem.find('> .card > .card-body'));
                    }
                }

                function removeCard() {
                    var cardElem = widgetElem.find('> .card');
                    // console.log('cardElem',cardElem.length,element.html());
                    if (cardElem.length === 1) {
                        // Move content out of card
                        cardElem.find('>.card-body').children().appendTo(widgetElem);
                        cardElem.remove();
                    }
                }
            }
        }

        function removeCssByRegex(regex) {
            // var regs = [].concat(regex);
            // element.removeClass(function (index, className) {
            //     for (var i =0;i<regs.length;i++){
            //        if (className.match(regs[i])) {
            //
            //        }
            //     }
            //     return (className.match(/(^|\s)col-\S+/g) || []).join(' ');
            // });
        }

        /**
         * Remove element classes except those of exclusion.
         * @param {jQuery} element
         * @param {string} cssToPreserve Space separated css class names shall be preserved
         */
        function removeCss(element, cssToPreserve) {
            var existingCss = element[0].className;
            var toRemove = diffCss(cssToPreserve, existingCss);
            element.removeClass(toRemove);

            function diffCss(sysCssList, oldCssList) {
                var sysCss = sysCssList.split(/\s+/);
                var oldCss = oldCssList.split(/\s+/);
                return _.difference(oldCss, sysCss).join(' ');
            }
        }

        /**
         * Find the scope of the widget
         * @returns {scope|null} null if not found
         */
        function findWidgetScope(scope) {
            if (scope.$widget) {
                return scope;
            }
            var parent = scope;
            while (parent) {
                if (parent.$widget) {
                    return parent;
                }
                parent = parent.$parent;
            }
            return null;
        }

        /**
         * Find the scope of page where the widget in
         * @returns {Scope|null} null if not found
         * @deprecated use {@link pageDataUtil#findPageScope}
         */
        function findPageScope(scope) {
            return pageDataUtil.findPageScope(scope);
        }

        // function renderUndefinedWidget(elem, message) {
        //     var html = getTemplateForUndefinedWidget(message);
        //     // elem/*.addClass('alert')*/.css('background-color', 'rgba(122,122,122,0.15)').html(html);
        //     elem.html(html);
        // }

        /**
         * Display a blank slate for undefined widget.
         * @param {string} message
         * @param {string} icon
         * @param {string} css
         * @param {boolean} useConfigButton
         * @returns {string}
         */
        function getTemplateForUndefinedWidget(message, icon, css, useConfigButton) {
            var html = '<section class="op-blank-slate ' + (css || '') + '">' +
                '<div class="op-blank-slate-body">';
            if (icon) {
                html += '<div class="op-blank-slate-icon"><i class="fa ' + icon + '"></i></div>';
            }
            html += '<p>' + _.escape(message || '') + '</p>';
            if (isEditMode() && useConfigButton) {
                html += '<a class="btn btn-primary" ng-click="$widget.configWidget($event)">{{"udp.designer.actions.goto_config"|translate}}</a>';
            }
            html += '</div></section>';
            return html;
        }

        /**
         *
         * @param {jQuery} contentElem Content element
         * @param {jQuery} container Content container
         * @param options
         * @param {function<{modalId:string}>} openCallback `modalId` is the ID of modal body
         * @param {function} closeCallback Callback when restore.
         */
        function zoomIn(contentElem, container, options, openCallback, closeCallback) {
            var modalId = 'js-modalzoom-' + _.uniqueId();
            var originalSize = {width: contentElem.innerWidth(), height: contentElem.innerHeight()};
            // console.log('originalSize',originalSize);
            var placeholder = $('<div></div>')
                .addClass('udp-widget-placeholder')
                .css('width', contentElem.innerWidth())
                .css('height', contentElem.innerHeight())
                .css('display', 'block');
            var template = '<div class="modal-header">' +
                '<h4 class="modal-title">' + (options.title || '&nbsp;') + '</h4>' +
                '<button type="button" class="btn-close" data-dismiss="modal" ng-click="dismissModal()"></button>' +
                '</div>' +
                '<div class="modal-body" id="' + modalId + '"></div>';
            var instance = $uibModal.open({
                template: template,
                size: 'xl',
                controller: ['$scope', function ($scope) {
                    $scope.dismissModal = function () {
                        instance.close();
                    }
                }]
            });
            instance.rendered.then(function () {
                // Move widget content to modal and change content to full height of modal body
                var modalBody = $('#' + modalId);
                modalBody.append(contentElem);
                contentElem.css('height', calcWidgetContentHeight(modalBody));
                // Fill original content with a placeholder of the same size
                placeholder.appendTo(container);
                // $('.modal-dialog').eq(0)
                //     .draggable({handle: '.modal-header:eq(0)'});
                var result = {modalId: modalId};
                openCallback && openCallback(result);
            });
            instance.closed.then(function () {
                placeholder.remove();
                contentElem.css('height', originalSize.height).appendTo(container);
                closeCallback && closeCallback();
            });
        }

        function isStaticWidget(uwType) {
            return uwType.indexOf('layout-') === 0 || uwType.indexOf('text-') === 0;
        }

        function isTextWidget(uwType) {
            return uwType.indexOf('text-') === 0;
        }

        function isLayoutWidget(type) {
            return type === 'layout-row' || isColWidget(type);//type === 'layout-col' || type === 'layout-float';
        }

        function isColWidget(type) {
            return type === 'layout-col' || type === 'layout-float' || type === 'layout-flex';
        }

        /**
         * If current view is in page edit mode
         * @returns {boolean}
         */
        function isEditMode() {
            // Using element to determine edit mode is not reliable
            // because when state change the page may not ready
            // return $(CANVAS_ZONE).length > 0;
            //app.appman.page.edit
            //TODO: optimize the regex
            return /^app\.appman\.page\.edit/.test($state.current.name) ||
                /^app\.appman\.page\.create/.test($state.current.name);
        }

        /**
         * Build widget buttons including draggable type label, configuration dropdown menu.
         * @param {string} type  Widget type
         * @param configCode
         * @returns {string} HTML of buttons
         */
        function buildWidgetButtons(type, configCode) {
            // console.log('buildWidgetButtons');
            var btnPin, btnDrag, btnDropdown, btnConfig = '', btnStyle;
            var hasInlineConfig = typeof configCode === 'string' && configCode;
            btnStyle = isLayoutWidget(type) ? 'btn-info' : 'btn-primary';
            btnPin = '<button type="button" class="btn ' + btnStyle + ' btn-sm uw-pin" ng-click="$widget.pinWidget($event)" title="{{\'udp.designer.actions.pin_widget\'|translate}}"><i class="far fa-circle"></i></button>';
            btnDropdown = '<button class="btn ' + btnStyle + ' btn-sm" type="button" ng-click="$widget.configWidget($event)" title="{{\'udp.designer.actions.config_widget\'|translate}}"><i class="fa fa-wrench"></i></button>';
            btnDropdown += '<button class="btn ' + btnStyle + ' btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" title="{{\'udp.designer.actions.widget_more_action\'|translate}}"><i class="fa fa-caret-down"></i></button>' +
                '<div class="dropdown-menu ' /*+ (isLayout ? '' : 'dropdown-menu-end')*/ + '">';
            if (!hasInlineConfig) {
                btnDropdown += '<a class="dropdown-item" ng-click="$widget.configWidget($event)"><i class="fa fa-wrench"></i> {{"common.action.config"|translate}}</a></li>\n';
            }
            if (!isLayoutWidget(type)) {
                btnDropdown += '<a class="dropdown-item" ng-click="$widget.copyWidget($event)"><i class="fa fa-clone"></i> {{"common.action.copy"|translate}}</a>\n';
                btnDropdown += '<a class="dropdown-item" ng-click="$widget.cutWidget($event)"><i class="fa fa-cut"></i> {{"common.action.cut"|translate}}</a>\n';
            }
            if ((isColWidget(type) || !isLayoutWidget(type))) {
                btnDropdown += '<a class="dropdown-item" ng-click="$widget.pasteWidget($event)" ng-class="{disabled:!$root.pasteWidgetEnabled}"><i class="fa fa-paste"></i> {{"common.action.paste"|translate}}</a>\n';
            }
            btnDropdown += '<a class="dropdown-item" ng-click="$widget.deleteWidget($event)"><i class="fa fa-times"></i> {{"common.action.delete"|translate}}</a>';
            btnDropdown += '<a class="dropdown-item" ng-click="$widget.moveWidget(-1,$event)"><i class="fa fa-chevron-left"></i> {{"common.action.move_left"|translate}}</a>' +
                '<a class="dropdown-item" ng-click="$widget.moveWidget(1,$event)"><i class="fa fa-chevron-right"></i> {{"common.action.move_right"|translate}}</a>' +
                '';
            btnDropdown += '</div>';
            btnDrag = '<span class="uw-drag btn ' + btnStyle + ' btn-sm" ng-dblclick="$widget.configWidget($event)">{{\'udp.w.' + type + '.name\'|translate}}' + '</span>';
            if (hasInlineConfig) {
                btnConfig = '<span class="uw-config">' + configCode + '</span>';
            } else if (configCode !== false) {
                btnConfig = '';
            }
            return '<div class="uw-buttons btn-group">' + btnPin + btnDrag + btnConfig + btnDropdown + /*btnConfig + btnRemove +*/ '</div>';
        }

        /**
         * Render `<udp-input></udp-input>` HTML.
         * @param controlName {string}
         * @param param {{control:string,format:string,label:string,showlabel:boolean,desc:string,showdesc:boolean,initval:string,source:string,sourcedef:string}} Parameter definition
         * @returns {angular.element}
         */
        function buildParamInputControl(controlName, param) {
            var modelName = '$widget.wParams["' + controlName + '"]';
            var el = angular.element('<udp-input></udp-input>');
            var attrs = angular.extend({}, param,
                {
                    name: controlName,
                    'ng-model': modelName,
                    _modeloptions: '{updateOn:"blur"}'
                });
            // If attr value is array, it will be converted to CSV automatically
            // If attr value is map object, manual convert it to string
            Object.keys(attrs).forEach(function (key) {
                if (angular.isObject(attrs[key]) && !angular.isArray(attrs[key])) {
                    attrs[key] = JSON.stringify(attrs[key]);
                }
            });
            el.attr(attrs);
            return el;
        }

        /**
         * Make widget resizable.
         * Widget can be resizable in edit mode and it has `resizable` definition.
         * @param {jQuery|angular.element} widgetElem Widget element
         * @param {function<{height:number,oldHeight:number}>} stopCallback Callback function called when drag stops.
         * Argument height is for widget content height.
         */
        function makeWidgetResizable(widgetElem, stopCallback) {
            var attr = widgetElem.attr('uw-props');
            // var props;
            // try {
            //     props = JSON.parse(attr || '{}');
            // } catch (err) {
            //     console.warn(attr);
            //     throw err;
            // }
            var props = widgetElem.scope().$eval(attr);
            var resizeConfig = getResizeConfig(widgetElem),
                resizeElem = widgetElem,
                resizeByChild = !!resizeConfig.resizeSelector;
            // if (widgetElem.attr('uw-type') === 'circle') {
            //     console.log('make', resizeConfig.uiHandles);
            // }
            // if (!resizeByChild)
            //     adjustWidgetSize(widgetElem, props);
            if (!isEditMode() || (!resizeConfig.resizeWidth && !resizeConfig.resizeHeight)) {
                return;
            }

            // Resize widget by drag child element
            // if (resizeConfig.resizeSelector) {
            //     resizeElem = widgetElem.find(resizeConfig.resizeSelector);
            // }
            resizeElem.resizable({
                handles: resizeConfig.uiHandles,
                minHeight: 50,
                // containment: 'parent',
                resize: function (e, ui) {
                    updateResizeIndicator(ui, true);
                },
                start: function (e, ui) {
                    updateResizeIndicator(ui, true);
                },
                stop: function (e, ui) {
                    var width, height;
                    updateResizeIndicator(ui, false);
                    var display = props.display || {};
                    console.log(resizeConfig);
                    if (resizeConfig.resizeHeight || resizeConfig.resizeWidth) {
                        if (resizeConfig.resizeHeight) {
                            height = roundHeight(ui.size.height);
                            console.log('height', height);
                            display.height = height;
                        }
                        if (resizeConfig.resizeWidth) {
                            width = calcWidthPercent(ui.helper, ui.size.width, 5);
                            display.width = width;
                        }
                        adjustWidgetSize(widgetElem, display);
                    }
                    // }
                    // Dragging will set height and width for widget element.
                    // Remove widget height because height is determined by .uw-content
                    // widgetElem.css('height', '');
                    // Update widget properties
                    // console.log('Update widget display props', display);
                    upgradeWidgetProps(widgetElem, {display: display});
                    if (angular.isFunction(stopCallback)) {
                        stopCallback({
                            // width: ui.size.width,
                            height: height,
                            // oldWidth: ui.originalSize.width,
                            oldHeight: roundHeight(ui.originalSize.height - (ui.size.height - height))
                        });
                    }
                }
            });

            function updateResizeIndicator(ui, toShow) {
                var indicator = $('#resize-indicator');
                if (!toShow) {
                    indicator.remove();
                    return;
                }
                if (indicator.length === 0) {
                    indicator = $('<span style="position:absolute;z-index:39" class="badge bg-danger" id="resize-indicator"></span>').prependTo(ui.helper);
                }
                indicator.css('right', 0)//ui.position.right)
                    .css('top', ui.position.top);
                var width = calcWidthPercent(ui.helper, ui.size.width, 5);
                var height = roundHeight(ui.size.height);
                indicator.html($translate.instant('common.term.width') + ': ' + width + '%&nbsp;&nbsp; ' + $translate.instant('common.term.height') + ': ' + height + $translate.instant('common.term.pixel'));
            }

            function calcWidthPercent(elem, width, round) {
                var parentWidth = elem.parent().width();
                var w = (width / parentWidth) * 100;
                w = w > 100 ? 100 : w;
                if (round) {
                    w = Math.round(w / round) * round;
                    if (w === 0) {
                        w = round;
                    }
                } else {
                    w = _.round(w, 0);
                }
                return w;
            }

        }

        /**
         * Get resizable config from widget definition.
         * The directions widget can be resize on.
         * @returns {{resizeHeight:boolean,resizeWidth:boolean,uiHandles:string,resizeSelector:string}}
         */
        function getResizeConfig(widgetElem) {
            var type = widgetElem.attr('uw-type');
            var widgetDef = widgetFactory.lookupWidgetDef(type);
            var result = {uiHandles: undefined, resizeWidth: false, resizeHeight: false, resizeSelector: undefined};
            var resizable = widgetDef.resizable, handles = [];
            if (resizable) {
                if (resizable.indexOf('w') >= 0) {
                    result.resizeWidth = true;
                    handles.push('e');
                }
                if (resizable.indexOf('h') >= 0) {
                    result.resizeHeight = true;
                    handles.push('s');
                }
                result.uiHandles = handles.join(',');
                // result.resizeSelector = widgetDef.resizeSelector;
            }
            return result;
        }

        /**
         * Resize widget by dragging uwidget DOM, not content DOM,
         * so we need calculate content height.
         * @param element Element of widget
         * @returns {number} Height in px
         */
        function calcWidgetContentHeight(element) {
            var contentElem = element.find('.uw-content');
            var height = element.height();
            if (contentElem.length) {
                var padding = 5;
                height = height - padding - (contentElem.offset().top - element.offset().top);
            }
            return roundHeight(height);
        }

        function roundHeight(height) {
            var minHeightInPx = 10;
            if (angular.isNumber(height))
                return Math.round(height / minHeightInPx) * minHeightInPx;
            else
                return height;
        }
    }
})(jQuery);
