(function () {
    'use strict';

    angular.module('oplus.main')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('app.error', {
                // parent: 'app',
                url: '/error?errorMessage&hideHeader',
                views: {
                    'navbar@': {template: ''},
                    'content@': {
                        templateUrl: 'app/modules/main/error.html',
                        controller: 'ErrorController',
                        controllerAs: 'errorVm'
                    }
                },
                data: {
                    hideDesktop: true
                },
                resolve: {
                    entity: ['$stateParams', function ($stateParams) {
                        return {hideHeader: $stateParams.hideHeader, errorMessage: $stateParams.errorMessage}
                    }]
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('error');
                    //     return $translate.refresh();
                    // }]
                }
            })
            .state('app.accessdenied', {
                url: '/accessdenied',
                data: {
                    authorities: []
                },
                views: {
                    'master@': {
                        templateUrl: 'app/modules/main/accessdenied.html'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('error');
                    //     return $translate.refresh();
                    // }]
                }
            });
    }
})();
