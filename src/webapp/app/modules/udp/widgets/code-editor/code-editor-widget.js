/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/22/2017
 */
(function () {
    'use strict';

    var app = angular.module('oplus.udp');

    app.run(['widgetFactory', 'dataEx', 'pageDataUtil', codeEditorWidget]);

    /**
     *
     * @param $translate
     * @param widgetFactory {widgetFactory}
     * @param $interval
     * @param $filter
     * @param $compile
     */
    function codeEditorWidget(widgetFactory, dataEx, pageDataUtil) {
        widgetFactory.defineWidget({
            type: 'code-editor',
            name: '代码编辑器',
            group: 'control',
            resizable: null,
            widthMode: 'wm-full',
            configHtmlFile: 'app/modules/udp/widgets/code-editor/code-editor-widget-config.html',
            configController: CodeEditorConfigCtrl,
            controlRenderer: {
                getTemplateForCompilation: function (props, type, element) {
                    var options = {
                        syntax: props.syntax,
                        readonly: props.readonly,
                        toolbar: props.toolbar,
                    }

                    var elem = angular.element('<op-code-editor style="height: inherit;width: inherit;"></op-code-editor>');
                    elem.attr('the-model', getModelName(props, element));
                    elem.attr('options', angular.toJson(options));
                    return elem.prop('outerHTML');
                },
                onInitControl: onInitControl,
            }
        });


        function getModelName(props, ele) {
            if (props.name)
                return '$widget.wParams["' + props.name + '"]';
            return '$widget.wParams["_unnamed_code_editor_' + ele.attr('id') + '"]';
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

        function onInitControl(scope, element, props) {
            var modelName = getModelName(props, element);
            var paramName = props.name || ('_unnamed_code_editor_' + element.attr('id'));

            scope.$watch(modelName, function (newVal, oldVal) {
                if (isEqual(newVal, oldVal))
                    return;
                scope.$widget.$pageScope.pageParams[paramName] = newVal;
            });

            if (angular.isDefined(props.initval)) {
                // Ignore self
                var ignores = [paramName, '@.' + paramName];
                var debugKey = '';
                var valueObj = pageDataUtil.getPageScopeValues(scope);
                var result = dataEx.evalVarExpr(props.initval, valueObj, {
                    ignores: ignores,
                    debugKey: debugKey
                });

                if (result && angular.isFunction(result.then)) {
                    // This is a promise
                    result.then(function (data) {
                        if (angular.isDefined(paramName)) {
                            scope.$widget.wParams[paramName] = data;
                            scope.$widget.$pageScope.pageParams[paramName] = data;
                        }
                    }).catch(function (err) {
                        
                    });
                } else if (angular.isDefined(result) && angular.isDefined(paramName)) {
                    scope.$widget.wParams[paramName] = result;
                    scope.$widget.$pageScope.pageParams[paramName] = result;
                }
            }
        }

        function CodeEditorConfigCtrl(scope, props) {
            scope.syntaxArr =  _.filter(Object.keys(CodeMirror.modes), function(f) { return f !== 'null'})

        }
    }
})();
