(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacInspectionEditController', CacInspectionEditController);
    CacInspectionEditController.$inject = ['$scope', '$timeout', '$state', '$stateParams', 'CacInspectionService', '$uibModal', 'messageService', 'currentUser', '$translate','CacCheckLogService'];

    function CacInspectionEditController($scope, $timeout, $state, $stateParams, CacInspectionService, $uibModal, messageService, currentUser, $translate,CacCheckLogService) {
        var vm = this;
        var inspectionId = $stateParams.id;
        vm.clear = clear;
        vm.save = save;

        vm.views = {
            fileSelectorConfigCheck: {
                repoType: 'git',
                viewMode: 'dialog',
                initDir: "oplus/oplus-cac/system_inspection/check/scripts",
                multipleSelect: false,
                showFileConfig: true,
                doNotShowTagsParam: true
            },
            fileSelectorConfigFix: {
                repoType: 'git',
                viewMode: 'dialog',
                initDir: "oplus/oplus-cac/system_inspection/fix/scripts",
                multipleSelect: false,
                showFileConfig: true,
                doNotShowTagsParam: true
            },
            auditParams:[{
                inspectionScripts: [],
                repairScripts: [],
                hosts: []
            }],

        }

        function save() {
            vm.isSaving = true;

            if(vm.inspection.name.indexOf(",") != -1 || vm.inspection.name.indexOf("|") != -1){
                messageService.toast("warning",  $translate.instant('cac3.information.prompt.thereAreSpecialSymbolsInTheName'));
                onSaveError();
                return;
            }

            var scripts =vm.views.auditParams[0];
            if (scripts.inspectionScripts.length === 0) {
                messageService.toast("warning",  $translate.instant('cac3.information.prompt.patrolScriptCannotBeEmpty'));
                onSaveError();
                return;
            }else if(scripts.repairScripts.length === 0 || typeof vm.inspection.fixScriptPath === 'undefined' || null === vm.inspection.fixScriptPath){
                vm.inspection.fixScriptPath="";
                vm.inspection.fixParams = null;
            }


            scripts.inspectionScripts.forEach(function (val, index) {
                vm.inspection.checkScriptPath = val.scriptPath;
                vm.inspection.checkParams = val.scriptParams;
            });

            scripts.repairScripts.forEach(function (val, index) {
                vm.inspection.fixScriptPath = val.scriptPath;
                vm.inspection.fixParams = val.scriptParams;
            });

            let checkScriptPath = vm.inspection.checkScriptPath.indexOf(".") !== -1;
            let fixScriptPath = "" === vm.inspection.fixScriptPath ? true : vm.inspection.fixScriptPath.indexOf(".") !== -1;
            if(!checkScriptPath || !fixScriptPath){
                messageService.toast("error",  $translate.instant('cac3.information.prompt.theScriptMustBeFile'));
                onSaveError();
                return;
            }

            if(vm.inspection.checkScriptPath === vm.inspection.fixScriptPath){
                messageService.toast("error",  $translate.instant('cac3.information.prompt.fixScriptCheckScriptInconsistent'));
                onSaveError();
                return;
            }

            vm.inspection.checkScriptType =vm.inspection.checkScriptPath.split('.').pop().toLowerCase();
            vm.inspection.fixScriptType =vm.inspection.fixScriptPath.split('.').pop().toLowerCase();
            vm.inspection.exceptionHosts = angular.toJson(scripts.hosts);



            CacInspectionService.uniqueValidation(vm.inspection).then(function (data) {
                if("" !== data.msg){
                    messageService.alertError("error",data.msg)
                    onSaveError();
                }else{
                    if("" !== vm.inspection.id && null !== vm.inspection.id && typeof(vm.inspection.id)!="undefined"){
                        CacCheckLogService.isItRunning(vm.inspection.id).then(function(data){
                            if(data){
                                messageService.toast("warning",  $translate.instant('cac3.information.prompt.thePatrolItemIsBeingExecutedAndCannotBeModified'));
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
            CacInspectionService.saveORUpdateInspection(vm.inspection,vm.inspection.id).then(function (data) {
                if("" === data){
                    messageService.toast("error",  $translate.instant('cac3.information.prompt.thePatrolItemIsBeingExecutedAndCannotBeModified'));
                    onSaveError();
                }else{
                    messageService.toast("success",  $translate.instant("app.setting.messages.info.appCreated"));
                    clear();
                }
            }).catch(function (err) {
                onSaveError();
                throw err;
            });
        }


        function init() {
            if (inspectionId != null) {
                CacInspectionService.getInspectionById(inspectionId).then(function (data) {
                    vm.inspection = data;
                    var tempFixScriptPath =[{'scriptPath':vm.inspection.fixScriptPath,'scriptParams':vm.inspection.fixParams}];
                    if(null === vm.inspection.fixScriptPath || "" === vm.inspection.fixScriptPath){
                        tempFixScriptPath =[];
                    }
                    $timeout(function () {
                        vm.views.auditParams=[{
                            inspectionScripts: [{'scriptPath':vm.inspection.checkScriptPath,'scriptParams':vm.inspection.checkParams}],
                            repairScripts: tempFixScriptPath,
                            hosts: angular.fromJson(vm.inspection.exceptionHosts)
                        }];
                    }, 200);
                }).catch(function (err) {
                    throw err;
                });
            }
        }
        init();

        function onSaveError() {
            vm.isSaving = false;
        }

        function clear() {
            $state.go('app.cac3.inspection.list', {});
        }

    }
})
();
