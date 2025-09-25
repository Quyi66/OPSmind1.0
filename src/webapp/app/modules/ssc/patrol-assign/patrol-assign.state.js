/**
 * 巡检模版分配 页面路由
 */
(function () {
    'use strict';
    angular.module('oplus.app').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc.config.patrol-assign', {
                url: '/patrol-assign',
                views: {
                    'ssc_config': {
                        templateUrl: 'app/modules/ssc/patrol-assign/patrol-assign.html',
                        controller: 'PatrolAssignController',
                        controllerAs: 'vm'
                    }
                }
            });
    }]);
})();

