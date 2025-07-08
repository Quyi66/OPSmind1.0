/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/20/2017
 */
(function () {
    'use strict';

    /**
     * Do not use directly
     * @private
     */
    angular.module('oplus.udp').service('_pageLocalDao', pageLocalDao);

    pageLocalDao.$inject = ['$q', 'localDaoFactory','currentUser'];

    /**
     * DAO for local database (localStorage)
     * @param $q
     * @param {localDaoFactory} localDaoFactory
     */
    function pageLocalDao($q, localDaoFactory) {
        var STORAGE_KEY = 'oplus.udp.pages';
        var dao = localDaoFactory.createDao(STORAGE_KEY);
        var that = this;
        this.findPage = dao.findEntity;
        this.findPageByCode = findPageByCode;//根据code查找页面
        this.findAllPages = findAllPages;
        // this.findPageByFolder = findPageByFolder;
        this.savePage = dao.saveEntity;
        this.deletePage = dao.deleteEntity;
        this.importPages = importPages;
        this.exportPages = exportPages;

        /**
         *
         * @param type
         * @param pages Pages to be imported
         * @returns {Promise}
         */
        function importPages(type, pages) {
            var d = $q.defer();
            that.findAllPages().then(function (existingPages) {
                var i = existingPages.length;
                while (i--) {
                    var p = existingPages[i];
                    if (_.find(pages, {id: p.id})) {
                        existingPages.splice(i, 1);
                    }
                }
                var allPages = existingPages.concat(pages);
                dao.saveAllEntities(allPages);
                d.resolve({num: pages.length});
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        function exportPages() {
            var blob = new Blob([localStorage.getItem(STORAGE_KEY)], {type: 'text/plain;charset=utf-8'});
            saveAs(blob, 'oplus-pages-backup.json');
        }

        /**
         *
         * @param options {{noContent:boolean=}}
         * @returns {promise<{total:number,records:{}}>}
         */
        function findAllPages(options) {
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

        /**
         * @params options
         *
         */
        function  findPageByCode(options) {

            var d = $q.defer();
            options = options || "";
            dao.findAllEntities().then(function (data) {


                var obj = {id:null};
                data.forEach(function (page) {

                    if(page.code == options) {
                        obj = page;
                    }

                });

                d.resolve(obj);


            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        /**
         * @param options {{noContent:boolean=}}
         * @returns {promise<{total:number,records:{}}>}
         */
        function findPageByFolder(options) {

            var d = $q.defer();
            options = options || "";
            dao.findAllEntities().then(function (data) {


                if (options.noContent) {
                    data.forEach(function (r) {
                        delete r.html;
                    });
                }

                var pageList = [];
                data.forEach(function (page) {

                    if(page.folderId == options) {
                        pageList.push(page);
                    }else if(options.trim() == "" &&  !page.folderId) {
                        pageList.push(page);
                    }

                });

                d.resolve(pageList);


            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;

        }

    }
})
();
