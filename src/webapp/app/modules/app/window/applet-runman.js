/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/11, created
 */
(function () {
    'use strict';
    angular.module('oplus.udp').service('appletRunman',
        ['$q', '$rootScope', '$translate', '$state', '$timeout', '$location', 'modalHelper', 'messageService', 'runningState', 'appletService', 'appletHelper', 'appletRegistry', 'userPref', 'appletRouter', 'currentUser', 'appletSecurity', 'widgetInteraction', appletRunman]);

    /**
     * @ngdoc service
     * @name appletRunman
     * @description
     * Management of running applet
     * @param {$q} $q
     * @param {$rootScope} $rootScope
     * @param $translate
     * @param {$state} $state
     * @param {$timeout} $timeout
     * @param {$location} $location
     * @param {modalHelper} modalHelper
     * @param {messageService} messageService
     * @param {runningState} runningState
     * @param {appletService} appletService
     * @param {appletRegistry} appletRegistry
     * @param {userPref} userPref
     * @param {appletRouter} appletRouter
     * @param {currentUser} currentUser
     * @param {appletSecurity} appletSecurity
     */
    function appletRunman($q, $rootScope, $translate, $state, $timeout, $location, modalHelper, messageService, runningState, appletService, appletHelper, appletRegistry, userPref, appletRouter, currentUser, appletSecurity, widgetInteraction) {
        var that = this;
        var APPLET_WINDOW_CSS = 'op-applet-window';
        var APPLET_WINDOW_ID_PREFIX = 'js-applet-window-';
        var USER_PREF_WINDOW_LAYOUTS = 'windowLayouts';

        this.prepareAppletWindowContent = prepareAppletWindowContent;
        // this.maximizeAppletWindow = maximizeAppletWindow;
        this.openApplet = openApplet;
        this.openAppletWindow = openAppletWindow;

        /**
         * Open an applet by code.
         * If applet is running, activate it.
         *
         * @param {string} appletCode
         */
        function openApplet(appletCode) {
            if (runningState.findRunningApplet(appletCode)) {
                appletHelper.activateRunningApplet(appletCode, true);
                return;
            }
            var appletDef = appletRegistry.findAppletDef(appletCode);
            if (appletDef.entry.type === 'InternalState') {
                $state.go(appletDef.entry.value);
            } else if (appletDef.entry.type === 'ExternalState') {
                //$state.go(appletRouter.getAppletState(appletCode), {appletCode: appletCode});
                if (appletDef.entry.value) {
                    widgetInteraction.openUrlLink({
                        url: appletDef.entry.value,
                        target: appletDef.entry.target || '_blank'
                    }, appletDef.entry.params, {applet: appletDef})
                } else {
                    var msg = 'Entry value is not specified for this applet ' + appletDef.code;
                    messageService.alertError('Error', msg);
                }
            } else {
                $state.go(appletRouter.getAppletState(appletCode), {appletCode: appletCode});
            }
            /*else if (window.$oplus.appConfig.useWindowUI) {
                $state.go('app.appletwindow_' + appletCode);
            } else {
                $state.go('app.applet_view', {appletCode: appletCode});
            }*/
        }

        /**
         *
         * @param appletCode
         * @return {Promise<[string]>}
         */
        function getAppletRoles(appletCode) {
            var d = $q.defer();
            d.resolve([]);
            return d.promise;
        }

        /**
         * Read applet definition and prepare its attributes to display on window.
         * @param {string} appletCode
         * @return {Promise<AppletDefinition>}
         */
        function prepareAppletWindowContent(appletCode) {
            var appletDef = appletRegistry.findAppletDef(appletCode);
            var promise;
            if (appletDef && appletDef.sourceType === 'CodeDefined') {
                promise = $q.when(appletDef);
            } else {
                promise = findDbDefinedApplet();
            }
            var d = $q.defer();
            var result;
            promise.then(function (applet) {
                result = applet;
                return appletService.getMyRolesInApplet(appletCode);
            }).then(function (roles) {
                currentUser.setAppletRoles(appletCode, roles);
                d.resolve(result);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;

            function findDbDefinedApplet() {
                var d = $q.defer();
                appletService.findAppletByCode(appletCode).then(function (applet) {
                    // console.log('appletRunman.prepareAppletWindowContent: applet=%o',angular.copy(applet));
                    if (!applet) {
                        d.reject(new Error('Cannot find applet ' + appletCode));
                        return;
                    }

                    applet = angular.merge({setting: {nav: {}}}, applet);
                    applet.icon = applet.setting.icon;
                    applet.code = applet.code || applet.name;
                    applet.windowSize = applet.setting.windowSize;
                    applet.entry = parseEntry(applet);
                    // applet.entryType = appletService.getEntryTypeFromEntry(applet.entry);
                    if (!applet.entry) {
                        var msg = 'Entry is not specified for this applet ' + applet.code;
                        messageService.alertError('Error', msg);
                        return d.reject(new Error(msg));
                    }

                    _.merge(applet, parseNav(applet.setting.nav));
                    d.resolve(applet);
                }).catch(function (err) {
                    d.reject(err);
                });
                return d.promise;
            }

            /**
             *
             * @param {{entry:{type:string,value:string}|string,entryParams:string}} applet
             * @return {{type:string,value:string,params:object}}
             */
            function parseEntry(applet) {
                var result;
                var entry = applet.entry;
                if (angular.isObject(entry)) {
                    result = {type: entry.type, value: entry.value};
                } else if (angular.isString(entry)) {
                    result = {};
                    if (entry.indexOf('#') === 0) {
                        console.warn('TODO: hardcode change to app.cac');
                        result.value = 'app.cac';
                        result.type = 'InternalState';
                    } else {
                        result.type = entry.indexOf('.') > 0 ? 'InternalState' : 'udp';
                        result.value = entry;
                    }
                }
                if (result && applet.entryParams) {
                    result.params = JSON.parse(applet.entryParams);
                }
                delete applet.entryParams;
                return result;
            }

            /**
             *
             * @param navSetting
             * @return {{navCss: string, navPos: string, theme: string, showNavOnHome: boolean, showNav: boolean}}
             */
            function parseNav(navSetting) {
                var applet = {navCss: '', theme: '', navPos: '', showNav: false, showNavOnHome: false};
                var hasItems = navSetting.items && navSetting.items.length > 0;
                // if (window.$oplus.appConfig.useWindowUI) {
                //     applet.navCss = 'bg-light';
                // } else if (navSetting.theme) {
                applet.navCss = 'bg-' + navSetting.theme;
                applet.theme = navSetting.theme || 'light';
                // }
                applet.navPos = navSetting.position === 'left' ? 'left' : 'top';
                if (hasItems) {
                    if (navSetting.hide !== true) {
                        applet.showNav = true;
                    }
                    if (navSetting.hideOnHome !== true) {
                        applet.showNavOnHome = true;
                    }
                }
                return applet;
            }
        }

        /**
         * Activate an existing or open a new applet window.
         * If an applet is not opened, open it.
         * If an applet is opened, activate it and put to front.
         * @param appletCode
         * @return {Promise} When window is rendered
         */
        function openAppletWindow(appletCode) {
            // console.log('openAppletWindow...', appletCode);
            if (runningState.findRunningApplet(appletCode)) {
                appletHelper.activateRunningApplet(appletCode, true);
                return $q.when(null);
            }
            // return doOpenAppletWindow(appletCode);

            // function doOpenAppletWindow(appletCode) {
            var d = $q.defer();
            var modalInstance;
            prepareAppletWindowContent(appletCode).then(function (applet) {
                if (applet.sourceType !== 'CodeDefined' && !appletSecurity.canUseApplet(appletCode)) {
                    applet.launchError = $translate.instant('common.uaa.no_permission');
                }
                var config = {
                    modaless: true,
                    windowClass: APPLET_WINDOW_CSS,
                    templateUrl: 'app/modules/app/window/applet-window-modal.html',
                    resolve: {
                        theApplet: function () {
                            return applet;
                        }
                    },
                    controller: 'AppletModalCtrl',
                    controllerAs: '$ctrl'
                };
                
                modalInstance = modalHelper.openModal(config, appletHelper.buildOptions(applet));
                modalInstance.opened.then(function () {
                    appletHelper.appletModalOpened(appletCode, true);
                });
                modalInstance.rendered.then(function () {
                    appletHelper.appletModalRendered(appletCode);
                    d.resolve();
                });
            }).catch(function (err) {
                console.error(err);
                d.reject(err);
            });

            return d.promise;


            function restoreWindowLayout(appletCode) {
                var layouts = userPref.readItem(USER_PREF_WINDOW_LAYOUTS, {});
                var layout = layouts[appletCode];
                var modal = appletHelper.findAppletModal(appletCode);
                if (!modal || !layout) return;
                modal.css(layout);
            }

            function arrangeWindowPosition(modalElem) {
                var positions = [];
                $('.' + APPLET_WINDOW_CSS).each(function () {
                    var elem = $(this);
                    if (!elem.is(modalElem)) {
                        var pos = elem.position();
                        positions.push(pos);
                    }
                });
                var self = modalElem.position();
                if (positions.length > 0) {
                    var max = _.maxBy(positions, function (o) {
                        return o.left;
                    });
                    // console.log('max', max);
                    if (max) {
                        modalElem.css({
                            left: max.left + 40,
                            top: max.top + 40
                        });
                    }
                }
                // }
            }
        }



    }
    
    angular.module('oplus.udp').controller('AppletModalCtrl',AppletModalCtrl);
    
    AppletModalCtrl.$inject = ['theApplet', 'runningState', 'modalHelper', 'appletHelper', '$uibModalInstance', '$sce'];
    
    /**
     *
     * @param {{code:string,title:string,icon:string,color:string,theme:string,entry:{}}} theApplet
     * @constructor
     */
    function AppletModalCtrl(theApplet, runningState, modalHelper, appletHelper, $uibModalInstance, $sce) {
        var that = this;
        // var useWindowUI = window.$oplus.appConfig.useWindowUI;
        this.applet = theApplet;
        this.minimizeWindow = minimizeWindow;
        this.restoreOrMaxWindow = restoreOrMaxWindow;
        this.closeWindow = closeWindow;
        this.$onInit = onInit;

        function onInit() {
            runningState.addAppletToRunning(theApplet);

            if (that.applet && that.applet.entry.type === 'ExternalState') {
                that.url = $sce.trustAsResourceUrl(that.applet.entry.value);
            }
        }

        function restoreOrMaxWindow() {
            modalHelper.maximizeOrRestoreModal(appletHelper.findAppletModal(theApplet.code));
        }

        function closeWindow($event) {
            appletHelper.saveWindowLayout(that.applet.code);
            $uibModalInstance.dismiss();
            appletHelper.closeAppletWindow(that.applet.code);
            // Stop propagation to try activating window
            $event.stopPropagation();
        }

        function minimizeWindow($event) {
            appletHelper.minimizeAppletWindow(that.applet.code);
            $event.stopPropagation();
        }
    }
}
)();
