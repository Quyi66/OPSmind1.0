(function () {
    angular.module('oplus.cac').controller('CacInspectionListController', CacInspectionListController);

    CacInspectionListController.$inject = ['$scope', 'CacInspectionService', '$state', '$http', 'messageService', 'currentUser', '$translate', '$filter', '$timeout', '$uibModal', 'modalHelper', 'CacCheckLogService'];


    function CacInspectionListController($scope, CacInspectionService, $state, $http, messageService, currentUser, $translate, $filter, $timeout, $uibModal, modalHelper, CacCheckLogService) {
        var vm = this;

        this.deleteInspection = deleteInspection;
        this.downloadTemplate = downloadTemplate;
        this.exportInspectionItems = exportInspectionItems;
        vm.selectedInstpections = [];

        function deleteInspection(id, name, owner) {
            if (currentUser.isSameUser(owner) || currentUser.hasPermission('cac:edit')) {
                CacCheckLogService.isItRunning(id).then(function (data) {
                    if (data) {
                        messageService.toast("warning", $translate.instant('cac3.information.prompt.thePatrolItemIsBeingExecutedAndCannotBeDelete'));
                    } else {
                        messageService.confirm($translate.instant('common.entity.delete.title'), $translate.instant("cac3.information.prompt.deletePatrolitem", {name: name}), function () {
                            CacInspectionService.deleteInspection(id).then(function () {
                                messageService.toast("success", $translate.instant('common.messages.operation.success'));
                                $state.go('app.cac3.inspection.list', null, {reload: true});
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
            } else {
                messageService.alertError(
                    $translate.instant('common.uaa.no_permission'),
                    $translate.instant('cac.messages.cannot_delete'))
            }
        };

        var tableColumns = [
            {
                data: 'name', title: $translate.instant('cac3.table_fields.patrol_item_name'),
                render: function (data, type, row, meta) {
                    return '<span' +
                        ' style=" display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;  width: 200px;"' +
                        ' title=' + row.name + '>' + row.name + '</span>';
                }
            },
            {data: 'description', title: $translate.instant('cac3.table_fields.patrol_item_description')},
            /* {data: 'checkScriptType',title: "检查脚本类型"},
             {data: 'fixScriptType',title: "修复脚本类型"},*/
            {
                data: 'checkScriptPath', title: $translate.instant('cac3.table_fields.check_script_name'),
                render: function (data, type, row, meta) {
                    return row.checkScriptPath.split('/').pop().toLowerCase();
                }

            },
            {
                data: 'fixScriptPath', title: $translate.instant('cac3.table_fields.fix_script_name'),
                render: function (data, type, row, meta) {
                    if (null === row.fixScriptPath || "" === row.fixScriptPath) {
                        return;
                    }
                    return row.fixScriptPath.split('/').pop().toLowerCase();
                }
            },
            {
                data: 'needCheck', title: $translate.instant('cac3.table_fields.whetherToCheckManually'),
                render: function (data, type, row, meta) {
                    var needCheck = row.needCheck;
                    return needCheck == 0 ? '<span class="badge badge-secondary">{{\'cac3.title.no\' | translate}}</span>' : '<span class="badge badge-primary">{{\'cac3.title.yes\' | translate}}</span>';
                }
            },
            {data: 'createdBy', title: $translate.instant('common.attr.created_by')},
            {
                data: 'createdAt',
                title: $translate.instant('common.attr.created_at'),
                type: 'html',
                render: function (data, type, row, meta) {
                    return $filter('date')(row.createdAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {data: 'updatedBy', title: $translate.instant('common.attr.updated_by')},
            {
                data: 'updatedAt',
                title: $translate.instant('common.attr.updated_at'),
                type: 'html',
                render: function (data, type, row, meta) {
                    return $filter('date')(row.updatedAt, 'yyyy-MM-dd HH:mm:ss');
                }
            },
            {
                data: 'key',
                title: $translate.instant('common.entity.detail.operation'),
                class: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, row, meta) {
                    return '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac3.table_fields.performSinglePatrolInspection\' | translate}}" ng-click="vm.runInspection({id:\'' + row.id + '\'},{templateName:\'' + row.name + '\'})">' +
                        '<i class="fa fa-caret-square-right"></i>' +
                        '</a>\n' +
                        '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac3.button.edit_inspection_items\' | translate}}"  ui-sref="app.cac3.inspection.edit({id:\'' + row.id + '\'})">' +
                        '<i class="fa fa-pencil"></i>' +
                        '</a>\n' +
                        '<a class="btn btn-default btn-sm opx-btn-icon opx-btn-flat" title="{{\'cac3.table_fields.deleteInspectionItems\' | translate}}"  ng-click="vm.deleteInspection(\'' + row.id + '\',\'' + row.name + '\',\'' + row.createdBy + '\')">' +
                        '<i class="fa fa-trash-alt"></i>' +
                        '</a>';
                }
            }
        ];

        vm.tableConfig = {
            data: [getPromise],
            columns: tableColumns,
            order: [[7, 'desc']],
            buttons: ['reload'],
            selection: {
                valueData: 'id', labelData: 'name', preselected: this.selectedInstpections, stateFn: function (row) {
                    //row表示查询出来的值进行处理。
                    //return row.status !== 0 ? 'disabled' : '';
                    return '';
                }
            },
        }

        function getPromise() {
            return CacInspectionService.getAllInspection();
        }

        function exportInspectionItems(event) {
            messageService.confirm($translate.instant('cac3.button.export_inspection_items'), vm.selectedInstpections.length > 0 ? $translate.instant('cac3.information.prompt.export_selected_inspection_items') : $translate.instant('cac3.information.prompt.export_all_inspection_items'), function () {
                event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL
                var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v3/get-inspection/export-inspection-items';//请求的URl
                var xhr = new XMLHttpRequest()
                xhr.open('POST', url)
                var token = currentUser.authToken;
                xhr.setRequestHeader("Authorization", "Bearer " + token);
                xhr.setRequestHeader('Content-type', 'application/json')
                xhr.send(JSON.stringify(vm.selectedInstpections))
                xhr.responseType = "blob";  // 返回类型blob
                xhr.onload = function () {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                    if (this.status === 200) {
                        var blob = this.response;
                        var reader = new FileReader();
                        reader.readAsDataURL(blob);
                        $timeout(function () {
                            var a = document.createElement('a');
                            a.download = "patrol_item_template.xlsx";
                            a.href = reader.result;
                            $("body").append(a);
                            a.click();
                        }, 100);
                    } else {
                        messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                    }
                }
                $state.go('app.cac3.inspection.list', null, {reload: true});
            });
        }

        function downloadTemplate(event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL
            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v3/get-inspection/download-template';//请求的URl
            var xhr = new XMLHttpRequest();//定义http请求对象
            xhr.open("GET", url, true);
            var token = currentUser.authToken;
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send();
            xhr.responseType = "blob";  // 返回类型blob
            xhr.onload = function () {   // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
                if (this.status === 200) {
                    var blob = this.response;
                    var reader = new FileReader();
                    reader.readAsDataURL(blob);
                    $timeout(function () {
                        var a = document.createElement('a');
                        a.download = "patrol_item_template.xlsx";
                        a.href = reader.result;
                        $("body").append(a);
                        a.click();
                    }, 100);
                } else {
                    messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                }
            }
        }

        vm.importInspection = function () {
            var instance = $uibModal.open({
                templateUrl: 'app/modules/cac/inspection/inspection-upload.html',
                controller: ['$http', '$scope', '$uibModalInstance', function ($http, $scope, $uibModalInstance) {
                    var that = this;
                    that.cancel = cancel;

                    function cancel() {
                        $uibModalInstance.close({action: "cancel"});
                    }

                    $scope.$watch('file', function (newVal, oldVal) {
                        that.fileName = newVal;
                    });


                    $scope.submit = function () {
                        var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/v3/get-inspection/bulk-import';//请求的URl
                        var fd = new FormData();
                        fd.append("excelFile", $scope.file);
                        $http({
                            method: 'POST',
                            url: url,
                            data: fd,
                            headers: {'Content-Type': undefined},
                            transformRequest: angular.identity
                        }).success(function (response) {
                            onSuccess(response);
                        }).error(function (response) {
                            onError(response);
                        })
                    };

                    function onSuccess(result) {
                        $state.go('app.cac3.inspection.list', null, {reload: true});
                        var contents = result.success.statistics + "</br></br>Failed column information:</br>" + "<div class=''>" + result.success.message + "</div>";
                        messageService.alertSuccess(result.success.code, contents);
                        $uibModalInstance.close(result);
                    }

                    function onError(result) {
                        $state.go('app.cac3.inspection.list', null, {reload: true});
                        messageService.alertError(result.error.code, result.error.message);
                        $uibModalInstance.close(result);

                    }

                }],
                controllerAs: '$ctrl',
                size: 'md',
                backdrop: true
            });

        }


        vm.runInspection = function (id, name) {
            if (currentUser.hasPermission("cac:run")) {
                var modal = modalHelper.openModal({
                    templateUrl: 'app/modules/cac/inspection/inspection-run.html',
                    controller: ['$scope', '$uibModalInstance', 'selected', 'templateName', '$compile', '$timeout', 'CacInspectionService', 'messageService', DynamicInspectionSelectorCtrl],
                    controllerAs: '$ctrl',
                    size: 'md',
                    resolve: {
                        selected: function () {
                            return id;
                        },
                        templateName: function () {
                            return name;
                        }
                    }
                });
                modal.result.then(function close(result) {
                }, function dismiss() {
                });
            } else {
                messageService.alertError(
                    $translate.instant('common.uaa.no_permission'),
                    $translate.instant('cac.messages.cannot_run'))
            }
        }

        function DynamicInspectionSelectorCtrl($scope, $uibModalInstance, selected, templateName, $compile, $timeout, CacInspectionService, messageService) {

            var _ctrl = this;
            _ctrl.clear = clear;
            _ctrl.runJob = runJob;
            _ctrl.hostList = [];
            _ctrl.itemList = [];

            function clear() {
                $uibModalInstance.close({action: "cancel"});
                $uibModalInstance.dismiss({action: "cancel"});
            }

            function runJob() {
                if (isEmpty()) {
                    return;
                }

                clear();

                _ctrl.itemList.push(selected.id)
                var threeCheckLog = {
                    hostJson: angular.toJson(_ctrl.hostList),
                    itemJson: angular.toJson(_ctrl.itemList),
                    name: templateName.templateName
                };
                CacCheckLogService.runCheckLog(threeCheckLog).then(function (data) {
                    $state.go("app.cac3.check_log.list", {templateId: 'inspection_all'});
                }).catch(function (err) {
                    messageService.toast('error', 'Error', err.message);
                });
            }

            function isEmpty() {
                if (_ctrl.hostList.length === 0) {
                    messageService.toast('warning', $translate.instant("cmd.messages.select_host"));
                    return true;
                }
                return false;
            }

        }
    }
})
();
