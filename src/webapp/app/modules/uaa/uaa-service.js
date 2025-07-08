/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/23/2017
 */
(function () {
    'use strict';
    angular.module('oplus.uaa').provider('uaaService', uaaServiceProvider);

    function uaaServiceProvider() {
        var disabled = false;
        this.disableUaa = function () {
            disabled = true;
        };
        this.$get = [function () {
            return {
                isDisabled: function () {
                    return disabled;
                }
            };
        }];
    }
})();