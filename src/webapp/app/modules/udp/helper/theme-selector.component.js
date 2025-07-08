/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 10/16/2017
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name udpThemeSelector
     * @description
     * ```
     * <udp-theme-selector the-model="object" customizable="boolean" options="object" themeGroup="@string">
     * ```
     * @attr {{theme:string, backColor:string, fontColor:string}|string} theModel Two-way binding selected theme or theme name
     * @attr {{modelType:string}} options
     * @attr {boolean} customizable
     * @attr {string} themeGroup
     *
     */
    angular.module('oplus.udp').component('udpThemeSelector', {
        templateUrl: 'app/modules/udp/helper/theme-selector.html',
        bindings: {
            theModel: '=',
            customizable: '<',
            modelType: '@',
            // options: '<',
            themeGroup: '@'
        },
        controller: ['themeService', '$scope', ThemeSelectorCtrl]
    });

    /**
     *
     * @param {themeService} themeService
     */
    function ThemeSelectorCtrl(themeService, $scope) {
        var that = this;
        if (this.themeGroup === 'page') {
            this.themeColors = themeService.getPageThemes(this.customizable);
        } else {
            this.themeColors = themeService.getDefinedThemes(this.customizable);
        }

        $scope.$watch('$ctrl.theModel', function (newVal, oldVal) {
            if (that.modelType === 'string') {
                that.selectedTheme = newVal;
            } else if (newVal) {
                that.selectedTheme = newVal.theme;
            }
        });

        $scope.$watch('$ctrl.selectedTheme', function (newVal, oldVal) {
            // console.log("selectedTheme = " + newVal);
            if (newVal === oldVal) return;
            if (that.modelType === 'string') {
                that.theModel = newVal;
            } else {
                that.theModel.theme = newVal;
            }
        });

        // function migrateOldModel() {
        // if (angular.isString($scope.theModel)) {
        //     $scope.theModel = {theme: $scope.theModel};
        // }
        // }
    }
})();
