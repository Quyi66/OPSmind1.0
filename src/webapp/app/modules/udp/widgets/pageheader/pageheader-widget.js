/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/10/02, created
 */
(function () {
    'use strict';
    angular.module('oplus.udp').run(['$state', '$location', 'widgetFactory', 'devel', 'runningState', 'widgetUiHelper', '$translate', 'appletRouter', pageheaderWidget]);

    /**
     *
     * @param $state
     * @param $location
     * @param {widgetFactory} widgetFactory
     * @param {devel} devel
     * @param {runningState} runningState
     * @param {widgetUiHelper} widgetUiHelper
     * @param {$translate} $translate
     * @param {appletRouter} appletRouter
     */
    function pageheaderWidget($state, $location, widgetFactory, devel, runningState, widgetUiHelper, $translate, appletRouter) {
        widgetFactory.defineWidget({
            type: 'pageheader',
            name: $translate.instant('udp.w.pageheader.name'),
            group: 'layout',
            // tag: 'dev',
            // resizable: 'h',
            widthMode: 'wm-full',
            configController: PageheaderWidgetConfigCtrl,
            controlRenderer: {
                getTemplateForCompilation: getTemplateForCompilation,
                onInitControl: onInitControl
            },
            cleanupForSave: cleanupForSave
        });

        /**
         *
         * @param $scope
         * @param props
         * @constructor
         */
        function PageheaderWidgetConfigCtrl($scope, props) {
        }

        function getTemplateForCompilation(props) {
            props.display = props.display || {};
            var html =
                '<nav class="op-pageheader navbar navbar-expand">' +
                '<div class="navbar-nav">' +
                '<div><ol class="breadcrumb op-pageheader-breadcrumb">' +
                '<li ng-if="phvm.showBreadcrumb" class="breadcrumb-item" ng-repeat="item in phvm.breadcrumbs track by $index">' +
                '<a href="#{{item.url}}">{{item.title}}</a>' +
                '</li>' +
                '<li class="breadcrumb-item active opx-navbar-title">{{phvm.title}}</li>' +
                '</ol>' +
                // '<div style="font-size:125%;font-weight: bold;" class="op-pageheader-title">{{phvm.title}}</div>' +
                '</div>' +
                '</div>' +
                '<div class="form-inline ms-auto uw-include-container op-pageheader-actions" data-uw-placeholder="actions">' +
                '</div> ' +
                '</nav>';
            return html;
        }

        function cleanupForSave(element) {
            element.find('.uw-include-placeholder').remove();
            var kept = element.find('.uw-include-container').detach();
            element.empty().append(kept);
        }

        function onInitControl(scope, element, props) {
            // If in applet window?
            element.parent('.js-page-content').addClass('op-fixed-pageheader opx-layout-vflex');
            var vm = scope.phvm = {};
            vm.showBreadcrumb = true;
            vm.breadcrumbs = [];
            var isEditMode = widgetUiHelper.isEditMode();
            var history = runningState.allHistory();
            // console.log('history',history);
            if (window.$oplus.appConfig.useWindowUI) {
                var state = appletRouter.detectIfCurrentStateIsApplet($state.current.name);
                if (state) {
                    history = runningState.getBreadcrumbs(state.appletCode);
                    // console.log('getBreadcrumbs',history);
                }
            }
            if (isEditMode) {
                vm.breadcrumbs.push({url: '', title: 'Level 1'});
                vm.breadcrumbs.push({url: '', title: 'Level 2'});
                vm.title = $translate.instant('udp.w.pageheader.edit_header');
                widgetUiHelper.observeEmptyPlaceholder(scope, element.find('.uw-include-container'), {
                    css: 'uw-include-placeholder',
                    text: 'Place actions here'
                });
            } else {
                for (var i = 0; i < history.length; i++) {
                    if (i < history.length - 1) {
                        vm.breadcrumbs.push(history[i]);
                    } else {
                        vm.title = history[i].title;
                    }
                }
                hideHeaderInModalAndChildPage();
            }

            function hideHeaderInModalAndChildPage() {
                var modal = element.closest('.modal');
                var needRemoveEmpty = false;
                if ((modal.length > 0 && !modal.hasClass('op-applet-window'))
                    || element.closest('.udp-openpage-container').length > 0) {
                    needRemoveEmpty = true;
                }
                if (needRemoveEmpty) {
                    if (element.find('.uw-include-container.op-pageheader-actions').children().length === 0) {
                        element.remove();
                    }
                }
            }
        }
    }
})();