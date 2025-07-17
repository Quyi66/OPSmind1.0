/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    'use strict';

    angular.module('oplus.jao').controller('CronJobController', CronJobController);

    CronJobController.$inject = ['$scope', '$state', 'messageService', 'cronJobService', '$translate', '$uibModal', 'appletService', '$q', 'currentUser', '$compile'];

    function CronJobController($scope, $state, messageService, cronJobService, $translate, $uibModal, appletService, $q, currentUser, $compile) {
        var that = this;
        
        // 将控制器方法暴露到全局，供DataTables渲染的HTML调用
        window.cronJobController = {
            startStop: function(id, triggerStatus, scheduleConf) {
                that.startStop(id, triggerStatus, scheduleConf);
            },
            executeCronJob: function(id) {
                that.executeCronJob(id);
            },
            deleteCronJob: function(id) {
                that.deleteCronJob(id);
            },
            copyCronJob: function(id) {
                that.copyCronJob(id);
            },
            nextExecutionTime: function(scheduleConf) {
                that.nextExecutionTime(scheduleConf);
            }
        };
        
        // 清理函数
        $scope.$on('$destroy', function() {
            delete window.cronJobController;
        });
        
        // 调试相关
        that.debugMode = false;
        that.apiBaseUrl = 'API连接正常';
        
        that.debugApiConnection = function() {
            that.debugMode = !that.debugMode;
            console.log('Debug mode:', that.debugMode);
            console.log('Controller instance:', that);
            console.log('Table config:', that.tableConfig);
        };
        
        that.showDebugInfo = function() {
            console.log('=== 调试信息 ===');
            console.log('控制器已加载:', !!that);
            console.log('$uibModal 可用:', !!$uibModal);
            console.log('$state 可用:', !!$state);
            console.log('messageService 可用:', !!messageService);
            console.log('当前状态:', $state.current);
            console.log('Angular 版本:', angular.version);
            
            messageService.toast('info', '调试信息已输出到控制台');
        };
        
        that.openNewTaskModal = function() {
            console.log('Opening new task modal...');
            
            try {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/modules/jao/cronJob/cron-job-dialog.html',
                    controller: 'CronJobDialogCtrl',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        cronJobData: function () {
                            return {
                                jobDesc: "",
                                scheduleConf:"",
                                jobType:"",
                                jobId:"",
                                id:""
                            };
                        }
                    }
                });
                
                modalInstance.result.then(function () {
                    console.log('Modal closed successfully');
                    // 刷新页面数据
                    if (that.tableConfig && that.tableConfig.reloadData) {
                        that.tableConfig.reloadData();
                    }
                }, function () {
                    console.log('Modal dismissed');
                });
            } catch (error) {
                console.error('Error opening modal:', error);
                messageService.toast('error', '打开模态框时发生错误: ' + error.message);
            }
        };
        
        that.testNewTask = function() {
            console.log('Testing new task...');
            console.log('Current state:', $state.current);
            console.log('Available states:', $state.get());
            
            // 先尝试一个简单的模态框
            try {
                var simpleModal = $uibModal.open({
                    template: '<div class="modal-header"><h3>测试模态框</h3></div><div class="modal-body">这是一个测试模态框</div><div class="modal-footer"><button class="btn btn-primary" ng-click="$close()">关闭</button></div>',
                    controller: ['$scope', function($scope) {
                        $scope.$close = function() {
                            simpleModal.close();
                        };
                    }],
                    size: 'sm'
                });
                
                simpleModal.result.then(function() {
                    console.log('Simple modal closed');
                    messageService.toast('success', '简单模态框测试成功');
                    
                    // 如果简单模态框工作，再尝试复杂的
                    setTimeout(function() {
                        that.openNewTaskModal();
                    }, 1000);
                });
            } catch (error) {
                console.error('Error in simple modal:', error);
                messageService.toast('error', '简单模态框测试失败: ' + error.message);
            }
        };
        
        // 初始化
        controlQuery();
        
        // 添加初始化检查
        console.log('CronJobController 已初始化');
        console.log('控制器方法:', Object.keys(that));
        
        // 确保方法可用
        if (!that.openNewTaskModal) {
            console.error('openNewTaskModal 方法未定义');
        }
        if (!that.testNewTask) {
            console.error('testNewTask 方法未定义');
        }
        if (!that.showDebugInfo) {
            console.error('showDebugInfo 方法未定义');
        }

        that.deleteCronJob = function (id) {
            messageService.confirm($translate.instant("task_scheduling.confirm_operation"), $translate.instant("task_scheduling.confirm_operation_id", {id: id}), function () {
                cronJobService.cronRestInterface("delete", id).then(function (result) {
                    messageService.toast('success', $translate.instant("task_scheduling.delete_job_id", {id: id}));
                    $state.go('app.jao.cron_job', null, {reload: true});
                });
            });
        };

        that.copyCronJob = function (id) {
            messageService.confirm($translate.instant("task_scheduling.confirm_operation"), $translate.instant("task_scheduling.copy_cron"), function () {
                cronJobService.cronRestInterface("copyCron", id).then(function (result) {
                    messageService.toast('success', $translate.instant('dts.list.copy_success'));
                    $state.go('app.jao.cron_job', null, {reload: true});
                });
            });
        };

        that.executeCronJob = function (id) {
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

        that.batchStartStopCron = function () {
            // cronJobService.cronRestInterface("batchScheduleConf", that.selectedCrons).then(function (data) {
            //     data.forEach(function (nextData){
            //         console.log(nextData)
            //     })
            // });
            let ids = "";
            let startStopData = {};
            that.selectedCrons.forEach(function (nextData) {
                if ("" === ids) {
                    ids = nextData["id"];
                } else {
                    ids = ids + "," + nextData["id"];
                }
                startStopData[nextData["id"]] = nextData["triggerStatus"]
            })
            messageService.confirm($translate.instant("task_scheduling.confirm_operation"), $translate.instant("task_scheduling.is_batch_start_stop_CRON", {id: ids}), function () {
                //启 停
                cronJobService.cronRestInterface("batchStartStop", startStopData).then(function (result) {
                    messageService.toast('success', $translate.instant("task_scheduling.success_id", {msg: ids}));
                    $state.go('app.jao.cron_job', null, {reload: true});
                });
            });
        }

        that.startStop = function (id, triggerStatus, scheduleConf) {
            let nextDatas = "";
            cronJobService.cronRestInterface("scheduleConf", scheduleConf).then(function (data) {
                let count = 0;
                let dates = [];
                
                // 改进数据格式检查
                if (!data || !angular.isArray(data) || data.length === 0) {
                    console.warn('Invalid scheduleConf API response:', data);
                    messageService.toast('error', "Failed to get schedule information");
                    return;
                }
                
                if (!data[0].next || data[0].next.length < 1) {
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
                    let intervalTimetext = that.intervalTime(
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
                        $state.go('app.jao.cron_job', null, {reload: true});
                    });
                });
            })
        }

        that.nextExecutionTime = function (scheduleConf) {
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
                    that.nextTime = [];

                    function onInit() {
                        cronJobService.cronRestInterface("scheduleConf", scheduleConf).then(function (data) {
                            // 改进数据格式检查
                            if (!data || !angular.isArray(data) || data.length === 0) {
                                that.nextTime.push("Failed to get schedule information");
                                return;
                            }
                            
                            if (!data[0].next || data[0].next.length < 1) {
                                that.nextTime.push("This task has no execution plan. Is it disabled?");
                            } else {
                                data[0].next.forEach(function (nextData) {
                                    that.nextTime.push(nextData);
                                });
                            }
                        }).catch(function (err) {
                            console.error('Failed to get next execution time:', err);
                            that.nextTime.push("Failed to get schedule information");
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

        function controlQuery() {
            var tableColumns = [
                {data: 'id', title: $translate.instant("task_scheduling.datatable.id")},
                {
                    data: 'jobDesc',
                    title: $translate.instant("task_scheduling.datatable.job_desc"),
                    render: function (data, type, row, meta) {
                        return '<span' +
                            ' style=" display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 150px;"' +
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
                            "rest": $translate.instant("task_scheduling.job_type_two"),
                            "script": $translate.instant("task_scheduling.job_type_one"),
                            "cac": $translate.instant("task_scheduling.job_type_three"),
                            "cmd": $translate.instant("cmd.index.list"),
                            "flows": $translate.instant("jao.index.schedule")
                        }
                        return map[JT];
                    }
                },
                {
                    data: 'triggerStatus',
                    title: '当前状态',
                    render: function (data, type, row, meta) {
                        var html;
                        var isDisabled = "";
                        if (!currentUser.hasPermission("jao:edit")) {
                            isDisabled = "disabled";
                        }
                        if ("1" === row.triggerStatus)
                            html = '<div class="btn-group">' +
                                '    <button ' + isDisabled + ' type="button" onclick="window.cronJobController.startStop(\'' + row.id + '\', \'' + row.triggerStatus + '\', \'' + row.scheduleConf + '\')" class="btn btn-success btn-sm">已启用</button>' +
                                '</div>'
                        else
                            html = '<div class="btn-group">' +
                                '    <button ' + isDisabled + ' type="button" onclick="window.cronJobController.startStop(\'' + row.id + '\', \'' + row.triggerStatus + '\', \'' + row.scheduleConf + '\')" class="btn btn-danger btn-sm">已禁用</button>' +
                                '</div>'
                        return html
                    }
                },
                {data: 'author', title: $translate.instant("task_scheduling.datatable.author")},
                {
                    data: 'scheduleConf',
                    title: '查看',
                    render: function (data, type, row, meta) {
                        return '<div class="btn-group">' +
                            '<button type="button" onclick="window.cronJobController.nextExecutionTime(\'' + row.scheduleConf + '\')" class="btn btn-default btn-sm" title="查看下次执行时间"><i class="fa fa-history"></i></button>' +
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
                        var isDisabled = "";
                        if (!currentUser.hasPermission("jao:edit")) {
                            isDisabled = "disabled";
                        }
                        return '<div class="btn-group">' +
                            '    <button ' + isDisabled + ' type="button" onclick="window.cronJobController.executeCronJob(\'' + row.id + '\')" class="btn btn-default btn opx-btn-icon opx-btn-flat" title="' + $translate.instant("task_scheduling.datatable.execute_once") + '">' +
                            '        <i class="fa fa-play-circle"></i>' +
                            '    </button>' +
                            '    <button ' + isDisabled + ' type="button" onclick="window.location.href=\'#/app/jao/cron_job/new?id=' + row.id + '\'" class="btn btn-default opx-btn-icon opx-btn-flat" title="' + $translate.instant("common.entity.action.edit") + '">' +
                            '        <i class="fa fa-pencil"></i>' +
                            '    </button>' +
                            '    <button ' + isDisabled + ' type="button" onclick="window.cronJobController.deleteCronJob(\'' + row.id + '\')" class="btn btn-default opx-btn-icon opx-btn-flat" title="' + $translate.instant("common.entity.action.delete") + '">' +
                            '        <i class="fa fa-trash-alt"></i>' +
                            '    </button>' +
                            '    <button ' + isDisabled + ' type="button" onclick="window.cronJobController.copyCronJob(\'' + row.id + '\')" class="btn btn-default opx-btn-icon opx-btn-flat" title="' + $translate.instant("common.action.copy") + '">' +
                            '        <i class="fa fa-copy"></i>' +
                            '    </button>' +
                            '</div>';
                    }
                }
            ];
            that.selectedCrons = [];
            that.tableConfig = {
                data: getPromise,
                columns: tableColumns,
                order: [[0, 'desc']],
                buttons: ['reload'],
                selection: {
                    valueData: function (row) {
                        var val = {id: row.id, scheduleConf: row.scheduleConf, triggerStatus: row.triggerStatus};
                        return val;
                    }, labelData: 'id', preselected: that.selectedCrons
                },
                language: {
                    emptyTable: "暂无任务调度数据",
                    loadingRecords: "正在加载任务数据...",
                    processing: "处理中...",
                    search: "搜索:",
                    lengthMenu: "显示 _MENU_ 条记录",
                    info: "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                    infoEmpty: "显示第 0 至 0 项结果，共 0 项",
                    paginate: {
                        first: "首页",
                        last: "末页", 
                        next: "下一页",
                        previous: "上一页"
                    }
                }
            }

            function getPromise() {
                var apps = {};
                var deferred = $q.defer();
                
                console.log('Starting data load...'); // 调试日志
                
                // 先尝试直接加载任务数据，简化流程
                cronJobService.cronRestInterface("query").then(function (listCron) {
                    console.log('cronJob API response:', listCron); // 调试日志
                    
                    var tableData = [];
                    
                    // 检查返回数据格式
                    if (!listCron) {
                        console.warn('cronJob API returned null/undefined');
                        deferred.resolve([]);
                        return;
                    }
                    
                    if (!angular.isArray(listCron)) {
                        console.warn('cronJob API returned non-array data:', typeof listCron, listCron);
                        deferred.resolve([]);
                        return;
                    }
                    
                    // 直接处理数据，不依赖appletService
                    angular.forEach(listCron, function (data) {
                        tableData.push(data);
                    });
                    
                    console.log('Processed table data count:', tableData.length); // 调试日志
                    deferred.resolve(tableData);
                    
                }).catch(function (err) {
                    console.error('Failed to load cron jobs:', err);
                    messageService.toast('error', 'Failed to load task scheduling data');
                    deferred.resolve([]); // 返回空数组而不是抛出错误
                });
                
                return deferred.promise;
            }

            //计算两个时间之间的时间差 多少天时分秒
            //startTime-Date.parse("2020-02-01 12:30:30")
            //endTime-Date.parse("2020-02-03 18:50:20")
            that.intervalTime = function (startTime, endTime, type = "text") {
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
    }
})();
