/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 11/14/2017
 */
(function () {
    'use strict';
    var app = angular.module('oplus.udp');
    app.run(['$q', '$filter', '$translate', 'widgetFactory', 'widgetValues', 'widgetInteraction', '$rootScope', 'widgetUiHelper', 'dataEx', 'widgetDataUtil', 'messageService', paramWidget]);

    /**
     * Page parameter widget.
     * It initializes data from data converter expression.
     * The data is used as page scope parameters.
     * @param $q
     * @param $filter
     * @param $rootScope
     * @param {widgetFactory} widgetFactory
     * @param {widgetInteraction} widgetInteraction
     * @param {widgetValues} widgetValues
     * @param {widgetUiHelper} widgetUiHelper
     * @param {dataEx} dataEx
     * @param {messageService} messageService
     * @param {widgetDataUtil} widgetDataUtil
     */
    function paramWidget($q, $filter, $translate, widgetFactory, widgetValues, widgetInteraction, $rootScope, widgetUiHelper, dataEx, widgetDataUtil, messageService) {
        widgetFactory.defineWidget({
            type: 'param',
            group: 'control',
            eventProperty: 'eventbychange',
            configController: ParamWidgetConfigCtrl,
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onInitControl: onInitControl,
                onReloadData: onReloadData,
                makePrintable: makePrintable
            }
        });

        function ParamWidgetConfigCtrl(scope, props) {
        }

        function makePrintable(element, props) {
            element.remove();
        }

        function onReloadData(scope, element) {
            var props = JSON.parse(element.attr('uw-props'));
            // console.log('onReloadData',props.data);
            refreshData(scope, props);
        }

        function onInitControl(scope, element, props) {
            refreshData(scope, props);
        }

        /**
         *
         * @param scope
         * @param {object} props
         * @param {string} props.name Parameter name
         */
        function refreshData(scope, props) {
            var expr = props.data;
            scope.data = {css: '', paramInfo: ''};
            var paramName = props.name;
            if (!paramName) return;
            evaluateDataExpr(expr).then(function (result) {
                if (angular.isDefined(result)) {
                    var params = {};
                    scope.data.paramInfo = '<pre class="uwtype-param-popover">' +
                        '@.' + paramName + '\n' + $filter('json')(result) +
                        '</pre>';
                    params[paramName] = result;
                    // Do not change URL
                    widgetInteraction.changePageParams(scope, {changeUrl: false, params: params}, null);
                }
            }).catch(function (err) {
                scope.data.css = 'btn-danger';
                scope.data.paramInfo = err.message;
                var title = $translate.instant('udp.w.param.error.cannot_resolve', {param: props.name || ''});
                messageService.toast('error', title, err.message || err);
                console.warn(title, expr, err);
            });


            /**
             * Evaluate data
             * @param {string} expr Data converter expression
             * @returns {Promise<>}
             */
            function evaluateDataExpr(expr) {
                var d = $q.defer();
                if (!expr) {
                    d.resolve(expr);
                } else {
                    var result = dataEx.evalVarExpr(expr, widgetDataUtil.getPageScopeValues(scope));
                    // console.log('result',result);
                    if (result && angular.isFunction(result.then)) {
                        // This is a promise
                        result.then(function (data) {
                            d.resolve(data);
                        }).catch(function (err) {
                            // console.error(err);
                            d.reject(err);
                        });
                    } else if (angular.isDefined(result)) {
                        d.resolve(result);
                    } else {
                        // undefined
                        d.resolve(undefined);
                    }
                }
                return d.promise;
            }
        }

        function getTemplateForCompilation(props) {
            parseDataVariables(props);
            var str = $translate.instant('common.term.parameter');
            if (widgetUiHelper.isEditMode()) {
                return '<button class="btn">' + str + ' ' + (props.name || '') + '</button>';
            }
            return '';

            function parseDataVariables(props) {
                var expr = props.data;
                if (!expr) return;
                if (widgetUiHelper.isEditMode()) return;
                var matches = expr.match(/\${@\.(.*?)}/gm);
                // TODO: a hack to set dataset.param for listening to the page scope param change
                if (matches) {
                    props.dataset = {params: [], hideParams: true};
                    matches.forEach(function (v) {
                        var param = v.substring(4, v.length - 1);
                        if (_.findIndex(props.dataset.params, {name: param}) < 0) {
                            props.dataset.params.push({name: param, control: 'hidden'});
                        }
                    })

                }
            }
        }
    }
})();
