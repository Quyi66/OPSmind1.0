(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('PermissionDeleteController', PermissionDeleteController);

    PermissionDeleteController.$inject = ['$uibModalInstance', 'entity', 'Permission', 'messageService'];

    function PermissionDeleteController($uibModalInstance, entity, Permission, messageService) {
        var vm = this;

        vm.permission = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            Permission.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                }, function () {
                    messageService.alertWarning("警告", "该权限正在被角色使用,无法删除!");
                });
        }
    }
})();
