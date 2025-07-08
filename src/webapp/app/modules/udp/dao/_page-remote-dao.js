/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 9/20/2017
 */
(function () {
    'use strict';

    /**
     * @ngdoc
     * @private
     */
    angular.module('oplus.udp').service('_pageRemoteDao', pageRemoteDao);

    pageRemoteDao.$inject = ['$http', 'restUtils','currentUser'];

    /**
     * DAO for remote database
     * @param $http
     * @param restUtils {restUtils}
     */
    function pageRemoteDao($http, restUtils,currentUser) {

        var module = "udp";

        this.findPage = findPage;
        this.findPageByCode = findPageByCode;
        this.findAllPages = findAllPages;
        this.findNotInFolderPages = findNotInFolderPages;
        this.findPages = findPages;
        this.findPageByFolderId = findPageByFolderId;
        // this.savePage = savePage;
        this.updatePagesFolderId = updatePagesFolderId;
        this.deletePage = deletePage;
        this.clonePage = clonePage;
        this.importPages = importPages;
        this.exportPages = exportPages;

        /**
         * @param params
         */
        function findAllPages(options) {
            //options = {"isPaging":false};
            return restUtils.callApi(module,'GET', '/api/udp/pages',null,options);
        }

        /**
         * @param folderId
         * @returns {promise}
         */
        function findNotInFolderPages(folderId) {
            return restUtils.callApi(module,'GET', '/api/udp/not-in-folder/{id}/pages', {id: folderId});
        }


        /**
         * @param ids
         * @param folderId
         * @returns {promise}
         */
        function updatePagesFolderId(ids,folderId) {
            return restUtils.callApi(module,'PUT','/api/udp/folder/{id}/pages?ids={ids}',{id:folderId,ids:ids.toString()});
        }

        function findPages(options) {
            //options["isPaging"] = true;
            return restUtils.callApi(module,'GET','/api/udp/pages?isPaging=true',null,options);
        }

        function findPageByFolderId(options) {
            return restUtils.callApi(module,'GET', '/api/udp/folder/pages/{id}?isPaging=true', {id: options.folderId},options);
        }


        // function savePage(page) {
        //
        //     if (!page.id) {
        //         page.createdBy = currentUser.loginId;
        //         page.creatorName = currentUser.displayName;
        //         page.modifiedBy = currentUser.loginId;
        //         page.modifierName = currentUser.displayName;
        //         return restUtils.callApi(module,'POST', '/api/udp/pages', null, page);
        //     } else {
        //         page.modifiedBy = currentUser.loginId;
        //         page.modifierName = currentUser.displayName;
        //         return restUtils.callApi(module,'PUT', '/api/udp/pages', null, page);
        //     }
        //
        // }

        function findPage(id) {
            return restUtils.callApi(module,'GET', '/api/udp/pages/{id}', {id: id});
        }

        function findPageByCode(code) {
            console.log('findPageByCode', code);
            return restUtils.callApi(module,'GET', '/api/udp/pages/code/{code}', {code: code});
        }

        function deletePage(id) {

            return restUtils.callApi(module,'DELETE', '/api/udp/pages/{id}', {id: id});

        }

       function clonePage(id) {
            return restUtils.callApi(module,'GET', '/api/udp/pages/clone/{id}', {id: id},{userId:currentUser.loginId,userName:currentUser.displayName});
        }

        function importPages(type, pages) {
            for(var i =0; i < pages.length;i++) {
                pages[i].modifiedAt = new Date(pages[i].modifiedAt);
                pages[i].createdAt = new Date(pages[i].createdAt);
                pages[i].setting = angular.fromJson(pages[i].setting);
            }
            return restUtils.callApi(module,'POST', '/api/udp/pages/import/' + type, null, pages);
        }

        function exportPages() {
            restUtils.callApi(module,'GET', '/api/udp/pages/export').then(function (pages) {

                var blob = new Blob([angular.toJson(pages)], {type: 'text/plain;charset=utf-8'});
                saveAs(blob, 'oplus-pages-backup.json');

            }).catch(function (err) {
                throw err;
            });

        }
    }
})();
