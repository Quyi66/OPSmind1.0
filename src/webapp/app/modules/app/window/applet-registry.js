/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/12, created
 */
(function () {
    'use strict';
    angular.module('oplus.udp').service('appletRegistry', ['$q', '$translate', '$state', 'restUtils', 'currentUser', 'themeService', 'appletRouter', appletRegistry]);


    /**
     * @ngdoc service
     * @name appletRegistry
     * @description
     * Contains all the registered applets
     * @param {$q} $q
     * @param {$translate} $translate
     * @param {$state} $state
     * @param {restUtils} restUtils
     * @param {currentUser} currentUser
     * @param {themeService} themeService
     * @param {appletRouter} appletRouter
     */
    function appletRegistry($q, $translate, $state, restUtils, currentUser, themeService, appletRouter) {
        /**
         * 应用入口点映射配置
         * 用于处理特殊的应用入口点重定向
         */
        var ENTRY_MAPPINGS = {
            'cac': {type: 'InternalState', value: 'app.cac'}
        };

        /**
         *
         * @type {[AppletDefinition]}
         */
        var codeDefinedApps = [];
        /**
         * @type {[AppletDefinition]}
         */
        var allAppletDefs;
        var that = this;
        var dbLoaded = false;
        this.CODE_DEFINED_APPLET_CODE_PREFIX = '__';
        this.findAppletDef = findAppletDef;
        this.loadAllAppletDefs = loadAllAppletDefs;
        this.getAppletDefs = getAppletDefs;
        this.getDesktopApplets = getDesktopApplets;
        this.getDockApplets = getDockApplets;
        initCodeDefinedApplets();

        /**
         * Get applets shown on desktop
         * @return {[AppletDefinition]}
         */
        function getDesktopApplets() {
            return _.sortBy(_.filter(getAppletDefs(), function (def) {
                return def.showIn && angular.isNumber(def.showIn.desktop);
            }), [function (o) {
                return o.showIn.desktop;
            }]);
        }

        /**
         * Get applets shown on dock
         * @return {[AppletDefinition]}
         */
        function getDockApplets() {
            return _.sortBy(_.filter(getAppletDefs(), function (def) {
                return def.showIn && angular.isNumber(def.showIn.dock);
            }), [function (o) {
                return o.showIn.dock;
            }]);
        }

        function getAppletDefs() {
            return allAppletDefs;
        }

        /**
         * Find all applet definitions including code defined and db defined
         * If user is not authenticated, only code defined loaded.
         * @param {boolean=} forceReload
         * @param {Object=tag} tag
         * @return {Promise<[AppletDefinition]>}
         */
        function loadAllAppletDefs(forceReload, tag) {
            if (dbLoaded && !forceReload) {
                return $q.when(allAppletDefs);
            }
            var query = tag ? _.map(tag, "id").join(",") : "";
            var d = $q.defer();
            var result = [];
            var toLoadDb = false;
            var promise;
            if (currentUser.isAuthenticated) {
                toLoadDb = true;
                promise = restUtils.callApi('udp', 'GET', '/api/udp/applets?isPaging=true', null, {query: query});
            } else {
                console.warn('appletRegistry.loadAllAppletDefs: User has not signed in');
                promise = $q.when([]);
            }
            promise.then(function (records) {
                dbLoaded = toLoadDb;
                _.forEach(records, function (rec) {
                    result.push(dbRecordToAppletDefinition(rec));
                });
                if (toLoadDb) {
                    console.log('appletRegistry.loadAllAppletDefs: %d applet loaded from DB', records.length);
                }
                allAppletDefs = [].concat(codeDefinedApps).concat(result);
                resolveAppState(allAppletDefs);
                d.resolve(allAppletDefs);
            }).catch(function (e) {
                d.reject(e);
            });
            return d.promise;

            function resolveAppState(defs) {
                // console.log('appletRegistry.resolveAppState: %d applets', defs.length);
                defs.forEach(function (def) {
                    if (def.entry.type === 'InternalState' || (!def.entry.type && /^#\/|\./.test(def.entry.value))) {
                        def._resolvedState = def.entry.value;
                    } else if (def.entry.type === 'ExternalState' || (!def.entry.type && /^#\/|\./.test(def.entry.value))) {
                        //def._resolvedState = window.$oplus.appConfig.useWindowUI ? 'app.appletwindow_' + def.code : 'app.applet_view';
                        //def._resolvedState = appletRouter.getAppletState(def.code);
                        //Todo external state router config
                    } else {
                        // def._resolvedState = window.$oplus.appConfig.useWindowUI ? 'app.appletwindow_' + def.code : 'app.applet_view';
                        def._resolvedState = appletRouter.getAppletState(def.code);
                    }
                });
            }

            function dbRecordToAppletDefinition(rec) {
                var setting = JSON.parse(rec.setting);
                var def = {
                    id: rec.id,
                    code: rec.code || rec.name,
                    title: rec.title,
                    type: rec.type,
                    status: rec.status,
                    version: rec.version,
                    order: rec.order,
                    icon: setting.icon,
                    color: setting.color,
                    windowSize: setting.windowSize,
                    entry: {type: rec.entryType, value: rec.entry, params: rec.entryParams},
                };

                // 检查是否有配置的入口点映射
                if (ENTRY_MAPPINGS[def.code]) {
                    def.entry = ENTRY_MAPPINGS[def.code];
                } else if ((!def.entry.type && /^#\/|\app./.test(def.entry.value))) {
                    def.entry = {type: 'InternalState', value: def.entry.value};
                } else if ((!def.entry.type && /^http[s]?:\/\//.test(def.entry.value))) {
                    def.entry = {type: 'ExternalState', value: def.entry.value, params: def.entry.params, target: setting.target || undefined};
                }
                if (def.code.toString().indexOf('ipam') >= 0) {
                    def.entry = {type: 'ExternalState', value: rec.entry, params: rec.entryParams};
                }
                return def;
            }
        }


        /**
         * Init code defined applets from router states
         */
        function initCodeDefinedApplets() {
            var allStates = $state.get();
            var appletStates = _.filter(allStates, function (o) {
                return !!o.useAsApplet;
            });
            var defs = _.map(appletStates, function (state) {
                var def = state.useAsApplet;
                return {
                    code: that.CODE_DEFINED_APPLET_CODE_PREFIX + def.code,
                    title: $translate.instant(def.title) || def.code,
                    icon: def.icon,
                    color: def.color,
                    type: def.type || 'Application',
                    sourceType: 'CodeDefined',
                    showIn: def.showIn,
                    windowSize: def.windowSize,
                    entry: {type: 'InternalState', value: state.name},
                    tag: "system"
                };
            });
            defs.forEach(function (def) {
                defineApplet(def);
            });
            //console.log('%cappletRegistry.initCodeDefinedApplets: %d', 'color:teal', defs.length);
        }

        /**
         *
         * @param {AppletDefinition} appDef
         */
        function defineApplet(appDef) {
            if (!appDef.code) {
                throw new TypeError('Applet code is required');
            }
            if (_.find(codeDefinedApps, {code: appDef.code})) {
                return;
            }
            codeDefinedApps.push(appDef);
        }

        /**
         *
         * @param condition
         * @param {boolean=} ignoreWarning
         * @return {AppletDefinition}
         */
        function findAppletDef(condition, ignoreWarning) {
            var predicate;
            if (angular.isString(condition)) {
                predicate = {code: condition};
            } else {
                predicate = condition;
            }
            // if (!code) return undefined;
            // Find from builtin first in case of remote applet defs not loaded
            // var result = _.find(codeDefinedApps, predicate);
            var result = _.find(allAppletDefs, predicate);
            // if (!result) {
            //     result = _.find(that.allAppletDefs, predicate);
            // }
            if (!result && !ignoreWarning) {
                console.warn('Cannot find applet definition:', {
                    condition: condition,
                    allAppletDefs: allAppletDefs
                });
            }
            return result;
        }
    }

    /**
     * Reference of core attributes for applet definition
     * @constructor
     */
    function AppletDefinition() {
        this.code = '';
        this.title = '';
        /**
         * It supports:
         * - `Application`:
         * - `Library`:
         * @type {string}
         */
        this.type = '';
        /**
         * Two values:
         * - `CodeDefined`: applet is statically defined by code
         * - `DbDefined`: applet is dynamically defined in database
         * @type {string}
         */
        this.sourceType = '';
        this.icon = '';
        this.color = '';
        this.showIn = {desktop: 0, dock: 0};
        /**
         * Entry point of the applet.
         *
         * `type` supports:
         * - `state`: entry value is a ui-router state name, e.g. `app.gfs`
         * - `udp`: entry value is a udp page
         * @type {{type: string, value: string}}
         */
        this.entry = {type: '', value: '', params: ''}

        /**
         * Resolved router state for entry
         * @type {string}
         */
        this._resolvedState = '';
        this.windowSize = '';

    }

    /**
     *
     * @constructor
     */
    function AppletDisplay() {
        this.code = '';
        this.title = '';
        this.icon = '';
        this.color = '';
    }
})();
