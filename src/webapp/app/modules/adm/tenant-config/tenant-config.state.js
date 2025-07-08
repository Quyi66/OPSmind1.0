/**
 * @author yangbin
 */
(function () {
    'use strict';
    angular.module('oplus.adm').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('tenantConfig', {
                parent: 'admin',
                url: '/tenant-config',
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/tenant-config/tenant-config-index.html',
                        controller: 'AdmTenantConfigCtrl',
                        controllerAs: 'admTenantConfigVm'
                    }
                }
            })
            .state('tenantConfig.tenant_import', {
                url:'/tenant-config/import',
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/tenant-config/tenant-config-import.html',
                        controller: 'TenantConfigImportCtrl',
                        controllerAs: '$import'
                    }
                }
            });
    }]);
})();
