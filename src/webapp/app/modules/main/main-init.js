/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/27, created
 */
(function () {
    'use strict';
    angular.module('oplus.main').service('mainInit',['messageService', 'tenantConfigInit', 'windowInit', 'i18nService', 'currentUser', 'tokenUrlHandler', mainInit]);

    /**
     * @ngdoc service
     * @name mainInit
     * @description
     * Main bootstrap to init the application.
     * @param {messageService} messageService
     * @param {tenantConfigInit} tenantConfigInit
     * @param {windowInit} windowInit
     * @param {i18nService} i18nService
     * @param {currentUser} currentUser
     * @param {tokenUrlHandler} tokenUrlHandler
     */
    function mainInit(messageService, tenantConfigInit, windowInit, i18nService, currentUser, tokenUrlHandler) {
        this.init = init;

        function init() {
            tenantConfigInit.initDynamicAppConfig().then(function () {
                var appConfig = window.$oplus.appConfig;
                console.log('%c[MainRunInit]%c AppConfig:', 'color:teal', '', {
                    profile: appConfig.profileId,
                    tenantCode: appConfig.tenantCode,
                    tenantId: appConfig.tenantId
                });
                currentUser.readLocalUserInfo();
                console.log('%c[MainRunInit]%c Local User: %s', 'color:teal', '', currentUser.basicUserInfo().loginId);

                // 检查并处理URL中的token参数
                return tokenUrlHandler.checkAndProcessToken();
            }).then(function (tokenResult) {
                console.log('%c[MainRunInit]%c Token处理结果:', 'color:teal', '', tokenResult);
                return i18nService.initLanguage();
            }).then(function (lang) {
                console.log('%c[MainRunInit]%c User Language: %s', 'color:teal', '', lang);
                return windowInit.initRun();
            }).then(function (changes) {
                console.log('%c[MainRunInit]%c Applet Routers: %d updated', 'color:teal', '', changes.length);
                console.log('%c[MainRunInit]%c COMPLETED', 'color:teal', '');
            }).catch(function (err) {
                var match = /^(TenantNotFound|TenantNotActivated):(.*)/.exec(err.message);
                if (match) {
                    var tenantCode = match[2].trim();
                    messageService.alertError('Error', 'Invalid tenant "' + tenantCode + '". Please check the URL is correct. ' + err.message);
                } else {
                    console.error(err);
                    throw err;
                }
            });
        }
    }
})();
