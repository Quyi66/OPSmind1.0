/**
 * @author luohuanjiang
 * @Date 2023-02-20
 */

(function () {
    'use strict';

    angular.module('oplus.udp')
        .run(['widgetFactory', 'messageService', 'pageDataUtil', 'widgetInteraction',
            'restUtils', 'datasetService', '$translate', 'appletRegistry', taskSchedulingWidget]);

    function taskSchedulingWidget(widgetFactory, messageService, pageDataUtil, widgetInteraction, restUtils, datasetService, $translate, appletRegistry) {
        widgetFactory.defineWidget({
            type: 'task-scheduling',
            name: $translate.instant('jao.index.cron'),
            group: 'control',
            desc: 'This is a control to display the current application task scheduling',
            resizable: null,
            widthMode: 'wm-full',
            configHtmlFile: 'app/modules/udp/widgets/task-scheduling/task-scheduling-widget-config.html',
            // 控件的配置页面的controller，可以是一个函数，也可以是一个字符串代表已经注入的Controller
            configController: TaskSchedulingConfigCtrl,
            controlRenderer: {
                // [必须]，控件的静态模板，类似于定义一个页面的template
                getTemplateForCompilation: getTemplateForCompilation
            }
        });

        function getTemplateForCompilation(props) {
            props = _.merge({}, {tasks: {}}, props);
            var options = {
                appletCode: props.tasks.appletCode
            };
            var elem = angular.element('<task-scheduling></task-scheduling>');
            elem.attr('options', JSON.stringify(options));
            var html = elem.prop('outerHTML');
            return html;
        }


        function TaskSchedulingConfigCtrl(scope) {
            scope.applets = appletRegistry.getAppletDefs();
        }
    }
})();