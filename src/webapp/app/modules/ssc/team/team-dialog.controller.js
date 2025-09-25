(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('TeamDialogController', TeamDialogController);

    TeamDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Team', 'currentUser', 'messageService', 'cacTemplateService'];

    function TeamDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, Team, currentUser, messageService, cacTemplateService) {
        var vm = this;
        vm.team = entity;
        vm.clear = clear;
        vm.save = save;
        vm.users = [];
        // CAC templates
        vm.cacTemplates = [];
        vm.selectedTemplateIds = [];
        var selectedUserMap = {};

        $timeout(function () {
            angular.element('.form-group:eq(1)>input').focus();
        });

        init();

        function init() {
            initUsers();
            initTemplates();
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

        function initTemplates() {
            cacTemplateService.getTemplates().then(function (templates) {
                vm.cacTemplates = templates || [];
                if (vm.team && vm.team.cacTemplateIds) {
                    if (angular.isArray(vm.team.cacTemplateIds)) {
                        vm.selectedTemplateIds = normalizeTemplateIdType(vm.team.cacTemplateIds);
                    } else if (angular.isString(vm.team.cacTemplateIds)) {
                        // support comma-separated values
                        vm.selectedTemplateIds = normalizeTemplateIdType(vm.team.cacTemplateIds.split(','));
                    }
                }
            }).catch(function () {
                // Ignore template load error in team dialog; keep UI functional
                vm.cacTemplates = [];
            });
        }

        function normalizeTemplateIdType(idList) {
            // Ensure the model type matches the option value type
            var numeric = vm.cacTemplates.length > 0 && angular.isNumber(vm.cacTemplates[0].id);
            if (!numeric) return idList;
            var arr = [];
            for (var i = 0; i < idList.length; i++) {
                var n = parseInt(idList[i]);
                if (!isNaN(n)) arr.push(n);
            }
            return arr;
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
            // attach selected template ids to team payload
            vm.team.cacTemplateIds = angular.copy(vm.selectedTemplateIds || []);
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
