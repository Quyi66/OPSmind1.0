/**
 *
 * @author wuqiang@famessoft.com , created on 2021-03-17.
 */
(function () {
    'use strict';

    angular
        .module('oplus.jao')
        .controller('CommandAddController', CommandAddController);

    CommandAddController.$inject = ['$state', '$timeout', '$scope', '$stateParams', 'commandService', 'messageService', '$translate'];

    function CommandAddController($state, $timeout, $scope, $stateParams, commandService, messageService, $translate) {
        var vm = this;
        vm.clear = clear;
        var id = $stateParams.id;
        vm.save = save;
        vm.allTypes = [$translate.instant('cmd.list.choose_grammar'), "cmd", "shell", "python", "playbook", "powershell"];
        vm.command = {type: vm.allTypes[0]}
        $timeout(function () {
            angular.element('.form-group:eq(0)>input').focus();
        });
        vm.viewMode = !id ? 'create' : ($state.current.name === 'app.jao_cmd.command_edit' ? 'edit' : 'view');
        if (id !== undefined) {
            commandService.findCommandById(id).then(function (data) {
                vm.command = data;
                vm.oldCmd = vm.command.command;
                if (vm.command.status === 1 || vm.command.status === 2) {
                    //修改待审核状态的命令
                    vm.command.command = vm.command.unapprovedCommand;
                }
                return vm.command;
            }).catch(function (err) {
                throw err;
            });
        }

        function save() {
            if (vm.command.type === $translate.instant('cmd.list.choose_grammar')) {
                messageService.toast('error', $translate.instant('common.messages.input', {obj: $translate.instant('cmd.list.choose_grammar')}))
                return;
            }
            if (id === null) {
                //新增命令
                vm.command.unapprovedCommand = vm.command.command;
                vm.command.command = null;
            } else {
                //修改命令
                vm.command.unapprovedCommand = vm.command.command;
                vm.command.command = vm.oldCmd;
            }
            vm.isSaving = true;
            commandService.saveCommand(vm.command).then(function () {
                clear();
                onSaveError();
            }).catch(function (err) {
                onSaveError();
                throw err;
            });
        }

        function onSaveError() {
            vm.isSaving = false;
        }

        function clear() {
            $state.go('app.jao_cmd.command_list', {});
        }
    }
})();
