/**
 * @author yangbin@famessoft.com, created on 2022/07/27
 *
 */
(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.config.tag', {
                url: '/tags',
                views: {
                    'ssc_config': {
                        templateUrl: function () {
                            return 'app/modules/ssc/tags/tag.html';
                        },
                        controller: 'udpTagsCtrl'
                    }
                }
            })
            .state('app.ssc.config.tag.new', {
                url: '/new',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/tags/tag-dialog.html',
                        controller: 'udpTagDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'sm',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    tenantId: null,
                                    type: "C",
                                    id: null
                                };
                            }
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action !== "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.tag.edit', {
                url: '/{id}/edit',
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/tags/tag-dialog.html',
                        controller: 'udpTagDialogController',
                        controllerAs: 'vm',
                        size: 'sm',
                        resolve: {
                            entity: ['udpTagsService', function (udpTagsService) {
                                return udpTagsService.findTagById($stateParams.id)
                            }]
                        }
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action !== "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.tag.delete', {
                url: '/{id}/delete',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/tags/tag-delete.html',
                        controller: 'udpTagDeleteController',
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
            })
            .state('app.ssc.config.tag.detail', {
                url: '/{id}/detail',
                onEnter: ['$stateParams', '$state', '$uibModal', 'udpTagsService', function ($stateParams, $state, $uibModal, udpTagsService) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/tags/tag-detail.html',
                        controller: 'udpTagDetailController',
                        controllerAs: 'vm',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return udpTagsService.findTagById($stateParams.id);
                            }
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
        ;
    }]);
})();
