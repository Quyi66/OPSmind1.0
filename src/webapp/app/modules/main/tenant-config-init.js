/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/23, moved from oplus-portal-web and massive code refactor
 */
(function () {
    angular.module('oplus.main').service('tenantConfigInit', ['$log', '$q', '$http', '$state', '$sessionStorage', 'currentUser', 'Auth', 'messageService', tenantConfigInit]);

    /**
     * @ngdoc service
     * @name tenantConfigInit
     * @description
     * Config application with distribution profile and tenant information.
     *
     * Logic:
     * 1. Read app config of dist env and merge with appConfig
     * 2. Parse app running mode from location URL. `/oplus/<tenantCode>` for normal mode, `/oplus-admin` for system admin mode
     * 3. If this is normal mode:
     *    1) Load all tenants info.
     *    2) If tenant not exists or not activated, throw error
     *    3) Otherwise, merge tenant config with appConfig
     * 4. Change browser title and icon with env config
     * @param {$log} $log
     * @param $q
     * @param $http
     * @param $state
     * @param $sessionStorage
     * @param {currentUser} currentUser
     * @param Auth
     * @param {messageService} messageService
     * @constructor
     */
    function tenantConfigInit($log, $q, $http, $state, $sessionStorage, currentUser, Auth, messageService) {
        var NORMAL_MODE = 'NORMAL';
        var SYSADMIN_MODE = 'SYSADMIN';
        this.initDynamicAppConfig = initDynamicAppConfig;

        /**
         * Load tenant config from DB and merge with appConfig.
         * @return {Promise}
         */
        function initDynamicAppConfig() {
            var d = $q.defer();
            var result = detectRunningMode();
            if (result.runningMode === NORMAL_MODE) {
                var tenantCode = result.tenantCode;
                mergeDynamicTenantConfig(window.$oplus.appConfig, tenantCode).then(function () {
                    // console.log('%c[AppConfig]%c app config ready %o', 'color:teal', '', window.$oplus.appConfig);
                    updateTitleAndLogo();
                    d.resolve();
                }).catch(function (err) {
                    d.reject(err);
                });
            } else if (result.runningMode === SYSADMIN_MODE) {
                updateTitleAndLogo();
                d.resolve();
            } else {
                d.reject(new Error('Invalid URL ' + window.location.href));
            }
            return d.promise;
        }

        /**
         * Load tenant config from DB and merge with app config object.
         * This is async call.
         * @param {{tenantId:string,tenantCode:string}} config Config to merge. Extra fields of `tenantId` and `tenantCode` will be added.
         * @param {string} tenantCode
         * @return {Promise<>}
         */
        function mergeDynamicTenantConfig(config, tenantCode) {
            var d = $q.defer();
            loadAllTenants().then(function (tenants) {
                var tenant = _.find(tenants, {code: tenantCode});
                if (!tenant) {
                    d.reject(new Error('TenantNotFound: ' + tenantCode));
                    return;
                }
                if (!tenant.activated) {
                    d.reject(new Error('TenantNotActivated: ' + tenantCode));
                    return;
                }
                config.tenantCode = tenant.code;
                config.tenantId = tenant.id;
                _.merge(config, tenant.config);
                d.resolve();
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        /**
         * set app name and app icon
         */
        function updateTitleAndLogo() {
            if (document.getElementById("oplusAppName")) {
                document.getElementById("oplusAppName").innerHTML = window.$oplus.appConfig.name;
                document.getElementById("oplusAppIcon").setAttribute('href', window.$oplus.appConfig.ui.logo);
            }
        }

        /**
         *
         * @return {{runningMode: string, tenantCode: string}}
         */
        function detectRunningMode() {
            var result = {runningMode: '', tenantCode: ''};
            var pathname = window.location.pathname;
            var match = pathname.match(/\/oplus\/(.*?)\//);
            if (match) {
                result.runningMode = NORMAL_MODE;
                result.tenantCode = match[1];
            } else {
                match = pathname.match(/\/oplus-admin/);
                if (match) {
                    result.runningMode = SYSADMIN_MODE;
                }
            }
            return result;
        }

        /**
         * Load all tenant infos from DB
         * @returns {Promise<[{id:string,accessToken:string,name:string,code:string,config:{},activated:boolean}]>}
         */
        function loadAllTenants() {
            var d = $q.defer();
            //TODO: change to restUtils
            $http.get(window.$oplus.appConfig.apiBaseUrls.portal + "/api/tenants/all").then(function (resp) {
                var dbTenants = resp.data;
                d.resolve(_.map(dbTenants, function (t) {
                    var parsed = {
                        id: t.id,
                        tenantId: t.id,
                        code: t.code,
                        activated: t.activated,
                        accessToken: t.accessToken,
                        config: {}
                    };
                    if (t.config) {
                        try {
                            parsed.config = JSON.parse(t.config);
                        } catch (e) {
                            console.error('Fail to parse tenant [' + t.code + '] config json: ' + t.config);
                        }
                    }
                    return parsed;
                }));
            }, function onError(resp) {
                d.reject(resp.data); //请求失败
            });
            return d.promise;
        }
    }
})();
