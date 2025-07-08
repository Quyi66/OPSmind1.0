/**
 * @author wuqiang@famessoft.com , created on 2021-03-23.
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name jaoCommandSelector
     * @description
     * ```html
     * <jao-command-selector the-model="array">
     * ```
     * @param {[{id:string, command:string}]} theModel Two-way binding of selected hosts
     */
    angular.module('oplus.jao').component('jaoDynamicCommandSelector', {
        bindings: {
            theCommand: '=theModel',
            onSelect: '<',
            theData: '=theData'
        },
        templateUrl: 'app/modules/jao/command/commandselector/command-selector.html',
        controller: ['$scope', 'cmActions', 'messageService', '$uibModal', '$translate', CommandSelector]
    });

    /**
     * @param $scope
     * @param {cmActions} cmActions
     * @param {messageService} messageService
     * @param $uibModal
     */
    function CommandSelector($scope, cmActions, messageService, $uibModal, $translate) {
        var that = this;
        that.removeItem = removeItem;
        that.openCommandDialog = openCommandDialog;
        that.clearAllCommand = clearAllCommand;

        function clearAllCommand() {
            messageService.confirm($translate.instant('common.messages.operation.title'), $translate.instant('cmd.messages.remove_all_command'), function () {
                that.theCommand = [];
            });
        }

        function initDeleteNullCommand() {
            for (var i = 0; i < that.theCommand.length; i++) {
                if (that.theCommand[i].cmd === null) {
                    that.theCommand.splice(i--, 1);
                }
            }
        }

        initDeleteNullCommand();

        function openCommandDialog() {
            openDynamicCommand();
        }

        //弹出框
        function openDynamicCommand() {
            var modal = $uibModal.open({
                templateUrl: 'app/modules/jao/command/commandselector/command-dynamic-selector.html',
                controller: ['$scope', 'theData', 'theCommand', '$uibModalInstance', '$compile', '$timeout','$translate', DynamicCommandSelectorCtrl],
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    theData: function () {
                        return that.theData;
                    },
                    theCommand: function () {
                        return that.theCommand;
                    }
                }
            });
            modal.result.then(function close(result) {
                that.theCommand = result;
            }, function dismiss() {
            });
        }

        function DynamicCommandSelectorCtrl($scope, theData, theCommand, $uibModalInstance, $compile, $timeout,$translate) {

            var _ctrl = this;
            _ctrl.tableCommands = [];
            _ctrl.theData = theData;
            _ctrl.theData.forEach(function (command) {
                command._selected = false;
                theCommand.forEach(function (item) {
                    if (item.id === command.id) {
                        command._selected = true;
                    }
                })
            });

            //初始化创建表格
            var tableOption = {
                order: [[1, 'asc']],
                aoColumns: [
                    {
                        mData: 'id',
                        width: '3rem',
                        title: '<div class="checkbox checkbox-inline checkbox-primary" title="$translate.instant(\'jao.select_all\')"><input type="checkbox" id="selectAllCommand"><label for="selectAllCommand"></label></div>',
                        className: 'text-center',
                        searchable: false,
                        orderable: false,
                        render: function (data, type, row, meta) {
                            var id = "'" + row.id + "'";
                            var index = _.findIndex(_ctrl.tableCommands, row);
                            var actionHtml = '<div class="checkbox checkbox-inline">' +
                                '<input ng-click="$ctrl.select(' + id + ')"  type="checkbox" class="checkboxHost" ' +
                                'ng-model="$ctrl.tableCommands[' + index + ']._selected "' +
                                '>' +
                                '<label for="check_host_' + row.id + '"></label></div>';
                            return actionHtml;
                        },
                        createdCell: function (nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    },
                    {mData: 'name', title: $translate.instant('common.entity.detail.name'), width: '200px'},
                    {mData: 'type', title: $translate.instant('common.entity.detail.type'), width: '100px'},
                    {
                        mData: 'command', title: $translate.instant('cmd.index.command'), className: 'cac-text-overflow ', width: '500px',
                        render: function (data, type, row, meta) {
                            return '<span' +
                                ' style="display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 400px;"' +
                                ' title="' + row.command + '">' + row.command + '</span>';
                        }
                    }
                ],
                autoWidth: false,
                deferRender: true,
                processing: true,
                lengthMenu: [10, 25, 50, 100],
                colReorder: true,
                stateSave: true,//datatable分页刷新后 固定在当前页
                retrieve: true,//和destroy一起，用于屏蔽Cannot reinitialise DataTable提示的
                destroy: true,
                serverSide: false,//true表示服务器端分页，false表示前端分页
                pagingType: "simple_numbers",
                dom: '<"dataTables_header"<"dataTables_toolbar" <"dataTables_controls" >f>>t<"dataTables_footer row"<"col-md-6 m-t" <"pull-left" l><"pull-left" i>><"col-md-6 m-t"p>><"clearfix">',
                createdRow: function (row, data, dataIndex) {
                },
                initComplete: function () {
                },
                //每一次绘datatables时候调用的方法
                fnPreDrawCallback: function (oSettings) {
                }
            };
            var tableInstance = null;
            _ctrl.checkSelectAllCommand = function () {
                var pageData = tableInstance.rows({page: 'current'}).data();
                var selectedData = _.filter(pageData, {_selected: true});
                // 如果选中的主机数量等于当前页主机数量，设置全选按钮状态为true;否则为false
                if (pageData.length == selectedData.length) {
                    angular.element("#selectAllCommand").prop("checked", true);
                    _ctrl.selectAll = true;
                } else {
                    angular.element("#selectAllCommand").prop("checked", false);
                    _ctrl.selectAll = false;
                }
            };

            function init() {
                _ctrl.tableCommands = _ctrl.theData;
                tableOption.ajax = function (data, callback, settings) {
                    callback(
                        {
                            aaData: _ctrl.theData,
                            totalRecords: _ctrl.theData.length
                        }
                    );
                };
                if (tableInstance != null) {
                    tableInstance.destroy();
                }
                $timeout(function () {
                    tableInstance = angular.element("#command-list-table").DataTable(tableOption);
                    _ctrl.checkSelectAllCommand();
                    // 为全选框绑定单击事件
                    angular.element("#selectAllCommand").on("click", function () {
                        var checkedAll = angular.element("#selectAllCommand").prop("checked");
                        if (checkedAll) {
                            angular.element("#command-list-table tbody :checkbox:not(:checked)").click();
                        } else {
                            angular.element("#command-list-table tbody :checkbox:checked").click();
                        }
                    });
                    angular.element("#command-list-table").on("draw.dt", function () {
                        _ctrl.checkSelectAllCommand();
                    });
                }, 50);
            }

            _ctrl.cancel = function () {
                $uibModalInstance.dismiss();
            };

            //按照用户选择命令的顺序对命令进行排序。
            if (theCommand.length !== 0) {
                _ctrl.selected = [];
                for (var i = 0; i < theCommand.length; i++) {
                    _ctrl.selected.push(theCommand[i]);
                }
            } else {
                _ctrl.selected = [];
            }
            $timeout(function () {
                _ctrl.select = function (id) {
                    _ctrl.tableCommands.forEach(function (value) {
                        value.cmd = value.command;
                        if (value.id === id && value._selected === true) {
                            _ctrl.selected.push(value);
                        } else if (value.id === id && value._selected === false) {
                            for (var i = 0; i < _ctrl.selected.length; i++) {
                                if (_ctrl.selected[i].id === value.id) {
                                    _ctrl.selected.splice(i, 1);
                                }
                            }
                        }
                    });
                };
            }, 50);

            _ctrl.confirm = function () {
                var selected = [];
                _ctrl.tableCommands.forEach(function (value) {
                    value.cmd = value.command;
                    if (value._selected) {
                        selected.push(value);
                    }
                });
                $uibModalInstance.close(_ctrl.selected);
            };
            init();
        }

        function removeItem(index) {
            that.theCommand.splice(index, 1);
        }
    }
})();
