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
                var navMode = 'tab';
                var checkInterval = 500, checkTimes = 0, checkCount = 0;
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
                    if (navMode === 'scroll') {
                        document.getElementById(linkId).scrollIntoView();
                    } else if (navMode === 'tab') {
                        parent.find('.js-navitem').removeClass('active');
                        link.addClass('active');
                        var selector = '#' + linkId;
                        $('fieldset', element).not(selector).hide();
                        $(selector).show();
                    }
                });
                scope.$on('$destroy', function () {
                    parent.off('click');
                });

                function buildElement() {
                    // console.log('buildElement',element.prop('outerHTML'));
                    var navItems = [];
                    var legends = $('fieldset>legend', element);
                    if (legends.length === element.data('items')) {
                        return;
                    }
                    element.data('items', legends.length);
                    if (legends.length === 0) {
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
