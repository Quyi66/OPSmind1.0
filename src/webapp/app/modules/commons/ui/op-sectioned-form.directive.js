/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/07/03, created
 */
(function () {
    'use strict';
    /**
     * @ngdoc directive
     * @name opSectionedForm
     * @restrict A
     * @description
     * This directive turns `fieldset` to navigatable section.
     * @example
     * ```html
     * <ANY op-sectioned-form/>
     * ```
     */
    angular.module('oplus.commons').directive('opSectionedForm', ['$compile','$timeout', '$interval', opSectionedForm]);

    function opSectionedForm($compile,$timeout, $interval) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.wrap('<div class="d-flex scroll-y h-100"></div>');
                var parent = element.parent();
                var navMode = 'scroll';
                var checkInterval = 500, checkTimes = 10, checkCount = 0;
                // $timeout(function () {
                //     buildElement();
                // }, 2000);
                buildElement();
                //TODO: need optimize the delay interval
                var stop = $interval(function () {
                    checkCount++;
                    buildElement();
                    if (checkCount > checkTimes) {
                        $interval.cancel(stop);
                    }
                }, checkInterval)
                parent.on('click', '.js-navitem', function () {
                    var link = $(this);
                    var linkId = link.data('id');
                    // 更新导航项的激活状态
                    parent.find('.js-navitem').removeClass('active');
                    link.addClass('active');

                    if (navMode === 'scroll') {
                        var targetElement = document.getElementById(linkId);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    } else if (navMode === 'tab') {
                        var selector = '#' + linkId;
                        // 隐藏所有顶级 fieldset 和组件内的 fieldset
                        $('fieldset', element).not(selector).hide();
                        // 显示目标 fieldset，如果在组件内，也要显示其父组件
                        var targetFieldset = $(selector);
                        targetFieldset.show();
                        // 确保父级组件也是可见的
                        targetFieldset.parents().show();
                    }
                });
                scope.$on('$destroy', function () {
                    parent.off('click');
                });

                function buildElement() {
                    // console.log('buildElement',element.prop('outerHTML'));
                    var navItems = [];
                    // 深度扫描所有 fieldset > legend，包括组件内部的
                    var legends = $('fieldset legend', element);
                    var currentCount = legends.length;
                    var lastCount = element.data('items') || 0;

                    // 如果数量没有变化且已经有菜单，则不重新构建
                    if (currentCount === lastCount && currentCount > 0 && parent.find('>.js-navmenu').length > 0) {
                        return;
                    }
                    element.data('items', currentCount);
                    if (currentCount === 0) {
                        return;
                    }
                    legends.each(function (index, elem) {
                        var legend = $(this);
                        var section = legend.parent();
                        var sectionId = section.attr('id');
                        if (!sectionId) {
                            sectionId = _.uniqueId('formsection');
                            section.attr('id', sectionId);
                        }
                        var label = legend.text();
                        navItems.push({label: label, id: sectionId});
                    });
                    var html = '';
                    var navMenu = $('<ul class="nav nav-pills flex-column px-3 bg-light js-navmenu" style="width:10rem;min-width: 10rem;"></ul>');
                    navItems.forEach(function (item) {
                        html += '<li class="nav-item"><a class="nav-link js-navitem" data-id="' + item.id + '">' + item.label + '</a></li>';
                    });
                    navMenu.html(html);
                    element.addClass('flex-fill scroll-y px-3');
                    var find = parent.find('>.js-navmenu');
                    if (find.length === 0) {
                        parent.prepend(navMenu);
                    } else {
                        find.replaceWith(navMenu);
                    }
                }
            }
        }
    }
})();
