/**
 * @author Joker Liu , created on 04/08/2019
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('OpUpload', OpUpload);

    OpUpload.$inject = ['Upload', '$q', '$http'];

    /**
     * @ngdoc service
     * @name OpUpload
     * @description service for file upload
     *
     */
    function OpUpload(Upload, $q, $http) {

        this.uploadOrReplace = uploadOrReplace;
        this.upload = upload;
        this.preUpload = preUpload;
        this.confirm = confirm;
        this.replace = replace;
        this.delete = deleteFile;
        this.getOriginalNameFromPath = getOriginalNameFromPath;

        /**
         * @description union of upload, preUpload,replace
         *
         * @param option {object} {module:'module', category:'category',action: 'preUpload' or undefined, files: file array, id: file id for replace, path: file path for replace,updateName: whether
         * update existing record's file name}
         * @returns {promise}
         */
        function uploadOrReplace(option) {
            var module = option.module;
            var category = option.category;
            var module = option.module;

            if ((option.id != undefined && option.id.length > 0) || (option.path != undefined && option.path.length > 0)) {
                return replace(module, category, option.files[0], option.id, option.path, option.updateName);
            } else if (option.action == "preUpload") {
                return preUpload(module, category, option.files);
            } else {
                return upload(module, category, option.files);
            }
        }

        /**
         * @description upload file to file server and return remote file path
         *
         * @param module {string} business module like : portal/tm/cm/udp/dts
         * @param category {string} business category or function name
         * @param files {Array<file>} file array
         * @param action {string} 'upload' or 'preUpload'
         * @returns {promise} promise resolve result format :
         * {
         *   data:[{
         *       id,
         *       name:originalName + '-' + milliseconds,
         *       originalName,
         *       size,
         *       module:value，
         *       category,
         *       path:'module + / + category + / + name',
         *       status:preUpload/upload/uploadFail
         *   }...],
         *   status:'success',
         *   message:''
         * }
         *
         */
        function upload(module, category, files, action) {
            var deferred = $q.defer();//声明承诺

            action = action == undefined ? "upload" : action;
            Upload.upload({
                url: 'api/upload',
                data: {action: action, module: module, category: category, params: files}
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);//请求成功
            }).error(function (data, status, headers, config) {
                deferred.reject(data);//请求成功
            });

            return deferred.promise;   // 返回承诺
        }

        /**
         * @description upload file to file server and return remote file path, the remote file path is truly : '/temp' + file path
         *
         * @param module {string} business module like : portal/tm/cm/udp/dts
         * @param category {string} business category or function name
         * @param files {Array<file>} file array
         * @returns {promise} promise resolve result format : </br>
         * {
         *   data:[{
         *       id,
         *       name:originalName + '-' + milliseconds,
         *       originalName,
         *       size,
         *       module:value，
         *       category,
         *       path:'module + / + category + / + name',//the file path is accessible after confirmed
         *       status:preUpload/uploadFail
         *   }...],
         *   status:'success',
         *   message:''
         * }
         *
         */
        function preUpload(module, category, files) {
            return upload(module, category, files, "preUpload");
        }

        /**
         * @description use to confirm file upload by method preUpload
         *
         * @param module {string} business module like : portal/tm/cm/udp/dts
         * @param category {string} business category or function name
         * @param ids {Array<string>} array of file id
         * @returns {promise} promise resolve result format :</br>
         * {
         *   data:[{
         *       id,
         *       name,
         *       originalName,
         *       size,
         *       module,
         *       category,
         *       path:,
         *       status:upload/confirmFail
         *   }...],
         *   status:'success',
         *   message:''
         * }
         */
        function confirm(module, category, ids) {
            var deferred = $q.defer();//声明承诺
            $http.put("api/upload/confirm", {module: module, category: category, params: ids})
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        }


        /**
         * @description replace the file content by id or path, replacement will not change exiting file name,id and path, so no need to update the existing reference
         *
         * @param module {string} business module like : portal/tm/cm/udp/dts
         * @param category {string} business category or function name
         * @param file {file}
         * @param id {string} id priority is greater than path
         * @param path {string}
         * @returns {promise} promise resolve result format :</br>
         * {
         *   data:[{
         *       id,
         *       name,
         *       originalName,
         *       size,
         *       module:value，
         *       category,
         *       path,
         *       status:replace/upoloadFail
         *   }...],
         *   status:'success',
         *   message:''
         * }
         */

        function replace(module, category, file, id, path, isUpdateName) {
            var action = id != undefined ? "replaceById" : "replaceByPath";
            action = isUpdateName ? (action + "AndUpdateName") : action;

            var deferred = $q.defer();//声明承诺
            Upload.upload({
                url: 'api/upload',
                method: 'put',
                data: {action: action, module: module, category: category, params: [file], id: id, path: path}
            }).success(function (data, status, headers, config) {
                // console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                deferred.resolve(data);//请求成功
            }).error(function (data, status, headers, config) {
                // console.log('error status: ' + status);
                deferred.reject(data);//请求成功
            });

            return deferred.promise;   // 返回承诺
        }

        /**
         * @description delete file by id or path
         *
         * @param module {string} business module like : portal/tm/cm/udp/dts
         * @param category {string} business category or function name
         * @param ids {Array<string>}
         * @param paths {Array<string>}
         * @returns {promise} promise resolve result format :</br>
         * {
         *   data:[{
         *       id,
         *       name,
         *       originalName,
         *       size,
         *       module:value，
         *       category,
         *       path,
         *       status:delete/deleteFail
         *   }...],
         *   status:'success',
         *   message:''
         * }
         */
        function deleteFile(module, category, ids, paths) {
            var deferred = $q.defer();//声明承诺

            var action, params;
            if (ids != undefined) {
                action = "deleteById";
                params = ids;
            } else {
                action = "deleteByPath";
                params = paths;
            }

            $http.delete("api/upload?action=" + action + "&module=" + module + "&category=" + category + "&params=" + params.join(','))
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });

            return deferred.promise;   // 返回承诺
        }

        /**
         * get original file name from path(/xxx/xxx/xxxx-name.type)
         * @param path
         * @returns {string}
         */
        function getOriginalNameFromPath(path) {
            var originalName = "";
            if (path) {
                var tempArr = path.split("/");
                var fileName = tempArr[tempArr.length - 1];
                originalName = fileName.slice(fileName.indexOf("-") + 1);
            }
            return originalName;
        }
    }
})();
