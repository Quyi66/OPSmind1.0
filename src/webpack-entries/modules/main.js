// Main 模块入口文件
// 首先导入模块定义
import "../../webapp/app/modules/main/main.module.js";

// 导入应用配置和初始化
import "../../webapp/app/profiles.js";

// 导入国际化
import "../../webapp/app/modules/oplus-lang.js";

// *** 重要：在这里定义 OplusApp 主应用模块 ***
// 创建主应用模块，确保在其他模块加载完成后可以使用
const OplusApp = angular.module('OplusApp', [
    // 第三方模块
    'ui.router',
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'pascalprecht.translate',
    'angular-loading-bar',
    'angularFileUpload',  // 注意：使用 angularFileUpload，不是 ngFileUpload
    'hc.marked',
    'toaster',
    'ui.calendar',
    'ui.codemirror',
    'ui.sortable',
    'ui.tinymce',
    'vs-repeat',
    'ngStorage',  // Angular localStorage 和 sessionStorage
    'ngCacheBuster',  // HTTP 缓存拦截器
    'tmh.dynamicLocale',  // 动态语言环境切换
    
    // Oplus 功能模块
    'oplus.commons',
    'oplus.layout',
    'oplus.main',
    'oplus.acm',
    'oplus.adm',
    'oplus.app',
    'oplus.cac',
    'oplus.dts',
    'oplus.flow',
    'oplus.gfs',
    'oplus.jao',
    'oplus.mac',
    'oplus.os',
    'oplus.search',
    'oplus.ssc',
    'oplus.uaa',
    'oplus.udp',
    'oplus.dev'
]);

// 应用配置
OplusApp.config(['$locationProvider', '$urlRouterProvider', '$stateProvider', '$httpProvider', '$translateProvider', '$compileProvider',
    function($locationProvider, $urlRouterProvider, $stateProvider, $httpProvider, $translateProvider, $compileProvider) {
        
        // URL 路由配置
        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise('/main');
        
        // HTTP 配置
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        
        // 国际化配置
        // 使用 StaticFilesLoader
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('zh-cn');
        $translateProvider.fallbackLanguage('zh-cn');
        $translateProvider.useCookieStorage();
        $translateProvider.useSanitizeValueStrategy('escaped');
        
        // 开发环境禁用调试信息
        if (typeof DEBUG_INFO_ENABLED !== 'undefined' && !DEBUG_INFO_ENABLED) {
            $compileProvider.debugInfoEnabled(false);
        }
    }
]);

// 应用运行时配置
OplusApp.run(['$rootScope', '$state', '$translate', '$window',
    function($rootScope, $state, $translate, $window) {
        
        // 设置全局变量
        $rootScope.$state = $state;
        
        // 路由变化监听
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            // 路由权限检查等逻辑
        });
        
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            console.error('State change error:', error);
        });
        
        // 设置应用信息
        if ($window['@oplus/init'] && $window['@oplus/init'].profiles) {
            const profile = $window['@oplus/init'].profiles[0];
            if (profile) {
                $rootScope.appName = profile.name || 'OPLUS';
                $rootScope.appLogo = profile.ui ? profile.ui.logo : 'content/images/logo-default.png';
            }
        }
        
        console.log('✅ OplusApp initialized successfully');
    }
]);

// 然后导入其他组件
import "../../webapp/app/modules/main/appconfig-init.js";
import "../../webapp/app/modules/main/main-config.js";
import "../../webapp/app/modules/main/main-init.js";
import "../../webapp/app/modules/main/main.controller.js";
import "../../webapp/app/modules/main/main.state.js";
import "../../webapp/app/modules/main/error.controller.js";
import "../../webapp/app/modules/main/error.state.js";
import "../../webapp/app/modules/main/tenant-config-init.js";
import "../../webapp/app/modules/main/tenant-util.js";

console.log('✅ Main module loaded with OplusApp definition'); 