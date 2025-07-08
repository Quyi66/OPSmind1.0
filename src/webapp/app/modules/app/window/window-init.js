/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/17, created
 */
(function () {
        'use strict';
        // var useDeferIntercept = !!window.$oplus.appConfig.useWindowUI;

        angular.module('oplus.udp').config(['$urlRouterProvider',
            function appletStates($urlRouterProvider) {
                // Bootstrap ui-router after applet defs async loaded in applet-init.run
                // https://ui-router.github.io/ng1/docs/latest/classes/url.urlrouterprovider.html
                // Call this method before UI-Router has bootstrapped. It will stop UI-Router from performing the initial url sync.
                // This can be useful to perform some asynchronous initialization before the router starts. Once the initialization is complete, call listen to tell UI-Router to start watching and synchronizing the URL.
                $urlRouterProvider.deferIntercept();
            }
        ]);

        angular.module('oplus.udp').service('windowInit', ['$q', '$state', '$rootScope', '$urlRouter', 'messageService', 'currentUser', 'appletRunman', 'appletRouter', 'appletService', 'appletRegistry', 'windowStateHandler', windowInit]);

        /**
         *
         * @param $q
         * @param $state
         * @param $rootScope
         * @param $urlRouter
         * @param {messageService} messageService
         * @param {currentUser} currentUser
         * @param appletRunman
         * @param appletRouter
         * @param appletService
         * @param appletRegistry
         * @param windowStateHandler
         */
        function windowInit($q, $state, $rootScope, $urlRouter, messageService, currentUser, appletRunman, appletRouter, appletService, appletRegistry, windowStateHandler) {
            this.initRun = initRun;
            this.initAppletDefsAndRouters = initAppletDefsAndRouters;
            $rootScope.$on('APPLET_CHANGED', function () {
                //console.log('windowInit: on APPLET_CHANGED');
                initAppletDefsAndRouters();
            });

            /**
             * This shall be called by `angular.module().run()`
             * @return {Promise<[string]>}
             */
            function initRun() {
                windowStateHandler.initStateListeners();
                // appletRouter.initRouters(appletRegistry.getCodeDefinedAppletDefs());
                return initAppletDefsAndRouters();
            }

            /**
             * Load and init applet definitions
             * @return {Promise<[string]>} Applet codes whose router changed
             */
            function initAppletDefsAndRouters() {
                if (!window.$oplus.appConfig.useWindowUI) {
                    $urlRouter.listen();
                    $urlRouter.sync();
                    return $q.resolve([]);
                }
                var d = $q.defer();
                // console.log('windowInit.initAppletDefsAndRouters: currentUser.isAuthenticated=' + currentUser.isAuthenticated);
                appletRegistry.loadAllAppletDefs(true).then(function (allDefs) {
                    // appletRegistry.initAppletDefs(defs);
                    // var allDefs = appletRegistry.getAppletDefs();
                    var changes = appletRouter.initRouters(allDefs);
                    // console.log('%c[WindowInit]%c Routers inited for %s applets: %s', 'color:teal', '', allDefs.length, _.map(allDefs, 'code').join(','));
                    // if (useDeferIntercept) {
                    $urlRouter.listen();
                    $urlRouter.sync();
                    // }
                    d.resolve(changes);
                }).catch(function (err) {
                    messageService.alertError('Error', 'Cannot init window: ' + err.message);
                    d.reject(err);
                })
                return d.promise;
            }
        }
    }
)();
