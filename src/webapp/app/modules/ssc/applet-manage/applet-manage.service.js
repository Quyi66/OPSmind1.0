/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').service('appletManageService', appletManageService);

    appletManageService.$inject = ['$q', 'restUtils', '$filter', 'OpDownload', 'Upload'];

    function appletManageService($q, restUtils, $filter, OpDownload, Upload) {

        var UDP_MODULE = "udp";
        var ADM_MODULE = "adm";
        this.findAllApplet = findAllApplet;
        this.findApplteById = findApplteById;

        this.exportPages = exportPages;
        this.exportAppletByIds = exportAppletByIds;
        this.importApplets = importApplets;

        this.deleteAppletById = deleteAppletById;
        this.copyApplet = copyApplet;

        this.findAllRecycledApplet = findAllRecycledApplet;
        this.deleteRecycledApplet = deleteRecycledApplet;
        this.deleteRecycledApplets = deleteRecycledApplets;
        this.clearRecycledApplets = clearRecycledApplets;
        this.recoverRecycledApplet = recoverRecycledApplet;

        this.importAppletAndScripts = importAppletAndScripts;

        function deleteAppletById(id) {
            return restUtils.callApi(ADM_MODULE, 'DELETE', '/api/adm/applet/{id}', {id: id});
        }

        function copyApplet(data) {
            return restUtils.callApi(ADM_MODULE, 'POST', '/api/adm/applet/copy', null, data);
        }

        function findApplteById(id) {
            return restUtils.callApi(ADM_MODULE, 'GET', '/api/adm/applet/id/{id}', {id: id});
        }

        function findAllRecycledApplet() {
            return restUtils.callApi(ADM_MODULE, 'GET', '/api/adm/applet/recycled');
        }

        function deleteRecycledApplet(appletCode) {
            return restUtils.callApi(ADM_MODULE, 'DELETE', '/api/adm/applet/recycled/{appletCode}', {appletCode: appletCode});
        }

        function deleteRecycledApplets(appletCodes) {
            return restUtils.callApi(ADM_MODULE, 'GET', '/api/adm/applet/recycled/delete', null, {appletCodes: appletCodes});
        }

        function recoverRecycledApplet(appletCodes) {
            return restUtils.callApi(ADM_MODULE, 'GET', '/api/adm/applet/recycled/recover', null, {appletCodes: appletCodes});
        }

        function clearRecycledApplets() {
            return restUtils.callApi(ADM_MODULE, 'POST', '/api/adm/applet/recycled/clear');
        }


        function findAllApplet() {
            return restUtils.callApi(UDP_MODULE, 'GET', '/api/udp/applets');
        }

        function exportAppletByIds(appletVm, currentTime) {
            var url = restUtils.getApiUrl('adm', '/api/adm/applet/export/relation');
            OpDownload.download(url, "applet-manager-" + currentTime + ".zip", 'POST', null, appletVm);
        }

        function importApplets(importType, udpAppletList) {

            return restUtils.callApi(ADM_MODULE, 'POST', '/api/adm/applet/import/relation/{importType}',
                {importType: importType},
                udpAppletList);
        }

        function exportPages(appletsTree) {
            var dateDate = $filter("date")(new Date(), "yyyyMMddHHmmss");
            var blob = new Blob([angular.toJson(appletsTree)], {type: 'text/plain;charset=utf-8'});
            return saveAs(blob, 'oplus-applet-list-' + dateDate + '.json');
        }

        function importAppletAndScripts(fileInfo) {
            var d = $q.defer();
            var url = restUtils.getApiUrl('adm', '/api/adm/applet/pre-upload/scripts');
            Upload.upload({
                url: url, // data: {file: fileInfo.file, options: Upload.json(fileInfo.options), dir: fileInfo.dir}
                file: fileInfo
            }).then(function (resp) {
                d.resolve(resp.data);
            }, function (resp) {
                var error = restUtils.guessError(resp);
                d.reject(error);
            });
            return d.promise;
        }
    }


})();

