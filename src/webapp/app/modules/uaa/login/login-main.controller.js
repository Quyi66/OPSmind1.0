(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .controller('LoginMainController', LoginMainController);

    LoginMainController.$inject = ['$rootScope', '$state'];

    function LoginMainController($rootScope, $state) {
        var that = this;
        this.logoNavbarPath = window.$oplus.appConfig.ui.headerLogo;
        $rootScope.$global.hideHeader = true;
        $rootScope.$global.settings.navigationMode = 'usermode';
        //Recommended version to support flexbox: https://caniuse.com/flexbox-gap
        //Minimum version to support ES6: https://caniuse.com/es6
        this.browsers = {
            chrome: {icon: 'fa-chrome', version: '84', min: '60'},
            firefox: {icon: 'fa-firefox', version: '63', min: '60'},
            edge: {icon: 'edge', version: '84', min: '16'},
            safari: {icon: 'safari', version: '14.1', min: '12'}
        };


        // vm.browerSupport = Object.keys(window.$oplus.appConfig.supportBrowser).map(function (value) {
        //     var version = window.$oplus.appConfig.supportBrowser[value].latestVersion;
        //     return value + (version === '0' ? '' : (' ' + version + '+'));
        // }).join(', ');
    }
})();
