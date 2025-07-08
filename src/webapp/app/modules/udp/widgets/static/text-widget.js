/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/18/2017
 */
(function () {
    'use strict';
    var app = angular.module('oplus.udp');

    app.run(['$translate', 'widgetFactory', 'dataEx', 'widgetUiHelper', staticWidget]);

    /**
     *
     * @param widgetFactory {widgetFactory}
     * @param widgetUiHelper {widgetUiHelper}
     * @param dataEx {dataEx}
     */
    function staticWidget($translate, widgetFactory, dataEx, widgetUiHelper) {
        var textWidgets = [];

        /**
         *
         * @param type {String}
         * @param name {String} Widget name
         * @param sourceCode {String} Actual HTML to be generated as source code
         * @param configCode {String} How to configure this widget (style, layout...)
         * @constructor
         */
        function Widget(type, name, sourceCode, configCode, widthMode) {
            this.type = type;
            this.name = name;
            this.sourceCode = sourceCode;
            this.configCode = configCode;
            this.widthMode = widthMode;
        }

        var lipsum = $translate.instant('udp.w.text.input_placeholder');//'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';


        textWidgets.push(new Widget('text-header',
            'text-header',
            '<div class="page-header" contenteditable="true"><h1>'+$translate.instant('udp.w.text-header.title_placeholder')+' <small>'+$translate.instant('udp.w.text-header.subtitle_placeholder')+'</small></h1>  </div>',
            false));
        textWidgets.push(new Widget('text-p',
            'text-p',
            '<p>' + lipsum + '</p>',
            false));
        textWidgets.push(new Widget('text-alert',
            'text-alert',
            '<div class="alert alert-success js-uw-style" data-customcss="alert.*">' +
            // '<button type="button" class="btn-close" data-dismiss="alert"></button>' +
            '<div contenteditable="true"><h4>' + $translate.instant('udp.w.text-alert.title_placeholder') + '</h4>' + $translate.instant('udp.w.text-alert.content_placeholder') + '</div></div>',
            '<span class="dropdown">' +
            '  <button class="btn btn-default btn-sm dropdown-toggle" data-bs-toggle="dropdown">' + $translate.instant('common.term.style') +
            '    <span class="caret"></span>' +
            '  </button>' +
            '  <div class="dropdown-menu js-uw-embed-style">' +
            '    <a class="dropdown-item" href="javascript:void(0);" rel="alert alert-primary">'+$translate.instant('common.color.primary')+'</a>' +
            '    <a class="dropdown-item" href="javascript:void(0);" rel="alert alert-secondary">'+$translate.instant('common.color.secondary')+'</a>' +
            '    <a class="dropdown-item" href="javascript:void(0);" rel="alert alert-success">'+$translate.instant('common.color.success')+'</a>' +
            '    <a class="dropdown-item" href="javascript:void(0);" rel="alert alert-info">'+$translate.instant('common.color.info')+'</a>' +
            '    <a class="dropdown-item" href="javascript:void(0);" rel="alert alert-warning">'+$translate.instant('common.color.warning')+'</a>' +
            '    <a class="dropdown-item" href="javascript:void(0);" rel="alert alert-danger">'+$translate.instant('common.color.danger')+'</a>' +
            '    <a class="dropdown-item" href="javascript:void(0);" rel="alert alert-light">'+$translate.instant('common.color.light')+'</a>' +
            '    <a class="dropdown-item" href="javascript:void(0);" rel="alert alert-dark">'+$translate.instant('common.color.dark')+'</a>' +
            '  </div>' +
            '</span>', 'wm-full'));
        // textWidgets.push(new Widget('text-jumbotron',
        //     'text-jumbotron',
        //     '<div class="jumbotron" contenteditable="true"><h1>'+$translate.instant('udp.w.text-jumbotron.title_placeholder')+'</h1><p>' + lipsum + '</p></div>',
        //     false));

        textWidgets.forEach(function (w) {
            widgetFactory.defineWidget({
                type: w.type,
                name: w.name,
                group: 'text',
                widthMode: w.widthMode || 'wm-inline',
                configController: function (scope, props) {
                },
                controlRenderer: {
                    getTemplateForCompilation: function (props) {
                        return w.sourceCode;
                    },
                    getConfig: function () {
                        return w.configCode;
                    },
                    renderDynamicData: renderDynamicData
                }
            });
        });

        function renderDynamicData(scope, element, props) {

        }
    }
})();