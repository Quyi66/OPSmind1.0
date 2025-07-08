/**
 * @author chen,shu-bin (coding99@163.com), created on 12/19/2017
 */
(function () {
    'use strict';

    /**
     * @ngdoc
     * @private
     */
    angular.module('oplus.udp').service('_folderRemoteDao', folderRemoteDao);

    folderRemoteDao.$inject = ['$http', 'restUtils','currentUser'];

    /**
     * DAO for remote database
     * @param $http
     * @param restUtils {restUtils}
     */
    function folderRemoteDao($http, restUtils,currentUser) {

        var module = "udp";

        this.findFolder = findFolder;
        this.findAllFolders = findAllFolders;
        this.findFolderByType = findFolderByType;
        this.saveFolder = saveFolder;
        this.deleteFolder = deleteFolder;


        function findAllFolders(options) {
            return restUtils.callApi(module,'GET', '/api/udp/folders');
        }

        function findFolderByType(type) {
            return restUtils.callApi(module,'GET', '/api/udp/type/{type}/folders', {type: type});
        }

        function saveFolder(folder) {
            if (!folder.id) {
                folder.createdBy = currentUser.loginId;
                folder.createdName = currentUser.displayName;
                folder.modifiedBy = currentUser.loginId;
                folder.modifiedName = currentUser.displayName;
                return restUtils.callApi(module,'POST', '/api/udp/folders', null, folder);
            } else {
                folder.modifiedBy = currentUser.loginId;
                folder.modifiedName = currentUser.displayName;
                return restUtils.callApi(module,'PUT', '/api/udp/folders', null, folder);
            }
        }

        function findFolder(id) {
            return restUtils.callApi(module,'GET', '/api/udp/folders/{id}', {id: id});
        }

        function deleteFolder(id) {
            return restUtils.callApi(module,'DELETE', '/api/udp/folders/{id}', {id: id});
        }



    }
})();
