/**
 * @author yangbin@famessoft.com, created on 2023/10/08
 *
 */
(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.config.applet-manage', {
                url: '/applet-manage',
                views: {
                    'ssc_config': {
                        templateUrl: function () {
                            return 'app/modules/ssc/applet-manage/applet-manage.html';
                        },
                        controller: 'appletManageCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.ssc.config.applet-manage.detail', {
                url: '/{id}/detail',
                onEnter: ['$stateParams','$state','$uibModal', 'appletManageService', function ($stateParams, $state, $uibModal, appletManageService) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/applet-manage/applet-manage-detail.html',
                        controller: 'appletManageDetailCtrl',
                        controllerAs: '$ctrl',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return appletManageService.findApplteById($stateParams.id);
                            }
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.applet-manage.copy', {
                url: '/{id}/copy',
                onEnter: ['$stateParams', '$state', '$uibModal', 'appletManageService', function ($stateParams, $state, $uibModal, appletManageService) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/applet-manage/applet-manage-copy.html',
                        controller: 'appletManageCopyCtrl',
                        controllerAs: '$ctrl',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return appletManageService.findApplteById($stateParams.id);
                            }
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })

            .state('app.ssc.config.applet-manage.import', {
                url: '/import',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        animation: false,
                        templateUrl: 'app/modules/ssc/applet-manage/applet-manage-import.html',
                        controller: 'appletManageImportCtrl',
                        controllerAs: '$ctrl',
                        backdrop: 'static',
                        size: 'md'
                    }).result.then(function () {
                        $state.go('^', {cache: true}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.applet-manage.delete', {
                url: '/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/applet-manage/applet-manage-delete.html',
                        controller: 'appletManageDeleteCtrl',
                        controllerAs: 'vm',
                        size: 'sm',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    tenantId: null,
                                    id: $stateParams.id
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('^', {cache: true}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            });
    }]);
})();
