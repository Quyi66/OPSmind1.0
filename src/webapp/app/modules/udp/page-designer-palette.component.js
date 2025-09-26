/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/25/2017
 */
(function () {
    angular.module('oplus.udp').component('udpPageDesignerToolbox', {
        templateUrl: 'app/modules/udp/page-designer-palette.html',
        controller: ['$scope', '$element', '$timeout', 'userPref', 'widgetFactory', 'widgetDnd', '$translate',PageDesignerToolboxCtrl]
    });

    /**
     * @param $scope
     * @param $element
     * @param $timeout
     * @param userPref {userPref}
     * @param widgetDnd {widgetDnd}
     * @param widgetFactory {widgetFactory}
     * @constructor
     */
    function PageDesignerToolboxCtrl($scope, $element, $timeout, userPref, widgetFactory, widgetDnd,$translate) {
        var PREF_NAME = 'udp.pd.paletteTab';
        var that = this;
        this.activeTab = userPref.readItem(PREF_NAME, 0);
        this.widgetGroups = [
            {group: 'layout', icon: 'fa-object-ungroup', text: 'Layout'},
            {group: 'text', icon: 'fa-font', text: 'Text'},
            // fa-window-alt 在我们加载的样式集中不包含 regular 版本，使用 regular 可用的 fa-window-restore 以保证显示
            {group: 'control', icon: 'fa-window-restore', text: 'Control'},
            {group: 'data', icon: 'fa-analytics', text: 'Data'}
        ];
        this.widgetGroups.forEach(function (wg) {
            wg.text=$translate.instant('udp.designer.wg'+wg.group);
            wg.widgets = widgetFactory.getWidgetsByGroup(wg.group);
        });
        this.showTab = function (index) {
            userPref.saveItem(PREF_NAME, index);
            that.activeTab = index;
        };
        this.$postLink = function () {
            // https://stackoverflow.com/questions/15207788/calling-a-function-when-ng-repeat-has-finished
            $timeout(function () {
                widgetDnd.initPaletteDnd();
            }, 0);
        };

    }
})();
