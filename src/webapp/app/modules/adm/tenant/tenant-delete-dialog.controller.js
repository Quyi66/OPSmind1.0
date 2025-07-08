(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('TenantDeleteController', TenantDeleteController);

    TenantDeleteController.$inject = ['$uibModalInstance', 'entity', 'Tenant', 'messageService'];

    function TenantDeleteController($uibModalInstance, entity, Tenant, messageService) {
        var vm = this;

        vm.tenant = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            //console.log("Delete id = " + id);
            Tenant.delete({id: id},
                function () {
                    messageService.toast("success", "删除成功");
                    $uibModalInstance.close(true);
                }, function () {
                    messageService.alertWarning("警告", "此租户关联其它资源，删除失败!");
                });
        }
    }
})();
