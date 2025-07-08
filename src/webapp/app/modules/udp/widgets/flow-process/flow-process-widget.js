/**
 * @ Author: chy
 * @ Create Time: 2023-03-31 16:19:19
 * @ Description:  
 */


(function () {
    'use strict';

    angular.module('oplus.udp')
        .run(['widgetFactory', 'messageService', 'pageDataUtil', 'widgetInteraction', 'widgetDataUtil',
            'restUtils', 'datasetService', '$translate', 'appletRegistry', flowProcessWidget]);

    function flowProcessWidget(widgetFactory, messageService, pageDataUtil, widgetInteraction, widgetDataUtil, restUtils, datasetService, $translate, appletRegistry) {
        widgetFactory.defineWidget({
            type: 'flow-process',
            name: '流程图',
            group: 'control',
            resizable: null,
            widthMode: 'wm-full',
            configHtmlFile: 'app/modules/udp/widgets/flow-process/flow-process-widget-config.html',
            configController: FlowProcessConfigCtrl,
            controlRenderer: {
                // [必须]，控件的静态模板，类似于定义一个页面的template
                getTemplateForCompilation: getTemplateForCompilation,
                // 可选，用于初始化页面控件和数据。如果没有的话，只是一个静态模板。旧版本用的是`renderDynamicData`
                onInitControl: onInitControl,
            }
        });

        var modeArr = [
            {
                code: 'detail',
                label: $translate.instant('udp.w.flow.process.mode.detail'),
                element: 'flow-detail-viewer'
            },
            {
                code: 'run',
                label: $translate.instant('udp.w.flow.process.mode.run'),
                element: 'flow-run-viewer'
            },
            {
                code: 'result',
                label: $translate.instant('udp.w.flow.process.mode.result'),
                element: 'flow-result-viewer'
            },
            {
                code: 'design',
                label: $translate.instant('udp.w.flow.process.mode.design'),
                element: 'process-designer'
            }
        ]

        var designType = [
            {
                code: 'add',
                label: $translate.instant('common.action.create')
            },
            {
                code: 'edit',
                label: $translate.instant('common.action.edit')
            },
        ]

        function getTemplateForCompilation(props) {
            var options = {
                inPage: true,
            };

            props.mode = props.mode || 'detail';

            if (props.mode === 'result') {
                options.pageParamName = props.result && props.result['pageParamName'] || '';
                options.pageEvent = props.result && props.result['pageEvent'] || '';
                options.viewMode = props.result && props.result['viewMode'] || 'fixed';
                options.refreshInterval = props.result && props.result['refreshInterval'] || 5;
            }
            else if (props.mode === 'run') {
                options.runLanding = props.run && props.run['runLanding'] || undefined;
            }
            else if (props.mode === 'detail') {
                options.pageParamName = props.detail && props.detail['pageParamName'] || '';
                options.pageEvent = props.detail && props.detail['pageEvent'] || '';
                options.runBtn = props.detail && props.detail['runBtn'] || undefined;
                options.designBtn = props.detail && props.detail['designBtn'] || undefined;
            }
            else if (props.mode === 'design') {
                options.designType = props.design && props.design['designType'] || '';
                options.process = props.selectedProcess && props.selectedProcess || {};
            }

            var modeEle = modeArr.find(f => f.code === props.mode).element;

            var elem = angular.element(`<${modeEle} class="in-page"></${modeEle}>`);
            elem.attr('options', JSON.stringify(options));
            if (props.processId) elem.attr('process-id', `'${props.processId}'`);
            var html = elem.prop('outerHTML');
            return html;
        }

        function onInitControl(scope, element, props) {
        }

        function FlowProcessConfigCtrl(scope, props) {
            scope.modeArr = modeArr;
            scope.designType = designType;
            props.mode = props.mode || modeArr[0].code;

            if (props.result)
                props.result['refreshInterval'] = props.result['refreshInterval'] || 5;
            else props.result = { refreshInterval: 5 }
        }
    }
})();