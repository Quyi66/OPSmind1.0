/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/8/25, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name umdModelAttr
     * @description
     * ```html
     * <umd-model-attr the-attr="={code:string,title:string,input:{control:string}}"
     *                 options="{readonly:boolean}" />
     * @param theAttr Two-way binding of attribute
     * ```
     */
    angular.module('oplus.commons').component('umdModelAttr', {
        bindings: {
            theAttr: '=',
            options: '<'
        },
        templateUrl: 'app/modules/commons/umd/umd-model-attr.html',
        controller: ['$scope', '$element', '$compile', udmModelAttrCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param $compile
     */
    function udmModelAttrCtrl($scope, $element, $compile) {
        var that = this;
        this.options = this.options || {};
        if (!that.theAttr.input) {
            that.theAttr.input = {};
        }
        $scope.$watch('$ctrl.theAttr.input', function (newVal, oldVal) {
            var inputConfig = newVal;
            if (!inputConfig) {
                return;
            }
            var props = calcChangedProps(newVal, oldVal);
            // Do not redraw if changed property is like `_active`
            if (props.length === 1 && props[0].indexOf('_') === 0) {
                return;
            }
            // console.log('Rerender uinput')
            var input = $('<udp-input ng-model="$ctrl.__empty" $controlonly="true" class="flex-fill"></udp-input>');
            Object.keys(inputConfig).forEach(function (prop) {
                var value = '{{$ctrl.theAttr.input.' + prop + '}}';
                input.attr(prop, value);
            });
            if (that.options.readonly) {
                input.attr('readonly', true);
            }
            $element.find('.form-control-wrapper')
                .empty()
                .html($compile(input)($scope));
        }, true);

        function calcChangedProps(newVal, oldVal) {
            if (newVal && !oldVal) {
                return Object.keys(newVal);
            }
            var result = [];
            Object.keys(newVal).forEach(function (key) {
                if (newVal[key] !== oldVal[key]) {
                    result.push(key);
                }
            });
            return result;
        }
    }
})();
