"use strict";
/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/31/2017
 */
(function () {
    angular.module('oplus.udp').service('widgetConfigHelper', widgetConfigHelper);

    widgetConfigHelper.$inject = ['widgetFactory', 'widgetUiHelper', 'pageDataUtil', '$uibModal', '$compile', '$state'];

    /**
     *
     * @ngdoc
     * @name widgetConfigHelper
     * @param widgetFactory {widgetFactory}
     * @param widgetUiHelper {widgetUiHelper}
     * @param {pageDataUtil} pageDataUtil
     * @param $uibModal
     * @param $compile
     * @param $state
     */
    function widgetConfigHelper(widgetFactory, widgetUiHelper, pageDataUtil, $uibModal, $compile, $state) {
        this.showConfigModal = showConfigModal;

        /**
         * Show widget config modal.
         * @param elem {angular.element} Widget element
         * @return {promise|null} If current state is page edit, i.e. click config button from page designer, it returns null.
         * If this is invoked directly from URL, it returns a promise of uibModal.result null if current state is page edit, promise if direct invocation from URL
         */
        function showConfigModal(elem, $scope) {
            if ($state.current.name === 'app.appman.page.edit' && elem.attr('id')) {
                // If this is in edit page and clicks config button
                $state.go('app.appman.page.edit.configWidget', {widgetId: elem.attr('id')});
                return null;
            }
            // Get uwidget itself
            var uwType = elem.attr('uw-type');
            var theWidget = {uwType: uwType, uwProps: {}, element: elem};
            try {
                theWidget.uwProps = JSON.parse(elem.attr('uw-props') || '{}');
            } catch (e) {
                throw new Error('Cannot parse widget attribute uw-props ' + elem.attr('uw-props)'));
            }
            // console.log('showConfigModal: uwProps=%o',theWidget.uwProps);
            var widgetDef = widgetFactory.lookupWidgetDef(uwType);
            var configController = 'WidgetConfigCtrl';
            if (angular.isFunction(widgetDef.configController)) {
                theWidget.configController = widgetDef.configController;
            } else if (angular.isDefined(widgetDef.configController)) {
                configController = widgetDef.configController;
            }
            // Show modal dialog
            // The open method returns a modal instance, an object with the following properties:
            // close(result) (Type: function) - Can be used to close a modal, passing a result.
            // dismiss(reason) (Type: function) - Can be used to dismiss a modal, passing a reason.
            // result (Type: promise) - Is resolved when a modal is closed and rejected when a modal is dismissed.
            //   LEO@20200405: result.then: function (onFulfilled, onRejected, progressBack)
            //                 it returns a promise as well
            // opened (Type: promise) - Is resolved when a modal gets opened after downloading content's template and resolving all variables.
            // closed (Type: promise) - Is resolved when a modal is closed and the animation completes.
            // rendered (Type: promise) - Is resolved when a modal is rendered.
            var instance = $uibModal.open({
                templateUrl: 'app/modules/udp/widgets/widget-config-modal.html',
                controller: configController,
                backdrop: 'static',//disables modal closing by click on the backdrop
                windowClass: 'udp-scrollable-modal udp-widget-config-modal',
                resolve: {
                    theWidget: function () {
                        return theWidget;
                    }
                },
                size: 'lg'
            });
            instance.rendered.then(function () {
                $('.modal-dialog').eq(0)
                    .draggable({handle: '.modal-header:eq(0)'})
                    .resizable({
                        minHeight: 400,
                        minWidth: 740
                    });
            });
            // result is a promise, result.then is promise as well
            return instance.result.then(function confirm(newProps) {
                var props = newProps || {}, display = props.display || {};
                elem.attr('uw-props', JSON.stringify(props));
                var uwType = elem.attr('uw-type');
                var widgetScope = elem.scope();
                var pageScope = pageDataUtil.findPageScope(widgetScope);
                if (widgetUiHelper.isLayoutWidget(uwType)) {
                    // Cannot re-compile layout widget because there is ng-transclude in the code which will cause ngTransclude:orphan error
                    // pageScope = pageDataUtil.findPageScope($scope);
                    widgetUiHelper.updateLayoutWidgetElementAttrs(uwType, props, elem, pageScope);
                } else {
                    // Redraw widget by re-compile
                    // Do not use incoming parameter `$scope` because it may come from modal and will be destroyed
                    // which will cause the loss of scope data
                    // Do not use elem.scope().$parent either, which will be lost when copying widget (I don't investigate why)
                    // pageScope = pageDataUtil.findPageScope($scope);
                    // scope = elem.scope().$parent;
                    // console.log('recompile_with_scope', $scope, pageScope);
                    widgetUiHelper.applyCustomWidgetCss(elem, display.css);
                    // $compile(elem)(pageScope);
                    //20210416: remove widget content first
                    $compile(elem.empty())(pageScope);
                    // Following works too
                    // elem.empty().removeAttr('class');
                    // var html = elem.prop('outerHTML');
                    // elem.replaceWith($compile(html)(pageScope));
                }
            }, function cancel() {
                // console.info('Config modal cancelled');
            });
        }
    }
})();
