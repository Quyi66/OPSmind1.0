(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('param', {
                parent: 'admin',
                url: '/param',
                data: {
                    authorities: [],
                    pageTitle: 'param.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/param/params.html',
                        controller: 'ParamController',
                        controllerAs: 'paramVm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('param');
                    //     $translatePartialLoader.addPart('global');
                    //     return $translate.refresh();
                    // }]
                }
            })
            .state('param.new', {
                url: '/new',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/param/param-dialog.html',
                        controller: 'ParamDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    domain: null,
                                    name: null,
                                    value: null,
                                    description: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('param');
                    });
                }]
            })
            .state('param.edit', {
                url: '/{id}/edit',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/param/param-dialog.html',
                        controller: 'ParamDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Param', function (Param) {
                                return Param.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('param.delete', {
                url: '/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/param/param-delete-dialog.html',
                        controller: 'ParamDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Param', function (Param) {
                                return Param.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('param', null, {reload: 'param'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('param.detail', {
                url: '/{id}',
                data: {
                    authorities: [],
                    pageTitle: 'param.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/param/param-detail.html',
                        controller: 'ParamDetailController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('param');
                    //     return $translate.refresh();
                    // }],
                    entity: ['$stateParams', 'Param', function ($stateParams, Param) {
                        return Param.get({id: $stateParams.id}).$promise;
                    }],
                    previousState: ["$state", function ($state) {
                        var currentStateData = {
                            name: $state.current.name || 'param',
                            params: $state.params,
                            url: $state.href($state.current.name, $state.params)
                        };
                        return currentStateData;
                    }]
                }
            });
    }

})();
