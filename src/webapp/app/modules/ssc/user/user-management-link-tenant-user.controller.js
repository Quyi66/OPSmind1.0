(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('LinkTenantUserController', LinkTenantUserController);

    LinkTenantUserController.$inject = ['$scope', '$timeout', '$compile', '$uibModalInstance', 'tenantId', 'onAddUser', 'User', 'messageService', 'dataTable','$translate'];

    function LinkTenantUserController($scope, $timeout, $compile, $uibModalInstance, tenantId, onAddUser, User, messageService, dataTable,$translate) {
        var vm = this;

        vm.selectUser = selectUser;
        vm.clear = clear;
        vm.save = save;
        //把创建用户事件传递到调用关联用户的调用者
        vm.onAddUser = onAddUser;

       /* (function init() {
            loadUsers();
        })();*/

        var selectedUsers = {};

        function selectUser(userId) {
            selectedUsers[userId] = !selectedUsers[userId];
            console.log("selectedUsers = " + JSON.stringify(selectedUsers));
        }

        /*function loadUsers() {
            // console.log("Run load users for tenant " + tenantId);
            User.getNotAssociatedTenantUsers(tenantId).then(function (result) {
                dataTable.initTable(".select-tenant-user-table", tableColumnConfig, result, {order: [[1, 'desc']]});
            });
        }*/

        var tableColumnConfig = [
            {
                mData: 'id', title: $translate.instant("sys_userManagement.choice"),
                searchable: false,
                orderable: false,
                render: function (data, type, user, meta) {

                    var userIdWrapp = "'" + data + "'";
                    return '<label class="i-checks"><input type="checkbox" ' + (selectedUsers[data] ? 'checked' : '') + ' ng-click="addTenantUserVm.selectUser(' + userIdWrapp + ')"/><i></i></label>';
                }/*,
                createdCell: function (nTd) {
                    $compile(nTd)($scope);
                }*/
            },
            {data: 'login', title: $translate.instant("sys_userManagement.login")},
            {data: 'fullName', title:  $translate.instant("sys_userManagement.fullName")},
            {data: 'department', title:  $translate.instant("sys_userManagement.department")},
        ];

        $scope.tableConfig = {
            data: [getPromise, ''],
            columns: tableColumnConfig,
            order: [[1, 'desc']],
            buttons: ['reload']
        }

        function getPromise() {
            return User.getNotAssociatedTenantUsers(tenantId);
        }


        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function onSaveSuccess(result) {
            vm.isSaving = false;
            $uibModalInstance.close(result);
            messageService.toast("success", $translate.instant("sys_userManagement.operationSuccess"));
        }

        function onSaveError(result) {
            vm.isSaving = false;
            // console.log(JSON.stringify(result));
            messageService.toast("error",  $translate.instant("sys_userManagement.operationError",{msg:result.data.title}));
        }

        function save() {
            // console.log("save vm.user.roles = " + JSON.stringify(vm.user.roles));
            vm.isSaving = true;

            //collect all selected roles
            var selectedUserIds = [];
            for (var i in selectedUsers) {
                if (selectedUsers[i]) {
                    selectedUserIds.push(i);
                }
            }
            if (selectedUserIds.length > 0) {
                User.associatedTenantUsers(tenantId, selectedUserIds).then(function () {
                    onSaveSuccess();
                }, function (result) {
                    onSaveError(result);
                });
            } else {
                $uibModalInstance.close();
                messageService.toast("warning", $translate.instant("sys_userManagement.noUserSelected"));
            }
        }

    }
})();
