/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/11/22
 */
(function () {
    'use strict';
    /**
     * @memberof oplus.commons
     * @ngdoc directive
     * @name opLoading
     * @description
     * Show loading indicator.
     * @restrict A
     * @example
     * <ANY op-loading="object"/>
     * @param {object} opLoading
     */
    angular.module('oplus.commons').directive('opLoading', ['$compile', opLoading]);

    function opLoading($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                // 定制版本：移除加载动画，用于iframe嵌入第三方系统
                // 不添加任何加载指示器
            }
        }
    }
})();
