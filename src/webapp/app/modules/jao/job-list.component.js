/**
 *
 * @author chy, 2021/10/25
 */
(function () {
    'use strict';

    angular.module('oplus.jao')
        .component('jobList', {
            templateUrl: 'app/modules/jao/job-list.component.html',
            controller: JobListComponentCtrl,
            bindings: {
                showApplet: '<',
                appletCode: '<',
                showNavigation: "<"
            }
        });

    JobListComponentCtrl.$inject = ['$timeout', 'jaoJobService', 'messageService', 'jaoUtil', 'currentUser', 'jaoDemo', '$translate', '$injector'];

    /**
     *
     * @param $timeout
     * @param {jaoJobService} jaoJobService
     * @param {messageService} messageService
     * @param {jaoUtil} jaoUtil
     * @param {currentUser} currentUser
     * @param {jaoDemo} jaoDemo
     * @param $translate
     * @param {appletService} appletService
     * @param {appletSecurity} appletSecurity
     * @constructor
     */
    function JobListComponentCtrl($timeout, jaoJobService, messageService, jaoUtil, currentUser, jaoDemo, $translate, $injector) {
        var that = this;
        this.showApplet = that.showApplet || false;
        this.appletCode = that.appletCode || '';
        this.showNavigation = that.showNavigation || false;
        this.jobsData = [];
        this.jobTypeList = jaoUtil.jobTypeList;
        this.listJobs = listJobs;
        this.quickRunJob = quickRunJob;
        this.copyJob = copyJob;
        this.deleteJob = deleteJob;
        this.onAppletSelectorChange = onAppletSelectorChange;
        this.moveJobs = moveJobs;

        var columnDefs = [{
            data: 'title',
            title: $translate.instant('jao.common.job'),
            render: function (data, type, row, meta) {
                var html = data;
                // '<span class="badge bg-secondary text-muted">' + row.id + '</span>';
                if (row.description) {
                    html += '<div>';
                    html += '<span class="help-block ms-1">' + row.description + '</span>';
                    html += '</div>';
                }
                // return '<a class="d-block text-wrap" ui-sref="app.jao.job_view({id:\'' + row.id + '\'})">' + html + '</a>';
                return '<a class="d-block text-wrap" ui-sref="app.appman.job.view({id:\'' + row.id + '\',appletCode:$ctrl.appletCode})">' + html + '</a>';
            }
        },
            {
                data: 'type',
                title: $translate.instant('common.entity.detail.type'),
                render: function (data) {
                    var def = jaoUtil.jobTypeList[data];
                    if (def) {
                        return '<div __style="width:1.5rem;height:1.5rem;" __class="text-center rounded-circle bg-secondary text-white"><i class="far fa-fw ' + def.icon + '"></i> ' + def.title + '</div>';
                    } else {
                        return "";
                    }
                },
                _extra: {
                    autoFilter: true
                }
            },
            {
                data: 'appletCode',
                title: $translate.instant('jao.job.widget.applet'),
            },
            {
                data: 'updatedBy',
                title: $translate.instant('common.entity.detail.update_by')
            },
            {
                data: 'updatedAt',
                title: $translate.instant('common.entity.detail.update_at'),
                render: function (data, type, row, meta) {
                    return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                }
            },
            {
                data: 'lastRunTime',
                title: $translate.instant('jao.log.jao_last_run_time'),
                render: function (data, type, row, meta) {
                    if (data) {
                        return $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss');
                    } else {
                        return "";
                    }
                }
            },
            {
                title: $translate.instant('common.entity.detail.operation'),
                class: 'text-left',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    var html = '<div>';
                    if (appletSecurity.canModifyAppletResource(row['appletCode'])) {
                        html += '<button type="button" ng-click="$ctrl.quickRunJob(\'' + row.id + '\')" class="btn btn-default opx-btn-icon opx-btn-flat" title="{{\'jao.common.run\' | translate}}"><i class="fa fa-play-circle"></i></button>\n';
                        html += '<button type="button" ng-click="$ctrl.copyJob(\'' + row.id + '\')" class="btn btn-default opx-btn-icon opx-btn-table" title="{{\'common.action.copy\' | translate}}"><i class="fa fa-copy"></i></button>\n';
                    }
                    var click = ' udp-widget-interaction=\'{"actions":["page"],"page":{"params":{"job_id":"' + row.id + '"},"pageId":"/jao/assets/udp/runlogs","target":"_dialog","size":"lg"}}\'';
                    html += '<button type="button"' + click + ' class="btn btn-default opx-btn-icon opx-btn-flat" title="{{\'jao.job.history\' | translate}}"><i class="fa fa-history"></i></button>';
                    html += '</div>';
                    return html;
                }
            }
        ];
        // this.selectedJobs = [];
        this.tableConfig = {
            columns: columnDefs,
            data: listJobs,
            selection: {
                valueData: 'id',
                labelData: 'title',
                selectedDatatype: 'Array'
            },
            order: [
                [5, 'desc']
            ],
            buttons: ['excel', 'reload']
        }

        // console.log('this.tableConfig',JSON.stringify(this.tableConfig),$scope);
        function listJobs() {
            return jaoJobService.findJobsByAppletCode(that.jobTypeFilter, that.appletCode);
        }

        function quickRunJob(jobId) {
            jaoJobService.quickRunJob(jobId);
        }

        function copyJob(jobId) {
            messageService.confirm(
                $translate.instant('jao.clone_job'), $translate.instant('jao.clone_confirm'), function () {
                    jaoJobService.copyJob(jobId).then(function (data) {
                        messageService.toast('success', $translate.instant('jao.clone_success'));
                        that.tableConfig.reloadData();
                    }).catch(function (e) {
                        throw e;
                    });
                });
        }

        //批量删除作业
        function deleteJob() {
            var ids = angular.toJson(that.tableConfig.selectedItems);
            messageService.confirm(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('jao.messages.batch_delete_jobs', {count: that.tableConfig.selectedItems.length}),
                function () {
                    jaoJobService.batchDeleteJob(ids).then(function () {
                        messageService.toast("success", $translate.instant('common.messages.operation.success', {operation: $translate.instant('common.entity.action.delete')}));
                        $timeout(function () {
                            that.tableConfig.markItemsSelected([]);
                            that.tableConfig.selectedItems.length = 0;
                            that.tableConfig.reloadData();
                        });
                    }).catch(function (err) {
                        messageService.toast("warning", $translate.instant('common.messages.operation.failed', {operation: $translate.instant('common.entity.action.delete')}));
                        throw err;
                    });
                });
        }

        function onAppletSelectorChange(applet) {
            that.appletCode = applet.name;
            that.tableConfig.reloadData();
        }

        function moveJobs() {
            appletService.openAppletSelectorModal(function (applet) {
                messageService.confirm($translate.instant('jao.page.action.move_job'),
                    $translate.instant('jao.page.action.move_job_confirm', {
                        applet: applet.title,
                        recordNum: that.tableConfig.selectedItems.length
                    }),
                    function () {
                        jaoJobService.moveJob(that.tableConfig.selectedItems, applet.code).then(function () {
                            reloadData();
                        }).catch(function (err) {
                            throw err;
                        });
                    })
            });
        }

        function reloadData() {
            that.tableConfig.reloadData();
        }
    }
})();
