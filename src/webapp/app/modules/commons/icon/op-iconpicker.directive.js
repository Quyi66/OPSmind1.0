/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/21/2017
 */
(function () {
    'use strict';

    /**
     * @memberof oplus.commons
     * @ngdoc directive
     * @name opIconpicker
     * @restrict E
     * @description
     * Angular wrapper for [fontawesome-iconpicker](https://github.com/farbelous/fontawesome-iconpicker)
     * @example
     * <op-iconpicker ng-model="string"
     *                options="{previewStyle:string=,excludeBrandIcon:boolean=}"></op-iconpicker>
     * @param {string} ngModel Two-way binding model
     * @param {{previewStyle:string=,excludeBrandIcon:boolean=}} options
     * @param {string} options.previewStyle Icon style for preview, "solid" (default), "regular", "light", "duotone"
     * @param {string} options.excludeBrandIcon True to exclude brand icon
     */
    angular.module('oplus.commons').directive('opIconpicker', iconPicker);

    iconPicker.$inject = ['$timeout'];

    function iconPicker($timeout) {
        var btn;
        btn = '<button type="button" class="dropdown-toggle btn btn-outline-default opx-btn-icon js-iconpicker-component" data-bs-toggle="dropdown" opx-popdrop></button>' +
            '<div class="dropdown-menu"></div>';
        return {
            restrict: 'EA',
            scope: {
                selectedIcon: '=ngModel',
                options: '<'
            },
            template: btn,
            link: function (scope, element, attrs, ctrl) {
                var $icp;
                element.addClass('dropdown');
                $icp = element.find('>.dropdown-toggle');
                var options = scope.options || {};
                var iconCss;
                var cssMap = {'solid': 'fas', 'regular': 'far', 'duotone': 'fad'};
                // if (useSelf) {
                //     element.addClass('js-iconpicker-component');
                // }
                if (options.previewStyle) {
                    iconCss = cssMap[options.previewStyle];
                }
                if (!iconCss) {
                    iconCss = 'fa';
                }
                var opts = {
                    hideOnSelect: true,
                    inputSearch: true,
                    component: '.js-iconpicker-component',
                    defaultValue: undefined,
                    fontAwesome5: true,
                    fullClassFormatter: function (e) {
                        return iconCss + ' ' + e;
                    },
                    icons: window['@oplus/icons'],
                    // container: 'body',
                    placement: 'bottomLeft'
                };
                if (options.excludeBrandIcon === true) {
                    opts.icons = _.filter(window['@oplus/icons'], {isBrand: false});
                }
                $icp.iconpicker(opts);
                $icp.on('iconpickerSelected', function (event) {
                    $timeout(function () {
                        scope.selectedIcon = event.iconpickerValue;
                    });
                });
                scope.$watch('selectedIcon', function (newVal, oldVal) {
                    if (!newVal) {
                        // To remove icon, it seems we have to
                        // 1. clear element's data `iconpickerValue`
                        // 2. clear control instance's `iconpickerValue`
                        if (angular.isUndefined(newVal)) {
                            // Use removeData since jquery.data(key,value) does not allow undefined as value.
                            $icp.removeData('iconpickerValue');
                        } else {
                            $icp.data('iconpickerValue', newVal);
                        }
                        $icp.data('iconpicker').iconpickerValue = newVal;
                        // $icp.data('iconpicker').setSourceValue(newVal);
                    }
                    $icp.data('iconpicker').update(newVal);
                    // console.log('selectedIcon', newVal, $icp.data('iconpicker').iconpickerValue);
                });
                // $icp.data('iconpicker').setSourceValue(scope.selectedIcon);//setSourceValue', 'methodArg2' /* , other args */);
                scope.$on('$destroy', function () {
                    $icp.off('iconpickerSelected');
                    var iconpicker = $icp.data('iconpicker');
                    if (iconpicker)
                        iconpicker.destroy();
                });
            }
        }
    }
})();
