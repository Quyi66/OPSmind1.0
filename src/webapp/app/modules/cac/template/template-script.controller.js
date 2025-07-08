/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模板脚本模型控制器
    cacModule.controller('CacTemplateScriptCtrl', CacTemplateScriptCtrl);
    CacTemplateScriptCtrl.$inject = ['$scope', '$timeout', 'entity', 'cacService', '$compile', '$uibModalInstance', '$http', '$translate'];

    function CacTemplateScriptCtrl($scope, $timeout, entity, cacService, $compile, $uibModalInstance, $http, $translate) {
        var vm = this;

        vm.views = {
            existingScripts: entity.scripts == null ? [] : entity.scripts,//编辑时，从模板页面传过来的脚本。用于点击取消按钮时的回显
            index: entity.index,
            scriptType: entity.scriptType,
            newScripts: [],//已选脚本用于回显，默认等于模板页面传过来的脚本。总的已选的脚本
            selectRecord: selectRecord,
            save: save,
            cancel: cancel
        };
        initDefaultCheckScript();

        function initDefaultCheckScript() {
            if (vm.views.existingScripts) {
                for (var i in vm.views.existingScripts) {
                    var script = vm.views.existingScripts[i];
                    vm.views.newScripts.push(script);
                }
            }
        }

        function cancel() {
            $uibModalInstance.close({
                action: "confirm",
                selectedScripts: vm.views.existingScripts,
                index: vm.views.index
            });
        }


        function selectRecord(script) {
            var script = decodeURI(script);
            script = angular.fromJson(script);

            if (vm.views.scriptType == cacService.playbookScripType) {
                vm.views.existingScripts = [];
                vm.views.newScripts = [];
                vm.views.existingScripts.push(script);
                vm.views.newScripts.push(script);
            } else {
                var hasFound = false;
                for (var i in vm.views.newScripts) {
                    if (vm.views.newScripts[i].id == script.id) {
                        hasFound = true;
                        vm.views.newScripts.splice(i, 1);//已选定的行，再次点击时取消选定
                    }
                }

                if (!hasFound) {
                    vm.views.newScripts.push(script);
                }
            }



        }

        function hasSelected(script) {
            var script = decodeURI(script);
            script = angular.fromJson(script);
            var result = false;

            for (var i in vm.views.newScripts) {
                if (script.id == vm.views.newScripts[i].id) {
                    result = true;
                    var index = vm.views.newScripts.findIndex(function (v) {
                        return script.id === v.id;
                    });

                    if (index < 0) {
                        vm.views.newScripts.push(script);
                    }
                    break;
                }
            }

            return result;
        }

        //保存选择
        function save() {
            //找到给定数组中其他参数数组没有的元素，然后将这些元素组成新数组返回。vm.views.newScripts用来检查的数组，vm.views.existingScripts用来排出的数组。
            // _.difference(vm.views.newScripts, vm.views.existingScripts);
            $uibModalInstance.close({
                action: "confirm",
                selectedScripts: vm.views.newScripts,
                index: vm.views.index
            });
        }


        var tableOption = {
            id: 'cac-template-script-table',
            order: [[3, 'desc'],[2, 'desc']],
            aoColumns: [
                {
                    mData: 'id', title: $translate.instant('common.entity.detail.select'),
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {

                        var script = encodeURI(angular.toJson(row));

                        var checkedStr = "";
                        if (hasSelected(script)) {
                            checkedStr = ' checked="true" ';
                        }

                        actionHtml = '<label class="i-checks" >' +
                            '<input type="checkbox" ' + checkedStr + ' ng-click="cacTemplateScriptVm.views.selectRecord(\'' + script + '\')"><i></i>' +
                            '</label>';

                        if (vm.views.scriptType == cacService.playbookScripType) {
                            actionHtml = '<label class="i-checks" >' +
                                '<input name="scriptId" type="radio" ' + checkedStr + ' ng-click="cacTemplateScriptVm.views.selectRecord(\'' + script + '\')"><i></i>' +
                                '</label>';
                        }


                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                },
                {mData: 'scriptName', title: $translate.instant('cac.script.name'), width: "180px"},
                {mData: 'createdAt', title: $translate.instant('common.entity.detail.create_at'), visible: false, order:'desc'},
                {mData: 'updatedAt', title: $translate.instant('common.entity.detail.update_at'), visible: false, order:'desc'},
                {mData: 'scriptParams', title: $translate.instant('cac.script.detail.param')}
            ]
        };

        function init() {
            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     tableOption.ajax = {
            //         url: 'app/modules/cac/api/script.json',
            //         dataSrc: "aaData"
            //     };
            // } else {
                var url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/scripts/';
                if(vm.views.scriptType==cacService.playbookScripType){
                    url = window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/scripts/getScriptsBy/' + cacService.scriptZipType;
                }
                $http({
                    url: url
                }).success(function (ciList, status, header, config, statusText) {
                    tableOption.ajax = function (data, callback, settings) {
                        callback(
                            cacService.assembleTable(ciList)
                        );
                    };

                    $timeout(function () {
                        //初始化datatables，并保存实例
                        cacService.prepareDatatable(".cac-template-script-dialog .cac-template-script-table", tableOption);
                    }, 10);
                }).error(function (data, header, config, status) {
                    console.log("Finish  $http ajax error");
                });
            }
        // }

        init();
    }


})
();
