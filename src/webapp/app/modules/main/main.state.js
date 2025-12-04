'use strict';

angular.module('oplus.main').config(['$stateProvider', '$urlRouterProvider', 'tenantUtilProvider',
        /**
         *
         * @param $stateProvider
         * @param $urlRouterProvider
         * @param {tenantUtilProvider} tenantUtilProvider
         */
        function ($stateProvider, $urlRouterProvider, tenantUtilProvider) {
            
            /**
             * 通知父级Vue应用需要登录
             * Angular作为iframe嵌入Vue，登录逻辑由Vue统一处理
             * @param {string} reason 需要登录的原因
             */
            function notifyParentNeedLogin(reason) {
                console.log('%c[Angular->Vue] 需要登录，通知父级Vue应用', 'color:orange', reason);
                
                // 检查是否在iframe中
                if (window.parent && window.parent !== window) {
                    try {
                        window.parent.postMessage({
                            type: 'OPLUS_AUTH_REQUIRED',
                            source: 'angular-iframe',
                            reason: reason || 'not_authenticated',
                            timestamp: Date.now()
                        }, '*');
                        console.log('%c[Angular->Vue] postMessage已发送', 'color:green');
                        return true;
                    } catch (e) {
                        console.warn('[Angular->Vue] postMessage发送失败:', e);
                    }
                }
                return false;
            }
            
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
                    // 优先通知父级Vue处理登录，如果不在iframe中则跳转本地登录页
                    if (!notifyParentNeedLogin('home_not_authenticated')) {
                        $state.go('app.login_main');
                    }
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
                    // 优先通知父级Vue处理登录
                    if (window.parent && window.parent !== window) {
                        notifyParentNeedLogin('otherwise_not_authenticated');
                        // 返回当前路径，不做跳转，等待Vue处理
                        return $location.path() || '/home';
                    }
                    return '/login';
                }
                return '/home';
            });
        }
    ]
);