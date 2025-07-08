(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('app.ssc.user', {
                url: '/user-management?tenantId',
                data: {
                    authorities: [],
                    pageTitle: 'sys_userManagement.home.title'
                },
                reloadOnSearch: false,
                views: {
                    'ssc_main': {
                        templateUrl: 'app/modules/ssc/user/user-management.html',
                        controller: 'UserManagementController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('user-management');
                    //     return $translate.refresh();
                    // }]

                }
            })
            // .state('user-management.new', {
            //     url: '/new?',
            //     data: {
            //         authorities: []
            //     },
            //     onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
            //         $uibModal.open({
            //             templateUrl: 'app/modules/adm/user/user-management-dialog.html',
            //             controller: 'UserManagementEditController',
            //             controllerAs: 'vm',
            //             backdrop: 'static',
            //             size: 'lg',
            //             resolve: {
            //                 entity: function () {
            //                     //firstName: null, lastName: null,
            //                     return {
            //                         id: null,
            //                         tenantId: $stateParams.tenantId,
            //                         login: null,
            //                         fullName: null,
            //                         email: null,
            //                         authMode: 'LOCAL',
            //                         activated: true,
            //                         langKey: null,
            //                         createdBy: null,
            //                         createdDate: null,
            //                         lastModifiedBy: null,
            //                         lastModifiedDate: null,
            //                         resetDate: null,
            //                         resetKey: null,
            //                         roles: null
            //                     };
            //                 }
            //             }
            //         }).result.then(function () {
            //             $state.go('user-management', {tenantId: $stateParams.tenantId}, {reload: true});
            //         }, function () {
            //             $state.go('user-management');
            //         });
            //     }]
            // })
            // .state('user-management.new-tenant-user', {
            //     url: '/new-tenant-user',
            //     data: {
            //         authorities: []
            //     },
            //     onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
            //         $uibModal.open({
            //             templateUrl: 'app/modules/adm/user/user-management-tenant-user-dialog.html',
            //             controller: 'LinkTenantUserController',
            //             controllerAs: 'addTenantUserVm',
            //             backdrop: 'static',
            //             size: 'lg',
            //             resolve: {
            //                 tenantId: function () {
            //                     return $stateParams.tenantId;
            //                 }
            //             }
            //         }).result.then(function () {
            //             $state.go('user-management', {tenantId: $stateParams.tenantId}, {reload: true});
            //         }, function () {
            //             $state.go('user-management');
            //         });
            //     }]
            // })
            .state('app.ssc.user.edit', {
                url: '/{tenantUserId}/{viewType}',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/user/user-management-edit.html',
                        controller: 'UserManagementEditController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'md',
                        resolve: {
                            entity: ['User', function (User) {
                                return User.get({tenantUserId: $stateParams.tenantUserId}).$promise;
                            }],
                            viewType: function () {
                                return $stateParams.viewType;
                            }
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.user', null, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.user.detail', {
                url: '/{tenantUserId}',
                data: {
                    authorities: [],
                    pageTitle: 'user-management.detail.title'
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/user/user-management-detail.html',
                        controller: 'UserManagementDetailController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['User', function (User) {
                                return User.get({tenantUserId: $stateParams.tenantUserId}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.user', null, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.user.delete', {
                url: '/{tenantUserId}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/user/user-management-delete.html',
                        controller: 'UserManagementDeleteController',
                        controllerAs: 'vm',
                        size: 'sm`',
                        resolve: {
                            entity: ['User', function (User) {
                                return User.get({tenantUserId: $stateParams.tenantUserId}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.user', null, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.user-allocate-role', {
                url: '/allocate-role',
                data: {
                    authorities: [],
                    pageTitle: 'user-management.allocate-role.title'
                },
                views: {
                    'ssc_main': {
                        templateUrl: 'app/modules/ssc/user/user-management-allocate-role.html',
                        controller: 'UserManagementAllocateRoleController',
                        controllerAs: 'allocateRoleVm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('user-management');
                    //     return $translate.refresh();
                    // }]
                }
            });
    }
})();
