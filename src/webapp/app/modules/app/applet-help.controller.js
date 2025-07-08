(function () {
    'use strict';

    angular.module('oplus.app').controller('AppletHelpCtrl', AppletHelpCtrl);

    AppletHelpCtrl.$inject = ['$stateParams', '$translate', 'appletService', 'messageService'];

    /**
     *
     * @param $stateParams
     * @param appletService {appletService}
     * @constructor
     */
    function AppletHelpCtrl($stateParams, $translate, appletService, messageService) {
        var vm = this;//$scope;
        vm.isHelpDocExisting = true;

        function init() {
            if ($stateParams.appletCode) {
                appletService.findAppletByCode($stateParams.appletCode).then(function (result) {
                    var helpDocUrl = result.helpDocUrl;
                    if (helpDocUrl) {
                        if (helpDocUrl.indexOf(".pdf") != -1) {
                            viewPdf(helpDocUrl);
                        }
                    } else {
                        vm.isHelpDocExisting = false;
                    }
                }).catch(function () {
                    messageService.alertWarning($translate.instant("app.help.messages.warn.findAppletByCode.error"), $translate.instant("app.help.messages.warn.findAppletByCode.noExit"));
                });
            } else {
                messageService.alertWarning($translate.instant("app.help.messages.warn.findAppletByCode.error"), $translate.instant("app.help.messages.warn.findAppletByCode.noName"));
            }
        }

        init();


        /**
         * view pdf
         * @param helpDocUrl
         */
        function viewPdf(helpDocUrl) {
            PDFObject.embed(getDocFileUrl(helpDocUrl), "#pdf-container");
        }

        function getDocFileUrl(helpDocUrl) {
            return appletService.getHelpDocDownloadUrl(helpDocUrl);
        }
    }
})();
