/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模型控制器
    cacModule.controller('CacRuleListCtrl', CacRuleListCtrl);
    CacRuleListCtrl.$inject = ['$scope', '$timeout', 'cacService', '$filter', 'cacRuleService', '$compile', '$uibModal', 'messageService', '$state', 'currentUser', 'dataTable', '$translate'];

    function CacRuleListCtrl($scope, $timeout, cacService, $filter, cacRuleService, $compile, $uibModal, messageService, $state, currentUser, dataTable, $translate) {
        var vm = this;
        vm.views = {
            editRule: editRule,
            addRule: addRule,
            findRule: findRule,
            deleteRule: deleteRule,
            tableInstance: null,
            exportRules: exportRules,
            uploadRuleExcel: uploadRuleExcel
        };


        function exportRules(event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL
            var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/rules/exportRules';   //请求的URl
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
                        a.download = "Rules.xlsx";			//自定义下载文件名称
                        a.href = reader.result;
                        $("body").append(a);
                        a.click();
                    }, 100);
                } else {
                    messageService.toast("error", $translate.instant('cac.messages.download_failed'));
                }
            }
        }

        //上传规则Excel表格，对应数据
        function uploadRuleExcel($file) {
            if ($file != null) {
                //console.log($file.name);
                var form = new FormData();
                form.append("files", $file);//files表示后台对应接收参数
                messageService.confirm(
                    $translate.instant('common.messages.operation.title', { operation: $translate.instant('common.entity.action.import') }),
                    $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.import'), obj: $translate.instant('cac.common.rule') }),
                    function () {
                        cacRuleService.uploadRule(form).then(function (result) {
                            if (result == "success") {
                                messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.import') }));
                            } else {
                                //0表示提示不会关掉。不写这个参数，提示框会立马消失掉！
                                messageService.toast("error", result);
                            }
                            angular.element("#cacRuleTable").dataTable().fnDestroy();
                            init();
                        }).catch(function (err) {
                            throw err;
                        });
                });
            }
        }

        //添加规则
        function addRule() {
            doEditRules(null);
        }

        //编辑规则
        function editRule(event) {
            var ruleJson = $(event.currentTarget).attr("rule");
            doEditRules(ruleJson);
        }

        function doEditRules(rule) {
            var rule = decodeURI(rule);//url解码
            $uibModal.open({
                templateUrl: 'app/modules/cac/rule/rule-edit.html',
                controller: 'CacRuleEditCtrl',
                controllerAs: 'cacRuleEditVm',
                backdrop: 'static',
                size: 'lg',//设置模态框大小
                resolve: {
                    entity: function () {
                        return {
                            rule: rule == "undefined" ? null : angular.fromJson(rule)//路由传参到模态框,将字符串转为json
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

        //删除规则
        function deleteRule(id) {
            if (id != null) {
                messageService.confirm(
                    $translate.instant('common.messages.operation.title', { operation: $translate.instant('common.entity.action.delete') }),
                    $translate.instant('common.messages.operation.body', { operation: $translate.instant('common.entity.action.delete'), obj: $translate.instant('cac.common.rule') }),
                    function () {
                        doDeleteRule(id, function () {
                            vm.views.tableInstance.ajax.reload(null, false);
                        });
                });
            }
        }

        function doDeleteRule(id, callBack) {
            cacRuleService.deleteRule(id).then(function () {
                if (callBack != null) {
                    callBack();
                }
            }).catch(function (err) {
                throw err;
            });
        }

        //查看规则
        function findRule(rule) {
            var rule = decodeURI(rule);//url解码
            // console.log("查看：" + rule);
            $uibModal.open({
                templateUrl: 'app/modules/cac/rule/rule-find.html',
                controller: 'CacRuleFindCtrl',
                controllerAs: 'cacRuleFindVm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    entity: function () {
                        return {
                            rule: angular.fromJson(rule)//路由传参到模态框,将字符串转为json
                        }
                    }
                }
            }).result.then(function (result) {

            }, function () {

            }).catch(function (err) {
                throw err;
            });
        }

        var tableOption = {
            id: 'cacRuleTable',
            //destroy:true,//可以多次初始化表格
            order: [[2, 'desc'], [1, 'desc']],
            aoColumns: [
                {
                    mData: 'ruleName', title: $translate.instant('cac.rule.name'), width: '100px', className: 'cac-text-overflow',
                    render: function (data, type, row, meta) {
                        return '<span title=\'' + row.ruleName + '\'>' + row.ruleName + '</span>';
                    }
                },
                {
                    mData: 'ruleExpression', title: $translate.instant('cac.rule.detail.expr'), className: 'cac-text-overflow', width:'900px',
                    render: function (data, type, row, meta) {
                        return '<span style=" display:block; overflow: hidden; white-space: nowrap;  text-overflow: ellipsis;max-width:900px;" title=\'' + row.ruleExpression + '\'>' + row.ruleExpression + '</span>';
                    }
                },
                {
                    mData: 'applicability', title: $translate.instant('cac.rule.detail.applicability'), className: 'cac-text-overflow',
                    render: function (data, type, row, meta) {
                        if (row.applicability != null) {
                            return '<span title=\'' + row.applicability + '\'>' + row.applicability + '</span>';
                        } else {
                            return '';
                        }

                    }
                },
                // {
                //     mData: 'label', title: '标签', className: 'cac-text-overflow', width: '15%',
                //     render: function (data, type, row, meta) {
                //         if(row.label != null){
                //             var label = row.label.replace(/"/g,' ').replace("[", "").replace("]", "").replace(/'/g, "");
                //             return '<span title=\'' + label + '\'>' + label + '</span>';
                //         }else{
                //             return '';
                //         }
                //
                //     }
                // },
                {mData: 'createdAt', title: $translate.instant('common.entity.detail.create_at'), visible: false, order: 'desc'},
                {
                    mData: 'updatedAt', title: $translate.instant('common.entity.detail.update_at'), order: 'desc', width: '8rem',
                    render: function (data, type, row, meta) {
                        var action = '';
                        if (row.updatedAt == null || row.updatedAt == '') {
                            var createdTime = $filter('date')(row.createdAt, 'yyyy-MM-dd HH:mm');
                            actionHtml = '<span>' + createdTime + '</span>'
                        } else {
                            var updatedTime = $filter('date')(row.updatedAt, 'yyyy-MM-dd HH:mm');
                            actionHtml = '<span>' + updatedTime + '</span>'
                        }
                        return actionHtml;
                    }
                },
                /*{mData: 'description', title: '说明'},*/
                {mData: 'createdBy', title: $translate.instant('common.entity.detail.create_by')},
                {
                    mData: 'id',
                    title: $translate.instant('common.entity.detail.operation'),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    width: '6rem',
                    render: function (data, type, row, meta) {
                        var id = "'" + row.id + "'";
                        //var code = "'" + row.modelCode + "'";
                        var rule = encodeURI(angular.toJson(row));

                        //TODO 外部代码中，ng-click函数的文本类型参数不能包含单引号，否则 angularjs $compile时会报错。
                        // 临时解决方案为把参数文本作为dom元素属性，点击事件获取此属性
                        // 合理的解决方案是ng-click事件传递对象id，js根据id查找对应记录

                        var actionHtml =
                            // '<div class="btn-group">' +
                            '<button type="button" class="btn btn-default btn-sm"  uaa-has-permission="cac:*:*" title="{{\'common.entity.action.edit\' | translate}}" rule="' + rule + '" ng-click="cacRuleListCtrlVm.views.editRule($event)">' +
                            '<span class="fa fa-pencil"></span>' +
                            '</button>\n' +
                            '<button type="button" class="btn btn-default btn-sm" uaa-has-permission="cac:*:*" title="{{\'common.entity.action.delete\' | translate}}" ng-click="cacRuleListCtrlVm.views.deleteRule(' + id + ')">' +
                            '<span class="fa fa-times"></span>' +
                            '</button>';
                        // '</div>';
                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }
            ]
        };

        function init() {

            dataTable.initTable(".rule-table", tableOption.aoColumns, undefined, {
                scrollX: true,
                order: [[2, 'desc'], [1, 'desc']],
                ajax: {
                    url: window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/rules',
                    dataSrc: ""
                }
            }).then(function (apiInstance) {
                vm.views.tableInstance = apiInstance;
            }).catch(function (err) {
                throw err;
            });
        }

        $scope.$watch(vm.views.tableInstance, function (value) {
            var val = value || null;
            if (val) {
                vm.views.tableInstance.fnClearTable();
                vm.views.tableInstance.fnAddData($scope.$eval(vm.views.tableInstance));
            }
        });
        init();

    }


    //新建、编辑规则Controller
    cacModule.controller('CacRuleEditCtrl', CacRuleEditCtrl);
    CacRuleEditCtrl.$inject = ['$uibModalInstance', '$timeout', '$compile', '$scope', 'cacRuleService', 'messageService', 'entity', '$translate'];

    function CacRuleEditCtrl($uibModalInstance, $timeout, $compile, $scope, cacRuleService, messageService, entity, $translate) {

        var vm = this;
        vm.views = {
            rule: entity.rule,
            cancel: cancel,
            save: save,
            uniqueFlag: false,
            option: {}
        };

        $timeout(function () {
            vm.views.option = {
                mode: 'javascript',
                lineNumbers: true,
                theme: 'opluscode',
                lineWrapping: true
            }
        });


        function save() {
            console.log(vm.views.rule);
            cacRuleService.addRule(vm.views.rule).then(function () {
                messageService.toast("success", $translate.instant('common.messages.operation.success', { operation: $translate.instant('common.entity.action.save') }));
                $uibModalInstance.close({action: "edit"});
            }).catch(function (err) {
                throw err;
            });

        }

        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }


        //注意这里用的是cacRuleEditVm而不是vm!
        /*$scope.$watch('cacRuleEditVm.views.rule.ruleName', function (newValue, oldValue) {
            if (newValue == undefined) {
                vm.views.uniqueFlag = false;
                return;
            }
            vm.views.uniqueFlag = cacRuleService.checkRuleName(newValue);
        }, true);*/


    }


    //查看规则Controller
    cacModule.controller('CacRuleFindCtrl', CacRuleFindCtrl);
    CacRuleFindCtrl.$inject = ['$uibModalInstance', 'entity'];

    function CacRuleFindCtrl($uibModalInstance, entity) {
        var vm = this;

        vm.views = {
            rule: entity.rule,
            close: close
        };

        function close() {
            $uibModalInstance.close();
        }

    }


})
();
