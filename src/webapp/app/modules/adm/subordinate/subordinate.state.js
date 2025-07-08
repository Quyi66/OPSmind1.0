(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('subordinate', {
                parent: 'admin',
                url: '/subordinate',
                data: {
                    pageTitle: 'oplusApp.subordinate.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/subordinate/subordinates.html',
                        controller: 'SubordinateController',
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
                    //     $translatePartialLoader.addPart('subordinate');
                    //     $translatePartialLoader.addPart('global');
                    //     return $translate.refresh();
                    // }]
                }
            })
            .state('subordinate.config', {
                url: '/config',
                data: {
                },
                views: {
                    'content@': {
                        templateUrl: 'app/modules/adm/subordinate/subordinate-config.html',
                        controller: 'SubordinateConfigController',
                        controllerAs: 'subordinateConfigVm'
                    }
                }
            })
            .state('subordinate.delete', {
                url: '/{id}/delete',
                data: {
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/adm/subordinate/subordinate-delete-dialog.html',
                        controller: 'SubordinateDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Subordinate', function (Subordinate) {
                                return Subordinate.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('subordinate', null, {reload: 'subordinate'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            });
    }

})();
