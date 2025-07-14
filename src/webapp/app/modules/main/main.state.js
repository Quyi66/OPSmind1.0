'use strict';

angular.module('oplus.main').config(['$stateProvider', '$urlRouterProvider', 'tenantUtilProvider',
        /**
         *
         * @param $stateProvider
         * @param $urlRouterProvider
         * @param {tenantUtilProvider} tenantUtilProvider
         */
        function ($stateProvider, $urlRouterProvider, tenantUtilProvider) {
            var homeContent;
            if (tenantUtilProvider.isTenantAdminUI()) {
                homeContent = {
                    templateUrl: 'app/modules/layout/home/admin/home.html'
                }
            } else {
                homeContent = {
                    template: '<div ui-view="mainView" class="h-100"></div>'
                }
            }
            homeContent.controller = ['$rootScope', '$state', 'currentUser', function ($rootScope, $state, currentUser) {
                if (!currentUser.isAuthenticated) {
                    console.log('%cRedirect from home to login because user has not logged in', 'color:orange');
                    $state.go('app.login_main');
                }
            }];
            $stateProvider.state('app', {
                abstract: true,
                views: {
                    'navbar@': {
                        template: '<op-taskbar></op-taskbar>'
                    },
                    'content@': {
                        template: '<div ui-view="mainView" class="h-100"></div>'
                    }
                }/*,
                resolve: {
                    //TODO: problem! it will execute multiple times
                    tenantLoader: ['tenantConfigInit', function (tenantConfigInit) {
                        console.warn('%cTenantConfig: Init only once...','color:yellow');
                        return tenantConfigInit.initDynamicAppConfig();
                    }]
                }*/
            });
            $stateProvider.state('app.home', {
                url: '/home',
                views: {
                    'content@': homeContent
                }
            });
            // 修改默认路由，未登录时跳转到登录页面
            $urlRouterProvider.otherwise(function($injector, $location) {
                var currentUser = $injector.get('currentUser');
                if (!currentUser.isAuthenticated) {
                    return '/login';
                }
                return '/home';
            });
        }
    ]
);