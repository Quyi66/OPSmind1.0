/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/8, created
 */
(function () {
    'use strict';

    /**
     * @ngdoc component
     * @name jaoOperationLogList
     * @description
     * ```html
     * <jao-operation-log-list
     *     with-module="string"
     *     with-action="string"
     *     with-filter-status="string"
     *     options="{actionColumn:string,varValues:object}">
     * ```
     * @param {string} withModule
     * @param {string} withAction
     * @param {string} withFilterStatus
     * @param {object=} options
     * @param {string} options.actionColumn A var expression to define action column
     * @param {object} options.varValues Variable values to evaluate the var expression of action column
     */
    angular.module('oplus.commons').component('jaoOperationLogList', {
        bindings: {
            withModule: '<',
            withAction: '<',
            withFilterStatus: '<',
            withFilterDay: '<',
            options: '<'
        },
        template: '<opx-datatable table-config="$ctrl.tableConfig"></opx-datatable>',
        controller: ['$scope', '$element', '$translate', 'dataEx', 'jaoUtil', jaoOperationLogListCtrl]
    });

    /**
     *
     * @param $scope
     * @param $element
     * @param $translate
     * @param {dataEx} dataEx
     * @param {jaoUtil} jaoUtil
     */
    function jaoOperationLogListCtrl($scope, $element, $translate, dataEx, jaoUtil) {
        var that = this;
        $(document).on('change', '#opsLogDate', function () {
            that.withFilterDay = $(this).val();
            // that.tableConfig.reloadData();
            that.tableConfig.reloadDataSync();
        });
        var unregister = $scope.$watch('$ctrl.options', function (newVal, oldVal) {
            initConfig(newVal);
            unregister();
        });

        function initConfig(options) {
            that.tableConfig = {
                data: function () {
                    return $$.qdata("JAO_LIST_OPERATION_LOG", {
                        "module": that.withModule,
                        "action": that.withAction || "all",
                        "status": that.withFilterStatus || "all",
                        "day": that.withFilterDay || "all"
                    });
                },
                columns: [
                    {
                        data: 'start_time',
                        title: $translate.instant('jao.log.start_time'),
                        render: function (data, type, row, meta) {
                            return $$.formatDate(row.start_time, "YYYY-MM-DD HH:mm:ss")
                        }
                    },
                    {
                        data: 'action',
                        title: $translate.instant('jao.log.operation'),
                        _extra: {autoFilter: true}
                    },
                    {
                        data: 'status',
                        title: $translate.instant('jao.log.status'),
                        _extra: {autoFilter: true},
                        render: function (data, type, row, meta) {
                            var def = jaoUtil.jobStatusDefs[data];
                            if (def) {
                                // var filterStatus = that.withFilterStatus;
                                // var isFilter = false;
                                // if (filterStatus) {
                                //     var statusList = filterStatus.split(",")
                                //     if (statusList.indexOf(row.action) !== -1) {
                                //         isFilter = true;
                                //     }
                                // }
                                // var click = 'udp-widget-interaction=\'{"actions":["page"],"page":{"params":{"runId":"' + row['run_id'] + '"},"pageId":"/jao/assets/udp/run-result","target":"_dialog"}}\'';
                                // var html;
                                // if (isFilter) {
                                //     html = '<span class="badge bg-' + def.color + '">' + def.title + '</span>';
                                // } else {
                                //     html = '<span class="badge bg-' + def.color + '" ' + click + '>' + def.title + '</span>';
                                // }
                                var runRecord = row.run_record;
                                var click = 'udp-widget-interaction=\'{"actions":["page"],"page":{"params":{"runId":"' + row['run_id'] + '"},"pageId":"/jao/assets/udp/run-result","target":"_dialog"}}\'';
                                var html;
                                if (!runRecord) {
                                    html = '<span class="badge bg-' + def.color + '">' + def.title + '</span>';
                                } else {
                                    html = '<span class="badge bg-' + def.color + '" ' + click + '>' + def.title + '</span>';
                                }
                                return html;
                            }
                            return data;
                        }
                    },
                    {
                        data: 'ata_node',
                        title: $translate.instant('jao.log.ata_node'),
                        _extra: {autoFilter: true}
                    },
                    {
                        data: 'message',
                        title: $translate.instant('jao.log.result'),
                        className: 'wrap',
                        render: function (data, type, row, meta) {
                            try {
                                var obj = JSON.parse(data);
                                var id = obj["msg_id"];
                                if (!id) {
                                    return data;
                                }
                                // if (msg_id === "import_success") {
                                return $translate.instant(id, obj);
                                // } else {
                                //     return data;
                                // }
                            } catch (e) {
                                return data;
                            }
                        }
                    },
                    {
                        data: 'username',
                        title: $translate.instant('jao.log.username')
                    },
                    {
                        data: 'end_time',
                        title: $translate.instant('jao.log.end_time'),
                        render: function (data, type, row, meta) {
                            return $$.formatDate(row.end_time, "YYYY-MM-DD HH:mm:ss")
                        }
                    },
                    {
                        title: $translate.instant('jao.log.time_consumed'), render: function (data, type, row, meta) {
                            return $$.timeDiff(row.start_time, row.end_time);
                        }
                    }
                ],
                order: [[0, 'desc']],
                buttons: ['reload', 'excel'],
                responsive: false,
            }
            if (options && options.actionColumn) {
                that.tableConfig.columns.push({
                    // title: $translate.instant('jao.log.action'),
                    title: '',
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var values = row;
                        if (options.varValues) {
                            values = _.merge({}, values, options.varValues);
                            // values['#'].tenantId='test';
                        }
                        // console.log('...',values);
                        return dataEx.evalVarExpr(options.actionColumn, values, {valueOfUnresolvedVar: ''});
                    }
                });
            }
        }
    }
})();
