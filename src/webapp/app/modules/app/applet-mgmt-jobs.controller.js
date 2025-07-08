/**
 *
 * @author chy, created on 2020 / 10 / 12
 *
 */
(function () {
    'use strict';

    angular.module('oplus.app').controller('AppletMgmtJobsCtrl', AppletMgmtJobsCtrl);

    AppletMgmtJobsCtrl.$inject = ['$stateParams'];

    function AppletMgmtJobsCtrl($stateParams) {
        this.appletCode = $stateParams.appletCode;
    }
})();
