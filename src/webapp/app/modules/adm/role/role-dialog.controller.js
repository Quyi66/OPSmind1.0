(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('RoleDialogController', RoleDialogController);

    RoleDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Role', 'Permission', 'User', 'messageService'];

    function RoleDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, Role, Permission, User, messageService) {
        var vm = this;

        vm.role = entity;
        vm.clear = clear;
        vm.save = save;

        vm.permissions = [];
        vm.users = [];

        var selectedUserMap = {};

        $timeout(function () {
            angular.element('.form-group:eq(1)>input').focus();
        });

        function init() {
            Permission.query(function (result) {
                var selectedPermissions = entity.permissions;
                if (selectedPermissions != null && selectedPermissions.length > 0) {
                    var allPermissionMap = {};
                    for (var j in result) {
                        allPermissionMap[result[j].id] = result[j];
                    }
                    for (var i in selectedPermissions) {
                        var selectedId = selectedPermissions[i].id;
                        if (allPermissionMap[selectedId] != undefined) {
                            allPermissionMap[selectedId].isChecked = true;
                        } else {
                            console.log("Permission [" + selectedId + "] not exists!");
                        }
                    }
                }
                vm.permissions = result;
            });

            var selectedUsers = entity.users;
            for (var i in selectedUsers) {
                var user = selectedUsers[i];
                user.isChecked = true;
                selectedUserMap[user.tenantUserId] = user;
            }

            initUsers();
        }

        init();

        function initUsers() {
            User.getAllUsersBasicInfo().then(function (result) {
                if (result != undefined && result.length > 0) {
                    //push all user info selectedUserMap
                    for (var j in result) {
                        var user = result[j];
                        var tenantUserId = user.tenantUserId;
                        var selectedUser = selectedUserMap[tenantUserId];
                        if (selectedUser != undefined) {
                            result[j] = selectedUser;
                            // console.log("Find selected user " + selectedUser.fullName + "--" + selectedUser.isChecked);
                        } else {
                            selectedUserMap[tenantUserId] = user;
                        }
                    }
                }
                vm.users = result;
            });
        }

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {

            vm.isSaving = true;
            //collect all selected permissions
            var selectedPermissions = [];
            for (var i in vm.permissions) {
                if (vm.permissions[i].isChecked) {
                    selectedPermissions.push(vm.permissions[i]);
                }
            }
            vm.role.permissions = selectedPermissions;

            //collect all selected users
            var selectedUsers = [];
            for (var i in selectedUserMap) {
                if (selectedUserMap[i].isChecked) {
                    selectedUsers.push(selectedUserMap[i]);
                }
            }
            vm.role.users = selectedUsers;

            if (vm.role.id !== null) {
                Role.update(vm.role, onSaveSuccess, onSaveError);
            } else {
                Role.save(vm.role, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess(result) {
            messageService.toast('success', '保存成功');
            $scope.$emit('oplusApp:roleUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError() {
            vm.isSaving = false;
        }
    }
})();
