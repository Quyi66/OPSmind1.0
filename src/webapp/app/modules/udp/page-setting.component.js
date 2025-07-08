/**
 * @author Leo Liao (leoliaolei@gmail.com), 2020/04/30, extracted from page-designer.controller
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name udpPageSetting
     * @description
     * ```html
     * <udp-page-setting page="object">
     * ```
     */
    angular.module('oplus.udp').component('udpPageSetting', {
        bindings: {
            page: '='
        },
        templateUrl: 'app/modules/udp/page-setting.html',
        controller: ['themeService', PageSettingCtrl]
    });


    /**
     * @param {themeService} themeService
     */
    function PageSettingCtrl(themeService) {
        var that = this;
        if (angular.isString(that.page.setting)) {
            that.page.setting = {};
        }
    }
})();
