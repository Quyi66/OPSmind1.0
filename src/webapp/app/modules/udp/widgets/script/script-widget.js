/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/18/2018
 */

(function () {
    'use strict';

    angular.module('oplus.udp')
        .run(['$timeout', '$translate', 'widgetFactory', 'widgetUiHelper', 'widgetDataUtil', 'pageDataUtil', scriptWidget]);

    /**
     *
     * @param $timeout
     * @param {widgetFactory} widgetFactory
     * @param {widgetUiHelper} widgetUiHelper
     * @param {widgetDataUtil} widgetDataUtil
     * @param {pageDataUtil} pageDataUtil
     */
    function scriptWidget($timeout, $translate, widgetFactory, widgetUiHelper, widgetDataUtil, pageDataUtil) {
        widgetFactory.defineWidget({
            type: 'script',
            group: 'text',
            resizable: null,
            configController: ScriptWidgetConfigCtrl,
            configHtmlFile: undefined,
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onReloadData: onReloadData,
                onInitControl: onInitControl
            }
        });

        function ScriptWidgetConfigCtrl(scope, props) {
            this.afterInit = function () {
                if (props.content && props.content.tpl) {
                    props.content.tpl = decodeAngular(props.content.tpl);
                }
            };
            this.beforeSave = function () {
                if (props.content && props.content.tpl) {
                    props.content.tpl = encodeAngular(props.content.tpl);
                }
            }
        }

        function getTemplateForCompilation(props) {
            var isEditMode = widgetUiHelper.isEditMode();
            var content = props.content || {};
            var html = content.tpl, css = content.css;
            if (!html) {
                throw new WidgetNotConfiguredError($translate.instant('udp.w.script.error.no_html'));
            }
            html = decodeAngular(html);
            if (css) {
                html += '<style type="text/css">' + css + '</style>\n';
            }
            if (isEditMode) {
                var elem = $('<textarea ng-non-bindable class="w-100 form-control code" readonly></textarea>');
                elem.html(html);
                html = elem.prop('outerHTML');
            }
            return html;
        }

        function onReloadData(scope, element) {
            var dataprocessFn,
                props = scope.$widget.uwProps || {},
                content = props.content || {},
                js = content.js;
            if (!js) {
                js = '';
            }
            var head = 'var $w=$scope.$w={};' +
                '$scope.$data=$data;$scope.$p=$p;$scope.$g=$g;';
            js = head + js;
            try {
                dataprocessFn = Function('$scope', '$data', '$p', '$g', js);
            } catch (err) {
                console.error(err);
            }
            var pageScope = pageDataUtil.findPageScope(scope);
            widgetDataUtil.queryData(element, props).then(function (data) {
                dataprocessFn(scope, data, pageScope.pageParams, pageScope.globalParams);
            }).catch(function (err) {
                widgetUiHelper.showWidgetError(element, err.message, $translate.instant('udp.wc.dataset.error.cannot_get_data'))
            });
        }

        function onInitControl(scope, element, props) {
            onReloadData(scope, element);
        }

        function decodeAngular(str) {
            return str.replace(/\\{\\{(.*?)\\}\\}/g, '{{$1}}');
        }

        function encodeAngular(str) {
            return str.replace(/{{(.*?)}}/g, '\\{\\{$1\\}\\}');
        }
    }
})();