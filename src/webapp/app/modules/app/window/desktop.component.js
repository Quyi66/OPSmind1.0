/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/13, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name opDesktop
     * @description
     * ```html
     * ```
     */
    angular.module('oplus.udp').component('opDesktop', {
        templateUrl: 'app/modules/app/window/desktop.component.html',
        controller: ['$state', '$scope', '$rootScope', '$translate', 'appletRegistry', 'currentUser', 'appletRunman', 'windowInit', DesktopCtrl]
    });

    /**
     *
     * @param $state
     * @param $scope
     * @param $rootScope
     * @param $translate
     * @param {appletRegistry} appletRegistry
     * @param {currentUser} currentUser
     * @param {appletRunman} appletRunman
     * @param {windowInit} windowInit
     */
    function DesktopCtrl($state, $scope, $rootScope, $translate, appletRegistry, currentUser, appletRunman, windowInit) {
        var that = this;
        this.$onInit = onInit;

        function onInit() {
            var unregister = $scope.$watch(function () {
                return appletRegistry.getAppletDefs();
            }, function (newVal) {
                if (!newVal || newVal.length === 0) return;
                // console.log('DesktopCtrl.$watch: Applet defs changed, length=' + appletRegistry.getAppletDefs().length);
                initShortcuts();
                // unregister();
            });
        }

        function initShortcuts() {
            that.shortcuts = _.map(appletRegistry.getDesktopApplets(), function (def) {
                return {type: 'Applet', name: def.code, title: def.title, icon: def.icon, color: def.color};
            });
        }

        this.openShortcut = function (shortcut) {
            if (shortcut.type === 'Applet') {
                appletRunman.openApplet(shortcut.name);
            } else {
                $state.go(shortcut.sref);
            }
        };
    }
})();
