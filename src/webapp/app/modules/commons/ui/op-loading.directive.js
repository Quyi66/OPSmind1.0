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
                var defaultConfig = {style: 'ellipsis'};
                var config = angular.extend({}, defaultConfig, scope.$eval(attrs['opLoading']));
                // console.log(config);
                var html;
                if (config.style === 'spinner') {
                    html = '<i class="fa fa-3x fa-pulse fa-spinner"></i>';
                } else {
                    html = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';
                }
                element.append(html);
            }
        }
    }
})();
