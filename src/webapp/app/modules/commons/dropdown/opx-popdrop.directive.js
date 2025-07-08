/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/1/17, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name opxPopdrop
     * @description
     * Popover and dropdown with bootstrap 5.
     * ```html
     * <ANY data-bs-toggle="dropdown|popover" opx-popdrop>
     * ```
     * @see https://getbootstrap.com/docs/5.1/components/popovers/#options
     * @see https://getbootstrap.com/docs/5.1/components/dropdowns/#options
     */
    angular.module('oplus.commons').directive('opxPopdrop', ['$parse', opxPopdropDirective]);

    function opxPopdropDirective($parse) {
        return {
            restrict: 'A',
            scope: {
                theConfig: '<opxPopdrop',
                title: '@bsTitle'
            },
            link: linkFn
        };

        function linkFn(scope, element, attrs, ctrl) {
            var toggleType = element.data('bsToggle');
            var instance;
            var domEl = element[0];
            scope.theConfig = scope.theConfig || {};
            if (toggleType === 'dropdown') {
                instance = new bootstrap.Dropdown(domEl, {
                    popperConfig: {
                        strategy: 'fixed'
                    }
                });
            } else if (toggleType === 'popover') {
                // console.log('popover...%o',document.querySelector('.btn-info'));
                var theConfig = scope.theConfig;
                var options = {html: true, container: 'body'};
                if (theConfig.content) {
                    if (theConfig.content.startsWith('#')) {
                        var contentElem = $(theConfig.content);
                        options.content = contentElem;
                    }
                }
                instance = new bootstrap.Popover(domEl, options);
            }
            if (instance) {
                scope.$on('$destroy', function () {
                    // console.log('destroy');
                    instance.dispose();
                });
            }
        }
    }
})();
