/**
 *
 * @author yangbin, created on 5/12/2023
 */
(function () {
    'use strict';

    angular.module('oplus.udp').run(['$q', '$translate', 'i18nService', 'themeService', 'conditionalFormat',
        'widgetFactory', 'widgetDataUtil', 'widgetInteraction', 'widgetValues', 'widgetUiHelper', 'repeatedItemsWidgetBuilder', circleKpiWidget]);


    /**
     * @param $q
     * @param $translate
     * @param {i18nService} i18nService
     * @param {conditionalFormat} conditionalFormat
     * @param {widgetFactory} widgetFactory
     * @param {widgetDataUtil} widgetDataUtil
     * @param {widgetInteraction} widgetInteraction
     * @param {widgetValues} widgetValues
     * @param {themeService} themeService
     * @param {widgetUiHelper} widgetUiHelper
     * @param {repeatedItemsWidgetBuilder} repeatedItemsWidgetBuilder
     */
    function circleKpiWidget($q, $translate, i18nService, themeService, conditionalFormat, widgetFactory, widgetDataUtil, widgetInteraction,
                             widgetValues, widgetUiHelper, repeatedItemsWidgetBuilder) {
        var VERSION = '1.0';
        widgetFactory.defineWidget({
            type: 'circle-kpi',
            name: 'udp.w.circle-kpi.name',
            group: 'data',
            widthMode: 'wm-full',
            eventProperty: 'eventbychange',
            version: VERSION,
            configController: CircleKpiWidgetConfigCtrl,
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onInitControl: onInitControl,
                onReloadData: onReloadData
            }
        });

        function CircleKpiWidgetConfigCtrl(scope, element, props) {

        }

        function upgradeWidgetProps(props) {
            widgetInteraction.upgradeWidgetProps(props);
            props._v = VERSION;
        }

        function onReloadData(scope, element) {
            console.log("CircleKpiWidgetConfigCtrl onReloadData------------------onReloadData : ");
        }
        function getProps(props) {
            var defaultProps = {
                core: {
                    exportParam: '',
                    rememberSelection: true
                },
                parse: {
                    init: true
                }
            };
            return _.merge({}, defaultProps, props);
        }

        function onInitControl(scope, element, props) {
            scope.parseStateList = [];
            props = getProps(props);
            upgradeWidgetProps(props);
            var core = props.core;
            scope._hasDetail = !!(props.fields && props.fields.detail && (props.fields.detail.field || props.fields.detail.convertFn));

        }

        function getTemplateForCompilation(props) {
            props = getProps(props);
            upgradeWidgetProps(props);
            if (!props.dataset || !props.fields) {
                throw new WidgetNotConfiguredError($translate.instant('udp.wc.error.missing_dataset_or_field'));
            }

            var options = {
                init: props.parse.init,
                data: props.parse.data
            };
            var elem = angular.element(' <circle-kpi the-model="items"></circle-kpi>');
            elem.attr('options', JSON.stringify(options));
            return elem.prop('outerHTML');
        }
    }
})();
