/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    'use strict';
    angular.module('oplus.cac').provider('cacDao', cacDaoProvider);

    cacDaoProvider.$inject = [];

    function cacDaoProvider() {
        var useLocalDb = false;//window.$oplus.appConfig.modules.cac.useLocalDb;
        this.useLocalDb = function (value) {
            useLocalDb = value;
        };

        this.$get = ['_cacLocalDao', '_cacRemoteDao', cacDaoFactory];

        function cacDaoFactory(cacLocalDao, cacRemoteDao) {
            if (useLocalDb) {
                return cacLocalDao;
            } else {
                return cacRemoteDao;
            }
        }
    }
})();
