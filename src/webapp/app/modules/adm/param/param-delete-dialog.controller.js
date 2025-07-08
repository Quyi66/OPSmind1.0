(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('ParamDeleteController', ParamDeleteController);

    ParamDeleteController.$inject = ['$uibModalInstance', 'entity', 'Param', 'messageService'];

    function ParamDeleteController($uibModalInstance, entity, Param, messageService) {
        var vm = this;

        vm.param = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            Param.delete({id: id},
                function () {
                    messageService.toast("success", "删除成功");
                    $uibModalInstance.close(true);
                }, function () {
                    messageService.alertWarning("警告", "删除失败!");
                });
        }
    }

})();
