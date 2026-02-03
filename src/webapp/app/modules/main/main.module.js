(function () {

    'use strict';
    // OplusApp 模块现在在 app.js 中定义，这里只定义 oplus.main
    angular.module('oplus.main', [
        'ui.router',
        'ui.router.state.events',
        'ui.bootstrap',
        'ngResource',
        'ngStorage',
        'ngCookies',
        'ngAnimate',
        'ngSanitize',
        'ngCacheBuster',
        'ngAria',
        'ngLocale',
        'tmh.dynamicLocale',
        'pascalprecht.translate',
        'angularFileUpload',
        'ngFileUpload',
        'infinite-scroll',
        'angular-loading-bar',
        // 'angulartics',
        // 'angulartics.piwik',
        'oplus.layout',
        'oplus.commons',
        'oplus.dev',
        'oplus.uaa',
        'oplus.dts',
        'oplus.udp',
        'oplus.jao',
        'oplus.acm',
        'oplus.gfs',
        'oplus.cac',
        'oplus.app',
        'oplus.adm',
        'oplus.ssc',
        'oplus.mac',
        'oplus.search',
        'oplus.flow',
        'oplus.os',
        'oplus.vap'
    ]);
    angular.module('oplus.main').config(['commonsConfigProvider', function (commonsConfigProvider) {
        var value = _.get(window.$oplus.appConfig, 'modules.udp.dataEx.defaultUnresolvedVar');
        // console.log('window.$oplus.appConfig.modules.udp.dataEx.defaultUnresolvedVar="'+value+'"');
        commonsConfigProvider.setDataExDefaultUnresolvedVar(value);
    }]);
    angular.module('oplus.main').run(['mainInit', function (mainInit) {
        mainInit.init();
    }]);
})();
