/**
 * @Auther: zml
 * @Date: 2018/5/14
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacScriptListCtrl', CacScriptListCtrl);
    CacScriptListCtrl.$inject = ['$scope', '$timeout', 'cacService', '$http', 'cacScriptService', '$compile', '$uibModal', 'messageService', '$translate'];

    function CacScriptListCtrl($scope, $timeout, cacService, $http, cacScriptService, $compile, $uibModal, messageService, $translate) {
        var vm = this;
        vm.views = {
            editScript: editScript,
            editScriptContent: editScriptContent,
            addScript: addScript,
            findScript: findScript,
            deleteScript: deleteScript,
            deleteScriptFile: deleteScriptFile,
            tableInstance: null
        }


        function addScript() {
            doUploadScripts(null);
        }

        function editScriptContent(scriptName) {
            $uibModal.open({
                templateUrl: 'app/modules/cac/script/script-content-edit.html',
                controller: 'CacScriptEditCtrl',
                controllerAs: 'cacScriptEditVm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    entity: function () {
                        return {
                            scriptName: scriptName
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
            }).catch(function (err) {
                throw err;
            });
        }

        //编辑脚本
        function editScript(script) {
            var script = decodeURI(script);//url解码
            $uibModal.open({
                templateUrl: 'app/modules/cac/script/script-edit.html',
                controller: 'CacScriptEditCtrl',
                controllerAs: 'cacScriptEditVm',
                backdrop: 'static',
                size: 'md',//设置模态框大小
                resolve: {
                    entity: function () {
                        return {
                            script: script == "undefined" ? null : angular.fromJson(script)//路由传参到模态框,将字符串转为json
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
            }).catch(function (err) {
                throw err;
            });
        }

        //添加脚本
        function addScript() {
            var script = decodeURI(script);//url解码
           // console.log(script);
            $uibModal.open({
                templateUrl: 'app/modules/cac/script/script-upload.html',
                controller: 'CacScriptUploadCtrl',
                controllerAs: 'cacScriptUploadVm',
                backdrop: 'static',
                size: 'md',//设置模态框大小
                resolve: {
                    entity: function () {
                        return {
                            script: script == "undefined" ? null : angular.fromJson(script)//路由传参到模态框,将字符串转为json
                        }
                    }
                }
            }).result.then(function (result) {
                //关闭模态框时执行，result是关闭时传递过来的参数
                var action = result.action;
                vm.views.tableInstance.ajax.reload(null, false);
                /*if (action != "cancel") {
                    //重置（默认或者设置为true）或者保持分页信息（设置为false）
                    vm.views.tableInstance.ajax.reload(null, false);
                }*/
            }).catch(function (err) {
                throw err;
            });
        }

        //删除脚本,数据库记录
        function deleteScript(id, filename) {
            if (id != null) {
                messageService.confirm(
                    $translate.instant('common.messages.operation.title', { operation: $translate.instant('common.entity.action.delete') }),
                    $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.delete'), obj: $translate.instant('cac.common.script') }),
                    function () {
                        deleteScriptFile(id, filename);
                });
            }

        }

        //删除服务器上脚本文件
        function deleteScriptFile(id, filename) {
            cacScriptService.deleteScriptFile(filename).then(function (data) {
                doDeleteScript(id, function () {
                    vm.views.tableInstance.ajax.reload(null, false);
                    messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.delete') }));
                });

            }).catch(function (err) {
                throw err;
            });
        }

        function doDeleteScript(id, callBack) {
            cacScriptService.deleteScript(id).then(function () {
                if (callBack != null) {
                    callBack();
                }
            }).catch(function (err) {
                throw err;
            });
        }

        //查看脚本
        function findScript(script) {
            var script = decodeURI(script);//url解码
            // console.log("查看：" + script);
            $uibModal.open({
                templateUrl: 'app/modules/cac/script/script-find.html',
                controller: 'CacScriptFindCtrl',
                controllerAs: 'cacScriptFindVm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    entity: function () {
                        return {
                            script: angular.fromJson(script)//路由传参到模态框,将字符串转为json
                        }
                    }
                }
            }).result.then(function (result) {

            }).catch(function (err) {
                throw err;
            });
        }

        var tableOption = {
            id: 'cacScriptTable',
            order: [[2, 'desc'],[1, 'desc']],
            aoColumns: [
                {mData: 'scriptName', title: $translate.instant('cac.script.name')},
                {mData: 'createdAt', title: $translate.instant('common.entity.detail.create_at'), visible: false, order:'desc'},
                {mData: 'updatedAt', title: $translate.instant('common.entity.detail.update_at'), visible: false, order:'desc'},
                {mData: 'scriptParams', title: $translate.instant('cac.script.detail.param')},
                {mData: 'scriptSize', title: $translate.instant('cac.script.detail.size')},
                {mData: 'createdBy', title: $translate.instant('cac.script.detail.create_by')},
                {
                    mData: 'id',
                    title: $translate.instant('cac.script.detail.view'),
                    render: function (data, type, row, meta) {
                        var scriptName = "'" + row.scriptName + "'";
                        if (row.scriptType == cacService.playbookScripType) {
                            return "";
                        } else {
                            var actionHtml =
                                '<button class="btn btn-success btn-sm" ng-click="cacScriptListCtrlVm.views.editScriptContent(' + scriptName + ')">{{\'cac.script.detail.view\' | translate}}</button>';
                            return actionHtml;
                        }

                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }

                },
                /*{mData: 'description', title: '描述'},*/
                {
                    mData: 'id',
                    title: $translate.instant('common.entity.detail.operation'),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        var filename = "'" + row.scriptName + "'";
                        var script = encodeURI(angular.toJson(row));
                        var actionHtml =
                            '<div class="btn-group">' +
                            '<button type="button" class="btn btn-default btn-sm"  title="{{\'common.entity.action.edit\' | translate}}" uaa-has-permission="cac:*:*" ng-click="cacScriptListCtrlVm.views.editScript(\'' + script + '\')">' +
                            '<span class="fa fa-pencil"></span>' +
                            '</button>' +
                            '<button type="button" class="btn btn-default btn-sm" title="{{\'common.entity.action.delete\' | translate}}" uaa-has-permission="cac:*:*" ng-click="cacScriptListCtrlVm.views.deleteScript(' + id + ',' + filename + ')">' +
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

        function init() {
            dataTable.initTable(".script-table", tableOption.aoColumns, undefined, {
                scrollX: true,
                order: [[2, 'desc'], [1, 'desc']],
                ajax: {
                    url: window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/scripts',
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


    //添加脚本Controller
    cacModule.controller('CacScriptUploadCtrl', CacScriptUploadCtrl);
    CacScriptUploadCtrl.$inject = ['$scope', '$uibModalInstance', 'cacService', '$http', 'cacScriptService', 'messageService', 'entity', '$translate'];

    function CacScriptUploadCtrl($scope, $uibModalInstance, cacService, $http, cacScriptService, messageService, entity, $translate) {

        var vm = this;
        vm.views = {
            scriptList: [],
            cancel: cancel,
            save: save,
            reduceScript: reduceScript,
            addScript: addScript,
            changeAttach: changeAttach,
            files: [],
            saveAndNew: saveAndNew,
            isExit: false,
            isChinese: false,
            script: {}
        };

        function saveAndNew() {
            vm.views.save(true);
            vm.views.scriptList = [];
            initFileInput();
        }


        function save(continue_new) {
            console.log(vm.views.scriptList);
            var form = new FormData();
            var file = angular.element(".file")[0].files[0];
            form.append("files", file);//files表示后台对应接收参数

            //传入出了file以外的实体，后台也用String来接，然后用jsonObject来转换
            /* var scriptList = JSON.stringify(vm.views.scriptList);
            form.append("script", scriptList);*/
            //传一个file以外的字符传到后台，newDir表示文件选择的git路径
            form.append("newDir", "");
            //var isSuccess = cacScriptService.uploadFile(form);
            cacScriptService.uploadFile(form).then(function (data) {
                if (data == 'true') {
                    if (vm.views.isExit) {
                        //如果存在该文件时，cac后台更新该记录
                        cacScriptService.updateScript(vm.views.script).then(function () {
                            messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.upload') }));
                            if (!continue_new) {
                                $uibModalInstance.close({action: "edit"});
                            } else {
                                angular.element(".file").val(null);
                                vm.views.script = {};
                                vm.views.isExit = false;

                            }
                        }).catch(function (err) {
                            throw err;
                        });
                    } else {
                        cacScriptService.addScript(vm.views.script).then(function () {
                            messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.upload') }));
                            if (!continue_new) {
                                $uibModalInstance.close({action: "edit"});
                            }
                        }).catch(function (err) {
                            throw err;
                        });
                    }
                } else {
                    messageService.toast("error", $translate.instant('cac.messages.upload_script_fail'));
                }

            }).catch(function (data) {
                //0表示提示不会关掉。不写这个参数，提示框会立马消失掉！
                messageService.toast("error", data);
            });

        }

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function changeAttach($file) {
            if ($file != null) {
                //vm.views.files[$index] = $file;
                //vm.views.scriptList[$index].scriptName = $file.name;
                var fileName = $file.name;
                var isChinese = cacService.isChinese(fileName);
                if(isChinese){
                    vm.views.isChinese = true;
                    $scope.addScriptForm.$invalid = true;
                }else{
                    vm.views.isChinese = false;
                    $scope.addScriptForm.$invalid = false;
                }
                // vm.views.script.scriptSize = cacService.getFileSize($file.size);
                cacScriptService.checkScript($file.name).then(function (data) {
                    if (data) {
                        vm.views.script = data;
                        vm.views.isExit = true;
                    } else {
                        vm.views.isExit = false;
                    }
                    var splitArray = $file.name.split(".");
                    vm.views.script.scriptName = $file.name;
                    //获取后缀名
                    vm.views.script.scriptFormat = splitArray[splitArray.length - 1];
                    if (vm.views.script.scriptFormat == cacService.scriptZipType) {
                        vm.views.script.scriptType = cacService.playbookScripType;
                    } else {
                        vm.views.script.scriptType = cacService.otherScriptType;
                    }
                }).catch(function (err) {
                    throw err;
                });

            }
        }

        function reduceScript($index) {
            angular.element(".file" + $index).val(null);
            vm.views.scriptList.splice($index, 1);
        }

        function addScript() {
            initFileInput();
        }

        function initFileInput() {
            var scriptObj = {
                scriptParams: "",
                scriptName: "",
                scriptFormat: ""
            };
            vm.views.scriptList.push(scriptObj);
        }

        function init() {
            initFileInput();
        }

        init();


    }


    //编辑脚本Controller
    cacModule.controller('CacScriptEditCtrl', CacScriptEditCtrl);
    CacScriptEditCtrl.$inject = ['$uibModalInstance', '$timeout', '$http', 'cacScriptService', 'messageService', 'entity', '$translate'];

    function CacScriptEditCtrl($uibModalInstance, $timeout, $http, cacScriptService, messageService, entity, $translate) {

        var vm = this;
        vm.views = {
            script: entity.script,
            scriptName: entity.scriptName,
            cancel: cancel,
            save: save,
            saveScriptContent: saveScriptContent,
            option: {}
        };

        init();

        function init() {
            if (vm.views.scriptName != undefined && vm.views.scriptName != "" && vm.views.scriptName != null) {
                getScriptContentByName(vm.views.scriptName);
            }
        }

        function getScriptContentByName(scriptName) {
            cacScriptService.getScriptContentByName(scriptName).then(function (data) {
                vm.views.scriptContent = data;
            }).catch(function (err) {
                throw err;
            });
        }

        $timeout(function () {
            vm.views.option = {
                mode: 'text/x-sh',
                lineNumbers: true,
                theme: 'opluscode',
                lineWrapping: true
            }
        });

        function saveScriptContent() {

        }

        function save() {
            cacScriptService.addScript(vm.views.script).then(function () {
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


    //查看脚本Controller
    cacModule.controller('CacScriptFindCtrl', CacScriptFindCtrl);
    CacScriptFindCtrl.$inject = ['$uibModalInstance', 'entity'];

    function CacScriptFindCtrl($uibModalInstance, entity) {
        var vm = this;

        vm.views = {
            script: entity.script,
            cancel: cancel
        };

        function cancel() {
            $uibModalInstance.close();
        }

    }


})
();
