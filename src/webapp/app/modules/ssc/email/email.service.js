/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').service('sscEmailService', sscEmailService);

    sscEmailService.$inject = ['$q', 'restUtils'];

    function sscEmailService($q, restUtils) {
        var module = "portal";
        this.getEmailConfig = getEmailConfig;
        this.saveEmailConfig = saveEmailConfig;
        this.runEmailConfig = runEmailConfig;
        this.getCacEmailSwitch = getCacEmailSwitch;
        this.saveCacEmailSwitch = saveCacEmailSwitch;


        function getEmailConfig() {
            return restUtils.callApi(module, 'GET', '/api/email-config');
        }

        function saveEmailConfig(emails) {
            return restUtils.callApi(module, 'POST', '/api/email-config',null,emails);
        }

        function runEmailConfig(recipient) {
            return restUtils.callApi(module, 'GET', '/api/email-config/{recipient}', {recipient:recipient});
        }

        function getCacEmailSwitch() {
            return restUtils.callApi(module, 'GET', '/api/email-config/cac-on-off');
        }

        function saveCacEmailSwitch(S) {
            return restUtils.callApi(module, 'POST', '/api/email-config/cac-on-off', null,S);
        }

    }

})();

