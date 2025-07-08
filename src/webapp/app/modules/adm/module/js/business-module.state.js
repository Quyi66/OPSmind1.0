(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('businessModule', {
                parent: 'admin',
                url: '/businessModule',
                data: {
                    authorities: [],
                    pageTitle: 'businessModule.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/module/business-modules.html',
                        controller: 'BusinessModuleController',
                        controllerAs: 'businessModuleVm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('business-module');
                    //     $translatePartialLoader.addPart('global');
                    //     return $translate.refresh();
                    // }]
                }
            })
            .state('businessModule.detail', {
                url: '/{id}',
                data: {
                    authorities: [],
                    pageTitle: 'businessModule.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/module/business-module-detail.html',
                        controller: 'BusinessModuleDetailController',
                        controllerAs: 'businessModuleDetailVm'
                    }
                },
                resolve: {
                    entity: ['$stateParams', 'BusinessModule', function ($stateParams, BusinessModule) {
                        return BusinessModule.get({id: $stateParams.id}).$promise;
                    }]
                }
            })
            .state('businessModule.edit', {
                url: '/{id}/edit',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/module/business-module-dialog.html',
                        controller: 'BusinessModuleDialogController',
                        controllerAs: 'businessModuleDialogVm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['BusinessModule', function (BusinessModule) {
                                return BusinessModule.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('businessModule.new', {
                url: '/new',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/module/business-module-dialog.html',
                        controller: 'BusinessModuleDialogController',
                        controllerAs: 'businessModuleDialogVm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    id: null,
                                    name: null,
                                    code: null,
                                    description: null,
                                    permission: null,
                                    dataSql: null,
                                    elements: []
                                };
                            }
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('businessModule');
                    });
                }]
            })
            .state('businessModule.delete', {
                url: '/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/module/business-module-delete-dialog.html',
                        controller: 'BusinessModuleDeleteController',
                        controllerAs: 'businessModuleDeleteVm',
                        size: 'md',
                        resolve: {
                            entity: ['BusinessModule', function (BusinessModule) {
                                return BusinessModule.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('businessModule', null, {reload: 'businessModule'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            });
    }

})();
