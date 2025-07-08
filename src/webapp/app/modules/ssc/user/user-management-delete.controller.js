(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('UserManagementDeleteController', UserManagementDeleteController);

    UserManagementDeleteController.$inject = ['$uibModalInstance', 'entity', 'User'];

    function UserManagementDeleteController($uibModalInstance, entity, User) {
        var vm = this;

        vm.user = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete() {
            User.delete({tenantUserId: vm.user.tenantUserId},
                function () {
                    $uibModalInstance.close(vm.user);
                });
        }
    }
})();
