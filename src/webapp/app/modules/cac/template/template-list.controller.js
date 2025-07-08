/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');


    //模型控制器
    cacModule.controller('CacTemplateListCtrl', CacTemplateListCtrl);
    CacTemplateListCtrl.$inject = ['$scope', '$timeout', '$state', 'cacService', 'cacTemplateService', '$compile', 'messageService', '$filter', '$http', 'dataTable', 'currentUser', '$translate', 'Param'];

    function CacTemplateListCtrl($scope, $timeout, $state, cacService, cacTemplateService, $compile, messageService, $filter, $http, dataTable, currentUser, $translate, Param) {
        var vm = this;
        vm.views = {
            deleteTemplate: deleteTemplate,
            // editTemplate: editTemplate,
            // findTemplate: findTemplate,
            run: run,
            dashboardSwitch: "",
            teamsSwitch: ""
            // tableInstance: null
        };
        vm.reloadTable = function () {
            // console.log('reloadTable');
        }
        var columnDefs = [
            {
                data: 'templateName',
                title: $translate.instant('common.entity.detail.name'),
                render: function (data, type, row, meta) {
                    var content = data;
                    if (row.description) {
                        content += '<p class="help-block">' + row.description + '</p>';
                    }
                    return '<a class="d-block" href="" ui-sref="app.cac.job.list({templateId:\'' + row.id + '\'})">' + content + '</a>';
                }
            },
            {
                data: 'auditParams',
                title: $translate.instant('cac.template.detail.audit_params'),
                render: function (data, type, row, meta) {
                    var auditParams = angular.fromJson(row.auditParams);
                    var html = '';
                    for (var i = 0; i < auditParams.length; i++) {
                        var auditParam = auditParams[i];
                        html += '{{"cac.common.host" | translate}}: <strong>' + auditParam.hosts.length + '</strong>, ' +
                            '{{"cac.common.script" | translate}}: <strong>' + auditParam.scripts.length + '</strong> ' +
                            '<br/>';

                    }
                    return '<span class="cac_table_col_project" style="line-height: 15px!important;">' + html + '</span>';
                }
            },
            // {data: 'scriptType', title: '脚本类型'},
            // /*{data: 'description', title: '描述'},*/
            {
                data: 'createdAt',
                title: $translate.instant('cac.template.detail.last_time'),
                type: 'html',
                render: function (data, type, row, meta) {
                    var actionHtml = "";
                    var executedAt = row.executedAt;
                    if (executedAt != null) {
                        executedAt = $filter('date')(row.executedAt, 'yyyy-MM-dd HH:mm:ss');
                        var jobId = "'" + row.jobId + "'";
                        actionHtml = '<a class="cac-td-hover" title="{{\'cac.index.job\' | translate}}" ui-sref="app.cac.result({jobId:' + jobId + '})">' + executedAt + '</a>';
                    } else {
                        executedAt = $translate.instant('cac.common.not_run');
                        //<span hidden>-1</span>是让未执行的模板排在最后
                        actionHtml = '<a class="cac-td-hover" disabled="disabled" title="{{\'cac.messages.template_not_run\' | translate}}"><span hidden>-1</span>' + executedAt + '</a>';
                    }
                    return actionHtml;
                }
            },
            {
                data: 'executedBy',
                title: $translate.instant('cac.template.detail.executed_by')
            },
            {
                data: 'id',
                title: $translate.instant('common.entity.detail.operation'),
                className: 'text-center',
                searchable: false,
                orderable: false,
                // type: 'num',
                render: function (data, type, row, meta) {
                    var id = "'" + row.id + "'";
                    // var template = encodeURI(angular.toJson(row));
                    return '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac.template.run\' | translate}}" ng-click="cacTemplateListCtrlVm.views.run(' + id + ')">' +
                        '<i class="fa fa-caret-square-right"></i>' +
                        '</a>\n' +
                        '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac.template.edit\' | translate}}"  ui-sref="app.cac.template_edit({templateId:\'' + row.id + '\'})">' +
                        '<i class="fa fa-pencil"></i>' +
                        '</a>\n' +
                        '<a ng-if="\'yes\' === cacTemplateListCtrlVm.views.dashboardSwitch" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="dashboard"  ui-sref="app.cac.template_dashboard({templateId:\'' + row.id + '\',templateName:\'' + row.templateName + '\'})">' +
                        '<i class="fa fa-tachometer-alt"></i>' +
                        '</a>\n' +
                        '<a ng-if="\'yes\' === cacTemplateListCtrlVm.views.teamsSwitch" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="teams"  ui-sref="app.cac.template_teams({templateId:\'' + row.id + '\',templateName:\'' + row.templateName + '\'})" uaa-has-permission="sysadmin:*:*">' +
                        '<i class="fa fa-users-cog"></i>' +
                        '</a>\n' +
                        '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac.template.delete\' | translate}}"  ng-click="cacTemplateListCtrlVm.views.deleteTemplate(' + id + ',' + row.createdBy + ')">' +
                        '<i class="fa fa-trash-alt"></i>' +
                        '</a>';
                }
            }
        ];
        init();

        function init() {
            Param.getByDomain('cac').then(function (result) {
                const elementMap = new Map();
                result.forEach(item => elementMap.set(item.name, item.value));
                vm.views.dashboardSwitch = elementMap.get('dashboard_switch')  || 'no';
                vm.views.teamsSwitch = elementMap.get('teams_switch')  || 'no';
            }).catch(function (err) {
                throw err;
            });

            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v2/templates';
            var dataSrc = "";
            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     url = 'app/modules/cac/api/template.json';
            //     dataSrc = "aaData";
            // }
            vm.tableConfig = {
                columns: columnDefs,
                data: [function () {
                    return $http.get(url);
                }, dataSrc, false],
                order: [[2, 'desc']]
            }

            // dataTable.initTable("#cacTemplateTable", tableOption.aoColumns, undefined, {
            //     scrollX: true,
            //     order: [[2, 'desc']],
            //     ajax: {
            //         url: url,
            //         dataSrc: dataSrc
            //     }
            // }).then(function (apiInstance) {
            //     vm.views.tableInstance = apiInstance;
            // }).catch(function (err) {
            //     throw err;
            // });
        }

        function deleteTemplate(id, owner) {
            if (id != null) {
                if (currentUser.isSameUser(owner) || currentUser.hasPermission('cac:edit')) {
                    messageService.confirm(
                        $translate.instant('common.messages.operation.title', { operation: $translate.instant('common.entity.action.delete') }),
                        $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.delete'), obj: $translate.instant('cac.common.template') }),
                        function () {
                            doDeleteTemplate(id, function () {
                                vm.tableConfig.reloadData();
                                // vm.views.tableInstance.ajax.reload(null, false);
                            });
                    });
                } else {
                    messageService.alertError(
                        $translate.instant('common.uaa.no_permission'),
                        $translate.instant('cac.messages.cannot_delete'))
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


        // function editTemplate(template) {
        //     template = angular.fromJson(decodeURI(template));
        //     $state.go("app.cac.template_edit", {template: template});
        // }

        // function findTemplate(template) {
        //     template = angular.fromJson(decodeURI(template));
        //     $state.go("app.cac.template.findTemplate", {template: template});
        // }

        function run(templateId) {
            // template = angular.fromJson(decodeURI(template));
            if (currentUser.hasPermission("cac:run")) {
                $state.go("app.cac.job_add", {templateId: templateId});
            } else {
                messageService.alertError(
                    $translate.instant('common.uaa.no_permission'),
                    $translate.instant('cac.messages.cannot_run'))
            }
        }
    }
})();
