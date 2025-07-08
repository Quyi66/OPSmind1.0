(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('register', {
            parent: 'account',
            url: '/register',
            data: {
                authorities: [],
                pageTitle: 'register.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/uaa/register/register.html',
                    controller: 'RegisterController',
                    controllerAs: 'vm'
                }
            },
            // resolve: {
            //     translatePartialLoader: ['$translate', function ($translate) {
            //         $translatePartialLoader.addPart('register');
            //         return $translate.refresh();
            //     }]
            // }
        });
    }
})();
