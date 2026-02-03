/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/17, created
 */
(function () {
        'use strict';
        angular.module('oplus.udp').service('appletRouter', ['$state', '$stateRegistry', appletRouter]);
        angular.module('oplus.udp').config(['$urlRouterProvider', '$uiRouterProvider',
            function ($urlRouterProvider, $uiRouterProvider) {
                var StickyStatesPlugin = window['@uirouter/sticky-states'].StickyStatesPlugin;
                $uiRouterProvider.plugin(StickyStatesPlugin);
            }]);

        /**
         * @ngdoc service
         * @name appletRouter
         * @description
         * Config state routers for window mode.
         * @param {$state} $state
         * @param {$stateRegistry} $stateRegistry
         */
        function appletRouter($state, $stateRegistry) {
            var useStickyForCodeDefinedApplet = true;
            var useStickyForUdpApplet = true;
            var modifiedStates = [];
            this.initRouters = initRouters;
            this.getAppletWindowUiView = getAppletWindowUiView;
            this.getAppletState = getAppletState;
            this.detectIfCurrentStateIsApplet = detectIfCurrentStateIsApplet;
            var useWindowUI = window.$oplus.appConfig.useWindowUI;

            /**
             * Detect if current state is applet mode.
             * @return {null|{appletCode: string, action: string}} Null if not in applet mode.
             */
            function detectIfCurrentStateIsApplet(stateName) {
                var APPLET_STATE_REGEX = /^app\.appletwindow_([^.]+)\.?(open_page|open_menu)?/;
                var matches = APPLET_STATE_REGEX.exec(stateName);
                if (matches) {
                    return {appletCode: matches[1], action: matches[2]};
                }
                return null;
            }

            function getAppletWindowUiView(appletCode) {
                return useWindowUI ? 'appletwindow_view_' + appletCode : 'applet_main_view';
            }

            function getAppletState(appletCode, action) {
                var state = useWindowUI ? 'app.appletwindow_' + appletCode : 'app.applet_view';
                if (action) {
                    state += '.' + action;
                }
                return state;
            }

            /**
             * Init state routers with applet definition.
             * @param {[AppletDefinition]} defs
             * @return {[string]} Applet codes whose router changed
             */
            function initRouters(defs) {
                var changes = [];
                if (!window.$oplus.appConfig.useWindowUI) {
                    return changes;
                }
                defs.forEach(function (def) {
                    var appletCode = initAppletRouterState(def);
                    if (appletCode) {
                        changes.push(appletCode);
                    }
                });
                return changes;

                /**
                 * Init or update dynamic routers.
                 * @param {AppletDefinition} appletDef
                 * @return {string|null} appletCode if router changed, null if not changed
                 */
                function initAppletRouterState(appletDef) {
                    if (!useWindowUI) {
                        return null;
                    }
                    if (!appletDef.entry.type && /^#\/|\./.test(appletDef.entry.value)) {
                        appletDef.entry.type = 'InternalState';
                    }
                    var appletCode = appletDef.code;
                    if (appletDef.entry.type === 'InternalState') {
                        updateStateForCodeDefinedApplet(appletCode, appletDef.entry.value);
                    } else if (appletDef.entry.type === 'ExternalState') {
                        //Todo Need a new routing method for ExternalState
                    } else {
                        createDynamicStateForUdpApplet(appletCode);
                    }
                    return appletCode;
                }
                function createDynamicStateForUdpApplet(appletCode) {
                    var allStates = [];
                    var windowState = {
                        // name: 'app.appletwindow_' + appletCode,
                        name: getAppletState(appletCode),
                        url: '/apw/' + appletCode,
                        // Add sticky to root state only
                        sticky: useStickyForUdpApplet,
                        onEnter: ['$rootScope', '$state', '$stateParams', '$timeout', 'appletRunman', function ($rootScope, $state, $stateParams, $timeout, appletRunman) {
                            // 针对 VAP 模块，如果是访问根路径，自动跳转到 CVE 列表
                            if (appletCode === 'vap') {
                                $timeout(function() {
                                    // 检查当前状态是否是 VAP 根状态（没有子状态）
                                    var currentName = $state.current.name;
                                    var vapRootState = getAppletState('vap');
                                    var vapCveListState = getAppletState('vap', 'cve_list');
                                    if (currentName === vapRootState) {
                                        $state.go(vapCveListState, $stateParams, { location: 'replace' });
                                    }
                                }, 0);
                            }
                            return appletRunman.openAppletWindow(appletCode);
                        }]
                        // resolve: {
                        //     _WaitWindowRendered_: ['$rootScope', '$stateParams', 'appletRunman', function ($rootScope, $stateParams, appletRunman) {
                        //         // console.log('WaitWindowRendered:OpenAppletWithDynamicState')
                        //         return appletRunman.openAppletWindow(appletCode);
                        //     }]
                        // }
                    };
                    allStates.push(windowState);
                    var pageState = {
                        // name: 'app.appletwindow_' + appletCode + '.open_page',
                        name: getAppletState(appletCode, 'open_page'),
                        url: '/page/:pageId?:p',
                        views: {},
                        resolve: {
                            pageId: ['$stateParams', function ($stateParams) {
                                return $stateParams.pageId;
                            }],
                            pageParams: [function () {
                                return {};
                            }]
                        }
                    }
                    pageState.views[getAppletWindowUiView(appletCode) + '@'] = {
                        templateUrl: 'app/modules/udp/page-view-applet.html',
                        controller: 'PageViewCtrl'
                    };
                    var menuState = _.extend({}, pageState, {
                        // name: 'app.appletwindow_' + appletCode + '.open_menu',
                        name: getAppletState(appletCode, 'open_menu'),
                        url: '/menu/:pageId?:p'
                    });
                    allStates.push(pageState);
                    allStates.push(menuState);

                    // VAP 模块自定义页面状态
                    if (appletCode === 'vap') {
                        var cveListState = {
                            name: getAppletState(appletCode, 'cve_list'),
                            url: '/cve/list',
                            views: {}
                        };
                        cveListState.views[getAppletWindowUiView(appletCode) + '@'] = {
                            template: '<vap-cve-list></vap-cve-list>'
                        };
                        allStates.push(cveListState);
                    }

                    allStates.forEach(function (state) {
                        if ($stateRegistry.get(state.name)) {
                            $stateRegistry.deregister(state.name);
                        }
                        $stateRegistry.register(state);
                    });
                }

                function updateStateForCodeDefinedApplet(appletCode, stateName) {
                    var oldStateDecl = $state.get(stateName);
                    if (!oldStateDecl) {
                        console.warn('updateStateForCodeDefinedApplet: Cannot find state of "%s" for applet "%s"', stateName, appletCode);
                    }
                    if (modifiedStates.indexOf(stateName) > -1) {
                        // console.log('...UpdateSystemDefinedState.OmitModifiedState: applet=' + appletCode + ', state=' + stateName);
                        return;
                    }
                    // console.log('appletRouter.updateStateForCodeDefinedApplet', {appletCode: appletCode, stateName: stateName});
                    modifiedStates.push(stateName);
                    var childrenStateDecls = _.filter($stateRegistry.get(), function (o) {
                        return o.name.indexOf(stateName + '.') === 0;
                    });
                    var newStateDecl = {
                        name: stateName,
                        url: oldStateDecl.url,
                        sticky: useStickyForCodeDefinedApplet,
                        views: {},
                        resolve: {
                            _WaitWindowRendered_: ['$rootScope', '$stateParams', 'appletRunman', function ($rootScope, $stateParams, appletRunman) {
                                // console.log('WaitWindowRendered:OpenAppletByPredefinedState')
                                return appletRunman.openAppletWindow(appletCode);
                            }]
                        }
                    };
                    var newViewName = 'modal_main_view_' + appletCode + '@';
                    newStateDecl.views[newViewName] = oldStateDecl.views['mainView'];
                    $stateRegistry.deregister(stateName);
                    [newStateDecl].concat(childrenStateDecls).forEach(function (o) {
                        $stateRegistry.register(o);
                    });
                }
            }
        }
    }
)();
