/**
 * @author yangbin
 * @Date 2022-09-01
 */

(function () {
    'use strict';

    angular.module('oplus.udp')
        .run(['widgetFactory', 'messageService', 'pageDataUtil', 'widgetInteraction', 'widgetDataUtil',
            'restUtils', 'datasetService', '$translate', 'appletRegistry', flowLayoutWidget]);

    function flowLayoutWidget(widgetFactory, messageService, pageDataUtil, widgetInteraction, widgetDataUtil, restUtils, datasetService, $translate, appletRegistry) {
        widgetFactory.defineWidget({
            type: 'flow-layout',
            name: '流程编排',
            group: 'control',
            resizable: null,
            widthMode: 'wm-full',
            configHtmlFile: 'app/modules/udp/widgets/flow-layout/flow-layout-widget-config.html',
            configController: FlowLayoutConfigCtrl,
            controlRenderer: {
                // [必须]，控件的静态模板，类似于定义一个页面的template
                getTemplateForCompilation: getTemplateForCompilation,
                // 可选，用于初始化页面控件和数据。如果没有的话，只是一个静态模板。旧版本用的是`renderDynamicData`
                onInitControl: onInitControl
            }
        });

        function getTemplateForCompilation(props) {
            props = getProps(props);
            var options = {
                selector: 'multiple',
                appletCode: props.core.appletCode,
                flowTemplate: props.core.flowId,
                hostScope: props.core.hostScope,
                hostGroup: props.core.hostGroup,
                scriptsOption: props.core.scriptsOption,
            };
            var elem = angular.element('<flow-layout  the-model="flowSetp"></flow-layout>');
            elem.attr('options', JSON.stringify(options));
            var html = elem.prop('outerHTML');
            return html;
        }

        function getProps(props) {
            //Todo 参数设定
            // 1. 主机选择器是否全局，还是每个节点都需要选择主机信息
            // 2. 是否接收传入的参数
            // 3. 是否需要支持主机分组
            // 4. 是否支持脚本多选
            // 5. 应用信息
            var defaultProps = {
                core: {
                    exportParam: '',
                    // exportType: 'string',
                    rememberSelection: true,
                    hostScope: 'global',
                    hostGroup: 'false',
                    scriptsOption: 'single'
                }
            };
            return _.merge({}, defaultProps, props);
        }

        function onInitControl(scope, element, props) {
            scope.flowSetp = {};
            props = getProps(props);
            var core = props.core;
            if (core.rememberSelection) {
                scope.flowSetp = widgetDataUtil.getWidgetCache(element) || {};
                normalizeFlowParams(scope.flowSetp);
            }
            if (core.exportParam) {
                scope.$watch('flowSetp', function (newVal, oldVal) {
                    var paramValue;
                    var flow = newVal;
                    normalizeFlowParams(flow);
                    paramValue = flow;
                    var changed = {};
                    changed[core.exportParam] = paramValue;
                    widgetInteraction.changePageParams(scope, {params: changed});
                    if (core.rememberSelection) {
                        widgetDataUtil.setWidgetCache(element, newVal);
                    }
                }, true);
            }

        }

        function normalizeFlowParams(flow) {
            if (!flow) {
                return [];
            }
            var params = flow.params;
            if (!Array.isArray(params)) {
                if (flow.globalParamsJson) {
                    try {
                        params = JSON.parse(flow.globalParamsJson) || [];
                    } catch (err) {
                        params = [];
                    }
                } else if (Array.isArray(flow.globalParams)) {
                    params = flow.globalParams;
                } else {
                    params = [];
                }
            }
            params = params.map(function (param) {
                var normalized = _.assign({
                    name: '',
                    label: '',
                    description: '',
                    defaultValue: '',
                    type: null,
                    secret: false
                }, param || {});
                if (typeof normalized.name === 'string') {
                    normalized.name = normalized.name.trim();
                } else {
                    normalized.name = '';
                }
                return normalized;
            });
            flow.params = params;
            flow.globalParams = params;
            flow.globalParamsJson = JSON.stringify(params || []);
            return params;
        }

        function FlowLayoutConfigCtrl(scope, props) {
            var map = {};
            map[$translate.instant('jao.field_name')] = $translate.instant('jao.field_value');
            scope.mapValue = map;
            scope.applets = appletRegistry.getAppletDefs();

        }
    }
})();
