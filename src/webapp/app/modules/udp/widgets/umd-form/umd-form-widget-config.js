/**
 * @ Author: chy
 * @ Create Time: 2023-05-28 08:45:17
 * @ Description:  
 */

(function () {
    'use strict';

    angular.module('oplus.udp').run(['widgetFactory', '$translate',
        function (widgetFactory, $translate) {
            widgetFactory.defineWidget({
                type: 'umd-form',
                name: '数据模型表单',
                group: 'control',
                resizable: null,
                widthMode: 'wm-full',
                configHtmlFile: 'app/modules/udp/widgets/umd-form/umd-form-widget-config.html',
                configController: FormConfigCtrl,
                controlRenderer: {
                    // [必须]，控件的静态模板，类似于定义一个页面的template
                    getTemplateForCompilation: getTemplateForCompilation,
                    // 可选，用于初始化页面控件和数据。如果没有的话，只是一个静态模板。旧版本用的是`renderDynamicData`
                    onInitControl: onInitControl,
                }
            });


            function getTemplateForCompilation(props) {
                if (!props.modelCode || !props.selectedData) {
                    throw new WidgetNotConfiguredError($translate.instant('udp.wc.error.missing_dataset_or_field'));
                }

                props = _.merge({}, props);
                var options = {
                    inPage: true,
                };

                // options.viewBtn = props.viewBtn || undefined;
                // options.customBtns = props.customBtns || undefined;
                
                var elem = angular.element('<umd-data-edit></umd-data-edit>');
                elem.attr('model-code', "'" + props.modelCode + "'");
                elem.attr('options', JSON.stringify(options));
                var html = elem.prop('outerHTML');
                return html;
            }

            function onInitControl(scope, element, props) {
            }

            function FormConfigCtrl(scope, props) {
                
            }
        }]);
})();
