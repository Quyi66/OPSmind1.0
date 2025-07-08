/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/09/19, Created
 */

(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name opSmartSelect
     * @description
     * This provides a unified way for selection within definite options.
     * It behaves like checkbox, select.
     * Why reinvent a wheel besides native checkbox and select? Native checkbox does not support array type output.
     *
     * This component intends to
     * - support array output of checkboxes
     * - support ngModel
     * @usage
     * ```html
     * <op-smart-select ng-model="[]" the-items="[array|object]|Promise<array>"
     *                 options="{valueData:string,labelData:string=,viewAs:string=}"/>
     * ```
     * @param {[array|object]|Promise<array>} theItems List of selectable items. Each item can be an array or object.
     * If array, the first element is value, second element is label.
     * If object, the value and label data are determined by `options.valueData` and `options.labelData`.
     * It can be a promise of data.
     * @param {string=} options.valueData The path of item to pick value data from.
     * @param {string=} options.labelData The path of item to pick label data from.
     * @param {string=} options.viewAs "checkbox" (default), "chip"
     */
    angular.module('oplus.commons').component('opSmartSelect', {
        templateUrl: 'app/modules/commons/ui/op-smart-select.html',
        require: {
            ngModelCtrl: '?ngModel'
        },
        bindings: {
            ngModel: '=',
            theItems: '<',
            options: '<'
        },
        controller: ['$scope', '$element', '$timeout', OpSmartSelectCtrl]
    });


    /**
     *
     * @param $scope
     * @param $element
     * @param $timeout
     */
    function OpSmartSelectCtrl($scope, $element, $timeout) {
        var that = this;
        this.options = this.options || {};
        this.selectedItems = [];
        this.$onInit = onInit;
        this.itemList = [];
        var viewAs = this.options.viewAs = this.options.viewAs || 'checkbox';
        this.extraCss = viewAs === 'chip' ? 'checkbox-inline op-select-chip' : 'checkbox-inline';
        var datatype = this.options.datatype;

        function onInit() {
            initNgModelCtrl();
            $scope.$watch('$ctrl.theItems', function (newVal, oldVal) {
                if (!newVal) {
                    return;
                }
                initItemList();
            });

            function initNgModelCtrl() {
                that.ngModelCtrl.$parsers.push(function parseInput(modelValue) {
                    // if (datatype === 'csv') {
                    //     return modelValue ? modelValue.split(',') : [];
                    // }
                    return modelValue;
                });
                that.ngModelCtrl.$formatters.push(function formatOutput(selectedItems) {
                    // if (datatype === 'csv') {
                    //     return selectedItems.join(',');
                    // }
                    return selectedItems;
                });
                that.ngModelCtrl.$render = function renderView() {
                    that.selectedItems = that.ngModelCtrl.$viewValue;
                };
                $scope.$watch('$ctrl.selectedItems', function (newVal, oldVal) {
                    if (!newVal) return;

                    that.ngModelCtrl.$setViewValue(angular.copy(that.selectedItems));
                }, true);

            }

            function initItemList() {
                if (!angular.isArray(that.theItems)) {
                    throw new Error('ProgramError: <op-smart-select> `the-items` must be array')
                }
                if (that.theItems.length === 0) {
                    return;
                }
                var sampleItem = that.theItems[0];
                var itemType = 'array';
                if (angular.isArray(sampleItem)) {
                } else if (angular.isObject(sampleItem)) {
                    itemType = 'object';
                    if (!that.options.valueData) {
                        throw new Error('ProgramError: <op-smart-select> options.valueData cannot be empty for object type item');
                    }
                }
                that.itemList = _.map(that.theItems, function (o) {
                    var value, label;
                    if (itemType === 'array') {
                        value = o[0];
                        label = o[1];
                    } else {
                        value = o[that.options.valueData];
                        label = o[that.options.labelData];
                    }
                    return {value: value, label: label, id: Date.now() + _.uniqueId('-')};
                });
            }
        }
    }
})();
