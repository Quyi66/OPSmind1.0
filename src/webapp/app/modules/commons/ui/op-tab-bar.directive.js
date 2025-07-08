/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 1/2/2019
 */

(function () {
    'use strict';
    angular.module('oplus.commons').directive('opTabBar', ['$timeout', opTabBar]);

    function opTabBar($timeout) {
        return {
            restrict: 'A',
            link: linkFn
        };
    }

    function linkFn(scope, element, attrs, ctrl) {
        setTimeout(function () {
            element.responsiveTabs();
        });
    }
})();