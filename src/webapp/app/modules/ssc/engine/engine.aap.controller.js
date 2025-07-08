(function () {
    'use strict';

    angular.module('oplus.ssc').controller('EngineAAPController', EngineAAPController);

    EngineAAPController.$inject = ['$scope', '$uibModal', '$compile', 'dataTable', '$translate', 'Param', 'sscEngineService', 'messageService', 'widgetInteraction'];

    function EngineAAPController($scope, $uibModal, $compile, dataTable, $translate, Param, sscEngineService, messageService, widgetInteraction) {
        var vm = this;
        vm.ansible_engines = [
            {
                name: 'Ansible',
                value: 'ansible'
            },
            {
                name: 'Ansible Automation Platform',
                value: 'aap'
            }
        ];

        vm.$onInit = onInit;
        vm.changeEngine = changeEngine;
        vm.openEEUploaderPage = openEEUploaderPage;
        vm.saveAapConfig = saveAapConfig;
        vm.saveAnsibleConfig = saveAnsibleConfig;
        vm.connectAap = connectAap
        vm.jaoParamKeys = []
        vm.jaoParamJsonKeys = ['is_fork','forks','sync_script_git']
        vm.ataParamKeys = ['tower_host']
        // value值为json字符串的配置项
        vm.ataParamJsonKeys = ['tower_clear','tower_config','tower_login_config','task_timeout']
        vm.jaoParamMap = {};
        vm.ataParamMap = {};
        vm.isConnectAap = false;
        vm.EEUploadPageConfig = {
            pageId: 'o9R4Os', 
            target: '_dialog' 
        } ;

        function onInit() {
            Param.getByDomainAndName('jao', 'script_engine').then(function (result) {
                vm.scriptEngineParam = result;
                vm.usedEngine = vm.scriptEngineParam.value;
                vm.scriptEngine = vm.scriptEngineParam.value;
                if (vm.scriptEngine === 'ansible') {
                    loadAnsibleConfig()
                } else if (vm.scriptEngine === 'aap') {
                    loadAapConfig();
                }
            });
        }


        /**
         * 验证aap配置账号密码是否能连接
         */
        function connectAap() {
            if (hasAapAccount()) {
                sscEngineService.queryProjectBaseDir().then(function(result){
                    vm.isConnectAap = true;
                    var aapConfig = angular.fromJson(result);
                    vm.aapProjectBaseDir = aapConfig.project_base_dir;
                    getAapInfo();
                    messageService.toast('success', 'connect aap success');
                },function(){
                    messageService.toast('error', 'account error,can not connect aap');
                });
            }
        }

        function hasAapAccount() {
            if (!vm.ataParamMap)  return false;
            if (!vm.ataParamMap['tower_host'])  return false;
            if (!vm.ataParamMap['tower_login_config']) return false;
            if (!vm.ataParamMap['tower_login_config']['value']['web_login_name']) return false;
            if (!vm.ataParamMap['tower_login_config']['value']['web_login_pwd']) return false;
            return true;
        }

        function openEEUploaderPage() {
            widgetInteraction.openPage(vm.EEUploadPageConfig, {}, {
                // current: angular.element(e.currentTarget).parents('flow-run-viewer'),
                // scope: $scope
            })
        }

        function loadAnsibleConfig() {
            Param.getByDomain('jao').then(function(params){
                _.forEach(params,function(obj){
                    if (vm.jaoParamKeys.indexOf(obj.name) !== -1) {
                        vm.jaoParamMap[obj.name] = obj;
                    } else if (vm.jaoParamJsonKeys.indexOf(obj.name) !== -1) {
                        obj.value = JSON.parse(obj.value);
                        vm.jaoParamMap[obj.name] = obj;
                    }
                })
            })
        }

        function loadAapConfig() {
            Param.getByDomain('ata').then(function(params){
                _.forEach(params,function(obj){
                    if (vm.ataParamKeys.indexOf(obj.name) !== -1) {
                        vm.ataParamMap[obj.name] = obj;
                    } else if (vm.ataParamJsonKeys.indexOf(obj.name) !== -1) {
                        obj.value = JSON.parse(obj.value);
                        vm.ataParamMap[obj.name] = obj;
                    }
                })
                connectAap();
            })
        }
        function changeEngine() {
            messageService.confirm($translate.instant('adm.prompt.change_operation'), $translate.instant('adm.prompt.cwtstc'), function () {
                saveJaoEngineParam(vm.usedEngine);
            });
        }


        $scope.addClusterServer = function () {
            vm.cs = {
                "host": "",
                "port": "",
                "username": "",
                "password": ""
            };
            vm.ataParamMap.tower_login_config.value.cluster_servers.push(vm.cs);
        };


        $scope.deleteClusterServe = function (index) {
            if (vm.ataParamMap.tower_login_config.value.cluster_servers.length <= 1) {
                alert("can not delete the last node ")
            } else {
                vm.ataParamMap.tower_login_config.value.cluster_servers.splice(index, 1);
            }
        };


        function saveJaoEngineParam() {
            if (vm.scriptEngineParam) {
                vm.scriptEngineParam.value = vm.usedEngine;
                Param.update(vm.scriptEngineParam, function() {
                    messageService.toast('success', $translate.instant('adm.prompt.success_change'));
                    vm.scriptEngine = vm.usedEngine;
                    onInit();
                }, function() {
                    messageService.toast('Error', $translate.instant('adm.prompt.failed_change'));
                });
            }
        }

        function saveAapConfig() {
            messageService.confirm($translate.instant('adm.prompt.change_operation'), $translate.instant('adm.prompt.cwtstc'), function () {
                var saveAtaParams = [];
                for (var key in vm.ataParamMap) {
                    var param = vm.ataParamMap[key];
                    if (vm.ataParamJsonKeys.indexOf(key) !== -1) {
                        param.value = angular.toJson(param.value);
                    }
                    saveAtaParams.push(param);
                }
                Param.batchUpdate(saveAtaParams).then(function(result){
                    onInit();
                    messageService.toast('success', $translate.instant('adm.prompt.success_change'));
                },function(){
                    messageService.toast('Error', $translate.instant('adm.prompt.failed_change'));
                });
            });
        }

        function saveAnsibleConfig(){
            messageService.confirm($translate.instant('adm.prompt.change_operation'), $translate.instant('adm.prompt.cwtstc'), function () {
                var saveJaoParams = [];
                for (var key in vm.jaoParamMap) {
                    var param = vm.jaoParamMap[key];
                    saveJaoParams.push(param);
                }
                Param.batchUpdate(saveJaoParams).then(function(result){
                    onInit();
                    messageService.toast('success', $translate.instant('adm.prompt.success_change'));
                },function(){
                    messageService.toast('Error', $translate.instant('adm.prompt.failed_change'));
                });
            });
        }

        vm.changeProjectPath = changeProjectPath

        function changeProjectPath() {
            var project = _.find(vm.queryProjects,{id: vm.ataParamMap.tower_config.value.template_project_id})
            vm.ataParamMap.tower_config.value.project_path = vm.aapProjectBaseDir + '/' + project.local_path;
        }

        function getAapInfo() {
            sscEngineService.queryProjects().then(function (result) {
                vm.queryProjects = angular.fromJson(result).results;
            });

            sscEngineService.queryOrganizations().then(function (result) {
                    vm.queryOrganizations = angular.fromJson(result).results;
                }
            );
            sscEngineService.queryCredentials().then(function (result) {
                    vm.queryCredentials = angular.fromJson(result).results;
                }
            );
            sscEngineService.queryExecution_environments().then(function (result) {
                    vm.queryExecution_environments = angular.fromJson(result).results;
                }
            );
            sscEngineService.queryInstance_groups().then(function (result) {
                    vm.queryInstance_groups = angular.fromJson(result).results;
                }
            );


        }

    }

})();
