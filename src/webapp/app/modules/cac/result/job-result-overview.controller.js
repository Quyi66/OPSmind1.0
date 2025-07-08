/**
 * @Auther: zml
 * @Date: 2018/5/24
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //主控制器
    cacModule.controller('JobResultOverviewCtrl', ResultCtrl);
    ResultCtrl.$inject = ['cacResultService', '$http', 'currentUser', '$scope', 'cacService', '$timeout', '$state', '$stateParams', '$uibModal', '$translate', 'messageService'];

    function ResultCtrl(cacResultService, $http, currentUser, $scope, cacService, $timeout, $state, $stateParams, $uibModal, $translate, messageService) {
        var vm = this;
        var jobId = $stateParams.jobId;

        vm.params = {
            "job_id": $stateParams.jobId
        }
        vm.jobStatus = {
            "OK": {title: $translate.instant('cac.result.status.ok'), style: 'success'},
            "RUNNING": {title: $translate.instant('cac.result.status.running'), style: 'primary'},
            "ERROR": {title: $translate.instant('cac.result.status.error'), style: 'danger'}
        };

        vm.views = {
            job: {},
            auditParams: [],
            results: {},
            hosts: [],
            allhosts: [],
            rules: [],
            resultList: [],
            data_table: [],
            data_row: [],
            start: 0,//分页加载网格
            length: 5000,//每次加载十个主机
            // analyseMetric: analyseMetric,
            loadMore: loadMore,
            playbookScripType: cacService.playbookScripType,
            getMetricByJobIdAndHostKey: getMetricByJobIdAndHostKey,
            getMetricByJobIdAndHostKeyAndRule: getMetricByJobIdAndHostKeyAndRule,
            exportExcel: exportExcel,
            showHostKey: false,
            showRuleName: false,
            showLog: showLog,
            clickResult: clickResult,
            resultView: "outline",
            profileView: 'normal',
            isLoading: false,
            changeResultView: changeResultView,
            /* changeProfileView: changeProfileView*/
        };

        //巡检项-白名单
        vm.checkWhiteList = function () {
            var instance = $uibModal.open({
                parent: 'consultant',
                templateUrl: 'app/modules/cac/result/check-white-list.html',
                controller: ['$scope', '$uibModalInstance', 'messageService', function ($scope, $uibModalInstance, messageService) {
                    var that = this;
                    that.cancel = cancel;
                    that.deleteCheckWhiteList = deleteCheckWhiteList;

                    function cancel() {
                        $uibModalInstance.close({action: "cancel"});
                    }

                    var tableColumnConfig = [
                        {mData: 'templateName', title: $translate.instant('cac.white_list.template_name')},
                        {mData: 'hostKey', title: $translate.instant('cac.white_list.host_name')},
                        {mData: 'checkName', title: $translate.instant('cac.profile.check_item')},
                        {mData: 'scriptPath', title: $translate.instant('cac.white_list.patrol_script_path')},
                        {
                            mData: 'id', title: $translate.instant('cac.white_list.operate'),
                            className: 'text-center',
                            searchable: false,
                            orderable: false,
                            render: function (data, type, row, meta) {
                                var id = angular.toJson({id: row.id});
                                return '<div class="btn-group">' +
                                    ' <button type="button" class="btn btn-default btn-sm" ng-click=\'$ctrl.deleteCheckWhiteList(' + id + ')\' title="' + $translate.instant("cac.profile.remove_white_list") + '">' +
                                    '   <i class="fa fa-trash-alt"></i>' +
                                    ' </button>&nbsp;' +
                                    '</div>';
                            }
                        }
                    ];
                    $scope.tableConfig = {
                        data: [getPromise],
                        columns: tableColumnConfig,
                        order: [[1, 'desc']],
                        buttons: ['reload']
                    }

                    function getPromise() {
                        return cacService.getCheckWhiteList(vm.views.job.templateId);
                    }


                    function deleteCheckWhiteList(id) {
                        messageService.confirm($translate.instant('common.entity.delete.title'), $translate.instant("cac.profile.remove_white_list"), function () {
                            cacService.deleteCheckWhiteList(id).then(function (data) {
                                $uibModalInstance.close({action: "cancel"});
                                $timeout(function () {
                                    vm.checkWhiteList();
                                }, 100);
                                messageService.toast("success", $translate.instant('common.messages.operation.success'));
                            }).catch(function (err) {
                                messageService.alertWarning("warning", $translate.instant('common.messages.operation.failed'));
                                //console.log("err=== {}", err);
                            });
                        });
                    }

                }],
                controllerAs: '$ctrl',
                size: 'md',
                backdrop: true
            });
        }

        function clickResult(id, rule) {
            var scriptPath = "";
            vm.views.auditParams.forEach(function (mode, index) {
                mode.scripts.forEach(function (mode2, index2) {
                    scriptPath = mode2.scriptPath;
                    return;
                })
            });
            $timeout(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/cac/result/job-result-to-rule.html',
                    controller: 'JobResultToRuleCtrl',
                    controllerAs: 'jobResultToRuleCtrlVm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                id: id,
                                name: rule.checkItem,
                                //白名单-所需参数
                                templateId: vm.views.job.templateId,
                                templateName: vm.views.job.templateName,
                                scriptPath: scriptPath
                            };
                        }
                    }
                });
            }, 200);
            // console.log(id);
            // console.log(rule);
            // cacResultService.getCheckItemById(id);
        }

        function changeResultView() {
            if (vm.views.resultView === "list") {
                $state.go("app.cac.result", {jobId: vm.views.job.id});
                vm.views.resultView = "outline";
            } else {
                $state.go("app.cac.result.output", {
                    jobId: vm.views.job.id,
                    taskId: vm.views.job.taskId,
                    templateId: vm.views.job.templateId
                });
                vm.views.resultView = "list";
            }
        }

        /*  function changeProfileView() {
              if (vm.views.profileView === "profile") {
                  $state.go("app.cac.result", {jobId: vm.views.job.id});
                  vm.views.profileView = "normal";
              } else {
                  $state.go("app.cac.result.view", {jobId: vm.views.job.id});
                  vm.views.profileView = "profile";
              }
          }*/

        //用来测试分析的
        function analyseMetric() {
            var result = {};
            result.josResult = vm.views.job.jobResult;
            result.jobStatus = vm.views.job.jobStatus;
            result.taskId = vm.views.job.taskId;
            cacResultService.getOutputsByTaskId_test(vm.views.job.taskId).then(function (data) {
                result.outputs = data;
            }).catch(function (err) {
                console.log("err=== {}", err);
            });

            result.metrics = cacResultService.getMetrics(vm.views.job.id).then(function (data) {
                result.metrics = data;
            }).catch(function (err) {
                console.log("err=== {}", err);
            });

            $timeout(function () {
                cacResultService.analyseMetric(angular.fromJson(result));
            }, 3000);
        }

        //打开执行日志
        function showLog() {
            $uibModal.open({
                templateUrl: 'app/modules/cac/job/job-run-log.html',
                controller: 'CacJobRunLogCtrl',
                controllerAs: 'cacJobRunLogVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    params: function () {
                        return {
                            jobId: jobId
                        }
                    }
                }
            }).result.then(function (result) {
            }).catch(function (err) {
                throw err;
            });
        }

        //将结果导出Excel
        function exportExcel(event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL（防止跳转页面）

            var instance = $uibModal.open({
                template: '<div class="modal-header">'+
                    '<button type="button" class="btn-close" data-dismiss="modal" title="'+$translate.instant('common.file.close_prompt')+'" ng-click="$ctrl.cancel()" style="margin-left: 95%;"></button>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<div class="op-blank-slate">' +
                    '<div class="op-blank-slate-icon">' +
                    '<i class="fa fa-4x fa-pulse fa-spinner fa-fw"></i>' +
                    '</div>' +
                    '<p class="op-flashing-text">'+$translate.instant('common.file.file_downloading')+'</p>' +
                    '</div>' +
                    '</div>',
                controller: ['$scope','$uibModalInstance',downloadExcel],
                controllerAs: '$ctrl',
                size: 'sm',
                backdrop: 'static'
            });

            function downloadExcel($scope,$uibModalInstance){
                var _downloadExcel = this;

                _downloadExcel.$onInit = initDownloadExcel;
                _downloadExcel.cancel = cancel;
                function cancel() {
                    $uibModalInstance.close({action: "cancel"});
                }

                function initDownloadExcel(){
                    var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v2/results/export/' + jobId;//请求的URl
                    var xhr = new XMLHttpRequest();//定义http请求对象
                    xhr.open("GET", url, true);
                    var token = currentUser.authToken;
                    xhr.setRequestHeader("Authorization", "Bearer " + token);
                    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhr.setRequestHeader("Language", $translate.use());
                    xhr.send();
                    xhr.responseType = "blob";  // 返回类型blob
                    xhr.onload = function () {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                        if (this.status === 200) {
                            var blob = this.response;
                            var reader = new FileReader();
                            reader.readAsDataURL(blob);
                            $timeout(function () {
                                var d = new Date();
                                var datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '_' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                                var a = document.createElement('a');
                                a.download = vm.views.job.templateName + datetime + ".xlsx";
                                a.href = reader.result;
                                $("body").append(a);
                                a.click();
                                $uibModalInstance.close(true);
                            }, 100);
                        } else {
                            $uibModalInstance.close(true);
                            messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                        }
                    }
                }

            }
        }

        function getMetricByJobIdAndHostKey(jobId, hostKey, ruleName, metricName, metricStatus) {
            cacResultService.getMetricByJobIdAndHostKey(jobId, hostKey, ruleName, metricName, metricStatus);
        }

        function getMetricByJobIdAndHostKeyAndRule(jobId, hostKey, ruleName, ruleExpression) {
            cacResultService.getMetricByJobIdAndHostKeyAndRule(jobId, hostKey, ruleName, ruleExpression);
        }

        function getJob(jobId) {
            cacResultService.getJob(jobId).then(function (data) {
                vm.views.job = data;
                vm.views.auditParams = angular.fromJson(vm.views.job.auditParams);
                if (vm.views.job.jobStatus != 'ERROR') {
                    getResultsByJobId(jobId);
                }
            }).catch(function (err) {
                throw err;
            });
        }

        function mockResult(hostSum, ruleSum) {
            var hosts = [];
            for (var i = 1; i <= hostSum; i++) {
                hosts.push({
                    unreachable: "REACHABLE",
                    hostKey: "host-" + i
                });
            }

            var rules = [];
            for (var j = 1; j <= ruleSum; j++) {
                rules.push({
                    ruleName: "rule-" + j,
                    applicability: "",
                    ruleExpression: "ruleExpression-" + j
                });
            }

            var results = [];
            _.forEach(hosts, function (host) {
                _.forEach(rules, function (rule) {
                    results.push(
                        {
                            hostKey: host.hostKey,
                            ruleName: rule.ruleName,
                            auditResult: $translate.instant('cac.result.audit_result.rule_not_square')
                        }
                    );
                });
            });

            return {
                hosts: hosts,
                rules: rules,
                results: results
            };
        }

        function getResultsByJobId(jobId) {
            vm.views.isLoading = true;
            // if (jobId == 'ff808081717c84890171853c38b11e2c' || window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     //if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     // $http({
            //     //     url: "app/modules/cac/api/result.json",
            //     //     method: 'GET'
            //     // }).then(function (data) {
            //     //     vm.views.results = data.data;
            //     //     vm.views.hosts = vm.views.results.hosts;
            //     //     vm.views.rules = vm.views.results.rules;
            //     //     vm.views.resultList = vm.views.results.results;
            //     //     $timeout(function () {
            //     //         showTable();
            //     //     });
            //     // });
            //
            //     vm.views.results = mockResult(5000, 100);
            //     vm.views.hosts = vm.views.results.hosts;
            //     vm.views.rules = vm.views.results.rules;
            //     vm.views.resultList = vm.views.results.results;
            //     $timeout(function () {
            //         showTable();
            //     });
            // } else {
            cacResultService.getResultsByJobId(jobId, vm.views.start, vm.views.length).then(function (data) {
                vm.views.results = data;
                vm.views.results.hosts = _.sortBy(vm.views.results.hosts, ['hostKey']);
                /*if (vm.views.job.scriptType == vm.views.playbookScripType) {
                    vm.views.hostResults = data.hostKey;
                    vm.views.checkItems = data.checkItem;
                    vm.views.hosts = data.hosts;
                    $timeout(function () {
                        showPlaybookTable();
                    });
                } else {
                    vm.views.hosts = vm.views.results.hosts;
                    vm.views.rules = vm.views.results.rules;
                    vm.views.resultList = vm.views.results.results;
                    $timeout(function () {
                        showTable();
                    });
                }*/
                vm.views.hosts = vm.views.results.hosts;
                vm.views.rules = vm.views.results.rules;
                // console.log(angular.toJson(vm.views.rules));
                vm.views.resultList = vm.views.results.results;
                $timeout(function () {
                    vm.views.isLoading = false;
                    showTable();
                });


            }).catch(function (err) {
                throw err;
            });
        }

        // }

        function init() {
            if (jobId != null) {
                getJob(jobId);
            }
        }

        init();

        /**
         * 1、先循环模板中的主机列表
         * 2、循环主机检查结果，根据主机获取该主机的全部检查项
         * 3、循环全部的检查项，如果该检查项在第二步中的存在，则判断检查成功与否。否则未检查
         *
         */
        function showPlaybookTable() {
            for (var i = 0; i < vm.views.hostResults.length; i++) {
                var hostCheckItems = vm.views.hostResults[i].checkItem;
                var hostKey = vm.views.hostResults[i].hostKey;
                var tr_obj = {};
                tr_obj.hostKey = hostKey;
                tr_obj.hostStatus = vm.views.hostResults[i].unreachable;
                var td_arrs = [];
                for (var j = 0; j < vm.views.checkItems.length; j++) {
                    //组装表格中每个td的数据
                    var td_obj = {};
                    td_obj.checkItem = vm.views.checkItems[j].checkItem;
                    //cac_result结果表中的状态由'true','false','人工判断'和'规则未检查'四种状态
                    var flag = null;
                    for (var k = 0; k < hostCheckItems.length; k++) {
                        if (vm.views.checkItems[j].checkItem == hostCheckItems[k].checkItem) {
                            if (hostCheckItems[k].auditResult == 'OK') {
                                flag = 'true';
                                break;
                            } else if (hostCheckItems[k].auditResult == 'FAILED') {
                                flag = 'false';
                                break;
                            } else if (hostCheckItems[k].auditResult == $translate.instant('cac.result.audit_result.check')) {
                                flag = $translate.instant('cac.result.audit_result.check');
                                break;
                            } else if (hostCheckItems[k].auditResult == $translate.instant('cac.result.audit_result.skipping')) {
                                flag = $translate.instant('cac.result.audit_result.skipping');
                                break;
                            }
                        }
                    }
                    td_obj.flag = flag;
                    td_arrs.push(td_obj);
                }
                tr_obj.checkItems = td_arrs;
                vm.views.data_table.push(tr_obj);
            }
        }

        function showTable() {
            var startTime = (new Date()).getTime();

            console.log("Start show table startTime = " + startTime);

            var hostRuleResultMap = {};
            var tableRecords = [];

            if (vm.views.resultList.length == 0) {
                vm.views.data_table = tableRecords;
            } else {
                for (var listIndex = 0; listIndex < vm.views.resultList.length; listIndex++) {
                    var result = vm.views.resultList[listIndex];
                    //cac_result结果表中的状态由'true','false','人工判断'和'规则未检查'四种状态
                    if (result.auditResult == 'OK') {
                        result.flag = 'true';
                    } else if (result.auditResult == 'FAILED') {
                        result.flag = 'false';
                    } else if (result.auditResult == 'CHECK') {
                        result.flag = $translate.instant('cac.result.audit_result.check');
                    } else if (result.auditResult == 'SKIPPING') {
                        result.flag = $translate.instant('cac.result.audit_result.skipping');
                    }
                    var key = result.hostKey + "-" + result.checkItem;
                    hostRuleResultMap[key] = result;

                }
                console.log("Hosts size = " + vm.views.hosts.length);
                console.log("Rule size = " + vm.views.rules.length);
                for (var hIndex = 0; hIndex < vm.views.hosts.length; hIndex++) {

                    var host = vm.views.hosts[hIndex];
                    var record = {
                        hostKey: host.hostKey,
                        hostStatus: host.unreachable,
                        isUnreachable: (host.unreachable === 'UNREACHABLE' || host.unreachable === 'unreachable') && host.unreachable !== "SKIPPING",
                        isSkipping: host.unreachable === "SKIPPING",
                        rules: []
                    };
                    tableRecords.push(record);

                    var data_row = record.rules;

                    for (var rIndex = 0; rIndex < vm.views.rules.length; rIndex++) {
                        // console.log("Size 2 = " + vm.views.rules.length);

                        var rule = vm.views.rules[rIndex];
                        //不能rule_obj = vm.views.rules[rIndex]这样直接赋值。
                        var rule_obj = {
                            hostKey: record.hostKey,
                            hostStatus: record.hostStatus
                        };

                        rule_obj.checkItem = rule.checkItem;
                        var key = host.hostKey + "-" + rule.checkItem;
                        var result = hostRuleResultMap[key];
                        if (result) {
                            rule_obj.id = result.id;
                            rule_obj.flag = result.flag;
                        } else {
                            rule_obj.id = "";
                            rule_obj.flag = "-";

                        }
                        var flag = rule_obj.flag;

                        var skipping = $translate.instant('cac.result.audit_result.skipping');
                        rule_obj.class = flag == 'true' ? 'bg-success' : (flag == 'false' ? 'bg-danger' : (flag == $translate.instant('cac.result.audit_result.check') ? 'bg-warning' : (flag == $translate.instant('cac.common.inapplicable') ? 'cac-bg-grey' : (flag == skipping ? 'bg-info' : 'bg-light'))));
                        rule_obj.iconClass = flag == 'true' ? 'fa-check' : (flag == 'false' ? 'fa-times' : (flag == $translate.instant('cac.result.audit_result.check') ? 'fa-user-md' : (flag == $translate.instant('cac.common.inapplicable') ? 'fa-minus' : (flag == skipping ? 'fa-adjust' : 'fa-question'))));
                        // rule_obj.title = vm.views.job.scriptType + "!=" + vm.views.playbookScripType + "?" + rule_obj.ruleExpression + ":" + rule_obj.checkItem;
                        rule_obj.title = rule_obj.checkItem;
                        data_row.push(rule_obj);
                    }
                }

                var finishTime = (new Date()).getTime();
                console.log("Finish show table, finishTime = " + finishTime + " time cost = " + (finishTime - startTime) / 1000);
                vm.views.data_table = tableRecords;
                //  console.log(JSON.stringify(vm.views.data_table));
            }

        }

        function loadMore() {
            if (vm.views.hosts.length >= vm.views.length) {
                vm.views.start += vm.views.length;
                cacResultService.getResultsByJobId(jobId, vm.views.start, vm.views.length).then(function (data) {
                    vm.views.results = data;
                    vm.views.hosts = vm.views.results.hosts;
                    if (vm.views.hosts.length > 0) {
                        if (vm.views.job.scriptType == vm.views.playbookScripType) {
                            /*vm.views.hostResults = data.hostKey;
                            vm.views.checkItems = data.checkItem;
                            $timeout(function () {
                                showPlaybookTable();
                            });*/
                        } else {
                            vm.views.rules = vm.views.results.rules;
                            vm.views.resultList = vm.views.results.results;
                            $timeout(function () {
                                showTable();
                            });
                        }
                    }

                }).catch(function (err) {
                    throw err;
                });
            }

        }
    }


    //滚动指令
    cacModule.directive('whenScrolled', function () {
        return function (scope, elm, attr) {
            // 内层DIV的滚动加载
            var raw = elm[0];
            elm.bind('scroll', function () {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - 5) {
                    scope.$apply(attr.whenScrolled);
                }
            });
        };
    });


})();
