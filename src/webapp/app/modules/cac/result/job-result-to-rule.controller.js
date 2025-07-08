/**
 * @Auther: zml
 * @Date: 2018/5/18
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('JobResultToRuleCtrl', JobResultToRuleCtrl);
    JobResultToRuleCtrl.$inject = ['$http', 'entity', '$timeout', 'cacService', '$uibModalInstance', 'dataTable', 'cacResultService', '$translate'];

    function JobResultToRuleCtrl($http, entity, $timeout, cacService, $uibModalInstance, dataTable, cacResultService, $translate) {
        var vm = this;
        vm.saveAndDelCheckWhiteList=saveAndDelCheckWhiteList;
        vm.checkWhiteListID="";
        vm.views = {
            id: entity.id,
            checkItemName: entity.name,
            tableInstance: null,
            cancel: cancel
        };
        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function init() {
            if (vm.views.id) {
                cacResultService.queryOutput(vm.views.id).then(function (data) {
                    if(entity.templateId && entity.templateName && entity.scriptPath){
                        vm.checkWhiteList=data;//用来查询是否匹配白名单
                        vm.param={
                            templateId : entity.templateId,
                            hostId : vm.checkWhiteList.hostId,
                            checkName: vm.checkWhiteList.name
                        }
                        cacService.findByCheckWhiteList(vm.param).then(function (whiteList) {
                            if("" == whiteList){
                                vm.checkWhiteListType="add";
                                vm.btnStyle ='btn-info';
                            }else{
                                vm.btnStyle ='btn-danger';
                                vm.checkWhiteListType="del";
                                vm.checkWhiteListID =whiteList.id;
                            }
                        }).catch(function (err) {
                            throw err;
                        });
                    }

                    vm.views.metricStatus = data.status;
                    vm.views.metricName = data.name;
                    vm.views.metricValue = data.output;
                    if (vm.views.metricStatus == 'OK') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.pass');
                        vm.views.metricStatusClass = "badge bg-success";
                    } else if (vm.views.metricStatus == 'CHECK') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.check');
                        vm.views.metricStatusClass = "badge bg-warning";
                    } else if (vm.views.metricStatus == 'SKIPPING') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.skipping');
                        vm.views.metricStatusClass = "badge bg-secondary";
                    } else if (vm.views.metricStatus == 'FAILED') {
                        vm.views.metricStatus = $translate.instant('cac.result.audit_result.failed');
                        vm.views.metricStatusClass = "badge bg-danger";
                    } else {
                        vm.views.metricStatus = $translate.instant('common.messages.no_data');
                        vm.views.metricStatusClass = "label cac-bg-light-grey";
                    }
                }).catch(function (err) {
                    throw err;
                });
            } else {
                vm.views.metricStatus = $translate.instant('common.messages.no_data');
                vm.views.metricStatusClass = "label cac-bg-light-grey";
                vm.views.metricName = vm.views.checkItemName;
            }

        }

        init();

        function saveAndDelCheckWhiteList(){
            if("add" == vm.checkWhiteListType){
                vm.btnStyle ='btn-danger';
                vm.checkWhiteListType="del";
                vm.add={
                    templateId : entity.templateId,
                    templateName : entity.templateName,
                    scriptPath: entity.scriptPath,
                    hostId : vm.checkWhiteList.hostId,
                    hostKey : vm.checkWhiteList.hostKey,
                    checkName: vm.checkWhiteList.name
                }
                cacService.saveCheckWhiteList(vm.add).then(function (whiteList) {
                    console.log("add success ",whiteList)
                }).catch(function (err) {
                    throw err;
                });
            }else{
                vm.btnStyle ='btn-info';
                vm.checkWhiteListType="add";
                cacService.deleteCheckWhiteList({id:vm.checkWhiteListID}).then(function (data) {
                    console.log("delete success ",data)
                }).catch(function (err) {
                    console.log("err=== {}",err);
                });
            }
        }
    }

})
();
