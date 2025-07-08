/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/21/2017.
 */
(function () {
    'use strict';
    angular.module('oplus.dev').config(['$stateProvider',
        function ($stateProvider) {
            configRoutesForDebug($stateProvider);
        }]);

    function configRoutesForDebug($stateProvider) {
        $stateProvider
            .state('app.dev', {
                url: '/dev',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/dev/dev-index.html',
                        controller: 'DevIndexCtrl'
                    }
                }
            })
            .state('app.translator', {
                url: '/translator',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/dev/translator/trans-index.html',
                        controller: 'DevTranslatorCtrl',
                        controllerAs:'$ctrl'
                    }
                }
            })
            .state('app.dev.component', {
                url: '/:component',
                views: {
                    'component': {
                        templateUrl: function ($stateParams) {
                            return 'app/modules/dev/dev-' + $stateParams.component + '.html'
                        },
                        controller: 'DevComponentCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            });
    }
})();