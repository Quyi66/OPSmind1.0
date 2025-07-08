/**
 * @author wuqiang@famessoft.com , created on 2021-04-26.
 */
(function () {
    'use strict';

    angular
        .module('oplus.jao')
        .controller('CommandApproveCtrl', CommandApproveCtrl);

    CommandApproveCtrl.$inject = ['$scope', '$state', '$compile', '$timeout', 'modalHelper', 'messageService', 'commandService', 'dataTable', '$translate'];

    function CommandApproveCtrl($scope, $state, $compile, $timeout, modalHelper, messageService, commandService, dataTable, $translate) {
        var vm = this;
        vm.tableCommands = [];
        vm.showCommandStatus = showCommandStatus;
        vm.commandApprove = commandApprove;
        vm.batchApprove = batchApprove;

        var tableColumnConfig = {
            columns: [
                {
                    data: 'name', title: $translate.instant('common.entity.detail.name'),
                    render: function (data, type, row, meta) {
                        var html = data;
                        if (row.description) {
                            html += '<p class="help-block">' + row.description + '</p>';
                        }
                        return html;
                    }
                },
                {
                    data: 'command',
                    title: $translate.instant('cmd.index.command'),
                    className: 'cac-text-overflow ',
                    width: '500px',
                    render: function (data, type, row, meta) {
                        var html =
                            '<span' +
                            ' style="display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 400px;"' +
                            ' title="' + row.unapprovedCommand + '" ng-non-bindable>' + row.unapprovedCommand + '</span>';

                        return html;
                    }
                },
                {
                    data: 'createdAt',
                    title: $translate.instant('common.entity.detail.create_at'),
                    render: function (data, type, row, meta) {
                        return new Date(Date.parse(data)).toLocaleString();
                    }
                },
                {data: 'createdBy', title: $translate.instant('cmd.index.created_by')},
                // {
                //     data: 'description', title: $translate.instant('common.entity.detail.description'), className: 'cac-text-overflow ', width: '400px',
                //     render: function (data, type, row, meta) {
                //         if (row.description === null) {
                //             row.description = "";
                //         }
                //         return '<span' +
                //             ' style="display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 300px;"' +
                //             ' title="' + row.description + '">' + row.description + '</span>';
                //     }
                // },
                {
                    data: 'status', title: $translate.instant('common.action.action'),
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        return '<button ng-click="$ctrl.commandApprove(' + id + ')" class="btn btn-outline-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cmd.approve.button_approve\'|translate}}"><i class="fa fa-arrow-right"></i></button>';
                    }
                }
            ]
        };

        (function initData() {
            commandService.findAllUnapprovedCommand().then(function (data) {
                vm.tableCommands = data;
            }).catch(function (err) {
                throw err;
            });
        })();

        $scope.$watch('__tableSelectedItems', function (newVal, oldVal) {
            vm.selected = newVal;
        }, true);

        vm.selectedCommands = [];
        vm.tableConfig = {
            tableId: 'approve-list',
            columns: tableColumnConfig.columns,
            data: [unapprovedCommand],
            selection: {
                valueData: 'id', labelData: 'name', preselected: this.selectedCommands, stateFn: function (row) {
                    // return row.status !== 0 ? '' : 'disabled';
                    return row.status !== 0 ? '' : '';
                }
            },
            order: [[3, 'desc']],
            buttons: []
        };

        function unapprovedCommand() {
            return commandService.findAllUnapprovedCommand();
        }

        //批量审核命令
        function batchApprove() {
            vm.selectedCommandIds = vm.tableConfig.selectedItems;
            vm.type = 'batch';
            vm.selected = [];
            vm.tableCommands.forEach(function (value) {
                value.cmd = value.command;
                for (var i in vm.selectedCommandIds) {
                    if (value.id === vm.selectedCommandIds[i]) {
                        vm.selected.push(value);
                    }
                }
            });
            if (vm.selected.length === 0) {
                messageService.toast('error', $translate.instant('cmd.messages.select_command'));
                return;
            }
            showCommandStatus();
        }

        //单条命令审核
        function commandApprove(id) {
            vm.type = 'single';
            vm.tableCommands.forEach(function (command) {
                if (command.id === id) {
                    vm.thisCommand = command;
                }
            });
            showCommandStatus()
        }

        //命令审核弹出框
        function showCommandStatus() {
            var modal = modalHelper.openModal({
                templateUrl: 'app/modules/jao/command/command-approve-modal.html',
                controller: ['$scope', '$state', '$uibModalInstance', 'thisCommand', 'selected', 'type', '$compile',
                    '$timeout', 'commandService', 'messageService', ApproveCtrl],
                controllerAs: '$ctrl',
                backdrop: 'static',
                resolve: {
                    thisCommand: function () {
                        return vm.thisCommand;
                    },
                    selected: function () {
                        return vm.selected;
                    },
                    type: function () {
                        return vm.type;
                    }
                }
            });
            modal.result.then(function close(result) {
            }, function dismiss() {
            });
        }

        function ApproveCtrl($scope, $state, $uibModalInstance, thisCommand, selected, type, $compile,
                             $timeout, commandService, messageService) {
            var vm = this;
            vm.type = type;
            vm.selected = selected;
            vm.thisCommand = thisCommand;
            vm.cancel = cancel;
            vm.isApprove = isApprove;
            vm.reason = reason;
            vm.isReason = false;
            vm.unapprovedReason = "";
            if (type === 'single') {
                if (!thisCommand.command) {
                    vm.action = $translate.instant('cmd.approve.add_command');
                } else {
                    vm.action = $translate.instant('cmd.approve.edit_command');
                }
            }

            function reason(){
                if (vm.isReason) {
                    vm.isReason = false;
                } else {
                    vm.isReason = true;
                }
            }

            function cancel() {
                $uibModalInstance.close({action: "cancel"});
                $uibModalInstance.dismiss({action: "cancel"});
            }

            function isApprove(hasPermission) {
                //命令状态(0=通过,启用、1=待审核、2=审核失败、3=停用)
                if (type === 'single') {
                    selected = [];
                    if (hasPermission) {
                        thisCommand.status = 0;
                        thisCommand.unapprovedReason = vm.unapprovedReason;
                    } else {
                        thisCommand.status = 2;
                        thisCommand.unapprovedReason = vm.unapprovedReason;
                    }
                    selected.push(thisCommand);
                } else {
                    if (hasPermission) {
                        selected.forEach(function (command) {
                            command.status = 0;
                            command.unapprovedReason = vm.unapprovedReason;
                        })
                    } else {
                        selected.forEach(function (command) {
                            command.status = 2;
                            command.unapprovedReason = vm.unapprovedReason;
                        })
                    }
                }
                commandService.approveCommand(selected).then(function (data) {
                    $state.go('app.jao_cmd.command_review', {}, {reload: true});
                    messageService.toast("success", $translate.instant('common.messages.operation.success'));
                    $uibModalInstance.close(true);
                }).catch(function (err) {
                    messageService.toast("error", $translate.instant('common.messages.operation.failed'));
                    $state.go('app.jao_cmd.command_review', {}, {reload: true});
                    $uibModalInstance.close(true);
                    throw err;
                });

                $uibModalInstance.close(true);
            }
        }
    }
})();
