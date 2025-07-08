/**
 * @author yangbin
 * @date 2022-09-17 created
 */
(function () {
    'use strict';

    angular.module('oplus.udp')
        .run(['widgetFactory', 'messageService', 'pageDataUtil', 'widgetInteraction', 'widgetDataUtil',
            'restUtils', 'datasetService', '$translate', 'appletRegistry', flowInstanceWidget]);

    function flowInstanceWidget(widgetFactory, messageService, pageDataUtil, widgetInteraction, widgetDataUtil, restUtils, datasetService, $translate, appletRegistry) {
        widgetFactory.defineWidget({
            type: 'flow-instance',
            name: '流程记录',
            group: 'control',
            resizable: null,
            widthMode: 'wm-full',
            configHtmlFile: 'app/modules/udp/widgets/flow-instance/flow-instance-widget-config.html',
            configController: FlowInstanceConfigCtrl,
            controlRenderer: {
                // [必须]，控件的静态模板，类似于定义一个页面的template
                getTemplateForCompilation: getTemplateForCompilation,
                // 可选，用于初始化页面控件和数据。如果没有的话，只是一个静态模板。旧版本用的是`renderDynamicData`
                onInitControl: onInitControl
            }
        });

        function getTemplateForCompilation(props) {
            props = getProps(props);
            var flowId = props.core.flowId;
            var options = {
                selector: 'multiple',
                // exportType: props.core.exportType,
                appletCode: props.core.appletCode,
                flowInstanceId: props.core.flowId
            };


            var elem = angular.element('<flow-instance></flow-instance>');
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
                    rememberSelection: true
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
            }
            if (core.exportParam) {
                scope.$watch('flowSetp', function (newVal, oldVal) {
                    var paramValue;
                    var flow = JSON.parse(JSON.stringify(newVal));
                    flow.steps.forEach(function (step) {
                        if(step.config){
                            var verbosity = step.config.verbosity;
                            step.config.verbosity = verbosity? verbosity : "0";
                        }
                        //step.configJson = angular.toJson(step.config);
                        //step.config = undefined;
                    });

                    if(flow.globalParams){
                        flow.globalParamsJson = JSON.stringify(flow.globalParams);
                    }else{
                        flow.globalParams = undefined;
                        flow.globalParamsJson = undefined;
                    }
                    // flow.globalParamsJson = JSON.stringify(angular.toJson(flow.globalParams));
                    // flow.globalParams = undefined;
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

        function FlowInstanceConfigCtrl(scope, props) {
            var map = {};
            map[$translate.instant('jao.field_name')] = $translate.instant('jao.field_value');
            scope.mapValue = map;
            //scope.applets = appletRegistry.getAppletDefs();
        }
    }
})();
