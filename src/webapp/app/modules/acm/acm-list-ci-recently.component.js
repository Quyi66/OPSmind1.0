/**
 *
 * @author Pickle
 */
(function () {
    'use strict';

    angular.module('oplus.acm').component('acmListCiRecently', {
        bindings: {
            ciType: '<ciType',
            ngModel: '=',
            options: '<'
        },
        templateUrl: 'app/modules/acm/acm-list-ci-recently.html',
        controller: ['$element', '$timeout', '$scope', 'widgetInteraction', 'currentUser', 'acmUtil', 'acmService', '$translate', 'jaoUtil', AcmListCiRecentlyCtrl]
    });

    /**
     *
     * @param $element
     * @param $timeout
     * @param $scope
     * @param {widgetInteraction} widgetInteraction
     * @param currentUser
     * @param {acmUtil} acmUtil
     * @param {acmService} acmService
     * @param {$translate} $translate
     * @param {jaoUtil} jaoUtil
     * @constructor
     */
    function AcmListCiRecentlyCtrl($element, $timeout, $scope, widgetInteraction, currentUser, acmUtil, acmService, $translate, jaoUtil) {
        var PAGE_PARAM_OF_SELECTED_JOBS = '_selected_jobs_';
        var that = this;
        this.useOpxDatatable = false;
        this.dataType = that.options.dataType || "auto";
        this.udpPageData = {};
        this.$onInit = onInit;

        function onInit() {
            if (that.useOpxDatatable) {
                onInit_v2();
            } else {
                // onInit_v1();
                onInit_v3();
            }
        }

        function onInit_v2() {
            that.tableConfig = {
                columns: [],
                data: []
            };

        }

        function onInit_v1() {
            $scope.rowFields = [];
            $scope.idFields = [
                {
                    "field": "id",
                    "mcheck": true,
                    "mcheckUnionFiled": "IP",
                    "mcheckCIType": that.ciType,
                    "mcheckParam": PAGE_PARAM_OF_SELECTED_HOSTS,
                    "mcheckType": "map",
                    "hidden": false
                }
            ];
            // acmUtil.tabFields(that.ciType).then(function (result) {
            acmService.calcDynamicFieldsForTableView(that.ciType, 'selector').then(function (result) {
                // console.log('acmUtil.tabFields', that.ciType, result);
                $scope.rowFields = _.concat($scope.idFields, result);
                $scope.datatableProps = {
                    //Todo 根据CIT 自动获取fields
                    "fields": $scope.rowFields,
                    "display": {
                        "css": "mb-3",
                        "style": "simple",
                        "cardMode": true,
                        "noBorder": true,
                        "tbodyHeight": 370,
                        "exfilter": true
                    },
                    "dataset": {
                        "_type": "",
                        "params": [
                            {
                                "name": "token",
                                "initval": currentUser.authToken,
                                "format": "string",
                                // "binding": "groups",
                                "control": "hidden"
                            },
                            {
                                name: 'ciType',
                                initVal: that.ciType,
                                format: 'string',
                                binding: 'ciType',
                                control: 'hidden'
                            },
                            {
                                name: 'lim',
                                initVal: 1,
                                format: 'int',
                                binding: 'dataType',
                                control: 'hidden'
                            },
                            {
                                name: 'jobType',
                                // 下发任务类型
                                initVal: ["command", "script", "process"],
                                format: 'list',
                                binding: 'dataType',
                                control: 'hidden'
                            }
                        ],
                        "serverPage": true,
                        "hideParams": true,
                        "id": "ACM_GET_RECENTLY_CI"
                    }
                };
            });
            var watchExp = '$ctrl.udpPageData.pageParams.' + PAGE_PARAM_OF_SELECTED_HOSTS;
            $scope.$watch(watchExp, function (newVal, oldVal) {
                if (newVal === oldVal)
                    return;
                that.theModel = newVal;
            });
        }


        function onInit_v3() {
            // 表头： 作业名称，作业类型，本次执行的主机信息，执行时间
            var tableColumnConfig =
                [
                    {mData: 'jobTitle', title: $translate.instant('jao.log.job_title'), searchable: true},
                    {
                        mData: 'hosts',
                        title: $translate.instant('jao.log.delegate_host'),
                        render: function (data, type, row, meta) {
                            var run_result_hosts = row.run_result_hosts;
                            var html = '<div class="udp-linelimit">';
                            if (run_result_hosts) {
                                _.forEach(_.map(run_result_hosts, 'value'), function (v) {
                                    html = html + ' <span>' + v + '</span>' + '<br>';
                                })
                            }
                            return html + '</div>'
                        }
                    },
                    {mData: 'jobType', title: $translate.instant('jao.log.job_type'), searchable: true},
                    {
                        mData: "endTime", title: $translate.instant('jao.log.end_time'),
                        render: function (data, type, row, meta) {
                            return $$.formatDate(row.startTime, "YYYY-MM-DD HH:mm:ss");
                        }
                    },
                    {
                        mData: "ata_node", title: "Ansible Node",
                        render: function (data, type, row, meta) {
                            var html = '<div className="udp-linelimit expanded">';
                            _.forEach(data, function (v) {
                                html = html + '<p class="badge badge-secondary" target="_blank">' + v + '</p><br>';
                            })
                            return html + '</div>';
                        }
                    },
                    {
                        mData: 'status', title: $translate.instant('jao.log.status'),
                        render: function (data, type, row, meta) {
                            console.log("row.status :{}, row.jobTitle : , {}", row.status, row.jobTitle);

                            if(row.status){
                                var style = jaoUtil.jobStatusDefs[row.status];
                                var click = 'udp-widget-interaction=\'{"actions":["page"],"page":{"params":{"runId":"' + row.id + '"},"pageId":"/jao/assets/udp/run-result","target":"_dialog","size":"lg"}}\'';
                                if (!style.color) {
                                    style.color = 'danger';
                                }
                                return '<span class="badge badge-' + style.color + '" ' + click + '>' + style.title + '</span>';
                            }

                        }
                    },
                    {
                        mData: 'statsJson', title: $translate.instant('jao.log.detail'),
                        render: function (data, type, row, meta) {
                            return $$._jaoFormatJobStats(row.statsJson);
                        }
                    }
                ];

            that.selects = [];
            // that.preselected = that.ngModel;
            that.tableConfig = {
                data: [getPromise, ''],
                columns: tableColumnConfig,
                selection: {
                    valueData: function (row) {
                        var total_hosts = 0;
                        if (row.statsJson) {
                            total_hosts = JSON.parse(row.statsJson).totalHosts;
                        }
                        return {
                            key: row.id,
                            value: row.jobTitle,
                            // title: row.jobTitle,
                            runType: row.jobType,
                            assetType: that.ciType,
                            total_hosts: total_hosts,
                            run_result_hosts: row.run_result_hosts
                        };
                    },
                    labelData: function (row) {
                        return row.jobTitle;
                    }
                    // ,
                    // preselected: [
                    //     {
                    //         "key": "fe0f27bc230d44c48ee95c05dfd303b6",
                    //         "value": "^job【ACM】设备连通性检测",
                    //         "assetType": "database"
                    //     }
                    // ]
                },
                // order: [[3, 'asc']],
                buttons: ['reload']
            }
            $scope.$watch('$ctrl.tableConfig.selectedItems', function (newVal, oldVal) {
                if (oldVal) {
                    _.forEach(oldVal, function (o) {
                        _.remove(that.ngModel, function (o) {
                            return o.id === o.id;
                        })
                    });
                }
                if (newVal) {
                    // 将新值push
                    _.forEach(newVal, function (n) {
                        that.ngModel.push(n);
                    });
                }
            }, true);

            function getPromise() {
                var queryBo = {
                    "jobTypes": "script,command",
                    "limit": 100
                    // "ciType": "linux"
                }
                return acmService.getJobRecently(queryBo);
            }

        }

    }
})();
