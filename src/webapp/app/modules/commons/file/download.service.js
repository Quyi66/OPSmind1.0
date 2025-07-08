/**
 * @author Joker Liu , created on 03/04/2020
 */
(function () {
    'use strict';

    angular.module('oplus.commons').service('OpDownload', OpDownload);

    OpDownload.$inject = ['$http', 'messageService','$uibModal','$translate'];

    /**
     * @ngdoc service
     * @name OpDownload
     * @description service for file upload
     *
     * @param {$http} $http
     * @param {messageService} messageService
     */
    function OpDownload($http, messageService,$uibModal,$translate) {

        this.download = download;

        /**
         * Content-Disposition: attachment; filename="check-rhel-gmcc-latest.sh"
         *
         * @param {string} url 请求地址，分隔符为"/"
         * @param {string} [fileName] 要保存为的文件名。不传则优先跟据Content-Disposition识别，其次跟据URL识别文件名。可选
         * @param {string} [method] http 请求方式，默认GET。可选
         * @param {object} [params] 转为?param1=xx1¶m2=xx2的形式，可选
         * @param {object} [data] 包含了将被当做消息体发送给服务器的数据，通常在POST请求时使用。可选
         */
        function download(url, fileName, method, params, data) {
            var httpConfig = {
                url: url,
                method: method ? method : "GET",
                responseType: "arraybuffer"
            };
            if (params) {
                httpConfig.params = params;
            }
            if ("POST" === method) {
                httpConfig.data = data;
            }
            //大小*下载速度=进度(待定),拟态框(待优化)。
            var instance = $uibModal.open({
                template: '<div class="modal-header">'+
                    '<button type="button" class="btn-close" data-dismiss="modal" title="'+$translate.instant('common.file.close_prompt')+'" ng-click="$ctrl.cancel()" style="margin-left: 95%;"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="op-blank-slate">' +
                    '<div class="op-blank-slate-icon">' +
                    '<i class="fa fa-4x fa-pulse fa-spinner fa-fw"></i>' +
                    '</div>' +
                    '<p class="op-flashing-text">'+$translate.instant('common.file.file_downloading')+'</p>' +
                    '</div>' +
                    '</div>',
                controller: ['$scope','$uibModalInstance',viewCtrl],
                controllerAs: '$ctrl',
                size: 'sm',
                backdrop: 'static'
            });

            function viewCtrl($scope,$uibModalInstance){
                var vm = this;
                vm.cancel = cancel;
                function cancel() {
                    $uibModalInstance.close({action: "cancel"});
                }
                $http(httpConfig).then(
                    function success(response) {
                        var finalFileName = getFileName(fileName, response, url);
                        var file = new File([response.data], finalFileName, {type: response.headers("Content-Type")});
                        saveAs(file);
                        $uibModalInstance.close(true);
                        // messageService.toast('success', '下载完成','文件名：'+finalFileName);
                        // Open file
                        // var file=new Blob([response.data],{type: response.headers("Content-Type")});
                        // var fileUrl=URL.createObjectURL(file);
                        // window.open(fileUrl);
                    }, function error(err) {
                        //响应错误的处理方法体
                        messageService.toast('error', '【' + fileName + '】'+$translate.instant('common.file.download_failed'), err.message || err);
                    });
            }

            /**
             * Content-Disposition: attachment; filename="check-rhel-gmcc-latest.sh"
             *
             * 优先使用assign,其次跟据response header中的Content-Disposition识别，最后跟据URL识别文件名。可选
             *
             * @param {string} assignName
             * @param {object} response response
             * @param {string} url url
             * @returns {string} file name
             *
             */
            function getFileName(assignName, response, url) {
                var result, tempArr;
                if (assignName && assignName.length > 0) {
                    result = assignName;
                } else {
                    var contentDisposition = response.headers("Content-Disposition");
                    if (contentDisposition && contentDisposition.indexOf("filename") !== -1) {
                        tempArr = contentDisposition.split(";");
                        var fileNamePart = _.find(tempArr, function (str) {
                            return str.indexOf("filename") !== -1;
                        });
                        var fileNameStr = fileNamePart.trim().split("=")[1];
                        result = fileNameStr.substring(1, fileNameStr.length - 1);
                    } else {
                        tempArr = url.split("/");
                        result = tempArr[tempArr.length - 1];
                    }
                }
                return result;
            }

        }

    }
})();
