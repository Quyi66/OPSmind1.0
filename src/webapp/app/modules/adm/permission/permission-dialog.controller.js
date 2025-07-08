(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('PermissionDialogController', PermissionDialogController);

    PermissionDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Permission', 'Role'];

    function PermissionDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Permission, Role) {
        var vm = this;

        vm.permission = entity;
        vm.clear = clear;
        vm.save = save;
        vm.roles = Role.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.permission.id !== null) {
                Permission.update(vm.permission, onSaveSuccess, onSaveError);
            } else {
                Permission.save(vm.permission, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('oplusApp:permissionUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
