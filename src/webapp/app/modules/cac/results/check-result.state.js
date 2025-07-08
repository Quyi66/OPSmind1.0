/**
 * @Auther: zml
 * @Date: 2018/5/24
 */
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac3.check_result', {
                url: '/check-result/:logId',
                views: {
                    'cac3List': {
                        templateUrl: 'app/modules/cac/results/check-result-overview.html',
                        controller: 'CheckResultOverviewCtrl',
                        controllerAs: 'checkResultOverviewVm'
                    }
                }

            })
            .state('app.cac3.check_result.output', {
                url: '/:logId/output',
                views: {
                    'cacCheckResult': {
                        templateUrl: 'app/modules/cac/results/check-result-output-list.html',
                        controller: 'CacCheckResultOutputListCtrl',
                        controllerAs: 'cacCheckResultOutputListCtrlVm'
                    }
                }
            })
        ;
    }])
    ;
})();
