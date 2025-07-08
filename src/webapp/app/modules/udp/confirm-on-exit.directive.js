/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/21/2017
 */
(function () {
    'use strict';
    angular.module('oplus.udp').directive('udpConfirmOnExit', confirmOnExitDirective);
    confirmOnExitDirective.$inject = ['$q', '$transitions', '$state', 'pageService', 'messageService', '$translate'];

    /**
     * https://stackoverflow.com/questions/14852802/detect-unsaved-changes-and-alert-user-using-angularjs
     * @param $q
     * @param $transitions
     * @param $state
     * @param {pageService} pageService
     * @param messageService
     * @returns {{link: link}}
     */
    function confirmOnExitDirective($q, $transitions, $state, pageService, messageService, $translate) {
        var registered = false;
        return {
            link: function ($scope, elem, attrs) {
                // Event shall be registered only once
                if (!registered) {
                    registered = true;
                    onWindowUnload($state);
                    onStateChange($q, $transitions, pageService, messageService);
                }
            }
        };

        function onWindowUnload($state) {
            window.onbeforeunload = function () {
                var state = $state.current;
                var needCheckUnsavedChange = state.name === 'app.appman.page.edit' || state.name === 'app.appman.page.create';
                if (needCheckUnsavedChange) {
                    var hasUnsavedChange = pageService.checkUnsavedChange();
                    // console.log('hasUnsavedChange', hasUnsavedChange, $state);
                    if (hasUnsavedChange) {
                        return "The form is dirty, do you want to stay on the page?";
                    }
                }
            };
        }

        /**
         * Detect if there is unsaved change before user leaves page designer
         * @param $q
         * @param $transitions
         * @param {pageService} pageService
         * @param {messageService} messageService
         */
        function onStateChange($q, $transitions, pageService, messageService) {
            // https://ui-router.github.io/ng1/docs/latest/classes/transition.transition-1.html
            var STATE_EDIT_PAGE = 'app.appman.page.edit',
                STATE_NEW_PAGE = 'app.appman.page.create',
                STATE_CONFIG_WIDGET = 'app.appman.page.edit.configWidget';
            $transitions.onBefore({
                from: function needCheckUnsavedChange(state) {
                    // console.log(state);
                    return state.name === STATE_EDIT_PAGE || state.name === STATE_NEW_PAGE;
                }
            }, function callback(trans) {
                var to = trans.to().name;
                if (to === STATE_CONFIG_WIDGET || to === STATE_EDIT_PAGE) {
                    return true;
                }
                var ret = pageService.checkUnsavedChange();
                if (ret) {
                    var d = $q.defer();
                    messageService.confirm($translate.instant('udp.designer.actions.exit'), $translate.instant('udp.designer.actions.exit_confirm'), function () {
                        d.resolve(true);
                    }, function () {
                        d.resolve(false);
                    });
                    return d.promise;
                } else {
                    return true;
                }
            });
        }
    }
})();
