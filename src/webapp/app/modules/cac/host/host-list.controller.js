/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacHostListCtrl', CacHostListCtrl);
    CacHostListCtrl.$inject = ['$scope', '$timeout', 'cacService', '$filter', 'cacHostService', '$compile', '$uibModal', 'messageService', '$state', 'currentUser', 'dataTable', '$translate'];

    function CacHostListCtrl($scope, $timeout, cacService, $filter, cacHostService, $compile, $uibModal, messageService, $state, currentUser, dataTable, $translate) {
        var vm = this;
        vm.views = {
            tableInstance: null,
            addHost: addHost,
            editHost: editHost,
            deleteHost: deleteHost,
            uploadHostExcel: uploadHostExcel,
            exportHosts: exportHosts
        };

        var tableOption = {
            id: 'cacHostTable',
            aoColumns: [
                {mData: 'hostName', title: $translate.instant('cac.host.name')},
                {mData: 'hostKey', title: 'IP'},
                // {mData: 'hostUser', title: '主机用户名'},
                {mData: 'category', title: $translate.instant('common.term.category')},
                {mData: 'description', title: $translate.instant('common.entity.detail.description')},
                {
                    mData: 'id',
                    title: $translate.instant('common.entity.detail.operation'),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        var host = encodeURI(angular.toJson(row));
                        var actionHtml =
                            '<div class="btn-group">' +
                            '<button type="button" class="btn btn-default btn-sm"  title="{{\'common.entity.action.edit\' | translate}}" uaa-has-permission="cac:*:*" ng-click="cacHostListCtrlVm.views.editHost(\'' + host + '\')">' +
                            '<span class="fa fa-pencil"></span>' +
                            '</button>' +
                            '<button type="button" class="btn btn-default btn-sm" title="{{\'common.entity.action.delete\' | translate}}" uaa-has-permission="cac:*:*" ng-click="cacHostListCtrlVm.views.deleteHost(' + id + ')">' +
                            '<span class="fa fa-times"></span>' +
                            '</button>' +
                            '</div>';
                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }
            ]
        };

        //根据id,删除主机信息
        function deleteHost(id) {
            if (id != null) {
                messageService.confirm(
                    $translate.instant('common.messages.operation.title', { operation: $translate.instant('common.entity.action.delete') }),
                    $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.delete'), obj: $translate.instant('cac.common.host') }),
                    function () {
                        doDeleteHost(id, function () {
                            vm.views.tableInstance.ajax.reload(null, false);
                            messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.delete') }));
                        });
                });
            }
        }

        //回调函数，删除成功后，刷新表格并提示删除成功！
        function doDeleteHost(id, callBack) {
            cacHostService.deleteHost(id).then(function () {
                if (callBack != null) {
                    callBack();
                }
            }).catch(function (err) {
                throw err;
            });
        }

        function addHost() {
            saveHost(null);
        }

        function editHost(host) {
            saveHost(host);
        }


        function saveHost(host) {
            var host = decodeURI(host);//url解码
            $uibModal.open({
                templateUrl: 'app/modules/cac/host/host-edit.html',
                controller: 'CacHostEditCtrl',
                controllerAs: 'cacHostEditVm',
                backdrop: 'static',
                size: 'md',//设置模态框大小
                resolve: {
                    entity: function () {
                        return {
                            host: host == "undefined" ? null : angular.fromJson(host)//路由传参到模态框,将字符串转为json
                        }
                    }
                }
            }).result.then(function (result) {
                //关闭模态框时执行，result是关闭时传递过来的参数
                var action = result.action;
                if (action != "cancel") {
                    //重置（默认或者设置为true）或者保持分页信息（设置为false）
                    vm.views.tableInstance.ajax.reload(null, false);
                }
            }, function () {

            }).catch(function (err) {
                throw err;
            });
        }

        //上传主机Excel表格，对应数据
        function uploadHostExcel($file) {
            if ($file != null) {
                //console.log($file.name);
                var form = new FormData();
                form.append("files", $file);//files表示后台对应接收参数
                messageService.confirm(
                    $translate.instant('common.messages.operation.title', { operation: $translate.instant('common.entity.action.import') }),
                    $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.import'), obj: $translate.instant('cac.common.host') }),
                    function () {
                        cacHostService.uploadHostExcel(form).then(function (data) {
                            if (data == 'success') {
                                vm.views.tableInstance.ajax.reload(null, false);
                                messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.import') }));
                            } else {
                                messageService.toast("error", data);
                            }
                        }).catch(function (err) {
                            throw err;
                        });
                });
            }
        }

        function exportHosts(event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL
            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/hosts/exportHosts';   //请求的URl
            var xhr = new XMLHttpRequest();		//定义http请求对象
            xhr.open("GET", url, true);
            var token = currentUser.authToken;
            xhr.setRequestHeader("Authorization", "Bearer " + token);
            // xhr.setRequestHeader("X-JWT-Authorization", "Bearer " + token);
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
                        a.download = "Hosts.xlsx";			//自定义下载文件名称
                        a.href = reader.result;
                        $("body").append(a);
                        a.click();
                    }, 100);
                } else {
                    messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                }
            }
        }

        function init() {
            dataTable.initTable(".host-table", tableOption.aoColumns, undefined, {
                scrollX: true,
                ajax: {
                    url: window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/hosts',
                    dataSrc: ""
                }
            }).then(function (apiInstance) {
                vm.views.tableInstance = apiInstance;
            }).catch(function (err) {
                throw err;
            });
        }

        init();


    }

    //新建、编辑主机Controller
    cacModule.controller('CacHostEditCtrl', CacHostEditCtrl);
    CacHostEditCtrl.$inject = ['$uibModalInstance', '$timeout', '$compile', '$scope', 'cacHostService', 'messageService', 'entity', '$translate'];

    function CacHostEditCtrl($uibModalInstance, $timeout, $compile, $scope, cacHostService, messageService, entity, $translate) {

        var vm = this;
        vm.views = {
            host: entity.host,
            cancel: cancel,
            save: save
        };


        function save() {
            //console.log(vm.views.host);
            cacHostService.addHost(vm.views.host).then(function () {
                messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.save') }));
                $uibModalInstance.close({action: "edit"});
            }).catch(function (err) {
                throw err;
            });

        }

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }


    }

})
();
