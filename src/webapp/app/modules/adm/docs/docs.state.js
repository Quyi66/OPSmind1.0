(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig ($stateProvider) {
        $stateProvider.state('docs', {
            parent: 'admin',
            url: '/docs',
            data: {
                pageTitle: 'global.menu.admin.apidocs'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/adm/docs/docs.html',
                    controller: 'DocsController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     return $translate.refresh();
                // }]
            }
        });
    }
})();
