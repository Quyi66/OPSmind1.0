/**
 *
 * @author WuQiang, created on 2022-03-02
 */
(function () {
    'use strict';

    angular.module('oplus.jao').controller('CommandConsoleController', CommandConsoleController);

    CommandConsoleController.$inject = ['$scope', '$rootScope', '$state', '$filter', '$timeout', '$uibModal', 'messageService', 'jaoJobService', '$stateParams', '$translate', 'currentUser'];

    /**
     *
     * @param $scope
     * @param $rootScope
     * @param $state
     * @param $timeout
     * @param $uibModal
     * @param {messageService} messageService
     * @param {jaoJobService} jaoJobService
     * @param $stateParams
     * @constructor
     */
    function CommandConsoleController($scope, $rootScope, $state, $filter, $timeout, $uibModal, messageService, jaoJobService, $stateParams, $translate, currentUser) {
        var vm = this;
        vm.allTypes = [$translate.instant('cmd.list.choose_grammar'), "cmd", "shell", "python", "playbook", "powershell"];
        vm.command = {type: vm.allTypes[0]}
        vm.runCommand = runCommand;
        vm.cacheConsoleData = cacheConsoleData;
        vm.clear = clear;
        vm.history = history;
        vm.hosts = []
        vm.command.cmd = currentUser.console_cmd;
        if (currentUser.console_id) {
            vm.command.id = currentUser.console_id;
        }
        if (currentUser.console_hosts) {
            vm.hosts = currentUser.console_hosts;
        }
        if (currentUser.console_type) {
            vm.command.type = currentUser.console_type;
        }

        function runCommand() {
            vm.command.name = "console";
            // vm.command.id = "402881827f7eb825017f7ed5dfbf0002";
            console.log(vm.command);
            console.log(vm.hosts);
            var jobRequest = {
                commands: [],
                consoleCmd: [vm.command],
                hosts: vm.hosts
            };

            if (isEmpty()) {
                return;
            }

            jaoJobService.runConsoleCommand(jobRequest).then(function () {
                // $state.go('app.jao_cmd.logs', {});
            }).catch(function (err) {
                messageService.toast('error', 'Error', err.message);
            });
        }

        function cacheConsoleData() {
            if (vm.command.id) {
                currentUser.console_id = vm.command.id;
            }
            currentUser.console_cmd = vm.command.cmd;
            currentUser.console_hosts = vm.hosts;
            currentUser.console_type = vm.command.type;
        }

        function clear() {
            $state.go('app.jao_cmd.command_list', {});
        }

        function isEmpty() {
            if (!vm.hosts.length) {
                messageService.toast('error', $translate.instant("cmd.messages.select_host"));
                return true;
            } else if (vm.command.type === vm.allTypes[0]) {
                messageService.toast('error', $translate.instant("cmd.list.choose_grammar"));
                return true;
            } else if (!vm.command.cmd) {
                messageService.toast('error', $translate.instant("cmd.messages.select_command"));
                return true;
            }
            return false;
        }

        function history() {
            jaoJobService.findAllConsoleLog().then(function (result) {
                vm.theData = []
                result.forEach(function (consoleConfig) {
                    var data = {};
                    var cmdConfig = JSON.parse(consoleConfig.cmdConfig);
                    data.cmd = cmdConfig[0].cmd;
                    data.type = cmdConfig[0].type;
                    var hostConfig = JSON.parse(consoleConfig.hostConfig);
                    var hosts = []
                    hostConfig.forEach(function (host) {
                        hosts.push(host.value);
                    });
                    data.hostConfig = hostConfig;
                    data.hostname = hosts;
                    data.id = consoleConfig.id
                    data.createdAt = $filter('date')(new Date(consoleConfig.createdAt), "yyyy-MM-dd HH:mm:ss");
                    data.createdBy = consoleConfig.createdBy
                    data.lastRunTime = $filter('date')(new Date(consoleConfig.lastRunTime), "yyyy-MM-dd HH:mm:ss");
                    data.runNumber = consoleConfig.runNumber
                    vm.theData.push(data);
                });
                openDynamicConsoleLog();
            }).catch(function (err) {
                messageService.toast('error', 'Error', err.message);
            });
        }

        //弹出框
        function openDynamicConsoleLog() {
            var modal = $uibModal.open({
                templateUrl: 'app/modules/jao/command/command-console-dynamic.html',
                controller: ['$scope', 'theData', '$uibModalInstance', '$compile', '$timeout', '$translate', openDynamicConsoleLogCtrl],
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    theData: function () {
                        return vm.theData;
                    }
                }
            });
            modal.result.then(function close(data) {
                var hostConfig = data.hostConfig;
                vm.command.id = data.id;
                vm.command.cmd = data.cmd;
                vm.hosts = hostConfig;
                vm.command.type = data.type;
            }, function dismiss() {
            });
        }

        function openDynamicConsoleLogCtrl($scope, theData, $uibModalInstance, $compile, $timeout, $translate) {
            var ctrl = this;
            ctrl.theData = theData;
            ctrl.returnData = returnData;

            var columnDefs = [
                {
                    mData: 'cmd',
                    title: $translate.instant('cmd.index.command'),
                    className: 'cac-text-overflow ',
                    width: '500px',
                    render: function (data, type, row, meta) {
                        return '<span' +
                            ' style="display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 100px;"' +
                            ' title="' + row.cmd + '">' + row.cmd + '</span>';
                    }
                },
                {mData: 'type', title: $translate.instant('cmd.list.grammar'), width: '100px'},
                {
                    mData: 'hostname',
                    title: $translate.instant('cmd.index.host'),
                    className: 'cac-text-overflow ',
                    width: '500px',
                    render: function (data, type, row, meta) {
                        return '<span' +
                            ' style="display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 100px;"' +
                            ' title="' + row.hostname + '">' + row.hostname + '</span>';
                    }
                },
                {mData: 'createdAt', title: $translate.instant('cmd.index.created_at'), width: '100px'},
                {mData: 'createdBy', title: $translate.instant('cmd.index.created_by'), width: '100px'},
                {mData: 'lastRunTime', title: $translate.instant('cmd.index.last_run_time'), width: '100px'},
                {mData: 'runNumber', title: $translate.instant('cmd.index.run_number'), width: '100px'},
                {
                    data: 'id',
                    title: $translate.instant('cmd.index.action'),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        return ' <button type="submit" class="btn btn-default opx-btn-icon opx-btn-flat"' +
                            ' ng-click="$ctrl.returnData(' + id + ')" title="{{\'cmd.index.data_back\' | translate}}">' +
                            '     <i class="fa fa-reply"></i></button>';
                    }
                    // ,
                    // createdCell: function (nTd, sData, oData, iRow, iCol) {
                    //     $compile(nTd)($scope);
                    // }
                }

            ];

            ctrl.tableConfig = {
                tableId: 'console-log',
                columns: columnDefs,
                data: ctrl.theData,
                order: [[5, 'desc']],
                buttons: []
            };

            function listConsoleLog() {
                return jaoJobService.findAllConsoleLog();
            }

            ctrl.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function returnData(id) {
                ctrl.theData.forEach(function (data) {
                    if (data.id === id) {
                        $uibModalInstance.close(data);
                    }
                });

            }
        }

    }
})();
