(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.config.team', {
                url: '/team',
                views: {
                    'ssc_config': {
                        templateUrl: 'app/modules/ssc/team/team.html',
                        controller: 'TeamController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.ssc.config.team.edit', {
                url: '/{id}/edit',
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/team/team-dialog.html',
                        controller: 'TeamDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Team', function (Team) {
                                return Team.findTeamById($stateParams.id);
                            }]
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.config.team', {cache: true}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.ssc.config.team.new', {
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/team/team-dialog.html',
                        controller: 'TeamDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    tenantId: null,
                                    description: null,
                                    code: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.config.team', {cache: true}, {reload: true});
                    }, function () {
                        $state.go('app.ssc.config.team');
                    });
                }]
            })
            .state('app.ssc.config.team.delete', {
                // url: '/{id}/{name}/delete',
                url: '/{id}/delete',
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/ssc/team/team-delete-dialog.html',
                        controller: 'TeamDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: function () {
                                return {
                                    id: $stateParams.id,
                                    // name: $stateParams.name,
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('app.ssc.config.team', {cache: true}, {reload: true});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
        ;
    }]);
})();
