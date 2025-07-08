/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/20, extracted from windowStateHandler
 */
(function () {
        'use strict';
        angular.module('oplus.udp').service('windowStateHandler', ['$q', '$rootScope', '$state', '$timeout', '$location', 'appletRunman', 'runningState', 'appletService', 'appletRegistry', 'messageService', 'appletHelper', windowStateHandler]);

        /**
         * @ngdoc service
         * @name windowStateHandler
         * @description
         * Management of running applet
         * @param {$q} $q
         * @param {$rootScope} $rootScope
         * @param {$state} $state
         * @param {$timeout} $timeout
         * @param {$location} $location
         * @param {appletRunman} appletRunman
         * @param {runningState} runningState
         * @param {appletService} appletService
         * @param {appletRegistry} appletRegistry
         * @param {messageService} messageService
         */
        function windowStateHandler($q, $rootScope, $state, $timeout, $location, appletRunman, runningState, appletService, appletRegistry, messageService, appletHelper) {
            this.initStateListeners = initStateListeners;

            function initStateListeners() {
                $rootScope.$on('$stateChangeError', function onErrorHandle(event, toState, toParams, fromState, fromParams, error) {
                    // var match = /^(TenantNotFound|TenantNotActivated):(.*)/.exec(error.detail.message);
                    // if (match) {
                    //     var tenantCode = match[2].trim();
                    //     messageService.alertError('Error', 'Invalid tenant "' + tenantCode + '". Please check the URL is correct. ' + error.detail.message);
                    // }
                });

                $rootScope.$on('$stateChangeSuccess', function onErrorHandle(event, toState, toParams, fromState, fromParams) {
                });
                // $rootScope.$on('$stateChangeError', function (event, unfoundState, fromState, fromParams, options) {
                //     console.error('$stateChangeError', {
                //         unfoundState: unfoundState,
                //         fromState: fromState,
                //         fromParams: fromParams,
                //         options: options
                //     });
                // });
                $rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl, newState, oldState) {
                    // console.log('$locationChangeSuccess: url=%s', newUrl);
                });
                $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                    console.error('$stateNotFound ', unfoundState);
                });
                $rootScope.$on('$stateChangeStart', function hideDesktop(event, toState, toParams, fromState, fromParams) {
                    // console.log('$stateChangeStart');
                    // Set value before state changed, i.e. not in `$stateChangeSuccess`
                    $rootScope.$global.hideDesktop = toState.data && toState.data.hideDesktop;
                });
                $rootScope.$on('$stateChangeSuccess', function handleWindowAndPageView(event, toState, toParams, fromState, fromParams) {
                    var stateName = toState.name;
                    var toApplet = detectToApplet();
                    runningState.activeAppletCode = toApplet ? toApplet.code : undefined;
                    if (toApplet) {
                        // console.log('%cToAppletState:%c [%s]-->%c[%s]', 'color:orange', '', fromState.name, 'color:orange', stateName);
                        // Use substring to remove #
                        var url = $state.href(stateName, toParams).substring(1);
                        // LEO@20220104: widget interaction may append arbitrary URL query parameters which is not defined in state
                        // `$state.href(...)` will ignore the query parameters.
                        // We use `runningState.urlByWidgetInteraction` to keep URL invoked by `widgetInteraction.openPageInSelf`
                        // NOTE: There is a minor issue: in widgetInteraction.changePageParam, it will only update URL search by $location.search(...)
                        // For example, from `/apw/acm/menu/JVKEFJ?citype=windows_server` to `/apw/acm/menu/JVKEFJ?citype=linux`
                        // In this case, the state does not change, so "$stateChangeSuccess" will not be called and the applet url will not change
                        if (runningState.urlByWidgetInteraction) {
                            url = runningState.urlByWidgetInteraction;
                            // Use once and remove it
                            runningState.urlByWidgetInteraction = undefined;
                        }
                        updateAppletRunningState(toApplet.code, {url: url});
                        if (toApplet.type !== 'ByPredefinedState') {
                            // Start new breadcrumbs if click a menu
                            if (toApplet.action === 'open_menu') {
                                runningState.emptyBreadcrumb(toApplet.code);
                            }
                            //Push a placeholder title
                            runningState.pushBreadcrumb(toApplet.code, {title: '', url: url});
                        }
                    } else {
                        // If this is a normal view, minimize all applet window
                        // console.log('%cToNoneAppletState:%c [%s]-->%c[%s]', 'color:red', '', fromState.name, 'color:red', stateName);
                        runningState.allRunningApplets().forEach(function (applet) {
                            appletHelper.minimizeAppletWindow(applet.code);
                        });
                    }
                    if ($rootScope.$global.isAdminUI) {
                        $rootScope.$global.hideMasterContent = false;
                    } else if (window.$oplus.appConfig.useWindowUI) {
                        $rootScope.$global.hideMasterContent = !!toApplet || toState.name === 'app.home';
                    } else {
                        $rootScope.$global.hideMasterContent = toState.name === 'app.home';
                        handleHistoryForSpaMode();
                    }

                    /**
                     * If current state is for applet window
                     * @return {null|{code: string, action: string, type: string}} null if not.
                     * `type` is applet state type
                     * `action` is either open_page or open_menu.
                     * `code` is applet code
                     */
                    function detectToApplet() {
                        // 1. Check if next state is dynamic applet window
                        var APPLET_STATE_DETECT_REGEX = /^app\.appletwindow_([^.]+)\.?(open_page|open_menu)?/;
                        var matches = APPLET_STATE_DETECT_REGEX.exec(stateName);
                        if (matches) {
                            return {
                                type: '__ByDynamicState',
                                code: matches[1],
                                action: matches[2]
                            };
                        }
                        // 2. Check if next state is predefined window state
                        // Check appletRegistry.allAppletDefs is not empty, in case of appletDefs are not loaded from remote, if we refresh URL directly in browser
                        var def = appletRegistry.findAppletDef(function (o) {
                            return o.entry.type === 'InternalState' && (stateName === o.entry.value || stateName.indexOf(o.entry.value + '.') === 0);
                        }, true);
                        if (def) {
                            return {
                                type: 'ByPredefinedState',
                                code: def.code
                            };
                        }
                        // 3. Check if next URL is applet window
                        //NOTE: Use state.href instead of $location.url() because at this time location url is not refreshed to new state
                        var m = /\/apw\/([^\/?#]+)/.exec($state.href(toState.name));
                        if (m) {
                            return {
                                type: '__UDP',
                                code: m[1]
                            };
                        }
                        return null;
                    }


                    /**
                     *
                     * @param appletCode
                     * @param {{url:string}} state
                     */
                    function updateAppletRunningState(appletCode, state) {
                        var applet = runningState.findRunningApplet(appletCode);
                        if (applet) {
                            applet.url = state.url;
                        }
                    }


                    //TODO: has problem, need recode!!!
                    function handleHistoryForSpaMode() {
                        // console.log('PageViewCtrl.state', $state.$current.name);
                        // Save history for page change in _self which is the same state
                        var toKeepHistory = false;
                        if ((fromState.name === 'app.applet_view' || fromState.name === 'app.applet_view.open_menu' || fromState.name === 'app.applet_view.open_page')
                            && toState.name === 'app.applet_view.open_page') {
                            toKeepHistory = true;
                        }
                        if (!toKeepHistory) {
                            runningState.emptyHistory();
                        }
                        // var statesToKeepHistory = ['app.udp_pageview', 'app.applet_view.open_page', '__app.applet_view'];
                        // if (statesToKeepHistory.indexOf(stateName) < 0) {
                        //     runningState.emptyHistory();
                        // }
                    }
                });
            }
        }
    }

)();
