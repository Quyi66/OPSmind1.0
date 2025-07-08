/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/13/2018
 */

(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name udpButtonStyleConfig
     * @description
     * Config button display style
     * ```
     * <udp-button-style-config ng-model="object"/>
     * ```
     * @attr {object} theModel Button display style configurations
     */
    angular.module('oplus.commons').component('udpButtonStyleConfig', {
        templateUrl: 'app/modules/udp/helper/button-style-config.html',
        require: {
            ngModelCtrl: '?ngModel'
        },
        bindings: {
            theModel: '=ngModel'
        },
        controller: ['$scope', '$translate', '$sce', 'widgetUiHelper', 'themeService', ButtonStyleConfigCtrl]
    });

    /**
     *
     * @param $scope
     * @param $translate
     * @param {$sce} $sce
     * @param {widgetUiHelper} widgetUiHelper
     * @param {themeService} themeService
     */
    function ButtonStyleConfigCtrl($scope, $translate, $sce, widgetUiHelper, themeService) {
        var USE_NGMODEL_CTRL = true;
        var that = this;
        this.buttonStyles = [];
        this.buttonSizes = [
            {value: ''},
            {value: 'lg'},
            {value: 'sm'}
        ];
        this.$onInit = onInit;
        this.buttonLayouts = [
            {value: 'icon-only'},
            {value: 'icon-no'},
            {value: 'icon-left'},
            {value: 'icon-right'},
            {value: 'icon-top'}
        ];

        this.availButtonStyles = [{value: 'outline'},
            {value: 'flat'},
            {value: 'rounded'},
            {value: 'text'}];
        this.availButtonStyles.forEach(function (o) {
            o.title = $translate.instant('udp.wc.button.style_' + o.value);
        })
        this.buttonSizes.forEach(function (o) {
            o.title = $translate.instant('udp.wc.button.size_' + (o.value || 'default'));
        })
        this.buttonLayouts.forEach(function (o) {
            o.title = $translate.instant('udp.wc.button.layout_' + o.value.replace('-', '_'));
        })

        function onInit() {
            if (USE_NGMODEL_CTRL) {
                that.ngModelCtrl.$formatters.push(formatInput);
                that.ngModelCtrl.$render = renderViewValue;
                that.ngModelCtrl.$parsers.push(parseOutput);
                $scope.$watch('$ctrl.editCopy', function (newVal, oldVal) {
                    if (!newVal) return;
                    that.ngModelCtrl.$setViewValue(angular.copy(newVal));
                }, true);
            } else {
                if (this.theModel && this.theModel.style) {
                    that.buttonStyles = this.theModel.style.split(/\s+/);
                }
                $scope.$watch('$ctrl.theModel', function (newVal, oldVal) {
                    // console.log('theModel', newVal);
                    if (!newVal) return;
                    var html = widgetUiHelper.buildButton(newVal).prop('outerHTML');
                    html = $sce.trustAsHtml(html);
                    that.previewHtml = html;
                }, true);
                $scope.$watch('$ctrl.buttonStyles', function (newVal, oldVal) {
                    if (newVal === oldVal) return;
                    that.theModel.style = that.buttonStyles.join(' ') || undefined;
                }, true);
            }
        }

        function formatInput(modelValue) {
            var result = angular.copy(modelValue);
            if (!result) {
                result = {buttonStyles: []};
            } else if (result.style) {
                result.buttonStyles = result.style.split(/\s+/);
            } else {
                result.buttonStyles = [];
            }
            return result;
        }

        function renderViewValue() {
            that.editCopy = that.ngModelCtrl.$viewValue;
        }

        function parseOutput(viewValue) {
            var result = angular.copy(viewValue);
            result.style = result.buttonStyles.join(' ') || undefined;
            delete result.buttonStyles;
            return result;
        }
    }
})();
