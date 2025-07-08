/**
 * @author yangbin
 * @Date 2022-09-01
 */

(function () {
    'use strict';

    angular.module('oplus.udp')
        .run(['widgetFactory', 'messageService', 'pageDataUtil', 'widgetInteraction', 'widgetDataUtil',
            'restUtils', 'datasetService', '$timeout', '$translate', 'jaoFlowService', flowRecordWidget]);

    function flowRecordWidget(widgetFactory,  messageService, pageDataUtil, widgetInteraction, widgetDataUtil, restUtils, datasetService, $timeout, $translate, jaoFlowService) {
        widgetFactory.defineWidget({
            type: 'flow-record',
            name: '流程记录',
            group: 'control',
            resizable: null,
            widthMode: 'wm-full',
            configHtmlFile: 'app/modules/udp/widgets/flow-record/flow-record-widget-config.html',
            configController: FlowRecordConfigCtrl,
            controlRenderer: {
                // 可选，用于初始化页面控件和数据。如果没有的话，只是一个静态模板。旧版本用的是`renderDynamicData`
                onInitControl: onInitControl,
                // [必须]，控件的静态模板，类似于定义一个页面的template
                getTemplateForCompilation: getTemplateForCompilation

            }
        });

        function getTemplateForCompilation(scope, props) {
            // props = getProps(props);

            var options = {
                readonly: true,
                showElems: 'diagram'
            };

            var elem = angular.element('<flow-record ></flow-record>');
            elem.attr('the-model', JSON.stringify({}));
            elem.attr('options', JSON.stringify(options));
            return elem.prop('outerHTML');
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
            scope.flowInstance = {};


        }

        function FlowRecordConfigCtrl(scope, props) {
            var map = {};
            map[$translate.instant('jao.field_name')] = $translate.instant('jao.field_value');
            scope.mapValue = map;
        }
    }
})();