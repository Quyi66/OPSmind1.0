(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('RoleDeleteController', RoleDeleteController);

    RoleDeleteController.$inject = ['$uibModalInstance', 'entity', 'Role', 'messageService'];

    function RoleDeleteController($uibModalInstance, entity, Role, messageService) {
        var vm = this;

        vm.role = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            Role.delete({id: id},
                function () {
                    messageService.toast("success", "删除成功");
                    $uibModalInstance.close(true);
                }, function () {
                    messageService.alertWarning("警告", "该角色正在被用户使用,无法删除!");
                });
        }
    }
})();
