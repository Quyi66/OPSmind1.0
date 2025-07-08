/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/24, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name opxAppletItem
     * @description
     * ```html
     * ```
     */
    angular.module('oplus.commons').component('opxAppletItem', {
        transclude: true,
        bindings: {
            appletDef: '<',
            onClickApplet: '&'
        },
        templateUrl: 'app/modules/app/applet-item.component.html',
        controller: ['$scope', AppletItemCtrl]
    });

    function AppletItemCtrl($scope) {
        var that = this;
        var appletDef = that.appletDef;
        this.$onInit = onInit;
        this.clickApplet = clickApplet;

        function onInit() {
            appletDef._colors = calcColor({color: appletDef.color, theme: appletDef.theme}, appletDef.status);
        }

        function clickApplet($event) {
            that.onClickApplet({applet: appletDef, $event: $event});
        }

        /**
         *
         * @param {{color:string, theme:string}} setting
         * @param {string} appletStatus
         * @return {{iconBackColor: string, iconColor: string}}
         */
        function calcColor(setting, appletStatus) {
            var result = {iconColor: '#aaa', iconBackColor: '#666'};
            if (appletStatus === 'O') {
                return result;
            }
            if (setting.color) {
                result.iconColor = setting.color;
            }
            var main = tinycolor(result.iconColor);
            var isMainBright = main.getBrightness() > 200;
            if (isMainBright) {
                result.iconBackColor = main.darken(30).toRgbString();
            } else {
                result.iconBackColor = result.iconColor;
                result.iconColor = tinycolor.mix('#fff', result.iconColor, 50).toRgbString();
            }
            return result;
        }
    }
})();
