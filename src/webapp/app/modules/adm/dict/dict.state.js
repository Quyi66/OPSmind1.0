(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('dict', {
            parent: 'admin',
            url: '/dict',
            data: {
                pageTitle: 'oplusApp.dict.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/adm/dict/dicts.html',
                    controller: 'DictController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('dict');
                //     $translatePartialLoader.addPart('global');
                //     return $translate.refresh();
                // }]
            }
        })
        .state('dict.api', {
            url: '/api/{id}',
            data: {
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/modules/adm/dict/dict-dialog.html',
                    controller: 'DictApiCtrl',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        dict: ['Dict', function(Dict) {
                            return Dict.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('dict', {}, { reload: false });
                }, function() {
                    $state.go('dict');
                });
            }]
        })
    }

})();
