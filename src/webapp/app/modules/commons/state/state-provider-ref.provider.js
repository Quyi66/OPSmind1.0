/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/14, created
 */
(function () {
    'use strict';
    angular.module('oplus.commons').provider('stateProviderRef', [stateProviderRefProvider]);

    /**
     * @ngdoc provider
     * @name stateProviderRefProvider
     * @description
     * @deprecated
     * Use $stateRegistry instead.
     */
    function stateProviderRefProvider() {
        var refs = {};
        this.injectStateProvider = function ($stateProvider) {
            refs['$stateProvider'] = $stateProvider;
        };
        this.$get = [function () {
            return {
                get: function () {
                    return refs['$stateProvider'];
                }
            };
        }];
    }
})();
