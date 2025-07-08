/**
 * @Auther: zml
 * @Date: 2018/5/23
 */
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.template-user', {
                url: '/template-user',
                data: {
                    authorities: ['ROLE_USER'],
                    // pageTitle: $translate.instant('cac.index.template')
                },
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/cac/template/user/template-user-index.html',
                        controller: 'CacTemplateUserCtrl',
                        controllerAs: 'cacTemplateUserCtrlVm'
                    }
                },
                resolve: {}
            })
            .state('app.template-user.list', {
                url: '/template-user/list',
                data: {
                    authorities: ['ROLE_USER'],
                    // pageTitle: $translate.instant('cac.index.template')
                },
                views: {
                    'template': {
                        templateUrl: 'app/modules/cac/template/user/template-user-list.html',
                        controller: 'CacTemplateListCtrl',
                        controllerAs: 'cacTemplateListCtrlVm'
                    }
                },
                resolve: {}
            })
        ;
    }])
    ;
})();
