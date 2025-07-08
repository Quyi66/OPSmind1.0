(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('role', {
                parent: 'admin',
                url: '/role?page&sort&search',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'role.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/role/roles.html',
                        controller: 'RoleController',
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
                    //     $translatePartialLoader.addPart('role');
                    //     $translatePartialLoader.addPart('global');
                    //     return $translate.refresh();
                    // }]
                }
            })
            .state('role.role-detail', {
                url: '/role/{id}',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'role.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/role/role-detail.html',
                        controller: 'RoleDetailController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('role');
                    //     return $translate.refresh();
                    // }],
                    entity: ['$stateParams', 'Role', function ($stateParams, Role) {
                        return Role.get({id: $stateParams.id}).$promise;
                    }],
                    previousState: ["$state", function ($state) {
                        var currentStateData = {
                            name: $state.current.name || 'role',
                            params: $state.params,
                            url: $state.href($state.current.name, $state.params)
                        };
                        return currentStateData;
                    }]
                }
            })
            .state('role.role-detail.edit', {
                url: '/detail/edit',
                data: {
                    authorities: ['ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/role/role-dialog.html',
                        controller: 'RoleDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Role', function (Role) {
                                return Role.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: false});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('role.new', {
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/role/role-dialog.html',
                        controller: 'RoleDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    visibility: null,
                                    target: null,
                                    description: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('role', null, {reload: 'role'});
                    }, function () {
                        $state.go('role');
                    });
                }]
            })
            .state('role.edit', {
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/role/role-dialog.html',
                        controller: 'RoleDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Role', function (Role) {
                                return Role.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('role', null, {reload: 'role'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('role.delete', {
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/role/role-delete-dialog.html',
                        controller: 'RoleDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Role', function (Role) {
                                return Role.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('role', null, {reload: 'role'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('role.allocate-perm', {
                url: '/role/allocate-perm',
                data: {
                    authorities: [],
                    pageTitle: 'role.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/role/role-allocate-perm.html',
                        controller: 'RoleAllocatePermController',
                        controllerAs: 'allocatePermVm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('role');
                    //     return $translate.refresh();
                    // }]
                }
            });
    }

})();
