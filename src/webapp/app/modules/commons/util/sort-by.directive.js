(function() {
    'use strict';

    angular
        .module('oplus.commons')
        .directive('jhSortBy', jhSortBy);
    /**
     * @deprecated
     */
    function jhSortBy() {
        var directive = {
            restrict: 'A',
            scope: false,
            require: '^jhSort',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs, parentCtrl) {
            element.bind('click', function () {
                parentCtrl.sort(attrs.jhSortBy);
            });
        }
    }
})();
