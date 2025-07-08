/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
 */

(function () {
    'use strict';
    /**
     * @ngdoc
     * @description
     * Parent controller for widget configuration modal dialog.
     * It will put `uwType`, `uwProps` in `$scope`
     *
     */
    angular.module('oplus.udp').controller('WidgetConfigCtrl', WidgetConfigCtrl);

    WidgetConfigCtrl.$inject = ['$scope', '$uibModalInstance', 'theWidget', 'widgetFactory'];


    /**
     *
     * @param $scope
     * @param $uibModalInstance
     * @param {widgetFactory} widgetFactory
     * @param {object} theWidget
     * @param {function=} theWidget.configController
     * @param {object} theWidget.uwProps
     * @param {string} theWidget.uwTypes
     * @constructor
     */
    function WidgetConfigCtrl($scope, $uibModalInstance, theWidget, widgetFactory) {
        var wcc;
        $scope.uwType = theWidget.uwType;
        $scope.uwProps = theWidget.uwProps || {};
        $scope.uwidgetConfigTemplate = getWidgetConfigTemplate($scope.uwType);
        upgradeProps($scope.uwProps);
        if (angular.isFunction(theWidget.configController)) {
            wcc = new theWidget.configController($scope, $scope.uwProps);
            wcc.afterInit && wcc.afterInit($scope.uwProps);
        }
        $scope.save = function () {
            if (wcc) {
                wcc.beforeSave && wcc.beforeSave($scope.uwProps);
            }
            $uibModalInstance.close($scope.uwProps);
        };

        $scope.cancel = function ($event) {
            $uibModalInstance.dismiss('cancel');
        };

        function getWidgetConfigTemplate(widgetType) {
            var def = widgetFactory.lookupWidgetDef(widgetType);
            if (def.configHtmlFile) {
                return def.configHtmlFile;
            }
            return 'app/modules/udp/widgets/' + widgetType + '/' + widgetType + '-widget-config.html';
        }

        function upgradeProps(props) {
            var display = props.display || {};
            if (display.cardTheme) {
                display.theme = display.cardTheme;
                delete display.cardTheme;
            }
        }
    }
})();
