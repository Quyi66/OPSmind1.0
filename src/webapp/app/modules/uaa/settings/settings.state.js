(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('app.settings', {
            url: '/settings',
            data: {
                authorities: [],
                pageTitle: 'global.menu.account.settings'
            },
            useAsApplet: {
                type: 'PrivateTool',
                code: 'settings',
                title: 'User Settings',
                icon: 'fa-user-cog',
                color: '#666',
                windowSize: 'full'
            },
            views: {
                'mainView': {
                    templateUrl: 'app/modules/uaa/settings/settings.html',
                    controller: 'SettingsController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('settings');
                //     return $translate.refresh();
                // }]
            }
        })
        .state('settings', {
            parent: 'account',
            url: '/settings',
            data: {
                authorities: [],
                pageTitle: 'global.menu.account.settings'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/uaa/settings/settings.html',
                    controller: 'SettingsController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('settings');
                //     return $translate.refresh();
                // }]
            }
        });
    }
})();
