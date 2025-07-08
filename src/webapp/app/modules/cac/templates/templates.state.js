
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac3.templates', {
                url: '/templates',
                views: {
                    'cac3List': {
                        templateUrl: 'app/modules/cac/templates/templates.html',
                        controller: 'CacCheckLogListController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac3.templates.list', {
                url: '/list',
                views: {
                    'templates-view': {
                        templateUrl: 'app/modules/cac/templates/templates-list.html',
                        controller: 'CacTemplatesListController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac3.templates.add', {
                url: '/add',
                views: {
                    'templates-view': {
                        templateUrl: 'app/modules/cac/templates/templates-edit.html',
                        controller: 'CacTemplatesEditController',
                        controllerAs: 'vm'
                    }
                },resolve: {
                    entity: function () {
                        return {
                            createdAt: null,
                            createdBy: null,
                            description: null,
                            executedAt: null,
                            executedBy: null,
                            globalParameters: null,
                            hostsJson: null,
                            icon: null,
                            name: null,
                            overwrite: 0,
                            paramsJson: null,
                            tenantId: null,
                            threeCheckItemIds: [],
                            thumbcolor: null,
                            updatedAt: null,
                            updatedBy: null,
                            id: null
                        };
                    }
                }
            })
            .state('app.cac3.templates.edit', {
                url: '/:id/edit',
                views: {
                    'templates-view': {
                        templateUrl: 'app/modules/cac/templates/templates-edit.html',
                        controller: 'CacTemplatesEditController',
                        controllerAs: 'vm'
                    }
                },resolve: {
                    entity: ['CacTemplatesService','$stateParams', function(CacTemplatesService,$stateParams) {
                        return CacTemplatesService.getTemplatesById($stateParams.id);
                    }]
                }

            })

        ;
    }])
    ;
})
();