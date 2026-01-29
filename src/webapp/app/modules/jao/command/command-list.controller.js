/**
 * @author wuqiang@famessoft.com , created on 2021-03-17.
 */
(function () {
    'use strict';

    angular.module('oplus.jao').controller('JaoCommandCtrl', JaoCommandCtrl);

    JaoCommandCtrl.$inject = ['$scope', '$state', '$compile', 'modalHelper', '$timeout', '$stateParams', '$location', 'commandService', 'messageService', 'dataTable', '$translate'];

    function JaoCommandCtrl($scope, $state, $compile, modalHelper, $timeout, $stateParams, $location, commandService, messageService, dataTable, $translate) {
        var that = this;
        this.runCommand = runCommand;
        this.runCommands = runCommands;
        this.disableCommand = disableCommand;
        this.deleteCommand = deleteCommand;
        this.approveInfoDetail = approveInfoDetail;
        this.selected = [];
        this.allCommandList = [];

        var columnDefs = [
            {
                data: 'name',
                title: $translate.instant('common.entity.detail.name'),
                render: function (data, type, row, meta) {
                    var command = row.status === 2 || row.status === 1 || row.command == null ? row.unapprovedCommand : row.command;
                    var html = data;
                    if (row.description) {
                        html += '<p class="help-block">' + row.description + '</p>';
                    }
                    if (command) {
                        html += '<p class="help-block" style="display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 200px;" ng-non-bindable>' + command + '</p>';
                    }
                    return '<a class="d-block text-wrap" ui-sref="app.jao_cmd.command_view({id:\'' + row.id + '\'})">' + html + '</a>';
                }
            },
            {data: 'type', title: $translate.instant('common.entity.detail.type')},
            {
                data: 'createdAt',
                title: $translate.instant('common.entity.detail.create_at'),
                render: function (data, type, row, meta) {
                    return new Date(Date.parse(data)).toLocaleString();
                }
            },
            {
                data: 'updatedAt',
                title: $translate.instant('common.entity.detail.update_at'),
                render: function (data, type, row, meta) {
                    return new Date(Date.parse(data)).toLocaleString();
                }
            },
            {data: 'createdBy', title: $translate.instant('cmd.index.created_by')},
            {data: 'checkBy', title: $translate.instant('cmd.index.check_by')},
            {
                data: 'status', title: $translate.instant('common.entity.detail.status'),
                render: function (data, type, row, meta) {
                    var spanClass = "badge bg-success";
                    var status = "";
                    if (row.status === 0) {
                        status = $translate.instant('cmd.list.release');
                    } else if (row.status === 1) {
                        status = $translate.instant('cmd.list.is_approve');
                        spanClass = "badge bg-warning";
                        row.unapprovedReason = "";
                    } else if (row.status === 2) {
                        status = $translate.instant('cmd.list.approve_failed');
                        spanClass = "badge bg-danger";
                    } else if (row.status === 3) {
                        status = $translate.instant('cmd.list.disable');
                        spanClass = "badge bg-danger";
                    }
                    var id = "'" + row.id + "'";
                    return '<span type="button" ng-click="$ctrl.approveInfoDetail(' + id + ')" data-placement="left" class="' + spanClass + '" ' +
                        'data-bs-toggle="popover" title="' + status + '" ' +
                        '>' + status + '</span>';
                }
            },
            {
                data: 'id',
                title: $translate.instant('common.entity.detail.operation'),
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    var runCheck = row.status === 0 ? "" : "disabled";
                    var exitCheck = row.status === 3 ? "disabled" : "";
                    var disable = row.status === 1 || row.status === 2 ? "disabled" : "";
                    var enableDef = row.status === 3 ? ['{{\'common.entity.action.enable\' | translate}}', 'fa-check-circle', 'default'] : ['{{\'common.entity.action.disable\' | translate}}', 'fa-ban', 'default'];
                    var param = angular.toJson({id: row.id});
                    var id = "'" + row.id + "'";
                    return ' <button ' + exitCheck + ' uaa-has-permission="cmd:edit:*" type="submit" ui-sref=app.jao_cmd.command_edit(' + param + ') class="btn btn-default opx-btn-icon opx-btn-flat" title="{{\'common.entity.action.edit\' | translate}}">' +
                        '     <i class="fa fa-pencil"></i>' +
                        ' </button>' +
                        ' <button ' + disable + ' uaa-has-permission="cmd:approve:*" type="button" ng-click="$ctrl.disableCommand(' + id + ')" class="btn btn-' + enableDef[2] + ' opx-btn-icon opx-btn-flat" title="' + enableDef[0] + '">' +
                        '     <i class="fa ' + enableDef[1] + '"></i>' +
                        ' </button>' +
                        ' <button uaa-has-permission="cmd:edit:*" type="submit" ng-click="$ctrl.deleteCommand(' + id + ')" class="btn btn-default opx-btn-icon opx-btn-flat" title="{{\'common.entity.action.delete\' | translate}}">' +
                        '     <i class="fa fa-trash-alt"></i>' +
                        ' </button>' +
                        '<button ' + runCheck + ' type="button" ng-click="$ctrl.runCommand(' + id + ')" ' +
                        'class="btn btn-default btn opx-btn-icon opx-btn-flat" title="{{\'jao.function1\' | translate}}">' +
                        '<i class="fa fa-play-circle"></i>' +
                        '</button>';
                }
            }
        ];

        function init() {
            getAllCommands();
        }
        init()

        function approveInfoDetail(id) {
            for (var i in that.allCommandList) {
                if (id === that.allCommandList[i].id) {
                    that.command = that.allCommandList[i];
                }
            }
            var modal = modalHelper.openModal({
                templateUrl: 'app/modules/jao/command/command-list-approve-detail.html',
                controller: ['$scope', '$state', '$uibModalInstance', 'command', '$compile',
                    '$timeout', 'commandService', 'messageService', ApproveInfoDetailCtrl],
                controllerAs: '$ctrl',
                backdrop: 'static',
                resolve: {
                    command: function () {
                        return that.command;
                    }
                }
            });
            modal.result.then(function close(result) {
            }, function dismiss() {
            });
        }
        function ApproveInfoDetailCtrl($scope, $state, $uibModalInstance, command, $compile,
                             $timeout, commandService, messageService) {
            var vm = this;
            vm.command = command;
            vm.cancel = cancel;

            function init() {
                if (command.status === 0) {
                    command.status = $translate.instant('cmd.list.release');
                } else if (command.status === 1) {
                    command.status = $translate.instant('cmd.list.is_approve');
                } else if (command.status === 2) {
                    command.status = $translate.instant('cmd.list.approve_failed');
                } else if (command.status === 3) {
                    command.status = $translate.instant('cmd.list.disable');
                }
                command.checkAt = new Date(Date.parse(command.checkAt)).toLocaleString();
            }
            init()
            function cancel() {
                $uibModalInstance.close({action: "cancel"});
                $uibModalInstance.dismiss({action: "cancel"});
            }
        }

        // $scope.$watch('__tableSelectedItems', function (newVal, oldVal) {
        //     that.selected = newVal
        // }, true);
        this.selectedCommands = [];
        this.tableConfig = {
            tableId: 'cmd-list',
            columns: columnDefs,
            data: [listCommand],
            selection: {
                valueData: 'id', labelData: 'name', preselected: this.selectedCommands, stateFn: function (row) {
                    return row.status !== 0 ? 'disabled' : '';
                }
            },
            order: [[3, 'desc']],
            buttons: []
        };

        function listCommand() {
            /**
             * 将命令权限细化到个人，命令私有化。
             *
             * @author Bob, 2023/03/27, update
             */
            // return commandService.findCommandByTenantId();
            return commandService.findByTenantIdAndCreatedBy();
        }

        function getAllCommands() {
            commandService.findByTenantIdAndCreatedBy().then(function (data) {
                // commandService.findCommandByTenantId().then(function (data) {
                that.allCommandList = data;
            }).catch(function (err) {
                throw err;
            });
        }

        //启用禁用
        function disableCommand(id) {
            commandService.findCommandById(id).then(function (data) {
                if (data.status === 0) {
                    data.status = 3;
                    messageService.confirm($translate.instant('cmd.list.disable_command'),
                        $translate.instant('cmd.list.disable_message'), function () {
                            saveCommand(data);
                        });
                } else {
                    data.status = 0;
                    messageService.confirm($translate.instant('cmd.list.start_command'),
                        $translate.instant('cmd.list.start_message'), function () {
                            saveCommand(data);
                        });
                }
            }).catch(function (err) {
                throw err;
            });
        }

        function saveCommand(data) {
            commandService.saveCommand(data).then(function () {
                messageService.toast("success", $translate.instant('common.messages.operation.success'));
                $state.go('app.jao_cmd.command_list', null, {reload: true});
            }).catch(function (err) {
                messageService.alertWarning("warning", $translate.instant('common.messages.operation.failed'));
                throw err;
            });
        }

        function deleteCommand(id) {
            messageService.confirm($translate.instant('common.entity.delete.title'),
                $translate.instant('cmd.list.delete_command'), function () {
                    commandService.deleteCommand(id).then(function () {
                        messageService.toast("success", $translate.instant('common.messages.operation.success'));
                        $state.go('app.jao_cmd.command_list', null, {reload: true});
                    }).catch(function (err) {
                        messageService.alertWarning("warning", $translate.instant('common.messages.operation.failed'));
                        throw err;
                    });
                });
        }

        /**
         * 执行单条命令
         * @param id
         */
        function runCommand(id) {
            if (!that.allCommandList.length) {
                getAllCommands();
            }
            that.selectedList = [];
            $timeout(function () {
                that.type = 'runCommand';
                that.selectedList = [];
                for (var i in that.allCommandList) {
                    if (id === that.allCommandList[i].id) {
                        that.selectedList.push(that.allCommandList[i].id);
                    }
                }
                openDynamicCommand();
            }, 500);
        }

        /**
         * 批量执行命令
         * @param id
         */
        function runCommands(type) {
            if (!that.allCommandList.length) {
                getAllCommands();
            }
            $timeout(function () {
                that.type = type;
                that.selectedList = [];
                for (var i in that.selected) {
                    var id = that.selected[i].value;
                    for (var j in that.allCommandList) {
                        var id2 = that.allCommandList[j].id;
                        if (id === id2) {
                            that.selectedList.push(that.allCommandList[j]);
                        }
                    }
                }
                that.selectedList = that.tableConfig.selectedItems;
                openDynamicCommand();
            }, 500);
        }

        //弹出框
        function openDynamicCommand() {
            var modal = modalHelper.openModal({
                templateUrl: 'app/modules/jao/command/command-run.html',
                controller: ['$scope', '$uibModalInstance', 'selected', 'type', '$compile', '$timeout', 'jaoJobService', 'messageService', DynamicCommandSelectorCtrl],
                controllerAs: '$ctrl',
                size: 'md',
                resolve: {
                    selected: function () {
                        // console.log('selected',_ctrl.selectedList);
                        return that.selectedList;
                    },
                    type: function () {
                        return that.type;
                    }
                }
            });
            modal.result.then(function close(result) {
                that.selected = result;
            }, function dismiss() {
            });
        }

        function DynamicCommandSelectorCtrl($scope, $uibModalInstance, selected, type, $compile, $timeout, jaoJobService, messageService) {
            var _ctrl = this;
            _ctrl.hostList = [];
            _ctrl.clear = clear;
            _ctrl.saveJob = saveJob;
            _ctrl.runJob = runJob;
            _ctrl.commands = selected;
            _ctrl.type = type;
            _ctrl.job = {
                type: null,
                title: null,
                description: null,
                configJson: null
            };

            function clear() {
                $uibModalInstance.close({action: "cancel"});
                $uibModalInstance.dismiss({action: "cancel"});
            }

            function saveJob() {
                if (isEmpty()) {
                    return;
                }
                var hostList = _ctrl.hostList;
                var commandInfos = _ctrl.commands;
                var commandIds = [];
                commandInfos.forEach(function (commandId) {
                    commandIds.push({"id": commandId});
                });
                var tasks = [{"commands": commandIds, "hosts": hostList}];
                var configJson = {"tasks": tasks};

                _ctrl.job.title = _ctrl.title;
                _ctrl.job.description = _ctrl.description;
                _ctrl.job.type = 'command';
                _ctrl.job.configJson = angular.toJson(configJson);
                _ctrl.job.params = [];

                jaoJobService.saveJob(_ctrl.job).then(function (result) {
                    $state.go('app.jao_cmd.job_list.view',
                        {type: _ctrl.job.type, id: (_ctrl.job.id || result.id)},
                        {reload: true}
                    );
                    messageService.toast("success", $translate.instant('common.messages.operation.success'));
                    clear();
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant('common.messages.operation.failed'), err.measure());
                });
            }

            function runJob() {
                if (isEmpty()) {
                    return;
                }
                // var hostList = _ctrl.hostList;
                // var commandInfos = _ctrl.commands;
                // var commands = [];
                // commandInfos.forEach(function (command) {
                //     var id = command.id;
                //     var name = command.name;
                //     var type = command.type;
                //     var cmd = command.command;
                // commands.push({"id": id, "name": name, "type": type, "cmd": cmd});
                // });
                // var tasks = [{"commands": commands, "hosts": hostList}];
                // var configJson = {"tasks": tasks};
                // _ctrl.job.configJson = angular.toJson(configJson);

                // var jobRequest = {
                //     jobId: _ctrl.job.id,
                //     type: 'command',
                //     configJson: _ctrl.job.configJson,
                //     options: {
                //         secretParams: [],
                //         params: {}
                //     }
                // };
                var jobRequest = {
                    commands: _ctrl.commands,
                    hosts: _ctrl.hostList
                };
                clear();
                jaoJobService.runCommands(jobRequest, null).then(function () {
                    $state.go('app.jao_cmd.logs', {});
                }).catch(function (err) {
                    messageService.toast('error', 'Error', err.message);
                });
            }

            function isEmpty() {
                if (_ctrl.hostList.length === 0) {
                    messageService.toast('error', $translate.instant("cmd.messages.select_host"));
                    return true;
                }
                return false;
            }
        }
    }
})();
