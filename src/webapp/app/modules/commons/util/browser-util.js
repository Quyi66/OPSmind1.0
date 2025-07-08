/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/2/15, created
 */
(function () {
    'use strict';
    angular.module('oplus.commons').service('browserUtil', [browserUtil]);

    /**
     * @ngdoc service
     * @name browserUtil
     * @description
     */
    function browserUtil() {
        //Recommended version to support flexbox: https://caniuse.com/flexbox-gap
        //Minimum version to support ES6: https://caniuse.com/es6
        var supportedBrowsers = {
            chrome: {icon: 'fa-chrome', version: '84', min: '60'},
            firefox: {icon: 'fa-firefox', version: '63', min: '60'},
            edge: {icon: 'edge', version: '84', min: '16'},
            safari: {icon: 'safari', version: '14.1', min: '12'}
        };
    }
})();
