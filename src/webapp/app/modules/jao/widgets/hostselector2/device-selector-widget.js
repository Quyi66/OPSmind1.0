/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/04/05
 */

(function () {
    'use strict';

    angular.module('oplus.jao')
        .run(['widgetFactory', 'messageService', 'pageDataUtil', 'widgetInteraction', 'widgetDataUtil', 'restUtils', 'datasetService', 'acmService', 'acmUtil', '$translate', deviceSelectorWidget]);

    /**
     *
     * @param {widgetFactory} widgetFactory
     * @param {messageService} messageService
     * @param {pageDataUtil} pageDataUtil
     * @param {widgetInteraction} widgetInteraction
     * @param {widgetDataUtil} widgetDataUtil
     * @param {restUtils} restUtils
     * @param {datasetService} datasetService
     * @param {acmService} acmService
     * @param {acmUtil} acmUtil
     */
    function deviceSelectorWidget(widgetFactory, messageService, pageDataUtil, widgetInteraction, widgetDataUtil, restUtils, datasetService, acmService, acmUtil, $translate) {
        widgetFactory.defineWidget({
            type: 'device-selector',
            name: $translate.instant('jao.job.selector.name'),
            group: 'control',
            resizable: null,
            widthMode: 'wm-full',
            configHtmlFile: 'app/modules/jao/widgets/hostselector2/device-selector-widget-config.html',
            configController: DeviceSelectorConfigCtrl,
            controlRenderer: {
                // [必须]，控件的静态模板，类似于定义一个页面的template
                getTemplateForCompilation: getTemplateForCompilation,
                // 可选，用于初始化页面控件和数据。如果没有的话，只是一个静态模板。旧版本用的是`renderDynamicData`
                onInitControl: onInitControl
            }
        });

        function getTemplateForCompilation(props) {
            props = getProps(props);
            var display = props.display, core = props.core;
            var options = {
                selectMode: props.selectMode,
                selector: 'multiple',
                label: display.label,
                exportType: props.exportType,
                dataType: core.dataType
            };
            var elem = angular.element('<acm-device-selector ci-types="assetType" the-model="selectedHosts"></devcice-selector>');
            elem.attr('view-as', display.viewAs).attr('options', JSON.stringify(options));
            var html = elem.prop('outerHTML');
            return html;
        }

        function getProps(props) {
            var defaultProps = {
                core: {
                    exportParam: '',
                    // 'string': comma separated keys
                    // 'array': array of {key:string, hostname:string, ip:string}
                    exportType: 'string',
                    rememberSelection: true,
                    selectMode: 'all',
                    dataType: 'all'
                },
                display: {
                    viewAs: 'btndlg', // or dropdown
                    label: $translate.instant('common.entity.detail.select')
                }
            };
            return _.merge({}, defaultProps, props);
        }

        function onInitControl(scope, element, props) {
            scope.detype = [];
            scope.selectedHosts = [];
            props = getProps(props);
            scope.widget = {};
            scope.assetType = props.core.assetType;
            scope.dataType = props.core.dataType;
            var core = props.core;
            if (core.rememberSelection) {
                scope.selectedHosts = widgetDataUtil.getWidgetCache(element) || [];
            }
            if (core.exportParam) {
                // selectedHosts is an array of {key:string, ip:string, hostname:string}
                scope.$watch('selectedHosts', function (newVal, oldVal) {
                    var paramValue;
                    if (core.exportType === 'string') {
                        //TODO: need refactor
                        //TODO: now JAO backend only support string type
                        if (newVal && newVal.length > 0) {
                            if (angular.isString(newVal[0])) {
                                paramValue = newVal.join(',');
                            } else {
                                paramValue = _.map(newVal, 'key').join(',');
                            }
                        } else {
                            paramValue = '';
                        }
                    }  else  if(core.exportType === 'map'){
                        paramValue = JSON.stringify(JSON.stringify(newVal));
                    }else {
                        if (newVal && newVal.length > 0) {
                            paramValue = newVal;
                            //if (angular.isString(newVal[0])) {
                            //    paramValue = newVal;
                            //} else {
                            //    paramValue = newVal;
                            //    paramValue = _.map(newVal, 'key');
                            //}
                        } else {
                            paramValue = newVal;
                        }
                    }
                    var changed = {};
                    changed[core.exportParam] = paramValue;
                    // restUtils.callApi('cm', 'POST', '/api/cm/v2/host/list-host-key-by-groupAndTagStr', {}, {groupAndTagStr: paramValue}).then(function (data) {
                    //     console.log(data);
                    // });
                    widgetInteraction.changePageParams(scope, {params: changed});
                    if (core.rememberSelection) {
                        widgetDataUtil.setWidgetCache(element, newVal);
                    }
                }, true);
            }
            // if (props.display.viewMode === 'grouplist') {
            //     scope.widget.options = {
            //         clickCallback: function (groupPath) {
            //             widgetInteraction.handleInteraction(scope, props.interaction, {KEY: groupPath});
            //         }
            //     };
            // }
        }

        function DeviceSelectorConfigCtrl(scope, props) {
            var display = props.display || {};
            scope.viewModeDefs = acmUtil.viewModeDefs;
            scope.selectModeDefs = acmUtil.selectModeDefs;
            var map ={}
            map[$translate.instant('jao.field_name')]=$translate.instant('jao.field_value')
            scope.mapValue =map;
            acmService.tabTitle("select").then(function (result) {
               scope.selectCIT = result;
            });
        }
    }
})();