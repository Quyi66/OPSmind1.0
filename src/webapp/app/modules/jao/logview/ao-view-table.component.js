/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 2021/03/18
 */
(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name jaoAoViewTable
     * @desc View Ansible output as table
     * @usage
     * ```
     * <jao-ao-view-table contents="string[]">
     * ```
     * @param {string[]} contents List of ansible log contents in format of `{plays,tasks,}`
     */
    angular.module('oplus.jao').component('jaoAoViewTable', {
        bindings: {
            contents: '<'
        },
        templateUrl: 'app/modules/jao/logview/ao-view-table.html',
        controller: ['$q', '$http', '$element', '$scope', '$filter', '$timeout', '$compile', 'messageService', 'jaoUtil', '$translate', AoViewCtrl]
    });

    /**
     *
     * @param $q
     * @param $http
     * @param $element
     * @param $scope
     * @param $filter
     * @param $timeout
     * @param $compile
     * @param {messageService} messageService
     * @param {jaoUtil} jaoUtil
     */
    function AoViewCtrl($q, $http, $element, $scope, $filter, $timeout, $compile, messageService, jaoUtil, $translate) {
        var that = this;
        var statusDefs = jaoUtil.taskStatusDefs;
        var aoList;
        this.playFilter = '';
        this.changeBatch = changeBatch;
        this.reload = reload;
        this.$onInit = onInit;

        function onInit() {
            $scope.$watch('$ctrl.contents', function (newVal, oldVal) {
                console.log('watch $ctrl.contents: %o', newVal);
                if (newVal) {
                    generateTable(newVal);
                }
            }, true);
        }

        function changeBatch(batchId) {
            that.selectedBatchId = batchId;
            reload();
        }

        function reload() {
            if (that.tableConfig) {
                that.tableConfig.reloadData();
            }
        }


        /**
         *
         * @param {[string]} outputs Batches of Ansible output in JSON string
         */
        function generateTable(outputs) {
            var batchIds = [];
            outputs.forEach(function (item) {
                if (item._batchId && batchIds.indexOf(item._batchId) === -1) {
                    batchIds.push(item._batchId);
                }
            });
            that.batchIds = batchIds;
            if (batchIds.length > 0 && !that.selectedBatchId) {
                that.selectedBatchId = batchIds[0];
            }

            aoList = toAoList(outputs);
            that.plays = aoList.plays;
            if (that.plays.length === 1) {
                that.playFilter = that.plays[0].name;
            }

            console.log('that.tableConfig: %o', that.tableConfig);
            if (that.tableConfig) {
                that.tableConfig.reloadData();
            } else {
                var columns = [
                    // {data: 'play', title: 'Play'},
                    {data: 'hostKey', title: $translate.instant('jao.log.target_host'), _extra: {autoFilter: true}},
                    {data: 'delegateHost', title: $translate.instant('jao.log.delegate_host'), defaultContent: ''},
                    {data: 'task', title: $translate.instant('jao.common.task')},
                    {
                        data: 'status',
                        title: $translate.instant('jao.log.result'),
                        render: function (data, type, row, meta) {
                            var def = statusDefs[data] || '';
                            return '<span class="badge bg-' + def.color + '">' + def.text + '</span>';
                        }
                    },
                    {
                        data: 'output',
                        title: $translate.instant('jao.common.output'),
                        _extra: {linelimit: true, linebreak: true}
                    }
                ];
                that.tableConfig = {
                    data: [function () {
                        var data = aoList.data;
                        if (that.playFilter) {
                            data = _.filter(data, {play: that.playFilter});
                        }
                        if (that.selectedBatchId && that.batchIds.length > 1) {
                            data = _.filter(data, {batchId: that.selectedBatchId});
                        }
                        return $q.when(data);
                    }],
                    columns: columns,
                    buttons: ['excel']
                };
            }
        }

        /**
         *
         * @param outputs
         * @return {{plays: [{name:string}],data:[{play:string,task:string,hostKey:string,delegateHost:string,cmd:string,status:string,status:string,output:string}]}}
         */
        function toAoList(outputs) {
            var result = [], list = [];
            var plays = [];
            outputs.forEach(function (output) {
                if (angular.isString(output)) {
                    try {
                        list.push(JSON.parse(output));
                    } catch (err) {
                        throw new Error('Cannot parse JSON: `' + output + '` due to ' + err.message);
                    }
                } else {
                    list.push(output);
                }
            });
            list.forEach(function (item) {
                var batchId = item._batchId;
                var ataUrl = item._ataUrl || item.ataUrl;
                item.plays.forEach(function (play) {
                    if (!_.find(plays, {name: play.play.name})) {
                        plays.push({name: play.play.name});
                    }
                    // if (playFilter && playFilter === play.play.name) {
                    //     return;
                    // }
                    //
                    play.tasks.forEach(function (task) {
                        task.hosts.forEach(function (host) {
                            var parsedHost = jaoUtil.parseHost(host.hostKey);
                            var taskRec = {
                                play: play.play.name,
                                task: task.task.name,
                                hostKey: parsedHost.targetHost,
                                delegateHost: ataUrl || parsedHost.delegateHost,
                                cmd: determineCmd(host),
                                status: jaoUtil.parseHostStatus(host),
                                output: determineHostTaskOutput(host),
                                batchId: batchId
                            };
                            // if (parsedHost.delegateHost) {
                            //     taskRec.task = '(' + parsedHost.delegateHost + ') ' + taskRec.task;
                            // }
                            result.push(taskRec);
                        });
                    });
                });
            });
            return {plays: plays, data: result};
        }

        function determineCmd(host) {
            return host.cmd | host.shell | host.script | '';
        }

        function determineHostTaskOutput(host) {
            var str = host.stdout || host.module_stdout || host.msg || host.stderr || host.module_stderr;
            if (angular.isUndefined(str)) {
                return '';
            }
            if (angular.isObject(str)) {
                return JSON.stringify(str, null, '  ');
            }
            return str;
        }
    }
})();