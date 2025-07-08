/**
 * @Auther: zml
 * @Date: 2018/4/21
 */

(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        /***********************************************巡检模板************************************************/
            .state('app.cac.template', {
                url: '/template',
               // params:{"display":false},
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/template/template-index.html',
                        controller: 'CacTemplateIndexCtrl',
                        controllerAs: 'cacTemplateIndexCtrlVm'
                    }
                }
            })
            .state('app.cac.template.square', {
                url: '/square',
                views: {
                    'template-view': {
                        templateUrl: 'app/modules/cac/template/template-square.html',
                        controller: 'CacTemplateSquareCtrl',
                        controllerAs: 'CacTemplateSquareCtrlVm'
                    }
                }
            })
            .state('app.cac.template_add', {
                url: '/add',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/template/template-edit.html',
                        controller: 'CacEditTemplateCtrl',
                        controllerAs: 'cacEditTemplateCtrlVm'
                    }
                }
            })
            .state('app.cac.template_edit', {
                url: '/:templateId/edit',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/template/template-edit.html',
                        controller: 'CacEditTemplateCtrl',
                        controllerAs: 'cacEditTemplateCtrlVm'
                    }
                }

            })
            .state('app.cac.template_dashboard', {
                url: '/:templateId/:templateName/dashboard',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/template/template-dashboard.html',
                        controller: 'CacDashboardTemplateCtrl',
                        controllerAs: 'cacDashboardTemplateCtrlVm'
                    }
                }

            })
            .state('app.cac.template_teams', {
                url: '/:templateId/:templateName/teams',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/template/cac-team-config.html',
                        controller: 'CacTeamConfigCtrl',
                        controllerAs: 'cacTeamConfigCtrlVm'
                    }
                }

            })
            .state('app.cac.template.list', {
                url: '/list',
                views: {
                    'template-view': {
                        templateUrl: 'app/modules/cac/template/template-list.html',
                        controller: 'CacTemplateListCtrl',
                        controllerAs: 'cacTemplateListCtrlVm'
                    }
                }
            })
        ;
    }])
    ;
})
();
