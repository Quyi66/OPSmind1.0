/**
 * @author chen,shu-bin (coding99@163.com), created on 12/19/2017
 */
(function () {
    'use strict';

    /**
     * @ngdoc
     * Data Access Object for folder.
     * @usage
     * ```
     * angular.module('oplus.udp')
     *   .config(['folderDaoProvider', function(folderDaoProvider){
     *     folderDaoProvider.useLocalDb(true|false);
     *   }
     * ]);
     * ```
     */
    angular.module('oplus.udp').provider('folderDao', folderDaoProvider);

    folderDaoProvider.$inject = [];

    function folderDaoProvider() {
        var useLocalDb = false;
        this.useLocalDb = function (value) {
            useLocalDb = value;
        };

        this.$get = ['_folderLocalDao', '_folderRemoteDao', folderDaoFactory];

        function folderDaoFactory(folderLocalDao, folderRemoteDao) {
            if (useLocalDb) {
                return folderLocalDao;
            } else {
                return folderRemoteDao;
            }
        }
    }
})();
