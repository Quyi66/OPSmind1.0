(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('UserManagementDetailController', UserManagementDetailController);

    UserManagementDetailController.$inject = ['$uibModalInstance', 'User', 'entity'];

    function UserManagementDetailController($uibModalInstance, User, entity) {
        var vm = this;

        vm.user = entity;
        vm.clear = clear;

        function init() {
            vm.permissions = [];
            var permissionMap = {};
            for (var i in vm.user.roles) {
                var role = vm.user.roles[i];
                if (role.permissions != null && role.permissions.length > 0) {
                    for (var j in role.permissions) {
                        var permission = role.permissions[j];
                        if (permissionMap[permission.id] == null) {
                            vm.permissions.push(permission);
                            permissionMap[permission.id] = permission;
                        }
                    }
                }
            }
        }

        init();


        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

    }
})();
