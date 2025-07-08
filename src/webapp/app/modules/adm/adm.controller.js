/**
 *
 * @author wuqiang@famessoft.com , created on 2020-08-07.
 */
(function () {
    'use strict';

    angular.module('oplus.adm').controller('admCtrl', admCtrl);

    admCtrl.$inject = ['tenantUtil'];

    function admCtrl(tenantUtil) {
        var vm = this;

        vm.isOplusAdminUI = tenantUtil.isOplusAdminUI();
    }
})();
