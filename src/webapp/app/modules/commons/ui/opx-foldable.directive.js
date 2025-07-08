/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/08/30, created
 */
(function () {
    'use strict';
    /**
     * @ngdoc directive
     * @name opxFoldable
     * @description
     * Make element expandable and collapsible.
     * @restrict A
     * @example
     * ```html
     * <ANY opx-foldable/>
     * ```
     */
    angular.module('oplus.commons').directive('opxFoldable', [opxFoldable]);

    function opxFoldable() {
        var defs = {collapsed: {icon: 'fa-chevron-up'}, expanded: {icon: 'fa-chevron-down'}};
        return {
            restrict: 'A',
            link: function (scope, element, attrs, ctrl) {
                if (element.is('fieldset')) {
                    foldableFieldset(scope, element);
                } else if (element.hasClass('opx-sidebar')) {
                    foldableSidebar(scope, element);
                }
            }
        }

        function foldableSidebar(scope, element) {
            var collapsedCss = 'opx-sidebar-collapsed';
            var position = 'bottom';
            var style = '';
            if (position === 'bottom') {
            } else if (position === 'top') {
                style = 'position:absolute; top:40px; right:0; z-index:1;'
            }
            var button = $('<button class="op-foldable-toggle btn btn-outline-default" style="' + style + '">EXP</button>');
            if (position === 'bottom') {
                button.appendTo(element);
            } else if (position === 'top') {
                button.prependTo(element);
            }
            button.on('click', function () {
                var isCollapsed = element.hasClass(collapsedCss);
                if (isCollapsed) {
                    element.removeClass(collapsedCss);
                    element.find('.opx-treenav-item').each(function(){
                        var el=$(this);
                        el.text(el.attr('title').trim());
                    });
                } else {
                    element.addClass(collapsedCss);
                    // element.find('.opx-treenav-item').each(function(){
                    //   var el=$(this);
                    //   el.attr('title',el.find('.opx-treenav-item-title').text().trim());
                    // });
                }
            });
            scope.$on('$destroy', function () {
                button.off('click');
                button.remove();
            });
        }

        function foldableFieldset(scope, element) {
            var isFieldset = true;
            var handle = $('<button class="btn btn-default btn-sm opx-btn-flat opx-btn-icon pull-right">' +
                '<i class="fa ' + defs.expanded.icon + '"></i></button>');
            var legend = element.find('>legend').append(handle);
            var children = element.find('>*').not('legend');
            var wrapper = $('<div></div>').append(children).insertAfter(legend);
            handle.on('click', function () {
                if (wrapper.is(':visible')) {
                    wrapper.hide();
                    handle.find('i').removeClass(defs.expanded.icon).addClass(defs.collapsed.icon);
                } else {
                    wrapper.show();
                    handle.find('i').removeClass(defs.collapsed.icon).addClass(defs.expanded.icon);
                }
            });
            scope.$on('$destroy', function () {
                handle.off('click')
            });
        }
    }
})();
