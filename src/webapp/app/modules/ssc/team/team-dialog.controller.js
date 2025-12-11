(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('TeamDialogController', TeamDialogController);

    TeamDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Team', 'currentUser', 'messageService', 'appletService'];

    function TeamDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, Team, currentUser, messageService, appletService) {
        var vm = this;
        vm.team = entity;
        vm.clear = clear;
        vm.save = save;
        vm.users = [];
        vm.applets = [];
        vm.activeTab = entity.id ? 2 : 1; // 编辑时默认激活"用户"Tab，新建时激活"基本信息"Tab
        var selectedUserMap = {};

        $timeout(function () {
            angular.element('.form-group:eq(1)>input').focus();
        });

        init();

        function init() {
            initUsers();
            initTeamApplet(entity.id);
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

        function initTeamApplet(teamId) {
            // 获取团队已选中的应用ID列表（来自 /api/team/{id} 接口返回的 appletIds）
            var selectedAppletIds = entity.appletIds || [];

            // 使用与用户管理相同的 API 获取真实的应用列表
            appletService.findAppletsByTenantUser(currentUser.tenantUserId || '', currentUser.loginId || '').then(function (applets) {
                if (applets && applets.length > 0) {
                    for (var i = 0; i < applets.length; i++) {
                        // 根据 entity.appletIds 设置默认选中状态
                        applets[i]._team_applet = selectedAppletIds.indexOf(applets[i].id) !== -1;
                    }
                }
                vm.applets = applets;
                console.log('Loaded applets with team selection:', applets, 'selectedAppletIds:', selectedAppletIds);
            }).catch(function (err) {
                // API 失败时使用 mock 数据进行开发测试
                console.warn('Failed to load applets, using mock data:', err);
                vm.applets = getMockApplets();
            });
        }

        // Mock data for testing - same format as user management applets
        function getMockApplets() {
            return [
                { id: '1', title: '系统巡检', name: 'system-patrol', _team_applet: true },
                { id: '2', title: 'vCenter Manager', name: 'vcenter-manager', _team_applet: false },
                { id: '3', title: '密码管理', name: 'password-mgmt', _team_applet: true },
                { id: '4', title: 'sudo权限管理', name: 'sudo-mgmt', _team_applet: false },
                { id: '5', title: '资产管理', name: 'asset-mgmt', _team_applet: true },
                { id: '6', title: '补丁管理', name: 'patch-mgmt', _team_applet: false },
                { id: '7', title: '软件管理', name: 'software-mgmt', _team_applet: true },
                { id: '8', title: 'Oplus Core', name: 'oplus-core', _team_applet: false },
                { id: '9', title: '流程管理', name: 'flow-mgmt', _team_applet: true },
                { id: '10', title: '用户管理', name: 'user-mgmt', _team_applet: false },
                { id: '11', title: '应用启停', name: 'app-control', _team_applet: false },
                { id: '12', title: '数据下传', name: 'data-transfer', _team_applet: true }
            ];
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
            // Save team applets - use vm.team.id for edit, result.id for new team
            var teamId = (result && result.id) ? result.id : vm.team.id;
            if (teamId && vm.applets && vm.applets.length > 0) {
                console.log('Saving team applets for teamId:', teamId, 'applets:', vm.applets);
                appletService.saveAppletsByTeam(vm.applets, teamId).then(function () {
                    console.log('Team applets saved successfully');
                }).catch(function (err) {
                    console.warn('Failed to save team applets:', err);
                });
            } else {
                console.warn('Skipped saving team applets - teamId:', teamId, 'applets length:', vm.applets ? vm.applets.length : 0);
            }
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
