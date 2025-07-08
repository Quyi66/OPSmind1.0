(function () {
    'use strict';
    angular.module('oplus.main')
        .provider('tenantUtil', tenantUtil);

    tenantUtil.$inject = [];

    /**
     * @ngdoc provider
     * @name tenantUtilProvider
     */
    function tenantUtil() {

        /**
         * 是否是多租户环境
         * @returns {boolean}
         */
        function useMultiTenantEnv() {
            return window.$oplus.appConfig.useMultiTenant;
        }

        /**
         * 是否是多租户系统管理界面
         *
         * @returns {boolean}
         */
        function isTenantAdminUI() {
            return this.useMultiTenantEnv() && !!window.location.href.match(/\/oplus-admin\//);
        }

        /**
         * 当前环境是否是 oplus-admin
         * 非多租户可能部署在更目录下
         * 不区分是否是多租户模式
         *
         * @returns {boolean}
         */
        function isOplusAdminUI() {
            return !!window.location.href.match(/\/oplus-admin\//) || !window.location.href.match(/\/oplus\//);
        }

        var service = {
            useMultiTenantEnv: useMultiTenantEnv,
            isTenantAdminUI: isTenantAdminUI,
            isOplusAdminUI: isOplusAdminUI,
        };

        this.useMultiTenantEnv = useMultiTenantEnv;
        this.isTenantAdminUI = isTenantAdminUI;
        this.isOplusAdminUI = isOplusAdminUI;

        this.$get = function () {
            return service;
        }
    }
})();
