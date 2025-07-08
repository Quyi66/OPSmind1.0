(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.config.param', {
                url: '/params',
                views: {
                    'ssc_config': {
                        templateUrl: function () {
                            return 'app/modules/ssc/param/param.html';
                        },
                        controller: 'admParamCtrl',
                    }
                }
            })
            .state('app.ssc.config.param.new_app', {
                url: '/app/new',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/app/param-dialog.html',
                        controller: 'tenantParamDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    value: null,
                                    tenantId: null,
                                    description: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.param.edit_app', {
                url: '/app/{id}/edit',
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/app/param-dialog.html',
                        controller: 'tenantParamDialogController',
                        controllerAs: 'vm',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    value: null,
                                    tenantId: null,
                                    description: null,
                                    id: $stateParams.id
                                };
                            }
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.param.delete_app', {
                url: '/app/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/app/param-delete.html',
                        controller: 'tenantParamDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    value: null,
                                    tenantId: null,
                                    description: null,
                                    id: $stateParams.id
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.config.param', {cache: true}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.param.detail_app', {
                url: '/app/{id}/detail',
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/app/param-dialog.html',
                        controller: 'tenantParamDetailController',
                        controllerAs: 'vm',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    value: null,
                                    tenantId: null,
                                    description: null,
                                    id: $stateParams.id
                                };
                            }
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action != "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })

            .state('app.ssc.config.param.new_sys', {
                url: '/sys/new',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/sys/param-dialog.html',
                        controller: 'SscParamDialogController',
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
                        $state.go('^', {}, {
                            reload: result.action != "cancel"
                        });
                    }, function () {
                        $state.go('app.ssc.config.param');
                    });
                }]
            })
            .state('app.ssc.config.param.edit_sys', {
                url: '/sys/{id}/edit',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/sys/param-dialog.html',
                        controller: 'SscParamDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Param', function (Param) {
                                return Param.get({
                                    id: $stateParams.id
                                }).$promise;
                            }]
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {
                            reload: result.action != "cancel"
                        });
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.param.delete_sys', {
                url: '/sys/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/sys/param-delete-dialog.html',
                        controller: 'SscParamDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Param', function (Param) {
                                return Param.get({
                                    id: $stateParams.id
                                }).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.config.param', null, {
                            reload: 'app.ssc.config.param'
                        });
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.param.detail_sys', {
                url: '/sys/{id}/detail',
                data: {
                    authorities: [],
                    pageTitle: 'param.detail.title'
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/param/sys/param-detail.html',
                        controller: 'SscParamDetailController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Param', function (Param) {
                                return Param.get({
                                    id: $stateParams.id
                                }).$promise;
                            }],
                            previousState: ["$state", function ($state) {
                                var currentStateData = {
                                    name: $state.current.name || 'app.ssc.config.param',
                                    params: $state.params,
                                    url: $state.href($state.current.name, $state.params)
                                };
                                return currentStateData;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.config.param', null, {reload: 'app.ssc.config.param'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            });
        ;
    }]);
})();
