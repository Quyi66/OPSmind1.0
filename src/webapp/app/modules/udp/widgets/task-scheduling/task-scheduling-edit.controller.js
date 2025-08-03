/**
 * @author luohuanjiang
 * @created on 2021/06/08
 */
(function () {
    angular.module('oplus.udp').controller('CronJobEditCtrl', CronJobEditCtrl);

    CronJobEditCtrl.$inject = ['$scope', 'messageService', '$uibModalInstance', 'cronJobData', 'jaoJobService', '$uibModal', 'cronJobService', '$translate', '$timeout', 'currentUser', 'appletService', 'commandService', 'jaoFlowService', 'Team'];

    function CronJobEditCtrl($scope, messageService, $uibModalInstance, cronJobData, jaoJobService, $uibModal, cronJobService, $translate, $timeout, currentUser, appletService, commandService, jaoFlowService, Team) {
        var vm = this;
        vm.cron = cronJobData;
        vm.cancel = cancel;
        vm.ccfIds = [];//包含cac cmd flows(简称ccfIds)
        const _jobConstant = ['cac', 'flows', 'cmd'];//定义一个不用传入参数脚本类型常量

        if (currentUser.hasPermission('jao:edit')) {
            vm.jaoHighPower = false
        } else {
            vm.jaoHighPower = true;
        }

        if (vm.cron.id) {
            cronJobService.cronRestInterface("findId", vm.cron.id).then(function (result) {
                vm.cron = result;
                vm.params = [];
                vm.echoLabel = {};//回显运行参数的label
                vm.echoDescription = {};//回显运行参数的description
                vm.echotype = {};//回显运行参数的type

                if (_jobConstant.indexOf(vm.cron.jobType) <= -1) {
                    jaoJobService.findJobById(vm.cron.jobId).then(function (job) {
                        _.forEach(job.params, function (info) {
                            vm.echoLabel[info.name] = info.label;
                            vm.echoDescription[info.name] = info.description;
                            vm.echotype[info.name] = info.type;
                        })
                    }).catch(function (err) {
                        messageService.toast('error', $translate.instant("jao.messages.unable_obtain_job_info"), err.message);
                    });
                }

                $timeout(function () {
                    for (var key in vm.cron.jobParam) {
                        // 如果是团队信息，单独处理
                        if (key === 'teamIds' && vm.cron.jobType === 'cac') {
                            // 改为单选，只取第一个团队ID
                            var teamIds = vm.cron.jobParam[key].split(',');
                            vm.cron.selectedTeamId = teamIds[0];
                        } else {
                            vm.params.push({
                                'name': key,
                                'defaultValue': vm.cron.jobParam[key],
                                'label': vm.echoLabel[key],
                                'description': vm.echoDescription[key],
                                'type': vm.echotype[key]
                            });
                        }
                    }
                    if (_jobConstant.indexOf(vm.cron.jobType) > -1) {
                        vm.ccfIds = vm.cron.jobId.split(",");
                        vm.cron.jobId = '';
                        vm.displayType = false;
                    } else {
                        vm.displayType = true;
                    }
                    getJobsData(vm.cron.jobType);
                    vm.cron.logOutput = vm.cron.logOutput == true ? "0" : "1";
                    vm.cron.isEncrypt = vm.cron.isEncrypt == true ? "0" : "1";
                }, 200);
            }).catch(function (err) {
                throw err;
            });
        } else {
            vm.cron.logOutput = "1";//默认不开启日志
            vm.cron.isEncrypt = "1";//默认不加密
        }

        // 初始化团队列表
        vm.teamList = [];
        loadTeamList();

        function cancel() {
            $uibModalInstance.close();
        }

        // 加载团队列表
        function loadTeamList() {
            Team.findTeams().then(function(teams) {
                vm.teamList = teams;
            }).catch(function(err) {
                console.error('Failed to load teams:', err);
                messageService.toast('error', '加载团队列表失败');
            });
        }


        $scope.jobTypes = [
            {label: '', value: ''},
            {label: $translate.instant("task_scheduling.job_type_one"), value: 'script'},
            {label: $translate.instant("task_scheduling.job_type_two"), value: 'rest'},
            {label: $translate.instant("task_scheduling.job_type_three"), value: 'cac'},
            {label: $translate.instant("cmd.index.list"), value: 'cmd'},
            {label: $translate.instant("jao.index.schedule"), value: 'flows'}
        ];

        //change 事件 点击重新获取下拉数据
        $scope.showTemplate = function () {
            vm.displayType = _jobConstant.indexOf(vm.cron.jobType) > -1 ? false : true;
            //监控cmd值是否发送变化
            $scope.$watch('vm.ccfIds', function (newVal, oldVal) {
                switch (vm.cron.jobType) {
                    //cac提供附件名称参数字段
                    case _jobConstant[0]:
                        vm.params = [{
                            "name": "annex_name",
                            "label": $translate.instant("task_scheduling.custom_attachment_name"),
                            "description": $translate.instant("task_scheduling.custom_attachment_name"),
                            "type": null,
                            "defaultValue": "",
                            "secret": false
                        }];
                        break;
                    case _jobConstant[2]:
                        //cmd运行需要手动选择 主机，所以给他提供一个默认的参数叫hosts
                        vm.params = [{
                            "name": "hosts",
                            "label": $translate.instant("jao.common.host"),
                            "description": $translate.instant("jao.common.host"),
                            "type": "host",
                            "defaultValue": "",
                            "secret": false
                        }];
                        break;
                }
            });
            vm.cron.jobId = '';//清空
            getJobsData(vm.cron.jobType);
        };

        appletService.findApplets().then(function (applets) {
            $scope.appletsList = applets;
            /*_.forEach(applets, function (data) {
                vm.appletsMap[data.name] = data.title;
            })*/
        }).catch(function (err) {
            throw err;
        });

        function getJobsData(value) {
            if (value) {
                switch (value) {
                    case 'script':
                    case 'rest':
                        jaoJobService.findAllJobs(value).then(function (jobs) {
                            $scope.jobList = jobs;
                        }).catch(function (err) {
                            messageService.toast('error', $translate.instant("jao.messages.unable_obtain_job_info"), err.message);
                        });
                        break;
                    case 'cac':
                        cronJobService.getCacData().then(function (cac) {
                            $scope.jobList = cac;
                            vm.params[0].label = $translate.instant("task_scheduling.custom_attachment_name");//回显时label是没有值的。
                        }).catch(function (err) {
                            throw err;
                        });
                        break;
                    case 'cmd':
                        commandService.findByTenantIdAndCreatedBy().then(function (cmd) {
                            $scope.jobList = cmd;
                        }).catch(function (err) {
                            throw err;
                        });
                        break;
                    case 'flows':
                        jaoFlowService.findAllFlows().then(function (flows) {
                            $scope.jobList = flows;
                        }).catch(function (err) {
                            throw err;
                        });
                        break;
                }

            } else {
                $scope.jobList = [];
            }
        }

        $scope.showJobParameter = function () {
            if (_jobConstant.indexOf(vm.cron.jobType) <= -1)
                jobIdQueryData(vm.cron.jobId);
        };

        function jobIdQueryData(id) {
            jaoJobService.findJobById(id).then(function (job) {
                vm.params = job.params;
                var configJson = job.configJson;
                vm.jobConfig = JSON.parse(configJson || '{}');
                if (!angular.isObject(vm.jobConfig)) {
                    throw new FatalError($translate.instant("jao.messages.not_json", {configJson: configJson}));
                }
            }).catch(function (err) {
                messageService.toast('error', $translate.instant("jao.messages.unable_obtain_job_info"), err.message);
            });
        }

        vm.JobOperatingParam = function () {
            var instance = $uibModal.open({
                template: '<div class="modal-header">' +
                    '<h3 class="modal-title">{{ \'task_scheduling.operating_param\' | translate}}</h3>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="bg-light p-3" style="height:10rem;">' +
                    '<udp-input ng-repeat="param in $ctrl.params track by $index" type="string" label="{{param.label||param.name}}" showlabel="true" desc="{{param.description}}" showdesc="true" ng-model="param.defaultValue" control="{{param.isInput}}"></udp-input>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '   <button class="btn btn-default opx-btn-cancel" ng-click="$ctrl.cancel()">{{ \'common.entity.action.back\' | translate}}</button>' +
                    '</div>',
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    var that = this;
                    that.cancel = cancel;
                    that.params = vm.params;
                    //如果vm.params参数中有主机字段，且默认值是乱填写的，则清空。
                    _.forEach(that.params, function (info) {
                        if ("host" === info.type || "hosts" === info.name) {
                            if (!angular.isArray(info.defaultValue)) info.defaultValue = [];
                            info.isInput = 'assetSelector';
                        } else {
                            info.isInput = 'input';
                        }
                    })

                    function cancel() {
                        $uibModalInstance.close({action: "cancel"});
                    }
                }],
                controllerAs: '$ctrl',
                size: 'lg',
                backdrop: true
            });

        }

        vm.CronDialogBox = function () {
            var instance = $uibModal.open({
                templateUrl: 'app/modules/jao/cronJob/cron.html',
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    var that = this;
                    that.cancel = cancel;
                    that.scheduleConf = scheduleConf;
                    that.cron = vm.cron.scheduleConf.replace(/(^s*)|(s*$)/g, "").length == 0 ? "* * * * * ? " : vm.cron.scheduleConf;

                    function cancel() {
                        $uibModalInstance.close({action: "cancel"});
                    }

                    function scheduleConf() {
                        var cron = angular.element("#cron").val();
                        vm.cron.scheduleConf = cron;
                        cancel();
                    }
                }],
                controllerAs: '$ctrl',
                size: 'sm',
                backdrop: true
            });

        }

        vm.save = function () {
            var cronRequest = {
                jobDesc: vm.cron.jobDesc,
                scheduleConf: vm.cron.scheduleConf,
                jobType: vm.cron.jobType,
                appCode: vm.cron.appCode,
                jobId: _jobConstant.indexOf(vm.cron.jobType) > -1 ? vm.ccfIds.toString() : vm.cron.jobId,
                jobParam: {}
            };

            // 如果是巡检作业，添加团队信息到jobParam中，并设置categoryName
            if (vm.cron.jobType === 'cac' && vm.cron.selectedTeamId) {
                cronRequest.jobParam.teamIds = vm.cron.selectedTeamId;
                
                // 根据选中的团队ID找到团队名称，设置到categoryName
                var selectedTeam = vm.teamList.find(function(team) {
                    return team.id === vm.cron.selectedTeamId;
                });
                if (selectedTeam) {
                    cronRequest.categoryName = selectedTeam.name;
                }
            }

            if (_jobConstant[2] === vm.cron.jobType && vm.params[0].defaultValue.length < 1) {
                messageService.alertWarning("warning", "The running parameters are empty. Please enter the running parameters!");
                return;
            }

            if (_jobConstant.indexOf(vm.cron.jobType) <= -1 || _jobConstant[2] === vm.cron.jobType || _jobConstant[0] === vm.cron.jobType) {
                vm.params.forEach(function (param) {
                    cronRequest.jobParam[param.name] = param.defaultValue;
                });
                cronRequest.logOutput = typeConversion(vm.cron.logOutput);
                cronRequest.isEncrypt = typeConversion(vm.cron.isEncrypt);
            }

            var implement;
            if (vm.cron.id) {
                implement = "update";
                cronRequest.id = vm.cron.id;
            } else {
                implement = "add";
            }
            cronJobService.cronRestInterface(implement, cronRequest).then(function (result) {
                if (200 === result.code)
                    messageService.toast('success', implement + $translate.instant("task_scheduling.success_id", {msg: result.code}));
                else
                    messageService.toast('error', implement + $translate.instant("task_scheduling.error_id", {msg: result.msg}));
                vm.cancel();
            });


            /*var promise = jaoJobService.runJob(jobRequest, null);*/
            /*var json =JSON.stringify(jobRequest.options.params);*/
        };

        function typeConversion(data) {
            if ("1" == data) {
                return false;
            } else {
                return true;
            }
        }


        $scope.logOutputs = [
            {label: $translate.instant("task_scheduling.yes"), value: "0"},
            {label: $translate.instant("task_scheduling.no"), value: "1"}
        ];

        $scope.isEncrypts = [
            {label: $translate.instant("task_scheduling.yes"), value: "0"},
            {label: $translate.instant("task_scheduling.no"), value: "1"}
        ];

    }


})();