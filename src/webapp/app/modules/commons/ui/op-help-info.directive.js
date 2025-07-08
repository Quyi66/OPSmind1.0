/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 10/8/2017
 */
(function () {
    'use strict';
    /**
     * @memberof oplus.commons
     * @ngdoc directive
     * @name opHelpInfo
     * @description
     * Append an d-inline-block icon to the element to provide simple help information in popover.
     * @restrict A
     * @example
     * <ANY op-help-info="string"/>
     * @attr {string} op-help-info Text to display in popover. It can be:
     * - plain text
     * - a dom selector in format of "DOM:jquery_selector"
     */
    angular.module('oplus.commons').directive('opHelpInfo', ['$compile', '$translate', opHelpInfo]);

    function opHelpInfo($compile, $translate) {
        return {
            restrict: 'A',
            compile: function (element, attrs) {
                var info = attrs['opHelpInfo'] || '';
                // 1. 直接 Hack translate 如果当前直接使用 i18n 的 key 直接翻译
                info = $translate.instant(info);
                // 2. 如果当前使用 filter 的方式 translate
                var translateReg = /{{\s*['|"](.*)['|"]\s*\|\s*translate\s*}}/
                if (translateReg.test(info) && translateReg.exec(info).length === 2)
                    info = $translate.instant(translateReg.exec(info)[1])

                var content = info.replace(/'/g, "\\'");
                $('<i class="fa fa-info-circle text-black-50 ms-2" data-bs-toggle="popover" data-bs-trigger="hover" opx-popdrop></i>')
                    .attr('data-bs-content', content).appendTo(element);
                element.removeAttr('op-help-info')
                return {
                    pre: function preLink(scope, element, attrs, controller) {
                        // scope.helpInfo = info;
                        // console.log('compile.pre', scope.helpInfo);
                    },
                    post: function postLink(scope, element, attrs, controller) {
                        $compile(element)(scope);
                    }
                };
            }
        }
    }
})();
