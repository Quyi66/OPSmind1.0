(function () {
        var cacModule = angular.module('oplus.cac');

        cacModule.controller('CacTeamConfigCtrl', CacTeamConfigCtrl);
        CacTeamConfigCtrl.$inject = ['$scope', '$timeout', '$state', '$stateParams', 'cacTemplateService', 'messageService', '$translate'];

        function CacTeamConfigCtrl($scope, $timeout, $state, $stateParams, cacTemplateService, messageService, $translate) {
            var vm = this;
            vm.views = {
                templateId: $stateParams.templateId,
                templateName: $stateParams.templateName,
                teamsInfoData: [],
                choice_data: choice_data,
            }
            getTeamsInfo();//初始化
            function getTeamsInfo() {
                cacTemplateService.getTeamsInfo().then(function (data) {
                    if (Object.keys(data).length > 0) {
                        for (var key in data) {
                            vm.views.teamsInfoData.push({
                                'templateId': vm.views.templateId,
                                'teamId': key,
                                'teamName': data[key]
                            });
                        }
                        getSelectTeamData();
                    }
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
                });
            }

            function choice_data(teamData) {//保存数据
                cacTemplateService.saveTeamsInfo(teamData).then(function () {
                    console.log("save==", teamData);
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
                });
            }

            function getSelectTeamData() {//获取点击过的数据并回显
                cacTemplateService.getCacTeamConfig(vm.views.templateId).then(function (data) {
                    if (Object.keys(data).length > 0) {
                        for (var key in data) {
                            for (var i =0 ; i < vm.views.teamsInfoData.length ;i++){
                                if(key == vm.views.teamsInfoData[i].teamId){
                                    vm.views.teamsInfoData[i].isChecked = true
                                    break;
                                }
                            }
                        }
                    }
                }).catch(function (err) {
                    messageService.toast('error', $translate.instant("cac.export.error_msg"), err.message);
                });
            }

        }
    }
)
();
