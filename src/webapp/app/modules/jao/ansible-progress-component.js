/**
 * @author luohuanjiang created on 2021-04-15
 */
(function () {
    'use strict';

    /**
     Component routing jaoAnsibleProgress
     */
    angular.module('oplus.jao').component('jaoAnsibleProgress', {
        templateUrl: 'app/modules/jao/ansible-progress.html',
        controller: ['$scope', '$interval', '$http', 'messageService', 'utils', 'jaoJobService', '$translate', AnsibleProgressCtrl],
        bindings: {
            runId: '<',
            autoRefresh: '<'
            // options: '<'
        }
    });

    /**
     * Used with component.
     * @param $scope
     * @param $http
     * @param {messageService} messageService
     * @param utils
     * @param {jaoJobService} jaoJobService
     * @param $translate
     */
    function AnsibleProgressCtrl($scope, $interval, $http, messageService, utils, jaoJobService, $translate) {
        var that = this;
        var stopper;
        $scope.$watch('$ctrl.runId', function (newVal, oldVal) {
            if (newVal) controlQuery();
        });
        $scope.$watch('$ctrl.autoRefresh', function (newVal, oldVal) {
            var intervalMs = newVal;
            if (angular.isNumber(intervalMs) && intervalMs >= 2000) {
                stopper = $interval(function () {
                    that.tableConfig.reloadData();
                }, intervalMs);
            }
        });
        $scope.$on('$destroy', function () {
            if (stopper) {
                console.log('Destroy refresh timer')
                $interval.cancel(stopper);
                stopper = undefined;
            }
        })

        that.termination_someHosts = function (key, ataNode, pid) {
            messageService.confirm(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.detail.operation')}),
                $translate.instant('jao.messages.operation_body', {
                    operation: $translate.instant('jao.common.terminate'),
                    runId: key
                }),
                function () {
                    //终止
                    var value = {
                        key: key,
                        ataNode: ataNode,
                        pid: pid
                    };
                    jaoJobService.ansibleProgress("termination", that.runId, value).then(function (result) {
                        messageService.toast('success', $translate.instant('jao.messages.operation_success', {
                            operation: $translate.instant('jao.common.terminate'),
                            runId: key
                        }));
                    });
                });
        };

        function controlQuery() {
            var tableColumns = [
                {data: 'key', title: $translate.instant('jao.common.host')},
                {
                    data: 'duration', title: $translate.instant('jao.result.detail.duration'),
                    render: function (data, type, row, meta) {
                        return utils.formatDuration(data);
                    }
                },
                {data: 'ataNode', title: $translate.instant('jao.common.node')},
                {data: 'taskName', title: $translate.instant('jao.common.task')},
                {
                    data: 'key',
                    title: $translate.instant('common.entity.detail.operation'),
                    class: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        return '<div class="btn-group">' +
                            '    <button type="button" ng-click="$ctrl.termination_someHosts(\'' + row.key + '\',\'' + row.ataNode + '\',\'' + row.pid + '\')" class="btn btn-outline-danger btn-sm">{{\'jao.common.terminate\' | translate}}</button>' +
                            '</div>'
                    }
                }
            ];

            that.tableConfig = {
                data: [getPromise, ''],
                columns: tableColumns,
                order: [[1, 'desc']],
                buttons: ['reload']
            }

            function getPromise() {
                return jaoJobService.ansibleProgress("query", that.runId);
            }

            that.terminationAllHosts = function () {
                messageService.confirm(
                    $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.detail.operation')}),
                    $translate.instant('jao.messages.operation_body', {
                        operation: $translate.instant('jao.common.terminate'),
                        runId: that.runId
                    }),
                    function () {
                        jaoJobService.ansibleProgress("terminationAll", that.runId).then(function (result) {
                            messageService.toast('success', $translate.instant('jao.messages.operation_success', {
                                operation: $translate.instant('jao.common.terminate'),
                                runId: that.runId
                            }));
                        });
                    });
            };

            that.pauseJob = function (pause) {
                if (pause) {
                    messageService.confirm(
                        $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.detail.operation')}),
                        $translate.instant('jao.messages.operation_body', {
                            operation: $translate.instant('jao.common.continue'),
                            runId: that.runId
                        }),
                        function () {
                            messageService.toast('success', $translate.instant('jao.messages.operation_success', {
                                operation: $translate.instant('jao.common.continue'),
                                runId: that.runId
                            }));
                            that.pause = false;
                        });
                } else {
                    messageService.confirm(
                        $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.detail.operation')}),
                        $translate.instant('jao.messages.operation_body', {
                            operation: $translate.instant('jao.common.pause'),
                            runId: that.runId
                        }),
                        function () {
                            messageService.toast('success', $translate.instant('jao.messages.operation_success', {
                                operation: $translate.instant('jao.common.pause'),
                                runId: that.runId
                            }));
                            that.pause = true;
                        });
                }
            };
        }
    }
})();