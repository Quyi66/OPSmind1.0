/**
 * @ Author: chy
 * @ Create Time: 2023-03-31 16:19:19
 * @ Description:  
 */


(function () {
    'use strict';

    angular.module('oplus.udp').run(['widgetFactory', flowProcessResultWidget]);

    function flowProcessResultWidget(widgetFactory) {
        widgetFactory.defineWidget({
            type: 'flow-process-result',
            name: '流程执行列表',
            group: 'control',
            resizable: null,
            widthMode: 'wm-full',
            configHtmlFile: 'app/modules/udp/widgets/flow-process-result/flow-process-result-widget-config.html',
            configController: FlowProcessResultConfigCtrl,
            controlRenderer: {
                // [必须]，控件的静态模板，类似于定义一个页面的template
                getTemplateForCompilation: getTemplateForCompilation,
                // 可选，用于初始化页面控件和数据。如果没有的话，只是一个静态模板。旧版本用的是`renderDynamicData`
                onInitControl: onInitControl,
            }
        });

        function getTemplateForCompilation(props) {
            var options = {
                inPage: true,
            };

            options.viewBtn = props.viewBtn || undefined;
            options.customBtns = props.customBtns || undefined;
            
            var eleConst = props.processId ? 'process-result-list-table' : 'process-result-list'
            var elem = angular.element(`<${eleConst} class="in-page"></${eleConst}>`);
            elem.attr('options', JSON.stringify(options));
            if (props.processId) elem.attr('process-id', `'${props.processId}'`);
            var html = elem.prop('outerHTML');
            return html;
        }

        function onInitControl(scope, element, props) {
        }

        function FlowProcessResultConfigCtrl(scope, props) {
            props.customBtns = props.customBtns || [];

            scope.defaultBtn = {
                label: 'Button',
                icon: '',
                color: '',
                page: {},
            }

            scope.addCustomBtn = function () {
                props.customBtns.push(_.cloneDeep(scope.defaultBtn));
            }
        }
    }
})();