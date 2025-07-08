/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacTemplateSquareCtrl', CacTemplateSquareCtrl);
    CacTemplateSquareCtrl.$inject = ['$scope', '$timeout', '$state', 'cacService', 'cacTemplateService', '$compile', 'messageService', '$filter', '$http', 'currentUser', 'cacResultService', '$translate', 'Param'];

    function CacTemplateSquareCtrl($scope, $timeout, $state, cacService, cacTemplateService, $compile, messageService, $filter, $http, currentUser, cacResultService, $translate, Param) {
        var vm = this;


        vm.views = {
            deleteTemplate: deleteTemplate,
            editTemplate: editTemplate,
            findTemplate: findTemplate,
            run: run,
            dashboardSwitch: "",
            teamsSwitch: ""
        };

        function init() {
            Param.getByDomain('cac').then(function (result) {
                let elementMap = new Map();
                result.forEach(item => elementMap.set(item.name, item.value));
                vm.views.dashboardSwitch = elementMap.get('dashboard_switch')  || 'no';
                vm.views.teamsSwitch = elementMap.get('teams_switch')  || 'no';
            }).catch(function (err) {
                throw err;
            });

            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     //使用假数据
            //     var templateUrl = "app/modules/cac/api/template.json";
            //     $http.get(templateUrl).then(function (data) {
            //         vm.views.templateList = data;
            //         for (var i = 0; i < vm.views.templateList.length; i++) {
            //             vm.views.templateList[i].auditParams = angular.fromJson(vm.views.templateList[i].auditParams);
            //         }
            //     }).catch(function (err) {
            //         throw err;
            //     });
            // } else {
            cacTemplateService.getSquareTemplates().then(function (data) {
                vm.views.templateList = data;
                vm.views.templateSquareList = data;
                for (var i = 0; i < vm.views.templateSquareList.length; i++) {
                    vm.views.templateSquareList[i].auditParams = angular.fromJson(vm.views.templateSquareList[i].auditParams);
                    var hostLength = 0;
                    // var rulesLength = 0;
                    var scriptsLength = 0;
                    //todo 未去重
                    for (var j = 0; j < vm.views.templateSquareList[i].auditParams.length; j++) {
                        hostLength += vm.views.templateSquareList[i].auditParams[j].hosts.length;
                        // rulesLength += vm.views.templateSquareList[i].auditParams[j].ruleExpressions.length;
                        scriptsLength += vm.views.templateSquareList[i].auditParams[j].scripts.length;
                    }
                    vm.views.templateList[i].hostLength = hostLength;
                    vm.views.templateList[i].scriptsLength = scriptsLength;
                    var executedAt = $filter('date')(vm.views.templateList[i].executedAt, 'yyyy-MM-dd HH:mm:ss');
                    vm.views.templateList[i].executedTime = moment(executedAt).fromNow();
                }
            }).catch(function (err) {
                throw err;
            });
        }

        // }

        function deleteTemplate(id) {
            if (id != null) {
                var owner = "";
                vm.views.templateList.forEach(function (template) {
                    if (template.id == id) {
                        owner = template.createdBy;
                    }
                });
                if (currentUser.isSameUser(owner) || currentUser.hasPermission('cac:edit')) {
                    messageService.confirm(
                        $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                        $translate.instant('common.messages.operation.body', {
                            operation: $translate.instant('common.entity.action.delete'),
                            obj: $translate.instant('cac.common.template')
                        }), function () {
                            doDeleteTemplate(id, function () {
                                init();
                            });
                        });

                } else {
                    messageService.alertError($translate.instant('common.uaa.no_permission_title'), $translate.instant('cac.messages.cannot_delete'))
                }
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


        function editTemplate(template) {
            template = angular.fromJson(decodeURI(template));
            $state.go("app.cac.template_edit", {template: template});

        }

        function findTemplate(template) {
            template = angular.fromJson(decodeURI(template));
            $state.go("app.cac.template.findTemplate", {template: template});
        }


        function run(template) {
            template = angular.fromJson(decodeURI(template));
            $state.go("app.cac.job_add", {templateId: template.id});
        }

        init();

    }

})
();
