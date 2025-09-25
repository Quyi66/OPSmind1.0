(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('TeamDialogController', TeamDialogController);

    TeamDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Team', 'currentUser', 'messageService'];

    function TeamDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, Team, currentUser, messageService) {
        var vm = this;
        vm.team = entity;
        vm.clear = clear;
        vm.save = save;
        vm.users = [];
        var selectedUserMap = {};

        $timeout(function () {
            angular.element('.form-group:eq(1)>input').focus();
        });

        init();

        function init() {
            initUsers();
            var selectedUsers = entity.users;
            for (var i in selectedUsers) {
                var user = selectedUsers[i];
                user.isChecked = true;
                selectedUserMap[user.tenantUserId] = user;
            }
        }


        function initUsers() {
            var tid = currentUser.tenantId;
            Team.getAllUsersBasicInfo(tid).then(function (result) {
                if (result !== undefined && result.length > 0) {
                    //push all user info selectedUserMap
                    for (var j in result) {
                        var user = result[j];
                        var tenantUserId = user.tenantUserId;
                        var selectedUser = selectedUserMap[tenantUserId];
                        if (selectedUser !== undefined) {
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
            var selectedUsers = [];
            for (var i in selectedUserMap) {
                if (selectedUserMap[i].isChecked) {
                    selectedUsers.push(selectedUserMap[i]);
                }
            }
            vm.team.users = selectedUsers;
            Team.saveTeam(vm.team).then(function (result) {
                onSaveSuccess(result);
            }).catch(function (err) {
                onSaveError(err);
                throw err;
            });
        }

        function onSaveSuccess(result) {
            messageService.toast('success', 'success');
            $uibModalInstance.close(true);
            vm.isSaving = false;
        }

        function onSaveError(err) {
            messageService.toast('error', "fail:" + err.message);
            vm.isSaving = false;
        }
    }
})();
