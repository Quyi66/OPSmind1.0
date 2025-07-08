(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacTemplatesEditController', CacTemplatesEditController);
    CacTemplatesEditController.$inject = ['$scope', '$timeout', '$state', 'CacTemplatesService', '$uibModal', 'messageService', 'currentUser', '$translate','CacInspectionService','CacCheckLogService','entity'];

    function CacTemplatesEditController($scope, $timeout, $state, CacTemplatesService, $uibModal, messageService, currentUser, $translate,CacInspectionService,CacCheckLogService,entity) {
        var vm = this;

        vm.clear = clear;
        vm.save = save;

        vm.views = {
            auditParams: [{
                hosts: null === entity.hostsJson ? [] : angular.fromJson(entity.hostsJson)
            }],
            templates: entity
        }

        function save(){
            vm.isSaving = true;
            var hostsInfo =vm.views.auditParams[0];//主机信息
            if(hostsInfo.hosts.length === 0){
                messageService.toast("warning",  $translate.instant('cac3.information.prompt.host_info_notnull'));
                onSaveError();
                return;
            }
            if(vm.views.templates.threeCheckItemIds.length === 0){
                messageService.toast("warning",  $translate.instant('cac3.information.prompt.inspection_item_notnull'));
                onSaveError();
                return;
            }

            vm.views.templates.hostsJson = angular.toJson(hostsInfo.hosts);

            CacTemplatesService.uniqueValidation(vm.views.templates).then(function (data) {
                if("" !== data){
                    messageService.toast("error",  $translate.instant('cac3.information.prompt.add_duplicate_template_name'));
                    onSaveError();
                }else{
                    if("" !== vm.views.templates.id && null !== vm.views.templates.id && typeof(vm.views.templates.id)!="undefined"){
                        CacCheckLogService.isItRunning(vm.views.templates.id).then(function(data){
                            if(data){
                                messageService.toast("warning",  $translate.instant('cac3.information.prompt.cannot_be_modified_during_execution'));
                                onSaveError();
                            }else{
                                saveAndUpdate();
                            }
                        }).catch(function (err) {
                            messageService.alertError("danger", $translate.instant('common.messages.operation.failed'));
                            throw err;
                        });
                    }else{
                        saveAndUpdate();
                    }
                }
            }).catch(function (err) {
                onSaveError();
                throw err;
            });

        }

        function saveAndUpdate() {
            vm.views.templates.globalParameters = null === vm.views.templates.globalParameters ? "" : vm.views.templates.globalParameters;
            CacTemplatesService.saveORUpdateTemplates(vm.views.templates,vm.views.templates.id).then(function (data) {
                if("" === data || null === data){
                    messageService.toast("error",  $translate.instant('cac3.information.prompt.add_duplicate_inspection_name'));
                    onSaveError();
                }else{
                    messageService.toast("success",  $translate.instant("cmd.messages.save_success"));
                    clear();
                }
            }).catch(function (err) {
                onSaveError();
                throw err;
            });
        }

        function onSaveError() {
            vm.isSaving = false;
        }

        function clear() {
            $state.go('app.cac3.templates.list', {});
        }

    }

})
();
