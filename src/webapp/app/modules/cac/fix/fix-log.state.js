
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        /***********************************************巡检任务************************************************/
            .state('app.cac3.fix', {
                url: '/fix',
                views: {
                    'cac3List': {
                        templateUrl: 'app/modules/cac/fix/fix-log-index.html',
                        controller: 'CacFixLogController',
                        controllerAs: 'cacFixLogCtrlVm'
                    }
                }

            })
            .state('app.cac3.fix.list', {
                url: '/fix-list',
                views: {
                    'fixView': {
                        templateUrl: 'app/modules/cac/fix/fix-log-list.html',
                        controller: 'CacFixLogListController',
                        controllerAs: 'cacFixLogListCtrlVm'
                    }
                }

            })
        ;
    }])
    ;
})
();
