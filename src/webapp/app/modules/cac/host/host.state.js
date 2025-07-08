/**
 * @Auther: zml
 * @Date: 2018/4/21
 */

(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        /***********************************************巡检主机************************************************/
            .state('app.cac.host', {
                url: '/host',
                cache: false,
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/host/host-list.html',
                        controller: 'CacHostListCtrl',
                        controllerAs: 'cacHostListCtrlVm'
                    }
                }
            })
        ;
    }])
    ;
})
();
