(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('SscParamDeleteController', ParamDeleteController);

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
                    messageService.toast("success", $translate.instant("adm.content.delete_success"));
                    $uibModalInstance.close(true);
                }, function () {
                    messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                });
        }
    }

})();
