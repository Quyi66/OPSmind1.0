(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacCheckLogController', CacCheckLogController);
    CacCheckLogController.$inject = ['$state', '$stateParams', 'CacTemplatesService', '$timeout', '$uibModal', 'userPref'];

    function CacCheckLogController($state, $stateParams, CacTemplatesService, $timeout, $uibModal, userPref) {
        var vm = this;

        vm.views = {
            clearFilter: clearFilter,
            templateOrder: userPref.readItem('templateOrder', '-name'),
            changeTemplateOrder: changeTemplateOrder,
            templateList: []
        };

        function clearFilter() {
            vm.views.name = '';
        }

        function getAllTemplate() {
            CacTemplatesService.getAllTemplates().then(function (data) {
                vm.views.templateList = data;
            }).catch(function (err) {
                throw err;
            });
        }


        function changeTemplateOrder(templateOrder) {
            userPref.saveItem('templateOrder', templateOrder);
            vm.views.templateOrder = userPref.readItem('templateOrder', '-name');
        }
        getAllTemplate();

    }

    //模型控制器
    cacModule.controller('CacCheckLogListController', CacCheckLogListController);
    CacCheckLogListController.$inject = ['$q', '$scope', '$http', '$timeout', '$state', 'CacTemplatesService', '$compile', '$uibModal', '$stateParams', '$filter', 'currentUser', 'dataTable', '$httpParamSerializerJQLike', '$translate'];

    function CacCheckLogListController($q, $scope, $http, $timeout, $state, CacTemplatesService, $compile, $uibModal, $stateParams, $filter, currentUser, dataTable, $httpParamSerializerJQLike, $translate) {
        var vm = this;
        vm.scope = $scope;
        vm.views = {
            template: {},
            tableInstance: null,
            findCheckLogStatus: findCheckLogStatus,
            templateId: $stateParams.templateId,
            // refreshTable: refreshTable
            // refresh: "刷新列表"
        };


        var columnDefs = [
            {
                data: 'name',
                title: $translate.instant('common.entity.detail.name')
            },
            {
                data: 'hostJson',
                title: $translate.instant('cac3.title.hostAndItems'),
                render: function (data, type, row, meta) {
                    var host = angular.fromJson(row.hostJson);
                    var item = angular.fromJson(row.itemJson);
                    var html = '{{\'cac3.title.hostItem\' | translate}}: <strong>' + host.length + '</strong>, ' +
                        '{{\'cac3.title.patrolInspectionItems\' | translate}}: <strong>' + item.length + '</strong> ' +
                        '<br/>';
                    return '<span class="cac_table_col_project" style="line-height: 15px!important;">' + html + '</span>';
                }
            },
            {
                data: 'createdAt',
                title: $translate.instant('common.entity.detail.start_at'),
                render: function (data, type, row, meta) {
                    return $filter('date')(row.createdAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {
                data: 'endAt',
                title: $translate.instant('common.entity.detail.end_at'),
                render: function (data, type, row, meta) {
                    return $filter('date')(row.endAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {
                data: 'createdBy',
                title: $translate.instant('cac.job.detail.create_at'),
            },
            {
                data: 'id',
                title: $translate.instant('cac.job.detail.status'),
                render: function (data, type, row, meta) {
                    var taskId = "'" + row.taskId + "'";
                    var status = row.status;
                    var actionHtml = "";
                    if (status === "ERROR") {
                        actionHtml = '<button type="button" class="btn btn-danger rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacCheckLogListCtrlVm.views.findCheckLogStatus(' + taskId + ')">' +
                            '{{\'cac.result.status.error\' | translate}}</button>';
                    } else if (status === "SUCCESS") {
                        actionHtml = '<button type="button" class="btn btn-success rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacCheckLogListCtrlVm.views.findCheckLogStatus(' + taskId + ')">' +
                            '{{\'cac.result.status.ok\' | translate}}</button>';
                    } else {
                        actionHtml = '<button type="button" class="btn btn-primary rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacCheckLogListCtrlVm.views.findCheckLogStatus(' + taskId + ')">' +
                            '{{\'cac.result.status.running\' | translate}}</button>';
                    }
                    return actionHtml;
                }
            },
            {
                data: 'id',
                title: $translate.instant('common.entity.detail.operation'),
                className: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    var isEnbled = '';
                    if (row.status !== "SUCCESS") {
                        isEnbled = 'disabled';
                    }
                    return '<button type="button" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat"  ' + isEnbled + ' title="{{\'cac.index.job\' | translate}}" ui-sref="app.cac3.check_result({logId:\'' + row.id + '\'})"><i class="fa fa-grip-horizontal"></i></button>';
                }
            }
        ];
        this.tableConfig = {
            columns: columnDefs,
            data: [function (dtDataToServer) {
                var d = $q.defer();
                var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v3/check-log/page/' + vm.views.templateId;
                $http({
                    url: url,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
                    },
                    data: $httpParamSerializerJQLike(dtDataToServer)
                }).then(function (res) {
                    var result = res.data;
                    result.draw = dtDataToServer.draw;
                    d.resolve(result);
                    //console.log(result);
                }, function (err) {
                    d.reject(err);
                    throw err;
                });
                return d.promise;
            }, '', true],
            order: [[2, 'desc']],
            buttons: ['reload']
        };

        function init() {
            if (vm.views.templateId == null || vm.views.templateId == '' || vm.views.templateId == undefined) {
                vm.views.templateId = 'all';
            }
        }

        function findCheckLogStatus(taskId) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/log/check-log-result.html',
                controller: 'CacCheckLogResultCtrl',
                controllerAs: 'cacCheckLogResultVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    params: function () {
                        return {
                            jobId: taskId
                        }
                    }
                }
            }).result.then(function (result) {
            }).catch(function (err) {
                throw err;
            });
        }

        init();
    }
})
();
