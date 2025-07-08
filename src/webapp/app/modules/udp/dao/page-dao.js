/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/12/2017
 */
(function () {
    'use strict';

    /**
     * @ngdoc
     * Data Access Object for page.
     * @usage
     * ```
     * angular.module('oplus.udp')
     *   .config(['pageDaoProvider', function(pageDaoProvider){
     *     pageDaoProvider.useLocalDb(true|false);
     *   }
     * ]);
     * ```
     */
    angular.module('oplus.udp').provider('pageDao', pageDaoProvider);

    pageDaoProvider.$inject = [];

    function pageDaoProvider() {
        var useLocalDb = false;
        this.useLocalDb = function (value) {
            useLocalDb = value;
        };

        this.$get = ['_pageLocalDao', '_pageRemoteDao', pageDaoFactory];

        function pageDaoFactory(pageLocalDao, pageRemoteDao) {
            if (useLocalDb) {
                return pageLocalDao;
            } else {
                return pageRemoteDao;
            }
        }
    }
})();
