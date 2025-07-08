/**
 * @Auther: zml
 * @Date: 2018/4/21
 */

(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        /***********************************************巡检规则************************************************/
            .state('app.cac.rule', {
                url: '/rule',
                cache: false,
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/rule/rule-list.html',
                        controller: 'CacRuleListCtrl',
                        controllerAs: 'cacRuleListCtrlVm'
                    }
                }
            })
        ;
    }])
    ;
})
();
