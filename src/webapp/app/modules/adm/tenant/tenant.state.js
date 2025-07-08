(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('tenant', {
                parent: 'admin',
                url: '/tenant',
                data: {
                    authorities: [],
                    pageTitle: 'tenant.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/tenant/tenants.html',
                        controller: 'TenantController',
                        controllerAs: 'tenantVm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('tenant');
                    //     $translatePartialLoader.addPart('global');
                    //     $translatePartialLoader.addPart('user-management');
                    //     return $translate.refresh();
                    // }]
                }
            })
            // .state('tenant.detail', {
            //     url: '/{id}',
            //     data: {
            //         authorities: [],
            //         pageTitle: 'tenant.detail.title'
            //     },
            //     views: {
            //         'content@': {
            //             templateUrl: 'app/modules/adm/tenant/tenant-detail.html',
            //             controller: 'TenantDetailController',
            //             controllerAs: 'vm'
            //         }
            //     },
            //     resolve: {
            //         translatePartialLoader: ['$translate', function ($translate) {
            //             $translatePartialLoader.addPart('tenant');
            //             return $translate.refresh();
            //         }],
            //         entity: ['$stateParams', 'Tenant', function ($stateParams, Tenant) {
            //             return Tenant.get({id: $stateParams.id}).$promise;
            //         }],
            //         previousState: ["$state", function ($state) {
            //             var currentStateData = {
            //                 name: $state.current.name || 'tenant',
            //                 params: $state.params,
            //                 url: $state.href($state.current.name, $state.params)
            //             };
            //             return currentStateData;
            //         }]
            //     }
            // })
            .state('tenant.edit', {
                url: '/{id}/edit',
                data: {
                    authorities: []
                },
                views: {
                    'tenant': {
                        templateUrl: 'app/modules/adm/tenant/tenant-dialog.html',
                        controller: 'TenantDialogController',
                        controllerAs: 'tenantEditVm'
                    }
                },
                resolve: {
                    entity: ['$stateParams', 'Tenant', function ($stateParams, Tenant) {
                        return Tenant.get({id: $stateParams.id}).$promise;
                    }]
                }
            })
            .state('tenant.new', {
                url: '/new',
                data: {
                    authorities: []
                },
                views: {
                    'tenant': {
                        templateUrl: 'app/modules/adm/tenant/tenant-dialog.html',
                        controller: 'TenantDialogController',
                        controllerAs: 'tenantEditVm'
                    }
                },
                resolve: {
                    entity: function () {
                        return {
                            name: null,
                            code: null,
                            description: null,
                            accessToken: null,
                            id: null
                        };
                    }
                }
            })
            .state('tenant.delete', {
                url: '/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/tenant/tenant-delete-dialog.html',
                        controller: 'TenantDeleteController',
                        controllerAs: 'vm',
                        size: 'sm',
                        resolve: {
                            entity: ['Tenant', function (Tenant) {
                                return Tenant.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('tenant', null, {reload: 'tenant'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('tenant.tenant_import', {
                url:'/import',
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/tenant/tenant-import.html',
                        controller: 'TenantImportCtrl',
                        controllerAs: '$import'
                    }
                }
            });;
    }

})();
