/**
 * @author chenrongji, created on 2021-04-02
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name jaoHostSelector
     * @description
     * ```html
     * <jao-host-selector the-model="array">
     * ```
     * @param {[{key:string, hostname:string, ip:string}]} theModel Two-way binding of selected hosts
     */
    angular.module('oplus.jao').component('deviceDynamicSelector', {
        bindings: {
            theHosts: '=theModel',
            onSelect: '<',
            theData: '=theData'
        },
        templateUrl: 'app/modules/jao/widgets/hostselector2/device-selector.html',
        controller: ['$scope', 'cmActions', 'messageService', '$uibModal', '$translate', HostSelector]
    });

    /**
     * @param $scope
     * @param {cmActions} cmActions
     * @param {messageService} messageService
     * @param $uibModal
     */
    function HostSelector($scope, cmActions, messageService, $uibModal, $translate) {
        var that = this;
        that.removeItem = removeItem;
        that.openSelectorDialog = openDynamicHosts;
        that.clearAll = clearAll;


        function clearAll() {
            messageService.confirm(
                $translate.instant('common.messages.operation.title'),
                $translate.instant('jao.messages.remove_all_hosts'),
                function () {
                    that.theHosts = [];
                });
        }

        function openDynamicHosts() {
            var modal = $uibModal.open({
                templateUrl: 'app/modules/jao/widgets/hostselector2/device-dynamic-selector.html',
                controller: ['$scope', 'theData', 'theHosts', '$uibModalInstance', '$compile', '$timeout', DynamicHostSelectorCtrl],
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    theData: function () {
                        return that.theData;
                    },
                    theHosts: function () {
                        return that.theHosts;
                    }
                }
            });
            modal.result.then(function close(result) {
                that.theHosts = result;
            }, function dismiss() {
            });
        }

        function DynamicHostSelectorCtrl($scope, theData, theHosts, $uibModalInstance, $compile, $timeout) {
            var _ctrl = this;
            _ctrl.selectedStatus = {name: 'all', title: $translate.instant('common.term.all')};
            _ctrl.theData = theData;
            var selectedHosts = [];

            function refreshTable() {
                angular.element("#selectAllHost").off("click");
                // angular.element("#cm-host-table").off("page.dt");
                init();
            }

            $scope.$watch('$ctrl.selectedStatus', function (newVal, oldVal) {
                if (newVal === oldVal)
                    return;
                refreshTable();
            });
            _ctrl.theData.forEach(function (host) {
                host._selected = false;
                theHosts.forEach(function (item) {
                    if (item.key == host.key) {
                        host._selected = true;
                    }
                })
            });
            _ctrl.statusList = [
                {name: 'all', title: $translate.instant('jao.status.flow.all')},
                {name: 'failed', title: $translate.instant('jao.status.flow.failed')},
                {name: 'finished', title: $translate.instant('jao.status.flow.finished')},
                {name: 'skip', title: $translate.instant('jao.status.flow.skip')},
                {name: 'unexecuted', title: $translate.instant('jao.status.flow.unexecuted')}
            ];

            //初始化创建表格
            var tableOption = {
                // order: [[1, 'asc']],
                aoColumns: [
                    {
                        mData: 'key',
                        width: '3rem',
                        title: '<div class="checkbox checkbox-inline checkbox-primary" title="{{\'common.entity.detail.select_all\' | translate}}"><input type="checkbox" id="selectAllHost"><label for="selectAllHost"></label></div>',
                        className: 'text-center',
                        searchable: false,
                        orderable: false,
                        render: function (data, type, row, meta) {
                            var index = _.findIndex(_ctrl.tableHosts, row);
                            var actionHtml = '<div class="checkbox checkbox-inline">' +
                                '<input  type="checkbox" class="checkboxHost" ' +
                                'ng-model="$ctrl.tableHosts[' + index + ']._selected "' +
                                    // 'ng-click="$ctrl.selectHost('+index+')"' +
                                '>' +
                                '<label for="check_host_' + row.key + '"></label></div>';
                            return actionHtml;
                        },
                        createdCell: function (nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    },
                    {mData: 'key', title: $translate.instant('jao.common.host')},
                    {mData: 'status', title: $translate.instant('common.entity.detail.status')}
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
            _ctrl.checkSelectAllHost = function () {
                var pageData = tableInstance.rows({page: 'current'}).data();
                var selectedData = _.filter(pageData, {_selected: true});
                // 如果选中的主机数量等于当前页主机数量，设置全选按钮状态为true;否则为false
                if (pageData.length == selectedData.length) {
                    angular.element("#selectAllHost").prop("checked", true);
                    _ctrl.selectAll = true;
                } else {
                    angular.element("#selectAllHost").prop("checked", false);
                    _ctrl.selectAll = false;
                }
            };
            function init() {
                if (_ctrl.selectedStatus.name == 'all') {
                    _ctrl.tableHosts = _ctrl.theData;
                } else {
                    _ctrl.tableHosts = [];
                    _ctrl.theData.forEach(function (item) {
                        if (item.status == _ctrl.selectedStatus.name) {
                            _ctrl.tableHosts.push(item);
                        }
                    });
                }
                tableOption.ajax = function (data, callback, settings) {
                    callback(
                        {
                            aaData: _ctrl.tableHosts,
                            totalRecords: _ctrl.tableHosts.length
                        }
                    );
                };
                if (tableInstance != null) {
                    tableInstance.destroy();
                }
                $timeout(function () {
                    tableInstance = angular.element("#flow-host-table").DataTable(tableOption);
                    _ctrl.checkSelectAllHost();
                    //为全选框绑定单击事件
                    angular.element("#selectAllHost").on("click", function () {
                        var checkedAll = angular.element("#selectAllHost").prop("checked");
                        if (checkedAll) {
                            angular.element("#flow-host-table tbody :checkbox:not(:checked)").click();
                        } else {
                            angular.element("#flow-host-table tbody :checkbox:checked").click();
                        }
                    });
                    angular.element("#flow-host-table").on("draw.dt", function () {
                        _ctrl.checkSelectAllHost();
                    });
                }, 50);
            }

            _ctrl.cancel = function () {
                $uibModalInstance.dismiss();
            };
            _ctrl.confirm = function () {
                var selected = [];
                _ctrl.tableHosts.forEach(function (value) {
                    if (value._selected) {
                        selected.push(value);
                    }
                });
                $uibModalInstance.close(selected);
            };
            init();
        }

        function removeItem(index) {
            that.theHosts.splice(index, 1);
        }
    }
})();
