/**
 *
 * @author wuqiang@famessoft.com, created on 2020/08/12
 */
(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('tenantParamDeleteController', tenantParamDeleteController);

    tenantParamDeleteController.$inject = ['$uibModalInstance', 'entity', 'messageService','paramService','$translate'];

    function tenantParamDeleteController($uibModalInstance, entity, messageService,paramService,$translate) {
        var vm = this;

        vm.param = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            paramService.deleteParam(id).then(function () {
                messageService.toast("success", $translate.instant("adm.content.delete_success"));
                $uibModalInstance.close(true);
            }).catch(function (err) {
                messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                $uibModalInstance.close(true);
                throw err;
            });
        }
    }

})();
