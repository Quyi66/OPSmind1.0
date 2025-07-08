/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/13/2017
 */
(function () {
    'use strict';
    var app = angular.module('oplus.udp');
    app.run(['widgetFactory', 'widgetValues', 'widgetInteraction', '$rootScope', 'widgetDataUtil', 'devel', inputWidget]);

    /**
     * @param widgetFactory {widgetFactory}
     * @param widgetInteraction {widgetInteraction}
     * @param widgetValues {widgetValues}
     * @param widgetDataUtil {widgetDataUtil}
     * @param $rootScope
     * @param {devel} devel
     */
    function inputWidget(widgetFactory, widgetValues, widgetInteraction, $rootScope, widgetDataUtil, devel) {
        widgetFactory.defineWidget({
            type: 'input',
            group: 'control',
            eventProperty: 'eventbychange',
            widthMode: 'wm-inline',
            configController: 'WidgetConfigCtrl',
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onInitControl: onInitControl,
                onReloadData: onReloadData,
                makePrintable: makePrintable
            }
        });

        function makePrintable(element, props) {
            var control = (props || {}).control;
            if (control === 'datepicker') {
                element.find('.input-group-btn').remove();
            } else if (control === 'select') {
                element.remove();
            }
        }

        function getModelName(props) {
            if (props.name)
                return '$widget.wParams["' + props.name + '"]';
            return '_unnamed_';
        }

        function isEqual(newVal, oldVal) {
            if (newVal && oldVal && newVal instanceof File && oldVal instanceof File) {
                return newVal.name === oldVal.name;
            }
            // This method supports comparing arrays, array buffers, booleans, date objects, error objects, maps, numbers, Object objects, regexes, sets, strings, symbols, and typed arrays. Object objects are compared by their own, not inherited, enumerable properties. Functions and DOM nodes are compared by strict equality, i.e. ===.
            return _.isEqual(newVal, oldVal);
            // return newVal === oldVal || _.isEqual(newVal, oldVal) ||
            //     (angular.isDate(newVal) && angular.isDate(oldVal) && newVal.valueOf() === oldVal.valueOf());
        }

        function onReloadData(scope, element) {
        }

        function onInitControl(scope, element, props) {
            var modelName = getModelName(props);
            // console.log('modelName', modelName);
            var display = props.display || {};
            // if (false)
            scope.$watch(modelName, function (newVal, oldVal) {
                // console.log('>>>$watch', {modelName: modelName, newVal: newVal, oldVal: oldVal});
                if (isEqual(newVal, oldVal))
                    return;
                var paramName = props.name, paramValue = newVal;
                if (angular.isDefined(paramName)) {
                    scope.$widget.$pageScope.pageParams[paramName] = paramValue;
                    //20200427 TODO: there is problem with file type with ngf-select: Illegal Invocation
                    if (paramValue instanceof File) {
                        return;
                    }
                    var params = {};
                    params[paramName] = paramValue;
                    // console.log('changePageParams', {newVal: newVal, oldVal: oldVal});
                    widgetInteraction.changePageParams(scope, {
                        changeUrl: props.changeUrl,
                        _source: element.attr('id'),
                        event: props.eventbychange,
                        // LEO@20210722: Do not evaluate parameter value,
                        // otherwise params {"foo:"1"} will be evaluated to `{"foo":1}`
                        paramValueAsJson: false,
                        params: params
                    }, null);
                    if (props.eventbychange) {
                        scope.$widget.fireWidgetEvent(props.eventbychange);
                    }
                }
            });
        }

        function getTemplateForCompilation(props, type, element) {
            props.display = props.display || {};
            var el = angular.element('<udp-input></udp-input>');
            if (props.display.width) {
                el.css('width', props.display.width);
            }
            var attrs = angular.extend({}, props, {
                'class': 'js-udp-pagecontrol',
                'ng-model': getModelName(props),
                // 'uicrefid': 'widgetId',
                'keepundefined': true,
                'options': JSON.stringify(angular.merge({}, {refid: element.attr('id')}, props.options))
            });
            el.attr(attrs);
            //LEO@20190110: In chrome mobile mode, if change a input then click button immediately, the blur will not happen
            if (devel.needMobileView()) {
                el.attr({
                    '_modeloptions': '{updateOn:"default",debounce:{default:500}}'
                });
            }
            // var modelName = getModelName(props);
            // if (modelName)
            //     el.attr('ng-model', modelName);
            return el.prop('outerHTML');
        }
    }
})();
