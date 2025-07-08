(function () {
    'use strict';

    angular.module('oplus.main')
        // .config(['AppConfigProvider', function (AppConfigProvider) {
        //     AppConfigProvider.init();
        // }])
        // .config(['restUtilsProvider', function (restUtilsProvider) {
        //     Object.keys(window.$oplus.appConfig.apiBaseUrls).forEach(function (module) {
        //         restUtilsProvider.registerModuleApi(module, window.$oplus.appConfig.apiBaseUrls[module]);
        //     });
        // }])
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push(['$q', function ($q) {
                return {
                    'request': function (config) {
                        var url = config.url;
                        // Intercept jhipster API
                        if (url.indexOf('management/') === 0 ||
                            (url.indexOf('api/') === 0 && url.indexOf('api/data') !== 0)) {
                            // var baseUrl = window.$oplus.appConfig.apiBaseUrls.portal;
                            // config.url = baseUrl + '/' + config.url;
                            // console.log(url);
                            return config || $q.when(config);
                        } else {
                            return config;
                        }
                    }
                }
            }])
        }])
        .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
        }])
        .config(['$uibModalProvider', function ($uibModalProvider) {
            // https://stackoverflow.com/questions/39626752/disabling-animation-for-angular-ui-bootstrap-modals-completely
            $uibModalProvider.options.animation = false;
        }]);

})();
