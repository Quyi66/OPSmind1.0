/**
 *
 * @author Joker liu, created on 4/1/2020
 */

(function () {
    'use strict';
    angular.module('oplus.commons').directive('opxSidebar', ['$timeout','$translate', opSidebar]);

    function opSidebar($timeout,$translate) {
        return {
            restrict: 'C',
            link: linkFn
        };


        function linkFn(scope, element, attrs, ctrl) {
            $timeout(function () {
                initSideBarItems(element);
                initSideBarEvent(element);
            });
        }

        function initSideBarItems(element) {
            //生成折叠按钮
            if ($(element).hasClass("opx-collapsible")) {
                $(".opx-sidebar-header", element).prepend(
                    ' <button type="button" class="btn btn-default btn-sm opx-btn-icon opx-sidebar-toggler">'
                    + '<i class="fa fa-chevron-right expand-btn" title="'+$translate.instant('common.menu.expand_menu')+'"></i>'
                    + '<i class="fa fa-chevron-left collapse-btn" title="'+$translate.instant('common.menu.collapse_menu')+'"></i>'
                    + ' </button>'
                );
            }

            //生成搜索按钮
            if ($(".opx-sidebar-search", element).length > 0 && $(".opx-sidebar-title", element).length > 0) {
                $(' <button type="button" class="btn btn-default btn-sm opx-btn-icon opx-sidebar-search-btn">'
                    + '<i class="fa fa-search enter-search-btn" title="'+$translate.instant('common.menu.search')+'"></i>'
                    + '<i class="fa fa-reply exit-search-btn" title="'+$translate.instant('common.menu.exit_search')+'"></i>'
                    + ' </button>').insertAfter($(".opx-sidebar-search", element));
                // $(".opx-sidebar-header", element).appendAf(
                //     ' <button type="button" class="btn btn-default opx-btn-icon opx-sidebar-search-btn">'
                //     + '<i class="fa fa-search enter-search-btn" title="搜索"></i>'
                //     + '<i class="fa fa-reply exit-search-btn" title="退出搜索"></i>'
                //     + ' </button>'
                // );

                if (!$(".opx-sidebar-header", element).hasClass("opx-sidebar-header-mode-title") && !$(".opx-sidebar-header", element).hasClass("opx-sidebar-header-mode-form")) {
                    $(".opx-sidebar-header", element).addClass("opx-sidebar-header-mode-title")
                }
            }

            //处理opx-sidebar-header-fixed类
            if ($(".opx-sidebar-header", element).hasClass("opx-sidebar-header-fixed") && !$(element).hasClass("opx-sidebar-header-fixed")) {
                $(element).addClass("opx-sidebar-header-fixed")
            }
        }


        function initSideBarEvent(element) {
            //添加折叠事件
            $(".opx-sidebar-header", element).on("click", '.opx-sidebar-toggler', function () {
                if ($(element).hasClass("opx-sidebar-collapsed")) {
                    $(element).removeClass("opx-sidebar-collapsed");
                } else {
                    $(element).addClass("opx-sidebar-collapsed");
                }
            });

            //添加模式切换事件
            $(".opx-sidebar-header", element).on("click", '.opx-sidebar-search-btn', function () {
                if ($(".opx-sidebar-header", element).hasClass("opx-sidebar-header-mode-title")) {
                    $(".opx-sidebar-header", element).removeClass("opx-sidebar-header-mode-title");
                    $(".opx-sidebar-header", element).addClass("opx-sidebar-header-mode-form");
                } else {
                    $(".opx-sidebar-header", element).removeClass("opx-sidebar-header-mode-form");
                    $(".opx-sidebar-header", element).addClass("opx-sidebar-header-mode-title");
                }
            });
        }
    }
})();