/**
 * @author luohuanjiang
 * @Date 2023-02-20
 */
(function () {
    'use strict';


    angular.module('oplus.udp').component('taskScheduling', {
        bindings: {
            _options: '<options'
        },
        templateUrl: 'app/modules/udp/widgets/task-scheduling/task-scheduling.html',
        controller: ['$scope', 'messageService', '$rootScope', '$translate', '$state', 'cronJobService','$uibModal','$q','appletService', TaskSchedulingCtrl]
    });


    function TaskSchedulingCtrl($scope, messageService, $rootScope, $translate, $state, cronJobService,$uibModal,$q,appletService) {
        var task = this;
        task.$onInit = onInit;
        task.startStop = startStop;
        task.intervalTime = intervalTime;
        task.editTaskScheduling = editTaskScheduling;
        task.nextExecutionTime = nextExecutionTime;
        task.executeCronJob =executeCronJob;

        function editTaskScheduling(id){
            $uibModal.open({
                templateUrl: 'app/modules/udp/widgets/task-scheduling/task-scheduling-edit.html',
                controller: 'CronJobEditCtrl',
                controllerAs: 'vm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    cronJobData: function () {
                        return {
                            jobDesc: "",
                            scheduleConf:"",
                            jobType:"",
                            jobId:"",
                            id:id.id
                        };
                    }
                }
            }).result.then(function () {
                $state.reload();
            }, function () {
                $state.reload();
            });
        }

        function executeCronJob(id) {
            messageService.confirm($translate.instant("task_scheduling.confirm_operation"), $translate.instant("task_scheduling.whether_execute_once", {id: id}), function () {
                cronJobService.cronRestInterface("execute", id).then(function (result) {
                    if ("200" === result.code)
                        messageService.toast('success', $translate.instant("task_scheduling.execute_success", {id: id}));
                    else
                        messageService.toast('error', $translate.instant("task_scheduling.execute_error", {
                            id: id,
                            desc: result.code
                        }));
                });
            });
        };

        function nextExecutionTime(scheduleConf) {
            var instance = $uibModal.open({
                template: '' +
                    '<div class="modal-header">' +
                    '   <h3 class="modal-title">{{ \'task_scheduling.datatable.query\' | translate}}{{ \'task_scheduling.datatable.nextExecutionTime\' | translate}}</h3>' +
                    '   <a ng-click="$ctrl.cancel()">' +
                    '       <i class="fa fa-times" style="font-size: 20px;"></i>' +
                    '   </a>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '   <div class="bg-light text-center" style="height:10rem;">' +
                    '       <h3 ng-repeat="data in $ctrl.nextTime track by $index">{{data}}</h3>' +
                    '   </div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '</div>',
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    var that = this;
                    that.cancel = cancel;
                    that.$onInit = onInit;
                    that.nextTime =[];

                    function onInit() {
                        cronJobService.cronRestInterface("scheduleConf", scheduleConf).then(function (data) {
                            if(data[0].next.length < 1)
                                that.nextTime.push("This task has no execution plan. Is it disabled?")
                            data[0].next.forEach(function (nextData) {
                                that.nextTime.push(nextData);
                            })
                        });
                    }


                    function cancel() {
                        $uibModalInstance.close({action: "cancel"});
                    }
                }],
                controllerAs: '$ctrl',
                size: 'sm',
                backdrop: true
            });
        }

        function startStop(id, triggerStatus, scheduleConf) {
            let nextDatas = "";
            cronJobService.cronRestInterface("scheduleConf", scheduleConf).then(function (data) {
                let count = 0;
                let dates = [];
                if (data[0].next.length < 1) {
                    messageService.toast('error', "This task has no execution plan. Is it disabled?");
                    return;
                } else {
                    data[0].next.forEach(function (nextData) {
                        nextDatas = nextDatas + nextData + '<br/>';
                        if (count < 2) {
                            dates.push(nextData);
                        }
                        count++;
                    })
                }

                let content;
                let contentStart;
                if ("1" === triggerStatus) {
                    content = $translate.instant("task_scheduling.trigger_status_stop", {id: id});
                    triggerStatus = "stop";
                } else {
                    contentStart = $translate.instant("task_scheduling.trigger_status_start", {id: id});
                    content = '<div style="margin-left:150px;">' + $translate.instant("task_scheduling.trigger_status_start", {id: id}) + '</div>';
                    let intervalTimetext = intervalTime(
                        Date.parse(dates[0]),
                        Date.parse(dates[1])
                    )
                    let pattern = /天|时/;
                    let gp = "";
                    if (intervalTimetext.indexOf("秒") > 0 || intervalTimetext.indexOf("分") > 0 && !pattern.test(intervalTimetext)) {
                        gp += "<br/><br/>" + $translate.instant("task_scheduling.datatable.high_frequency");
                    }

                    nextDatas = '<div style=\"margin-left:160px;\"><br/><br/><div style=\"margin-left:18px;\"> ' + $translate.instant("task_scheduling.datatable.nextExecutionTime") + '</div>' + nextDatas + '</div>';
                    nextDatas = nextDatas + '<div style=\"margin-left:120px;\">' + gp + '</div>';
                    content += nextDatas;
                    triggerStatus = "start";
                }
                messageService.confirm($translate.instant("task_scheduling.confirm_operation"), content, function () {
                    //启 停
                    cronJobService.cronRestInterface(triggerStatus, id).then(function (result) {
                        messageService.toast('success', "start" === triggerStatus ? contentStart : content);
                        $state.reload();
                        // onInit();
                    }).catch(function (err) {
                        throw err;
                    });
                });
            })
        }

        function onInit() {
            var tableColumns = [
                {data: 'id', title: $translate.instant("task_scheduling.datatable.id")},
                {
                    data: 'jobDesc',
                    title: $translate.instant("task_scheduling.datatable.job_desc"),
                    render: function (data,type,row,meta) {
                        return '<span' +
                            ' style=" display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 200px;"' +
                            ' title=' + row.jobDesc + '>' + row.jobDesc + '</span>';
                    }
                },
                {data: 'scheduleConf', title: $translate.instant("task_scheduling.datatable.schedule_conf")},
                {data: 'appCode', title: $translate.instant("adm.menu.appres")},
                {
                    data: 'jobType', title: $translate.instant("task_scheduling.datatable.job_type"),
                    render: function (data, type, row, meta) {
                        var JT = row.jobType;
                        var map = {
                            "rest":$translate.instant("task_scheduling.job_type_two"),
                            "script":$translate.instant("task_scheduling.job_type_one"),
                            "cac":$translate.instant("task_scheduling.job_type_three"),
                            "cmd": $translate.instant("cmd.index.list"),
                            "flows": $translate.instant("jao.index.schedule")
                        }
                        return map[JT];
                    }
                },
                {
                    data: 'triggerStatus',
                    title: $translate.instant("task_scheduling.datatable.trigger_status"),
                    render: function (data, type, row, meta) {
                        var html;
                        if ("1" === row.triggerStatus)
                            html = '<div class="btn-group">' +
                                '    <button type="button" ng-click="$ctrl.startStop(\'' + row.id + '\',\'' + row.triggerStatus + '\',\'' + row.scheduleConf + '\')" class="btn btn-success btn-sm">' + $translate.instant("task_scheduling.enabled") + '</button>' +
                                '</div>'
                        else
                            html = '<div class="btn-group">' +
                                '    <button type="button" ng-click="$ctrl.startStop(\'' + row.id + '\',\'' + row.triggerStatus + '\',\'' + row.scheduleConf + '\')" class="btn btn-danger btn-sm">' + $translate.instant("task_scheduling.disabled") + '</button>' +
                                '</div>'
                        return html
                    }
                },
                {data: 'author', title: $translate.instant("task_scheduling.datatable.author")},
                {
                    data: 'scheduleConf',
                    title: $translate.instant("task_scheduling.datatable.query"),
                    render: function (data, type, row, meta) {
                        return '<div class="btn-group">' +
                            '<button type="button" ng-click="$ctrl.nextExecutionTime(\'' + row.scheduleConf + '\')" class="btn btn-default btn-sm" title="{{\'task_scheduling.datatable.nextExecutionTime\' | translate}}"><i class="fa fa-clock"></i></button>' +
                            '</div>';
                    }
                },
                {
                    data: 'key',
                    title: $translate.instant('common.entity.detail.operation'),
                    class: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var param = angular.toJson({id: row.id});
                        return '<div class="btn-group">' +
                            ' <button  type="submit"  class="btn btn-default btn-sm"  op-help-info="<li>' + $translate.instant("task_scheduling.datatable.op_help_info") + '</li>" >' +
                            '     <span class="hidden-sm-down" ng-click="$ctrl.executeCronJob(\'' + row.id + '\')">' + $translate.instant("task_scheduling.datatable.execute_once") + '</span>' +
                            ' </button>' +
                            '&nbsp;&nbsp;' +
                            ' <button  type="submit"  class="btn btn-default btn-sm">' +
                            '     <span class="hidden-sm-down" ng-click="$ctrl.editTaskScheduling({id:\'' + row.id + '\'})">' + $translate.instant("common.entity.action.edit") + '</span>' +
                            ' </button>' +
                            '</div>';
                    }
                }
            ];

            task.tableConfig = {
                data: [getPromise],
                columns: tableColumns,
                order: [[0, 'desc']],
                buttons: ['reload']
            }

            function getPromise() {
                let apps = {};
                let deferred = $q.defer();
                appletService.findApplets().then(function (applets) {
                    _.forEach(applets,function (data) {
                        apps[data.name] = data.title;
                    });
                    cronJobService.cronRestInterface("appCode", task._options.appletCode).then(function (listCron) {
                        let tableData = [];
                        _.forEach(listCron,function (data) {
                            if(apps.hasOwnProperty(data.appCode)){
                                data.appCode = apps[data.appCode];
                            }
                            tableData.push(data)
                        })
                        deferred.resolve(tableData);
                    });
                }).catch(function (err) {
                    throw err;
                });
                return deferred.promise;
            }
        }

        //计算两个时间之间的时间差 多少天时分秒
        //startTime-Date.parse("2020-02-01 12:30:30")
        //endTime-Date.parse("2020-02-03 18:50:20")
        function intervalTime(startTime, endTime, type = "text") {
            let cha = endTime - startTime;
            let day = Math.floor(cha / (24 * 3600 * 1000));
            let hours = Math.floor((cha % (24 * 3600 * 1000)) / (3600 * 1000));
            let minutes = Math.floor(
                ((cha % (24 * 3600 * 1000)) % (3600 * 1000)) / (60 * 1000)
            );
            let seconds = Math.floor(
                (((cha % (24 * 3600 * 1000)) % (3600 * 1000)) % (60 * 1000)) / 1000
            );
            let s1 = "";
            //返回字符串形式
            if (type == "text") {
                if (day >= 1) {
                    s1 += day + "天";
                }
                if (hours >= 1) {
                    s1 += hours + "时";
                }
                if (minutes > 0) {
                    s1 += minutes + "分";
                }
                if (seconds > 0) {
                    s1 += seconds + "秒";
                }
                return s1;
            } else {
                // 返回对象形式
                let obj = {
                    day,
                    hours,
                    minutes,
                    seconds,
                };
                return obj;
            }
        }

    }
})();
