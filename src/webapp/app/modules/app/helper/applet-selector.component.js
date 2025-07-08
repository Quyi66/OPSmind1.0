/**
 *
 * @author chy, created on 2021/10/12
 */
(function () {
    'use strict';
    /**
     * @usage
     * ```
     * <udp-applet-selector
     * applet-code="string"
     * on-change="function"
     * excluded="[string]"
     * options="{viewAs:string,showAll:boolean,includeAllAndNull:boolean}"/>
     * ```
     * @param {[string]} excluded Applet codes to be excluded
     * @param {function} onChange Callback on selection changes
     * @param {string} options.viewAs "dropdown"(default) or "list"
     * @param {boolean} options.showAll True to include unpublished applets. Default is false.
     * @param {boolean} options.includeAllAndNull True to include all and null applet. Default is false
     * @param {boolean} options.showFilter True to show search box to filter applets
     */
    angular.module('oplus.app').component('appletSelector', {
        bindings: {
            excluded: '<',
            appletCode: '=',
            onChange: '&',
            options: '<'
        },
        templateUrl: 'app/modules/app/helper/applet-selector.html',
        controller: ['$scope', 'appletService', '$translate', 'userPref', AppletSelectorCtrl]
    });

    /**
     *
     * @param $scope
     * @param {appletService} appletService
     * @param $translate
     * @param {userPref} userPref
     * @constructor
     */
    function AppletSelectorCtrl($scope, appletService, $translate, userPref) {
        var that = this;
        var excluded = that.excluded || [];
        that.options = _.extend({}, {viewAs: 'dropdown', showAll: false}, that.options);
        this.selectItem = selectItem;
        this.$onInit = onInit;

        function onInit() {
            $scope.$watch('$ctrl.appletCode', function (newVal, oldVal) {
                if (angular.isFunction(that.onChange())) {
                    var applet = _.find(that.applets, {name: newVal});
                    if (applet && angular.isFunction(that.onChange)) {
                        // Use onChange()(page) instead ot onChange(page)
                        // https://stackoverflow.com/a/26244600/1524900
                        that.onChange()(applet);
                    }
                }
            });

            appletService.findApplets().then(function (applets) {
                _.remove(applets, function (o) {
                    return excluded.indexOf(o.name) >= 0;
                });
                _.each(applets, function (applet) {
                    applet.setting = JSON.parse(applet.setting);
                });
                that.applets = _.orderBy(_.filter(applets, function (f) {
                    return that.options.showAll ? true : f.status === 'P';
                }), 'name');
                // that.applets = _.orderBy(applets, 'name');

                if (that.options.includeAllAndNull) {
                    that.applets.unshift({
                        name: '$NULL$',
                        title: $translate.instant('applet.selector.unsorted'),
                        setting: {icon: ''}
                    });
                    that.applets.unshift({
                        name: '',
                        title: $translate.instant('applet.selector.all'),
                        setting: {icon: ''}
                    });
                }

                if (!that.appletCode) {
                    that.appletCode = '';
                }
            }).catch(function (err) {
                throw err;
            });
        }

        function selectItem(applet) {
            that.appletCode = applet.name;
            that.selectedItem = applet.name;
        }
    }
})();