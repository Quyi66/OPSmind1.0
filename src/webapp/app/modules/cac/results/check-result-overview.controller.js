/**
 * @Auther: zml
 * @Date: 2018/5/24
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //主控制器
    cacModule.controller('CheckResultOverviewCtrl', CheckResultOverviewCtrl);
    CheckResultOverviewCtrl.$inject = ['CheckResultService', '$http','currentUser', '$scope', 'cacService', '$timeout', '$state', '$stateParams', '$uibModal', '$translate','CacCheckLogService'];

    function CheckResultOverviewCtrl(CheckResultService, $http,currentUser, $scope, cacService, $timeout, $state, $stateParams, $uibModal, $translate,CacCheckLogService) {
        var vm = this;
        var logId = $stateParams.logId;

        vm.params = {
            "check_log_id": $stateParams.logId
        }

        vm.status = {
            "OK": {title: $translate.instant('cac.result.status.ok'), style: 'success'},
            "RUNNING": {title: $translate.instant('cac.result.status.running'), style: 'primary'},
            "SUCCESS": {title: $translate.instant('cac.result.status.ok'), style: 'success'},
            "ERROR": {title: $translate.instant('cac.result.status.error'), style: 'danger'}
        };

        vm.views = {
            checkLog: {},
            isLoading: false,
            resultList: [],
            data_table: [],
            results: {},
            hosts: [],
            loadMore: loadMore,
            changeResultView: changeResultView,
            clickResult: clickResult,
            rules: [],
            auditParams: [
                {
                    hosts:[],
                    items:[]
                }
            ],
            showLog: showLog,
            exportExcel: exportExcel,
            showHostKey: false,
            showItem: false,
            profileView: 'normal',
            start: 0,//分页加载网格
            length: 5000,//每次加载十个主机
        };


        function getJob(logId) {
            CacCheckLogService.getCheckLog(logId).then(function (data) {
                vm.views.checkLog = data;
                vm.views.auditParams[0].hosts =angular.fromJson(vm.views.checkLog.hostJson);
                vm.views.auditParams[0].items =angular.fromJson(vm.views.checkLog.itemJson);
                if(null === vm.views.checkLog.templateId){
                    vm.views.checkLog.templateId="inspection_all";
                }
                if (vm.views.checkLog.status != 'ERROR') {
                    getResultsByJobId(logId);
                }
            }).catch(function (err) {
                throw err;
            });
        }

        function init() {
            if (logId != null) {
                getJob(logId);
            }
        }
        init();

        function getResultsByJobId(logId) {
            vm.views.isLoading = true;

            CheckResultService.getCheckResultsByJobId(logId, vm.views.start, vm.views.length).then(function (data) {
                vm.views.results = data;
                vm.views.results.hosts = _.sortBy(vm.views.results.hosts, ['hostKey']);
                vm.views.hosts = vm.views.results.hosts;
                vm.views.rules = vm.views.results.rules;
                vm.views.resultList = vm.views.results.results;
                $timeout(function () {
                    vm.views.isLoading = false;
                    showTable();
                });
            }).catch(function (err) {
                throw err;
            });
        }

        function showTable() {
            var startTime = (new Date()).getTime();

            //console.log("Start show table startTime = " + startTime);

            var hostRuleResultMap = {};
            var tableRecords = [];

            if (vm.views.resultList.length == 0) {
                vm.views.data_table = tableRecords;
            } else {
                for (var listIndex = 0; listIndex < vm.views.resultList.length; listIndex++) {
                    var result = vm.views.resultList[listIndex];
                    //cac_result结果表中的状态由'true','false','人工判断'和'规则未检查'四种状态
                    if (result.status == 'OK') {
                        result.flag = 'true';
                    } else if (result.status == 'FAILED') {
                        result.flag = 'false';
                    } else if (result.status == 'CHECK') {
                        result.flag = $translate.instant('cac.result.audit_result.check');
                    }
                    var key = result.hostKey + "-" + result.itemName;
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
                        var rule = vm.views.rules[rIndex];

                        var rule_obj = {
                            hostKey: record.hostKey,
                            hostStatus: record.hostStatus
                        };

                        rule_obj.itemName = rule.itemName;
                        var key = host.hostKey + "-" + rule.itemName;
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
                        rule_obj.class = flag == 'true' ? 'bg-success' : (flag == 'false' ? 'bg-danger' : (flag == $translate.instant('cac3.title.manualJudgment') ? 'bg-warning' : (flag == $translate.instant('cac3.title.inapplicable') ? 'cac-bg-grey' : 'bg-light')));
                        rule_obj.iconClass = flag == 'true' ? 'fa-check' : (flag == 'false' ? 'fa-times' : (flag == $translate.instant('cac3.title.manualJudgment') ? 'fa-exclamation' : (flag == $translate.instant('cac3.title.inapplicable') ? 'fa-minus' :  'fa-question')));
                        rule_obj.title = rule_obj.itemName;
                        data_row.push(rule_obj);
                    }
                }

                var finishTime = (new Date()).getTime();
                vm.views.data_table = tableRecords;
            }

        }

        function changeResultView() {
            if (vm.views.resultView === "list") {
                $state.go("app.cac3.check_result", {logId: vm.views.checkLog.id});
                vm.views.resultView = "outline";
            } else {
                $state.go("app.cac3.check_result.output", {logId: vm.views.checkLog.id});
                vm.views.resultView = "list";
            }
        }

        function clickResult(id, rule) {
            $timeout(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/cac/results/check-result-to-rule.html',
                    controller: 'CheckResultToRuleCtrl',
                    controllerAs: 'checkResultToRuleCtrlVm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                id: id,
                                name: rule.itemName,
                            };
                        }
                    }
                });
            }, 200);
        }

        //打开执行日志
        function showLog() {
            $uibModal.open({
                templateUrl: 'app/modules/cac/log/check-log-result.html',
                controller: 'CacCheckLogResultCtrl',
                controllerAs: 'cacCheckLogResultVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    params: function () {
                        return {
                            jobId: vm.views.checkLog.taskId
                        }
                    }
                }
            }).result.then(function (result) {
            }).catch(function (err) {
                throw err;
            });
        }

        function loadMore() {
            if (vm.views.hosts.length >= vm.views.length) {
                vm.views.start += vm.views.length;
                CheckResultService.getCheckResultsByJobId(logId, vm.views.start, vm.views.length).then(function (data) {
                    vm.views.results = data;
                    vm.views.hosts = vm.views.results.hosts;
                    if (vm.views.hosts.length > 0) {
                        vm.views.rules = vm.views.results.rules;
                        vm.views.resultList = vm.views.results.results;
                        $timeout(function () {
                            showTable();
                        });
                    }

                }).catch(function (err) {
                    throw err;
                });
            }
        }

        //将结果导出Excel
        function exportExcel(event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL
            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v3/check-item-result/export/' + logId;//请求的URl
            var xhr = new XMLHttpRequest();//定义http请求对象
            xhr.open("GET", url, true);
            var token = currentUser.authToken;
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send();
            xhr.responseType = "blob";  // 返回类型blob
            xhr.onload = function () {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                if (this.status === 200) {
                    var blob = this.response;
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    $timeout(function () {
                        var d = new Date();
                        var datetime=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + '_' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
                        var a = document.createElement('a');
                        a.download =vm.views.checkLog.name+datetime+".xlsx";
                        a.href = reader.result;
                        $("body").append(a);
                        a.click();
                    }, 100);
                } else {
                    messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                }
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
