
(function () {
    angular.module('oplus.cac').controller('CacTemplatesListController', CacTemplatesListController);

    CacTemplatesListController.$inject = ['$scope', 'CacTemplatesService', '$state','$http', 'messageService', 'currentUser', '$translate','$filter','CacCheckLogService'];


    function CacTemplatesListController($scope, CacTemplatesService, $state,$http, messageService, currentUser, $translate,$filter,CacCheckLogService) {
        var vm = this;
        vm.deleteTemplates = deleteTemplates;
        vm.runTemplates = runTemplates;

        function deleteTemplates(id,name,owner){
            if (currentUser.isSameUser(owner) || currentUser.hasPermission('cac:edit')) {
                CacCheckLogService.isItRunning(id).then(function(data){
                    if(data){
                        messageService.toast("warning",  $translate.instant('cac3.information.prompt.theTempleteBeingExecutedAndCannotBeDelete'));
                    }else{
                        messageService.confirm($translate.instant('common.entity.delete.title'),$translate.instant("cac3.information.prompt.deleteCheckTemplete",{name:name}), function () {
                            CacTemplatesService.deleteTemplates(id).then(function () {
                                messageService.toast("success", $translate.instant('common.messages.operation.success'));
                                $state.go('app.cac3.templates.list', null, {reload: true});
                            }).catch(function (err) {
                                messageService.alertError("danger", $translate.instant('common.messages.operation.failed'));
                                throw err;
                            });
                        });
                    }
                }).catch(function (err) {
                    messageService.alertError("danger", $translate.instant('common.messages.operation.failed'));
                    throw err;
                });
            }else {
                messageService.alertError(
                    $translate.instant('common.uaa.no_permission'),
                    $translate.instant('cac.messages.cannot_delete'))
            }
        }

        function runTemplates(id,name){
            if (currentUser.hasPermission("cac:run")) {
                messageService.confirm($translate.instant('cac3.title.confirmExecution'),$translate.instant("cac3.information.prompt.runCheckTemplete",{name:name}), function () {
                    CacCheckLogService.runCheckLogTemplateId(id).then(function () {
                        $state.go("app.cac3.check_log.list",  {templateId:id});
                    }).catch(function (err) {
                        messageService.alertError("danger", $translate.instant('common.messages.operation.failed'));
                        throw err;
                    });
                });
            }else{
                messageService.alertError(
                    $translate.instant('common.uaa.no_permission'),
                    $translate.instant('cac.messages.cannot_run'))
            }
        }

        initData();
        function initData() {
            var tableColumns = [
                {
                    data: 'name',
                    title: $translate.instant('common.entity.detail.name'),
                    render: function (data, type, row, meta) {
                        var content = data;
                        if (row.description) {
                            content += '<p class="help-block">' + row.description + '</p>';
                        }
                        return '<a class="d-block" href="" ui-sref="">' + content + '</a>';
                    }
                },
                {
                    data: 'hosts',
                    title: $translate.instant('cac3.title.hostAndItems'),
                    render: function (data, type, row, meta) {
                        var host = angular.fromJson(row.hostsJson);
                        var item = row.threeCheckItemIds;
                        var html = '{{\'cac3.title.hostItem\' | translate}}: <strong>' + host.length + '</strong>, ' +
                                '{{\'cac3.title.patrolInspectionItems\' | translate}}: <strong>' + item.length + '</strong> ' +
                                '<br/>';
                        return '<span class="cac_table_col_project" style="line-height: 15px!important;">' + html + '</span>';
                    }
                },
                {data: 'createdBy',title: $translate.instant('common.attr.created_by')},
                {
                    data: 'createdAt',
                    title: $translate.instant('common.attr.created_at'),
                    type: 'html',
                    render: function (data, type, row, meta) {
                        return $filter('date')(row.createdAt, 'yyyy-MM-dd HH:mm:ss');
                    }
                },
                {data: 'executedBy',title: $translate.instant('cac3.table_fields.executor')},
                {
                    data: 'executedAt',
                    title: $translate.instant('cac3.table_fields.executorTime'),
                    type: 'html',
                    render: function (data, type, row, meta) {
                        return $filter('date')(row.executedAt, 'yyyy-MM-dd HH:mm:ss');
                    }
                },
                {
                    data: 'key',
                    title: $translate.instant('common.entity.detail.operation'),
                    class: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        return '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac.template.run\' | translate}}" ng-click="vm.runTemplates(\'' + row.id +'\',\'' +row.name +'\')">' +
                            '<i class="fa fa-caret-square-right"></i>' +
                            '</a>\n' +
                            '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac.template.edit\' | translate}}"  ui-sref="app.cac3.templates.edit({id:\'' + row.id + '\'})">' +
                            '<i class="fa fa-pencil"></i>' +
                            '</a>\n' +
                            '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac.template.delete\' | translate}}"  ng-click="vm.deleteTemplates(\'' + row.id +'\',\'' +row.name +'\',\'' +row.createdBy +'\')">' +
                            '<i class="fa fa-trash-alt"></i>' +
                            '</a>';
                    }
                }
            ];

            vm.tableConfig = {
                data: [getPromise],
                columns: tableColumns,
                order: [[0, 'desc']],
                buttons: ['reload'],
            }

            function getPromise() {
                return CacTemplatesService.getAllTemplates();
            }
        }

    }
})
();
