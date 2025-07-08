(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac3.check_log', {
                url: '/check_log',
                views: {
                    'cac3List': {
                        templateUrl: 'app/modules/cac/log/check-log-index.html',
                        controller: 'CacCheckLogController',
                        controllerAs: 'cacCheckLogCtrlVm'
                    }
                }

            })
            .state('app.cac3.check_log.list', {
                url: '/check-list/:templateId',
                views: {
                    'checkView': {
                        templateUrl: 'app/modules/cac/log/check-log-list.html',
                        controller: 'CacCheckLogListController',
                        controllerAs: 'cacCheckLogListCtrlVm'
                    }
                }

            })
        ;
    }])
    ;
})
();
