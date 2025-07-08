(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('BusinessModuleDeleteController', BusinessModuleDeleteController);

    BusinessModuleDeleteController.$inject = ['$uibModalInstance', 'entity', 'BusinessModule', 'messageService'];

    function BusinessModuleDeleteController($uibModalInstance, entity, BusinessModule, messageService) {
        var vm = this;

        vm.businessModule = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            BusinessModule.delete({id: id},
                function () {
                    messageService.toast("success", "删除成功");
                    $uibModalInstance.close(true);
                }, function () {
                    messageService.alertWarning("警告", "删除失败!");
                });
        }
    }
})();
