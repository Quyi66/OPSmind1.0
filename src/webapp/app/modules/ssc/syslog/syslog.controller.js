(function () {
    'use strict';

    angular.module('oplus.ssc').controller('udpSyslogCtrl', udpSyslogCtrl);

    udpSyslogCtrl.$inject = ['$scope', '$state', '$compile', '$stateParams', '$location', 'messageService', 'udpTagsService', '$q', 'SyslogService', 'OperationlogService', '$translate'];

    function udpSyslogCtrl($scope, $state, $compile, $stateParams, $location, messageService, udpTagsService, $q, SyslogService, OperationlogService, $translate) {
        $scope.activeTab = 'login';

        sysLoginQuery();
        operationLoginQuery();

        function sysLoginQuery() {
            var tableColumnConfig = [
                // {mData: 'userId', title: "用户ID"},
                {mData: 'username', title: $translate.instant('sys_log.login_user')},
                {mData: 'loginTime', title: $translate.instant('sys_log.login_time')},
                {
                    mData: 'ipAddress', title: "IP",
                    render: function (data, type, row, meta) {
                        var spanClass = "badge bg-light";
                        return '<span type="text"  data-placement="left" class="' + spanClass + '" ' +
                            'title="' + row.ipAddress + '" ' +
                            '>' + row.ipAddress + '</span>';
                    }
                },
                {mData: 'geoLocation', title: $translate.instant('sys_log.address')},
                {
                    mData: 'loginStatus', title: $translate.instant('sys_log.login_status'),
                    render: function (data, type, row, meta) {
                        var spanClass = "badge bg-success";
                        if (row.loginStatus === "failed") {
                            spanClass = "badge bg-danger";
                        }
                        return '<span type="text"  data-placement="left" class="' + spanClass + '" ' +
                            'title="' + row.loginStatus + '" ' +
                            '>' + row.loginStatus + '</span>';
                    }
                },
                {
                    mData: 'deviceInfo',
                    title: $translate.instant('sys_log.device_info'),
                    render: function (data, type, row) {
                        if (!data) return '';
                        return '<span type="text" style="display:inline-block; max-width:200px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis;"  data-placement="left" ' +
                            ' title="' + data + '" ' +
                            '>' + data + '</span>';
                    }
                }
                // {mData: 'remark', title: "备注"},
            ];

            SyslogService.query(function (result) {
                $scope.sysTableConfig = {
                    data: result.content,
                    columns: tableColumnConfig,
                    order: [[1, 'desc']]
                };
            });
        }

        function operationLoginQuery() {
            var tableColumnConfig = [
                // {mData: 'id', title: "用户ID"},
                {mData: 'operator', title: $translate.instant('sys_log.operator')},
                {mData: 'operateTime', title: $translate.instant('sys_log.operate_time')},
                {mData: 'appModule', title: $translate.instant('sys_log.app_module')},
                {
                    mData: 'operationType', title: $translate.instant('sys_log.operation_type'),
                    render: function (data, type, row, meta) {
                        var spanClass = "badge bg-success";
                        if (row.operationType === "DELETE") {
                            spanClass = "badge bg-danger";
                        } else if (row.operationType === "UPDATE") {
                            spanClass = "badge bg-warning";
                        } else if (row.operationType === "CREATE") {
                            spanClass = "badge bg-secondary";
                        } else if (row.operationType === "EXECUTE") {
                            spanClass = "badge bg-primary";
                        } else if (row.operationType === "QUERY") {
                            spanClass = "badge bg-info";
                        }
                        return '<span type="text"  data-placement="left" class="' + spanClass + '" ' +
                            'title="' + row.operationType + '" ' +
                            '>' + row.operationType + '</span>';
                    }
                },
                {mData: 'description', title: $translate.instant('sys_log.description')},
                {
                    mData: 'status', title: $translate.instant('sys_log.status'),
                    render: function (data, type, row, meta) {
                        var spanClass = "badge bg-success";
                        if (row.status === "failed") {
                            spanClass = "badge bg-danger";
                        }
                        return '<span type="text"  data-placement="left" class="' + spanClass + '" ' +
                            'title="' + row.status + '" ' +
                            '>' + row.status + '</span>';
                    }
                }
            ];

            OperationlogService.query(function (result) {
                $scope.operationTableConfig = {
                    data: result,
                    columns: tableColumnConfig,
                    order: [[1, 'desc']]
                };
            });
        }
    }
})();
