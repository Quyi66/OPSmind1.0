(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('permission', {
            parent: 'admin',
            url: '/permission?page&sort&search',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'permission.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/adm/permission/permissions.html',
                    controller: 'PermissionController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('permission');
                //     $translatePartialLoader.addPart('global');
                //     return $translate.refresh();
                // }]
            }
        })
        .state('permission.permission-detail', {
            url: '/permission/{id}',
            data: {
                authorities: ['ROLE_ADMIN'],
                pageTitle: 'permission.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/adm/permission/permission-detail.html',
                    controller: 'PermissionDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('permission');
                //     return $translate.refresh();
                // }],
                entity: ['$stateParams', 'Permission', function($stateParams, Permission) {
                    return Permission.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'permission',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('permission.permission-detail.edit', {
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/modules/adm/permission/permission-dialog.html',
                    controller: 'PermissionDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Permission', function(Permission) {
                            return Permission.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('permission.new', {
            url: '/new',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/modules/adm/permission/permission-dialog.html',
                    controller: 'PermissionDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                domain: null,
                                action: null,
                                target: null,
                                description: null,
                                configJson: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('permission', null, { reload: 'permission' });
                }, function() {
                    $state.go('permission');
                });
            }]
        })
        .state('permission.edit', {
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/modules/adm/permission/permission-dialog.html',
                    controller: 'PermissionDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Permission', function(Permission) {
                            return Permission.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('permission', null, { reload: 'permission' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('permission.delete', {
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_ADMIN']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/modules/adm/permission/permission-delete-dialog.html',
                    controller: 'PermissionDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Permission', function(Permission) {
                            return Permission.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('permission', null, { reload: 'permission' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
