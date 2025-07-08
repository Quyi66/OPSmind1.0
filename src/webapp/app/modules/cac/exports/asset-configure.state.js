
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac3.export', {
                url: '/export',
                views: {
                    'cac3List': {
                        templateUrl: 'app/modules/cac/exports/asset-configure.html',
                        controller: 'CacAssetConfigureController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac3.export.list', {
                url: '/list',
                views: {
                    'configure-view': {
                        templateUrl: 'app/modules/cac/exports/asset-configure-export.html',
                        controller: 'CacAssetConfigureExportController',
                        controllerAs: 'vm'
                    }
                }
            })

        ;
    }])
    ;
})
();
