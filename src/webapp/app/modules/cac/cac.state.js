/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac', {
                url: '/cac',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/cac/cac-index.html',
                        controller: 'cacCtrl',
                        controllerAs: 'cacVm'
                    }
                }
            })
            .state('app.cac3', {
                url: '/cac3',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/cac/cac3-index.html',
                        controller: 'cac3Ctrl',
                        controllerAs: 'cacVm'
                    }
                }
            })
        ;
    }])
    ;
})();
