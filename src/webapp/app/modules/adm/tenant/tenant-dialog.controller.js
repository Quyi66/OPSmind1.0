(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('TenantDialogController', TenantDialogController);

    TenantDialogController.$inject = ['$scope', '$state', '$timeout', 'entity', 'Tenant', 'messageService'];

    function TenantDialogController($scope, $state, $timeout, entity, Tenant, messageService) {
        var vm = this;

        vm.tenant = entity;
        vm.clear = clear;
        vm.save = save;
        vm.onAddUser = onAddUser;

        $timeout(function () {
            angular.element('.form-group:eq(0)>input').focus();
        });

        function init() {
        }

        init();

        function clear() {
            $state.go('^', {}, {reload: true});
        }

        function save() {

            vm.isSaving = true;

            if (vm.tenant.id !== null) {
                Tenant.update(vm.tenant, onSaveSuccess, onSaveError);
            } else {
                Tenant.save(vm.tenant, onSaveSuccess, onSaveError);
            }
        }

        /**
         * when linked use to tenant
         * @param users array or null(cancel)
         */
        function onAddUser(users) {
            if (users) {
                //notify component of user list to refresh
                $scope.$broadcast('TENANT-USER:LINKED');
            }
        }

        function onSaveSuccess(result) {
            vm.isSaving = false;
            $state.go('^', {}, {reload: true});
        }

        function onSaveError(e) {
            vm.isSaving = false;
            var message = (e && e.data) ? e.data.title : JSON.stringify(e);
            messageService.confirm('保存失败', message);
        }
    }
})();
