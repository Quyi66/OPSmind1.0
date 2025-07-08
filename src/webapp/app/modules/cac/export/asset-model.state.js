
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac.export', {
                url: '/export',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/export/asset-model.html',
                        controller: 'CacAssetModelController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac.export.list', {
                url: '/list',
                views: {
                    'config-view': {
                        templateUrl: 'app/modules/cac/export/asset-model-export.html',
                        controller: 'CacAssetModelExportController',
                        controllerAs: 'vm'
                    }
                }
            })

        ;
    }])
    ;
})
();
