(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('logs', {
            parent: 'admin',
            url: '/logs',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'logs.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/adm/logs/logs.html',
                    controller: 'LogsController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('logs');
                //     return $translate.refresh();
                // }]
            }
        });
    }
})();
