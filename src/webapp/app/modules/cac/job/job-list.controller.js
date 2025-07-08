/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacJobCtrl', CacJobCtrl);
    CacJobCtrl.$inject = ['$state', '$stateParams', 'cacTemplateService', '$timeout', '$uibModal', 'userPref', 'Param'];

    function CacJobCtrl($state, $stateParams, cacTemplateService, $timeout, $uibModal, userPref, Param) {
        var vm = this;

        vm.views = {
            clearFilter: clearFilter,
            templateOrder: userPref.readItem('templateOrder', '-templateName'),
            changeTemplateOrder: changeTemplateOrder,
            templateList: [],
            structuralSwitch: ""
        };

        function clearFilter() {
            vm.views.templateName = '';
        }

        function getAllTemplate() {
            cacTemplateService.getTemplates().then(function (data) {
                vm.views.templateList = data;
            }).catch(function (err) {
                throw err;
            });
        }

        function init() {
            Param.getByDomainAndName('cac', 'structural_switch').then(function (result) {
                vm.views.structuralSwitch = result.value;
            }).catch(function (err) {
                throw err;
            });

            getAllTemplate();
            var urlParam = $stateParams.template;
            if (urlParam == null) {
                //$state.go("app.cac.job.jobList", {});
            } else {
                $state.go("app.cac.job.addJob", {template: urlParam});
            }
        }

        function changeTemplateOrder(templateOrder) {
            userPref.saveItem('templateOrder', templateOrder);
            vm.views.templateOrder = userPref.readItem('templateOrder', '-templateName');
        }

        init();

    }

    //模型控制器
    cacModule.controller('CacJobListCtrl', CacJobListCtrl);
    CacJobListCtrl.$inject = ['$q', '$scope', '$http', '$timeout', '$state', 'cacService', 'cacTemplateService', '$compile', '$uibModal', '$stateParams', '$filter', 'currentUser', 'dataTable', '$httpParamSerializerJQLike', '$translate'];

    function CacJobListCtrl($q, $scope, $http, $timeout, $state, cacService, cacTemplateService, $compile, $uibModal, $stateParams, $filter, currentUser, dataTable, $httpParamSerializerJQLike, $translate) {
        var vm = this;

        vm.views = {
            template: {},
            tableInstance: null,
            findJobStatus: findJobStatus,
            templateId: $stateParams.templateId,
            // refreshTable: refreshTable
            // refresh: "刷新列表"
        };


        var columnDefs = [
            {
                data: 'templateName',
                title: $translate.instant('cac.common.template')
            },
            {
                data: 'auditParams',
                title: $translate.instant('cac.template.detail.audit_params'),
                render: function (data, type, row, meta) {
                    var auditParams = angular.fromJson(row.auditParams);
                    var html = '';
                    for (var i = 0; i < auditParams.length; i++) {
                        var auditParam = auditParams[i];
                        html += '{{\'cac.common.script\' | translate}}：<strong>' + auditParam.scripts.length + '</strong>，' +
                            '{{\'cac.common.host\' | translate}}：<strong>' + auditParam.hosts.length + '</strong>' +
                            '<br>';
                    }
                    return '<div>' + html + '</div>';
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
                data: 'endedAt',
                title: $translate.instant('common.entity.detail.end_at'),
                render: function (data, type, row, meta) {
                    return $filter('date')(row.endedAt, 'yyyy-MM-dd HH:mm:ss');
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
                    var id = "'" + row.id + "'";
                    var jobStatus = row.jobStatus;
                    var actionHtml = "";
                    if (jobStatus === "ERROR") {
                        actionHtml = '<button type="button" class="btn btn-danger rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacJobListCtrlVm.views.findJobStatus(' + id + ')">' +
                            '{{\'cac.result.status.error\' | translate}}</button>';
                    } else if (jobStatus === "OK") {
                        actionHtml = '<button type="button" class="btn btn-success rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacJobListCtrlVm.views.findJobStatus(' + id + ')">' +
                            '{{\'cac.result.status.ok\' | translate}}</button>';
                    } else {
                        actionHtml = '<button type="button" class="btn btn-primary rounded-pill btn-sm" title="{{\'common.entity.action.view\' | translate}}" ng-click="cacJobListCtrlVm.views.findJobStatus(' + id + ')">' +
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
                    if ("WAITING" === row.jobStatus) {
                        isEnbled = 'disabled';
                    }
                    return '<a type="button"  ng-if="\'yes\' === cacJobCtrlVm.views.structuralSwitch" uaa-has-permission="cac:edit:*" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat"  ' + isEnbled + ' title="{{\'cac.index.job\' | translate}}" ui-sref="app.cac.structural_diagram({jobId:\'' + row.id + '\'})"><i class="fa fa-sitemap"></i></a>' +
                        // '<a type="button" uaa-has-permission="cac:edit:*" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat"  ' + isEnbled + ' title="{{\'cac.index.job\' | translate}}" ui-sref="app.cac.data_driven({jobId:\'' + row.id + '\'})"><i class="fa fa-sitemap"></i></a>'+
                        '<a type="button" uaa-has-permission="cac:edit:*" class="btn btn-default btn-sm opx-btn-icon opx-btn-flat"  ' + isEnbled + ' title="{{\'cac.index.job\' | translate}}" ui-sref="app.cac.result({jobId:\'' + row.id + '\'})"><i class="fa fa-grip-horizontal"></i></a>';
                }
            }
        ];
        var tableOption = {
            // id: 'cacJobTable',
            // order: [[2, 'desc']],
            // serverSide: true,
            // stateSave: false,
            aoColumns: columnDefs
            // fnPreDrawCallback: function (oSettings) {
            //     // debugger
            // }//,
        };
        this.tableConfig = {
            columns: columnDefs,
            data: [function (dtDataToServer) {
                var d = $q.defer();
                var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v2/jobs/page/' + vm.views.templateId;
                //https://stackoverflow.com/questions/24710503/how-do-i-post-urlencoded-form-data-with-http-without-jquery/30970229#30970229
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

        // function refreshTable() {
        //     if (vm.views.isRefreshing) {
        //         return;
        //     }
        //     // console.log(angular.element("#cacJobTable").DataTable().clear());
        //     // console.log(angular.element("#cacJobTable").dataTable().fnDestroy());
        //     vm.views.isRefreshing = true;
        //     vm.views.refreshClass = "icon-spining";
        //     init();
        // }

        function init() {
            if (vm.views.templateId == null || vm.views.templateId == '' || vm.views.templateId == undefined) {
                vm.views.templateId = 'all';
            }

            // dataTable.initTable("#cacJobTable", tableOption.aoColumns, undefined, {
            //     scrollX: true,
            //     order: [[2, 'desc']],
            //     serverSide: true,
            //     stateSave: false,
            //     initComplete: function () {
            //         var groupSelecthtml = '<div class="text-left" style="margin-top: -26px">' +
            //             '<button  ng-click="cacJobListCtrlVm.views.refreshTable()" class="btn btn-default btn-sm" style="width: auto">' +
            //             '刷新列表 <i ng-if="cacJobListCtrlVm.views.isRefreshing" ' +
            //             'class="fa fa-sync {{cacJobListCtrlVm.views.refreshClass}}"></i></button>' +
            //             '</div>';
            //         $compile(groupSelecthtml)($scope).appendTo("#cacJobTable_filter");
            //     },
            //     ajax: {
            //         url: window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v2/jobs/page/' + vm.views.templateId,
            //         dataSrc: "data",
            //         type: "POST",
            //         dataType: "json",
            //         async: false
            //     }
            // }).then(function (apiInstance) {
            //     vm.views.tableInstance = apiInstance;
            //     vm.views.isRefreshing = false;
            //     vm.views.refreshClass = "";
            // }).catch(function (err) {
            //     throw err;
            // });

            var template = $stateParams.template;
            if (template != null) {
                $state.go("app.cac.job.addJob", {template: template});
            }
        }

        function findJobStatus(id) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/job/job-run-log.html',
                controller: 'CacJobRunLogCtrl',
                controllerAs: 'cacJobRunLogVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    params: function () {
                        return {
                            jobId: id
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
