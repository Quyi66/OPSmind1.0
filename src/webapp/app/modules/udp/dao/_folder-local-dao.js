/**
 * @author chen,shu-bin Liao (leoliaolei@gmail.com), created on 9/20/2017
 */
(function () {
    'use strict';

    /**
     * Do not use directly
     * @private
     */
    angular.module('oplus.udp').service('_folderLocalDao', folderLocalDao);

    folderLocalDao.$inject = ['$q', 'localDaoFactory'];

    /**
     * DAO for local database (localStorage)
     * @param $q
     * @param localDaoFactory
     */
    function folderLocalDao($q, localDaoFactory) {
        var STORAGE_KEY = 'oplus.udp.folders';
        var dao = localDaoFactory.createDao(STORAGE_KEY);
        var that = this;
        this.findFolder = dao.findEntity;
        this.findAllFolders = findAllFolders;
        this.findFolderByType = findAllFolders;
        this.saveFolder = dao.saveEntity;
        this.deleteFolder = dao.deleteEntity;

        /**
         *
         * @param options {{noContent:boolean=}}
         * @returns {promise<{total:number,records:{}}>}
         */
        function findAllFolders(options) {
            var d = $q.defer();
            options = options || {};
            dao.findAllEntities().then(function (data) {
                if (options.noContent) {
                    data.forEach(function (r) {
                        delete r.html;
                    });
                }
                d.resolve(data);
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

    }
})();
