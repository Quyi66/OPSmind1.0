/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacEditTemplateCtrl', CacEditTemplateCtrl);
    CacEditTemplateCtrl.$inject = ['$scope', '$timeout', '$state', '$stateParams', 'cacTemplateService', '$uibModal', 'messageService', 'cacService', 'gfsActionHelper', 'cmActions', 'currentUser', '$translate'];

    /**
     * @param {gfsActionHelper} gfsActionHelper
     */
    function CacEditTemplateCtrl($scope, $timeout, $state, $stateParams, cacTemplateService, $uibModal, messageService, cacService, gfsActionHelper, cmActions, currentUser, $translate) {
        var vm = this;
        var templateId = $stateParams.templateId;

        vm.views = {
            deleteTemplate: deleteTemplate,
            // selectCacTemplateRules: selectCacTemplateRules,
            // selectCacTemplateHosts: selectCacTemplateHosts,
            // selectCacTemplateScripts: selectCacTemplateScripts,
            // selectScripts: selectScripts,
            deleteParams: deleteParams,
            addParams: addParams,
            removeScript: removeScript,
            changePlaybook: changePlaybook,
            back: back,
            save: save,
            templateRuleNames: "",
            templateHostNames: "",
            templateScriptNames: "",
            auditParams: [],
            auditParam: {},
            templateScripts: [],
            tableInstance: null,
            index: 0,
            template: {
                "scriptType": cacService.playbookScripType
            },
            showAuditParamsDetails: showAuditParamsDetails,
            detailFlag: [],
            playbookConstant: cacService.playbookScripType,
            templateNameFlag: false,
            jobStatus: $stateParams.jobStatus,
            fileSelectorConfig: {
                repoType: 'git',
                viewMode: 'dialog',
                initDir: $translate.instant('cac.common.run_scrip_path'),
                multipleSelect: false,
                showFileConfig: true,
                doNotShowTagsParam: true
            }
        };

        //$on用于截获来自父级作用域的事件----获取job任务模块传过来的template值
        $scope.$on("templateEdit", function (event, data) {
            vm.views.template = data;
            vm.views.auditParams = angular.fromJson(vm.views.template.auditParams);
            resolveAuditParams();
        });

        $scope.$on("to-template", function (event, data) {
            vm.views.auditParams = cacService.deleteAuditJsonAttr(vm.views.auditParams);
            // vm.views.auditParams = deleteHostAttr(vm.views.auditParams);
            changeHostKeyNameAndAddScriptName(vm.views.auditParams);
            vm.views.template.auditParams = angular.toJson(vm.views.auditParams);
            deleteHostAttr(vm.views.auditParams);
            //子Controller将数据传递到父Controller
            $scope.$emit("template", vm.views.template);

        });

        function deleteHostAttr(auditParams) {
            // auditParams.forEach(function (auditParam) {
            //     var hosts= [];
            //     auditParam.hosts.forEach(function (host) {
            //         hosts.push({"key":host.hostKey,"value":host.value,"assetType":host.assetType,});
            //     });
            //     auditParam.hosts = hosts;
            // });
            return auditParams;
        }

        function changeHostKeyNameAndAddScriptName(auditParams) {
            auditParams.forEach(function (auditParam) {
                // var hosts= [];
                // auditParam.hosts.forEach(function (host) {
                //     hosts.push({"hostKey":host.key,"value":host.value,"assetType":host.assetType});
                // });
                // auditParam.hosts = hosts;
                auditParam.scripts.forEach(function (script) {
                    script.scriptName = script.scriptPath;
                });
            });
            return auditParams;
        }

        // function addScriptName(auditParams) {
        //     auditParams.forEach(function (auditParam) {
        //         auditParam.scripts.forEach(function (script) {
        //             script.scriptName = script.scriptPath;
        //         });
        //     });
        //     return auditParams;
        // }

        initCacV2();

        function initCacV2() {
            $scope.cacV2 = {
                // enabled: !window.$oplus.appConfig.modules.cac.useCacV1,
                enabled: true,
                selectScripts: selectGfsScripts
            };

            function selectGfsScripts(item, $index, scriptType, ev) {
                var theScripts = vm.views.auditParams[$index].scripts;
                var selected = [];
                _.forEach(theScripts, function (script) {
                    selected.push({id: script.id, path: script.scriptName, config: script.scriptParams});
                });

                var isPlaybook = scriptType === 'playbook';
                var config = {
                    repoType: 'git',
                    dir: '',
                    useSelector: true,
                    multipleSelect: !isPlaybook,
                    preSelected: selected,
                    fileFilter: isPlaybook ? '.zip,site.yaml,site.yml' : null,
                    onConfirm: onConfirmSelect
                };
                gfsActionHelper.openFileSelector($scope, config);

                function onConfirmSelect(scripts) {
                    //console.log('onConfirmSelect', scripts);
                    // var index = $index;
                    theScripts.length = 0;
                    // if (isPlaybook) {
                    // scripts = [scripts];
                    // }
                    _.forEach(scripts, function (script) {
                        theScripts.push({
                            id: script.id,
                            scriptName: script.path,
                            scriptPath: script.path,
                            scriptParams: script.config
                        });
                    });
                    // console.log(theScripts,vm.views.auditParams[$index].scripts)
                    // vm.views.auditParams[index].templateScriptNames = resolveArrToString(theScripts, "scriptName");
                }
            }
        }

        function showAuditParamsDetails($index) {
            //angular.element(".list-view-pf-expand").removeClass("active");
            vm.views.detailFlag[$index] = true;
            //vm.views.auditParams[$index] = vm.views.customScope.toggleExpandItemField(vm.views.auditParams[$index], name);
            vm.views.auditParams[$index] = vm.views.customScope.toggleExpandItemField(vm.views.auditParams[$index]);
            if (vm.views.auditParams[$index].isExpanded) {
                angular.element(".list-view-pf-expand." + $index).addClass("active");
            } else {
                angular.element(".list-view-pf-expand." + $index).removeClass("active");
            }
        }

        vm.views.customScope = {
            toggleExpandItemField: function (item, field) {
                //if (item.isExpanded && item.expandField === field) {
                item.isCollapsed = !item.isCollapsed;
                return item;
            }
        };

        function deleteParams($index, ev) {
            messageService.confirm(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('common.messages.operation.title', {
                    operation: $translate.instant('common.entity.action.delete'),
                    obj: $translate.instant('cac.common.param')
                }),
                function () {
                    vm.views.auditParams.splice($index, 1);
                    if (vm.views.auditParams.length == 0) {
                        initParams();
                    }
                });
        }

        function addParams(ev) {
            initParams();
        }


        //返回模板template列表
        function back() {
            $state.go("app.cac.template.list", {display: true}, {reload: false});
        }

        //保存模板template
        function save() {

            if (vm.views.template.templateName == null || vm.views.template.templateName == "") {
                messageService.toast("error", $translate.instant('cac.messages.input', {name: $translate.instant('cac.template.name')}));
                return;
            }
            vm.views.auditParams = cacService.deleteAuditJsonAttr(vm.views.auditParams);
            //vm.views.auditParams = cacTemplateService.assembleHost(vm.views.auditParams);

            changeHostKeyNameAndAddScriptName(vm.views.auditParams);
            vm.views.template.auditParams = angular.toJson(vm.views.auditParams);
            cacTemplateService.addTemplate(vm.views.template).then(
                function (data) {
                    vm.views.template = data;
                    messageService.toast("success", $translate.instant('common.messages.operation.success', {operation: $translate.instant('common.entity.action.save')}));

                    vm.views.auditParams = angular.fromJson(vm.views.template.auditParams);
                    deleteHostAttr(vm.views.auditParams);
                    resolveAuditParams();

                    $timeout(function () {
                        $state.go("app.cac.template.list");
                    }, 200);

                    // $state.go("app.cac.job_add", {templateId: vm.views.template.id});
                }
            ).catch(function (err) {
                throw err;
            });


        }


        function deleteTemplate(id) {
            if (id != null) {
                messageService.confirm(
                    $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                    $translate.instant('common.messages.operation.body', {
                        operation: $translate.instant('common.entity.action.delete'),
                        obj: $translate.instant('cac.common.template')
                    }), function () {
                        doDeleteTemplate(id, function () {
                            vm.views.tableInstance.ajax.reload(null, true);
                        });
                    });
            }
        }

        function doDeleteTemplate(id, callBack) {
            cacTemplateService.deleteTemplate(id).then(function () {
                if (callBack != null) {
                    callBack();
                }
            }).catch(function (err) {
                throw err;
            });
        }

        //选择巡检规则（取消规则）
        // function selectCacTemplateRules(item, $index, ev) {
        //     var oEvent = ev || event;
        //     //js阻止事件冒泡
        //     oEvent.cancelBubble = true;
        //     oEvent.stopPropagation();
        //     $uibModal.open({
        //         templateUrl: 'app/modules/cac/template/template-rule-list.html',
        //         controller: 'CacTemplateRuleCtrl',
        //         controllerAs: 'cacTemplateRuleVm',
        //         backdrop: 'static',
        //         size: 'lg',
        //         resolve: {
        //             entity: function () {
        //                 return {
        //                     rules: item.ruleExpressions,
        //                     index: $index
        //                 };
        //             }
        //         }
        //     }).result.then(function (result) {
        //         var action = result.action;
        //         if (action != "cancel") {
        //             var index = result.index;
        //             vm.views.auditParams[index].ruleExpressions = result.selectedRules;
        //             vm.views.auditParams[index].templateRuleNames = resolveArrToString(result.selectedRules, "ruleName");
        //         }
        //     }).catch(function (err) {
        //         throw err;
        //     });
        // }

        //选择巡检主机
        // function selectCacTemplateHosts(item, $index, ev) {
        //     var hostSelectConfig = {preSelectedHosts:[],preSelectorGroup:''};
        //     _.forEach(vm.views.auditParams[$index].hosts,function(host){
        //         hostSelectConfig.preSelectedHosts.push(host.hostKey);
        //     });
        //
        //     cmActions.openHostSelector(hostSelectConfig,function(selectedHosts){
        //         vm.views.auditParams[$index].hosts = selectedHosts;
        //         vm.views.auditParams[$index].templateHostNames = resolveArrToString(selectedHosts, "hostKey");
        //     });
        //
        //     /*
        //     $uibModal.open({
        //         templateUrl: 'app/modules/cac/template/template-host-list.html',
        //         controller: 'CacTemplateHostCtrl',
        //         controllerAs: 'cacTemplateHostVm',
        //         backdrop: 'static',
        //         size: 'lg',
        //         resolve: {
        //             entity: function () {
        //                 return {
        //                     hosts: item.hosts,
        //                     index: $index
        //                 };
        //             }
        //         }
        //     }).result.then(function (result) {
        //         var action = result.action;
        //         if (action != "cancel") {
        //             var index = result.index;
        //             vm.views.auditParams[index].hosts = result.selectedHosts;
        //             vm.views.auditParams[index].templateHostNames = resolveArrToString(result.selectedHosts, "hostKey");
        //         } else {
        //             var index = result.index;
        //             vm.views.auditParams[index].hosts = result.selectedHosts;
        //             vm.views.auditParams[index].templateHostNames = resolveArrToString(result.selectedHosts, "hostKey");
        //         }
        //     }, function () {
        //
        //     });*/
        // }

        function selectScripts(result) {
            var action = result.action;
            if (action != "cancel") {
                var index = result.index;
                vm.views.auditParams[index].scripts = result.selectedScripts;
                vm.views.auditParams[index].templateScriptNames = resolveArrToString(result.selectedScripts, "scriptName");
            }
        }

        // //选择巡检脚本
        // function selectCacTemplateScripts(item, $index, scriptType, ev) {
        //     $uibModal.open({
        //         templateUrl: 'app/modules/cac/template/template-script-list.html',
        //         controller: 'CacTemplateScriptCtrl',
        //         controllerAs: 'cacTemplateScriptVm',
        //         backdrop: 'static',
        //         size: 'md',
        //         resolve: {
        //             entity: function () {
        //                 return {
        //                     scripts: item.scripts,
        //                     index: $index,
        //                     scriptType: scriptType
        //                 };
        //             }
        //         }
        //     }).result.then(function (result) {
        //         var action = result.action;
        //         if (action != "cancel") {
        //             var index = result.index;
        //             vm.views.auditParams[index].scripts = result.selectedScripts;
        //             vm.views.auditParams[index].templateScriptNames = resolveArrToString(result.selectedScripts, "scriptName");
        //         }
        //     }).catch(function (err) {
        //         throw err;
        //     });
        // }

        //根据数组属性，将数组转换为逗号分隔的字符串
        function resolveArrToString(arr, name) {
            var result = "";
            if (arr != null && arr.length > 0) {
                var templateArr = [];
                for (var i in arr) {
                    templateArr.push(arr[i][name]);
                }

                result = templateArr.join(",");
            }
            return result;
        }

        function initParams() {
            var auditParam = {
                scripts: [],
                ruleExpressions: [],
                hosts: [],
                isExpanded: true
            };
            vm.views.auditParams.push(auditParam);
            var index = vm.views.auditParams.length - 1;
            $timeout(function () {
                angular.element(".list-view-pf-expand." + index).addClass("active")
            });
        }

        function resolveAuditParams() {
            for (var i = 0; i < vm.views.auditParams.length; i++) {
                vm.views.auditParams[i].templateHostNames = resolveArrToString(vm.views.auditParams[i].hosts, "key");
                vm.views.auditParams[i].templateRuleNames = resolveArrToString(vm.views.auditParams[i].ruleExpressions, "ruleName");
                vm.views.auditParams[i].templateScriptNames = resolveArrToString(vm.views.auditParams[i].scripts, "scriptName");
            }
        }

        //当选择脚本类型为playbook时，如果有多个选项，则截取第一个选项
        function changePlaybook() {
            if (vm.views.auditParams.length > 1) {
                vm.views.auditParams = vm.views.auditParams.splice(0, 1);
            }
        }

        //根据脚本id，移除不需要的脚本
        function removeScript(scriptId, index) {
            messageService.confirm(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('common.messages.operation.body', {
                    operation: $translate.instant('common.entity.action.delete'),
                    obj: $translate.instant('cac.common.template')
                }),
                function () {
                    for (var i = 0; i < vm.views.auditParams[index].scripts.length; i++) {
                        if (vm.views.auditParams[index].scripts[i].id == scriptId) {
                            vm.views.auditParams[index].scripts.splice(i, 1);
                            break;
                        }
                    }
                });

        }

        function init() {
            if (templateId != null) {
                cacTemplateService.getTemplateById(templateId).then(function (data) {
                    vm.views.template = data;
                    if (vm.views.template.auditParams != "") {
                        vm.views.auditParams = angular.fromJson(vm.views.template.auditParams);
                        vm.views.auditParams = deleteHostAttr(vm.views.auditParams);
                        resolveAuditParams();
                    }
                }).catch(function (err) {
                    throw err;
                });
                vm.views.permission = currentUser.isSameUser(vm.views.template.createdBy) ? "cac:view" : "cac:edit";
                vm.views.uuaMessage = $translate.instant('common.uaa.no_permission_title');
            } else {
                vm.views.permission = "cac:edit:*";
                vm.views.uuaMessage = $translate.instant('common.uaa.no_permission_title');
                initParams();
            }
        }

        init();
    }

})
();
