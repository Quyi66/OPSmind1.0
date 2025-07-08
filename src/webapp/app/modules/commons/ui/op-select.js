/**
 * https://stackoverflow.com/questions/36134187/how-to-use-jquery-select2-with-angularjs
 * https://embed.plnkr.co/plunk/Mn99Pq
 * https://gist.github.com/vedovelli/3742804
 * https://stackoverflow.com/q/29644310/1524900
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/09/04
 */
(function () {
    'use strict';
    angular.module('oplus.commons').directive('opSelect', ['$timeout', '$compile', opSelect]);

    /**
     * @ngdoc directive
     * @name op-select
     * @description
     * Add select2 features to a standard <select> control.
     * @usage
     * ```
     * <select op-select="{datatype:string|array}" multiple ng-model="" ng-options=""></select>
     * ```
     *
     * @param $timeout
     * @param $compile
     */
    function opSelect($timeout, $compile) {
        return {
            restrict: 'A',
            //require: 'ngModel' gives you the controller for the ngModel directive, which is an ngModelController.
            // https://stackoverflow.com/questions/20930592/whats-the-meaning-of-require-ngmodel
            // https://docs.angularjs.org/api/ng/type/ngModel.NgModelController#custom-control-example
            require: 'ngModel',
            scope: {ngModel: '='},
            link: function (scope, element, attrs, ngModelCtrl) {
                var tagName = element[0].tagName;
                var type = element.attr('type');
                var directiveOptions;
                if (tagName === 'SELECT') {
                    linkForSelect();
                } else if (tagName === 'INPUT' && type === 'checkbox') {
                    linkForCheckbox();
                }

                function linkForSelect() {
                    $timeout(function () {
                        var props = attrs['opSelect'];
                        directiveOptions = scope.$eval(props) || {};
                        // console.log('directiveOptions', directiveOptions);
                        if (directiveOptions.datatype === 'string' && element[0].hasAttribute('multiple')) {
                            // ngModel --> $modelValue --> Formatters --> $viewValue --> $render().
                            ngModelCtrl.$formatters.push(function (value) {
                                if(value) {
                                    return value.split(',');
                                }
                                return '';

                            });
                            ngModelCtrl.$render = function () {
                                // fix multiple select not work
                                element.find('option').each(function() {
                                    var $option = $(this);
                                    // Note: $option.val() like string:simple、number：11
                                    var optionValue = $option.val().split(":")[1];
                                    if (_.indexOf(ngModelCtrl.$modelValue,optionValue) !== -1) {
                                        $option.prop('selected', true);
                                    }
                                })
                            };
                            // Widget --> $viewValue --> Parsers --> Validators? --> $modelValue --> ngModel.
                            ngModelCtrl.$parsers.push(function (value) {
                                return value.join(',');
                            });
                        }

                        if (directiveOptions.tags === true && (scope.ngModel || []).length > 0) {
                            if (element[0].hasAttribute('multiple')) {
                                directiveOptions.data = _.merge(directiveOptions.data || [],
                                    _.map(scope.ngModel, function (m) {
                                        return {
                                            id: m,
                                            text: m,
                                            selected: true
                                        }
                                    }))
                            }
                            else {
                                directiveOptions.data = _.merge(directiveOptions.data || [], [{
                                    id: scope.ngModel,
                                    text: scope.ngModel,
                                    selected: true
                                }])
                            }
                        }
                        var options = _.assign({theme: 'bootstrap4'}, directiveOptions);
                        // select2 width配置默认值为'resole'，会根据下拉框值计算宽度，导致组件设置的宽度失效
                        // 参考： https://select2.org/appearance#container-width
                        // options.width = '100%';

                        if ($(element).parents('fieldset').attr('disabled') === 'disabled') {
                            options['disabled'] = true;
                        }

                        element.select2(options);
                    });

                    // UI control to model
                    // ngModel.$render = function (asd, dsa) {
                    // }

                    // Model to UI control
                    scope.$watch('ngModel', function (newVal, oldVal) {
                        if (newVal === oldVal) return;
                        element.trigger('change.select2');
                    }, true);

                    if ((scope.$eval(attrs['opSelect']) || { tags: false }).tags === true) {
                        element.on('select2:select select2:unselect select2:clear', function (event) {
                            scope.$apply(function () {
                                ngModelCtrl.$setViewValue(element.val());
                            });
                        })
                    }

                    scope.$on('$destroy', function () {
                        if (element.hasClass("select2-hidden-accessible"))
                            element.select2('destroy');
                    });
                }

                function linkForCheckbox() {
                }
            }
        }
    }

    /**
     * @ngdoc directive
     * @name checkboxModel
     * @description
     * This directive uses with `checkbox` input. It supports array as model value.
     * https://github.com/Vikasg7/checkbox-select
     * @usage
     * `<input type="checkbox" checkbox-model="array" checkbox-value="">`
     */
    angular.module("oplus.commons").directive("checkboxModel", ["$compile", checkboxModel]);

    function checkboxModel($compile) {
        return {
            restrict: "A",
            // require:'checkboxModel',
            link: function (scope, element, attrs) {
                // Defining updateSelection function on the parent scope
                if (!scope.$parent.updateSelections) {
                    // Using splice and push methods to make use of
                    // the same "selections" object passed by reference to the
                    // addOrRemove function as using "selections = []"
                    // creates a new object within the scope of the
                    // function which doesn't help in two way binding.
                    scope.$parent.updateSelections = function (selectedItems, item, isMultiple) {
                        if (!selectedItems) {
                            throw new Error('Cannot find model property "' + attrs.checkboxModel + '" in scope for directive `checkbox-model`.');
                        }
                        var itemIndex = selectedItems.indexOf(item);
                        var isPresent = (itemIndex > -1);
                        if (isMultiple) {
                            if (isPresent) {
                                selectedItems.splice(itemIndex, 1);
                            } else {
                                selectedItems.push(item);
                            }
                        } else {
                            if (isPresent) {
                                selectedItems.splice(0, 1);
                            } else {
                                selectedItems.splice(0, 1, item);
                            }
                        }

                    }
                }

                // Adding or removing attributes
                element.attr("ng-checked", attrs.checkboxModel + ".indexOf(" + attrs.checkboxValue + ") > -1");
                var multiple = attrs.multiple ? "true" : "false";
                element.attr("ng-click", "updateSelections(" + [attrs.checkboxModel, attrs.checkboxValue, multiple].join(",") + ")");

                // Removing the checkbox-model attribute,
                // it will avoid recompiling the element infinitly
                element.removeAttr("checkbox-model")
                    .removeAttr("checkbox-value")
                    .removeAttr("multiple");

                //Need recompile because we set ng-model, ng-click...
                $compile(element)(scope);
            }
        }
    }

})();
