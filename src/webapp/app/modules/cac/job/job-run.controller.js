/**
 * @Auther: zml
 * @Date: 2018/5/3
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacJobRunCtrl', CacJobRunCtrl);
    CacJobRunCtrl.$inject = ['$scope', '$timeout', '$state', '$stateParams', 'cacJobService', '$http', 'messageService', 'cacService', 'restUtils', '$translate'];

    function CacJobRunCtrl($scope, $timeout, $state, $stateParams, cacJobService, $http, messageService, cacService, restUtils, $translate) {
        var vm = this;
        var template = $stateParams.template == null ? {} : $stateParams.template;

        vm.views = {
            job: {},
            template: template,
            save: save,
            run: run,
            back: back
        };

        //接收子页面传过来的数据
        $scope.$on("template", function (event, data) {
            vm.views.job.auditParams = data.auditParams;
            vm.views.job.templateName = data.templateName;
            vm.views.job.templateId = data.id;
            vm.views.job.scriptType = data.scriptType;
        });

        function back() {
            $state.go("app.cac.template.list", {display: true}, {reload: false});
        }

        function run() {
            //向下广播，子页面接收到到信息之后作出处理，并用$scope.$on()接收
            $scope.$broadcast("to-template", {});
            //校验是否为空
            if (vm.views.job.templateName == null || vm.views.job.templateName == "") {
                messageService.toast("error", $translate.instant('cac.message.input', { name: $translate.instant('cac.template.name') }));
                return;
            }
            if (vm.views.job.auditParams == undefined) {
                messageService.toast("error", $translate.instant('common.messages.operation.failed', { operation: $translate.instant('cac.common.square') }));
                return;
            } else {
                var arr = angular.fromJson(vm.views.job.auditParams);
                if (arr.length > 0) {
                    for (var i = 0; i < arr.length; i++) {
                        var index = i + 1;
                        if (arr[i].hosts.length == 0) {
                            vm.views.info = $translate.instant('cac.messages.pls_select_host', { index: index });
                            messageService.toast("error", vm.views.info);
                            return;
                        } else if (arr[i].scripts.length == 0) {
                            vm.views.info = $translate.instant('cac.messages.pls_select_script', { index: index });
                            messageService.toast("error", vm.views.info);
                            return;
                        } else if (vm.views.job.scriptType != cacService.playbookScripType && arr[i].ruleExpressions.length == 0) {
                            // vm.views.info = "请选择检查项" + index + "的规则";
                            // messageService.toast("error", vm.views.info);
                            // return;
                        }
                    }
                } else if (arr.length == 0) {
                    vm.views.info = $translate.instant('cac.messages.pls_add_check');
                    messageService.toast("error", vm.views.info);
                    angular.element('.cac-job-run-btn').html("<i class=\"fa fa-play\"></i> " + $translate.instant('cac.common.run') + $translate.instant('cac.common.square'));
                    return;
                }
            }

            angular.element('.cac-job-run-btn').text($translate.instant('cac.messages.running'));
            /*
                        //检查规则、主机、脚本是否发生过变化
                        cacService.updateAuditParams(vm.views.job.auditParams).then(function (data) {
                           // vm.views.job.auditParams = angular.toJson(data);
                            vm.views.job.auditParams = data;
                            //获取子controller传递过来的template
                            //执行之前先保存job,在执行(后台已执行)

                        }).catch(function (data) {
                                console.log("$http通过检查规则重新获取auditParams失败！"+data);
                        });*/
            cacJobService.run(vm.views.job).then(function (data) {
                messageService.toast("success", $translate.instant('cac.messages.checking'));
                $state.go("app.cac.job.list", {templateId: vm.views.job.templateId});
            }).catch(function (data) {
                angular.element('.cac-job-run-btn').html("<i class=\"fa fa-play\"></i> " + $translate.instant('cac.common.run') + $translate.instant('cac.common.square'));
                //data.message获取主要异常信息
                //data.stack获取详细异常信息
                messageService.toast("error", data.message);
            });
        }


        function save() {
            //触发点击事件，子controller（template controller）向父controller传递数据
            //$scope.$broadcast("to-template", {});
            $timeout(function () {
                //获取子controller传递过来的template
                if (vm.views.job.auditParams == undefined) {
                    return;
                } else {
                    cacService.deleteAuditJsonAttr(angular.fromJson(vm.views.job.auditParams));
                }
                cacJobService.addJob(vm.views.job).then(function () {
                    messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.save') }));
                }).catch(function (data) {
                    messageService.toast("error", $translate.instant('common.messages.operation.failed', { operation: $translate.instant('common.entity.action.save') }) + "：" + data);
                });

                $state.go("app.cac.job", {});
            }, 1000);
        }

        init();

        function init() {
            if ($stateParams.template != null) {
                vm.views.job = {};
                vm.views.job.templateName = $stateParams.template.templateName;
                vm.views.job.auditParams = $stateParams.template.auditParams;
            }
        }

    }

})
();
