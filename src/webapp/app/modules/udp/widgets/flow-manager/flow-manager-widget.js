/**
 * @author yangbin
 * @date 2022-09-17 created
 */
(function () {
    'use strict';

    angular.module('oplus.udp')
        .run(['widgetFactory', 'messageService', 'pageDataUtil', 'widgetInteraction', 'widgetDataUtil',
            'restUtils', 'datasetService', '$translate', 'appletRegistry', flowManagerWidget]);

    function flowManagerWidget(widgetFactory, messageService, pageDataUtil, widgetInteraction, widgetDataUtil, restUtils, datasetService, $translate, appletRegistry) {
        widgetFactory.defineWidget({
            type: 'flow-manager',
            name: '流程管理',
            group: 'control',
            resizable: null,
            widthMode: 'wm-full',
            configHtmlFile: 'app/modules/udp/widgets/flow-manager/flow-manager-widget-config.html',
            configController: FlowManagerConfigCtrl,
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
                style: props.style,
                applet: props.appletCode
            };
            var elem = angular.element('<flow-manager></flow-manager>');
            elem.attr('options', JSON.stringify(options));
            return elem.prop('outerHTML');
        }

        /**
         * 组件配置
         * @param props
         *       style: merge | list  组合样式
         *              merge : 树形与table的组合
         *              list: table list
         */
        function getProps(props) {

            var defaultProps = {
                style: 'merge',
                appletCode: '',
                core: {
                    exportParam: '',
                    // exportType: 'string',
                    rememberSelection: true
                }
            };
            return _.merge({}, defaultProps, props);
        }

        function onInitControl(scope, element, props) {

        }

        function FlowManagerConfigCtrl(scope, props) {
            //Todo not required config!!!
            scope.applets = appletRegistry.getAppletDefs();
        }
    }
})();
