/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/03/20
 */

(function () {
    'use strict';

    angular.module('oplus.gfs')
        .run(['$translate', 'widgetFactory', 'messageService', 'widgetDataUtil', 'gfsActionHelper', 'pageDataUtil', 'widgetInteraction',fileselectorWidget]);

    /**
     *
     * File selector
     *
     *
     * @param {widgetFactory} widgetFactory
     * @param {messageService} messageService
     * @param {widgetDataUtil} widgetDataUtil
     * @param {gfsActionHelper} gfsActionHelper
     * @param {pageDataUtil} pageDataUtil
     */
    function fileselectorWidget($translate, widgetFactory, messageService, widgetDataUtil, gfsActionHelper, pageDataUtil,widgetInteraction) {
        widgetFactory.defineWidget({
            type: 'fileselector',
            name: $translate.instant("gfs.selector.file_select"),
            group: 'control',
            widthMode: 'wm-full',
            configHtmlFile: 'app/modules/gfs/widgets/fileselector/fileselector-widget-config.html',
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onInitControl: onInitControl
            }
        });

        function getProps(props) {
            var defaultProps = {
                core: {
                    repoType: 'git',// or 'static'
                    multipleSelect: false,
                    downloadButton: false,
                    refreshButton: false,
                    searchButton: false,
                    // Limit the outermost dir to which can be navigated
                    // The initial dir and base dir will be set to this value
                    strictDir: '',
                    // Export selection to this page parameter
                    exportParam: '',
                    // exportAttr: ['path', 'config'],
                    // 'string' or 'array'
                    exportType: 'string',
                    rememberSelection: false
                },
                display: {
                    viewMode: 'dialog',
                    showFileConfig: false
                }
            };
            return _.extend({}, defaultProps, props);
        }

        function getTemplateForCompilation(props) {
            props = getProps(props);
            var display = props.display;
            var html;
            var selector = '<gfs-file-selector class="w-full" the-model="selectedItems" config="fileSelectorConfig" model-converter="modelConverter"></gfs-file-selector>';
            if (display.viewMode === 'browser') {
                html = selector;
            } else {
                html = '<div class="form-group"><label class="control-label"><%=label%></label>' +
                    '<div class="form-control-wrapper"><%=selector%></div>' +
                    '</div>';
                html = _.template(html)({label: display.label, selector: selector});
            }
            return html;
        }

        function onInitControl(scope, element, props) {
            props = getProps(props);
            var core = props.core;
            scope.modelConverter = {type: 'singleattr', singleattr: 'path', modelType: core.exportType};
            scope.fileSelectorConfig = {
                repoType: core.repoType,
                repo: core.repo,
                initDir: core.strictDir,
                base: core.strictDir,
                multipleSelect: core.multipleSelect,
                downloadButton: core.downloadButton,
                refreshButton: core.refreshButton,
                searchButton:  core.searchButton,
                viewMode: props.display.viewMode,
                // 不显示ansible tag输入框
                doNotShowTagsParam: true
            };
            scope.selectedItems = [];
            if (core.rememberSelection) {
                scope.selectedItems = widgetDataUtil.getWidgetCache(element) || [];
                console.log('remember', core.rememberSelection, scope.selectedItems);
            }
            if (core.exportParam) {
                scope.$watch('selectedItems', function (newVal, oldVal) {
                    if (newVal === oldVal) return;
                    var pageParams = pageDataUtil.findPageParams(scope);
                    pageParams[core.exportParam] = newVal;
                    widgetInteraction.changePageParams(scope,{params:pageParams})
                    if (core.rememberSelection) {
                        widgetDataUtil.setWidgetCache(element, newVal);
                    }
                });
            }
        }
    }
})();
