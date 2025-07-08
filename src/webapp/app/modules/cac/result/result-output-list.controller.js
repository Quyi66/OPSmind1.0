/**
 * @Auther: zml
 * @Date: 2018/7/19
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacResultOutputListCtrl', CacResultOutputListCtrl);
    CacResultOutputListCtrl.$inject = ['$scope', '$timeout', 'cacService', '$compile', '$uibModal', '$stateParams', 'cacResultService', '$translate', 'cacTemplateService', '$state'];

    function CacResultOutputListCtrl($scope, $timeout, cacService, $compile, $uibModal, $stateParams, cacResultService, $translate, cacTemplateService, $state) {
        var vm = this;
        var taskId = $stateParams.taskId;
        var jobId = $stateParams.jobId;
        var templateId = $stateParams.templateId;
        vm.saveAndDelCheckWhiteList = saveAndDelCheckWhiteList;

        vm.views = {
            tableInstance: null,
            jobId: $stateParams.jobId,
            getCheckItemById: getCheckItemById
        };


        function saveAndDelCheckWhiteList(data) {
            if ("n" == data.type) {
                var scriptPath = "";
                cacTemplateService.getTemplateById(templateId).then(function (data) {
                    vm.templateData = data;
                    var auditParams = angular.fromJson(data.auditParams);
                    if (auditParams.length > 0) {
                        auditParams.forEach(function (mode, index) {
                            mode.scripts.forEach(function (mode2, index2) {
                                scriptPath = mode2.scriptPath;
                                return;
                            })
                        });
                    }
                }).catch(function (err) {
                    throw err;
                });

                $timeout(function () {
                    if ("" != scriptPath) {
                        var param = {
                            templateId: templateId,
                            templateName: vm.templateData.templateName,
                            scriptPath: scriptPath,
                            hostId: data.hostId,
                            hostKey: data.hostKey,
                            checkName: data.checkName,
                        }
                        cacService.saveCheckWhiteList(param).then(function (whiteList) {
                            console.log("add success ", whiteList)
                        }).catch(function (err) {
                            throw err;
                        });
                    }
                }, 200);


            }/*else{
                cacService.deleteCheckWhiteList({id:vm.checkWhiteListID}).then(function (data) {
                    console.log("delete success ",data)
                }).catch(function (err) {
                    console.log("err=== {}",err);
                });
            }*/

        }

        function getCheckItemById(id) {
            if (templateId != null) {
                var scriptPath = "";
                cacTemplateService.getTemplateById(templateId).then(function (data) {
                    vm.templateData = data;
                    var auditParams = angular.fromJson(data.auditParams);
                    if (auditParams.length > 0) {
                        auditParams.forEach(function (mode, index) {
                            mode.scripts.forEach(function (mode2, index2) {
                                scriptPath = mode2.scriptPath;
                                var param = {
                                    id: id,
                                    scriptPath: scriptPath,
                                    templateName: vm.templateData.templateName,
                                    templateId: vm.templateData.id
                                }
                                cacResultService.getCheckItemById(param);
                                return;
                            })
                        });
                    }
                }).catch(function (err) {
                    throw err;
                });
            }
        }

        function init() {
            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     tableOption.ajax = {
            //         url: 'app/modules/cac/api/result-output.json',
            //         dataSrc: "aaData"
            //     };
            // } else {
            /*tableOption.ajax = cacService.assembleDataTableUrl('/api/cac/v2/jobs/result/' + jobId);*/
            /* tableOption.ajax = cacService.assembleDataTableUrl('/api/cac/v2/jobs/result-v2/' + jobId+","+templateId);
             $timeout(function () {
                 vm.views.tableInstance = cacService.prepareDatatable(".cac-output-table-list", tableOption);
             }, 10);*/

            var tableColumns = [
                {mData: 'hostKey', title: $translate.instant('cac.common.host')},
                {
                    mData: 'name',
                    title: $translate.instant('cac.template.detail.audit_params'),
                    render: function (data, type, row, meta) {
                        var checkItem = '';
                        if (row.name != null) {
                            checkItem = row.name;
                        }
                        var actionHtml = '<span title = "' + checkItem + '">' + checkItem + '</span>';
                        return actionHtml;
                    }

                },
                {
                    mData: 'status', title: $translate.instant('cac.common.result'),
                    render: function (data, type, row, meta) {
                        if (row.status == 'OK') {
                            var actionHtml = '<span class="badge bg-success">{{\'cac.result.audit_result.pass\' | translate}}</span>';
                        } else if (row.status == 'FAILED') {
                            var actionHtml = '<span class="badge bg-danger">{{\'cac.result.audit_result.failed\' | translate}}</span>';
                        } else if (row.status == 'CHECK') {
                            var actionHtml = '<span class="badge bg-warning">{{\'cac.result.audit_result.check\' | translate}}</span>';
                        } else if (row.status == 'SKIPPING') {
                            var actionHtml = '<span class="badge bg-info">{{\'cac.result.audit_result.skipping\' | translate}}</span>';
                        } else {
                            var actionHtml = '<span class="label cac-bg-light-grey">{{\'common.messages.no_data\' | translate}}</span>';
                        }
                        return actionHtml;
                    }
                },
                /*{
                    mData: 'whetherWhiteList',
                    title: $translate.instant('cac.profile.white_list'),
                    render: function (data, type, row, meta) {
                        var arr =row.whetherWhiteList.split(",");
                        var white_list_html;
                        if (arr[0] == 'y') {
                            white_list_html = '<span class="badge bg-info">{{\'task_scheduling.yes\' | translate}}</span>';
                        } else {
                            white_list_html = '<span class="badge bg-light">{{\'task_scheduling.no\' | translate}}</span>';
                        }
                        return white_list_html;
                    }
                },*/
                /*{
                    mData: 'whetherWhiteList',
                    title: $translate.instant('cac.profile.white_list'),
                    render: function (data, type, row, meta) {
                        /!*var arr =row.whetherWhiteList.split(",");*!/
                        var add = angular.toJson({type: 'n',hostId : row.hostId,hostKey : row.hostKey,checkName: row.name});
                        var del = angular.toJson({type: 'y',id : arr[1]});
                        var id = "'" + row.id + "'";
                        var white_list_html;
                        if (arr[0] == 'y') {
                            white_list_html = '<span ng-click=\'cacResultOutputListCtrlVm.saveAndDelCheckWhiteList(' + del + ')\' class="badge bg-info">{{\'task_scheduling.yes\' | translate}}</span>';
                        } else {
                            white_list_html = '<span ng-click=\'cacResultOutputListCtrlVm.saveAndDelCheckWhiteList(' + add + ')\' class="badge bg-light">{{\'task_scheduling.no\' | translate}}</span>';
                        }
                        return white_list_html;
                    }
                },*/
                {
                    mData: 'output',
                    title: $translate.instant('cac.result.output'),
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        var actionHtml = "";
                        if (row.output == null || row.output == "") {
                            actionHtml = '<span ng-click="cacResultOutputListCtrlVm.views.getCheckItemById(' + id + ')">{{\'common.term.none\' | translate}}</span>';
                        } else {
                            actionHtml = '<span ng-click="cacResultOutputListCtrlVm.views.getCheckItemById(' + id + ')">' +
                                (row.output || '').substr(0, 100) +
                                '</span>';
                        }

                        return actionHtml;
                    }
                }

            ];


            vm.tableConfig = {
                data: [getPromise],
                columns: tableColumns,
                order: [[1, 'desc']],
                buttons: ['reload']
            }

            function getPromise() {
                return cacResultService.prepareDatatableOutPut(jobId + "," + templateId);
            }

        }

        // }

        init();

    }

})
();
