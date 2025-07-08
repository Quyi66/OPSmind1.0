/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模板规则模型控制器
    cacModule.controller('CacTemplateRuleCtrl', CacTemplateRuleCtrl);
    CacTemplateRuleCtrl.$inject = ['$scope', '$timeout', 'entity', 'cacService', '$compile', '$uibModalInstance', '$http', '$translate'];

    function CacTemplateRuleCtrl($scope, $timeout, entity, cacService, $compile, $uibModalInstance, $http, $translate) {
        var vm = this;

        vm.views = {
            existingRules: entity.rules == null ? [] : entity.rules,//编辑时，从模板页面传过来的规则。用于点击取消按钮时的回显
            index: entity.index,
            newRules: [],//已选规则用于回显，默认等于模板页面传过来的规则。总的已选的规则
            selectAll: false,
            selectRecord: selectRecord,
            hasSelected: hasSelected,
            save: save,
            cancel: cancel,
            category: "",
            label: "",
            categoryList: [],
            labelList: [
                $translate.instant('cac.rule.labels.0'),
                $translate.instant('cac.rule.labels.1'),
                $translate.instant('cac.rule.labels.2'),
                $translate.instant('cac.rule.labels.3'),
                $translate.instant('cac.rule.labels.4'),
                $translate.instant('cac.rule.labels.5'),
                $translate.instant('cac.rule.labels.6'),
                $translate.instant('cac.rule.labels.7'),
                $translate.instant('cac.rule.labels.8'),
            ],
            selectRule: selectRule
        };

        initDefaultCheckRule();

        function initDefaultCheckRule() {
            if (vm.views.existingHosts) {
                for (var i in vm.views.existingRules) {
                    var rule = vm.views.existingRules[i];
                    vm.views.newRules.push(rule);
                }
            }
        }

        function selectRule() {
            $(".cac-template-rule-dialog .cac-template-rule-table").dataTable().fnDestroy();
            init();
        }

        function filterRule(ciList, category, label) {
            var tableObj = cacService.assembleTable(ciList);
            var ruleList = [];
            if (category == "") {
                if (label == "") {
                    return tableObj;
                } else {
                    var bool = true;
                    for (var i in ciList) {
                        if (ciList[i].label != null) {
                            for (var j = 0; j < label.length; j++) {
                                if (ciList[i].label.indexOf(label[j]) < 0) {
                                    bool = false;
                                    break;
                                }
                            }
                            if (bool) {
                                ruleList.push(ciList[i]);
                            }
                            bool = true;
                        }
                    }
                }
            } else {
                if (label == "") {
                    for (var i in ciList) {
                        if (ciList[i].category == category) {
                            ruleList.push(ciList[i]);
                        }
                    }
                } else {
                    var bool = true;
                    for (var i in ciList) {
                        if (ciList[i].label != null && ciList[i].category == category) {
                            for (var j = 0; j < label.length; j++) {
                                if (ciList[i].label.indexOf(label[j]) < 0) {
                                    bool = false;
                                    break;
                                }
                            }
                            if (bool) {
                                ruleList.push(ciList[i]);
                            }
                            bool = true;
                        }
                    }
                }
            }
            tableObj.aaData = ruleList;
            tableObj.totalRecords = ruleList.length;
            return tableObj;
        }

        function cancel() {
            $uibModalInstance.close({
                action: "cancel",
                selectedHosts: vm.views.existingRules,
                index: vm.views.index
            });
        }

        function selectRecord(event) {
            var ruleJson = '';
            if ($(event.currentTarget).attr("rule") == undefined) {
                ruleJson = event;
            } else {
                ruleJson = $(event.currentTarget).attr("rule");
            }
            var rule = decodeURI(ruleJson);
            rule = angular.fromJson(rule);
            var hasFound = false;
            for (var i in vm.views.newRules) {
                if (vm.views.newRules[i].id == rule.id) {
                    hasFound = true;
                    vm.views.newRules.splice(i, 1);//已选定的行，再次点击时取消选定
                }
            }

            if (!hasFound) {
                vm.views.newRules.push(rule);
            }

        }

        //判断规则rule是否已经被选
        function hasSelected(rule) {
            var rule = decodeURI(rule);
            rule = angular.fromJson(rule);
            var result = false;

            for (var i in vm.views.existingRules) {
                if (rule.id == vm.views.existingRules[i].id) {
                    result = true;
                    var index = vm.views.newRules.findIndex(function (v) {
                        return rule.id === v.id;
                    });

                    if (index < 0) {
                        vm.views.newRules.push(rule);
                    }
                    break;
                }
            }
            return result;
        }

        //保存选择
        function save() {
            //_.difference(vm.views.newRules, vm.views.existingRules);
            $uibModalInstance.close({
                action: "confirm",
                selectedRules: vm.views.newRules,
                index: vm.views.index
            });
        }

        var tableOption = {
            id: 'cac-template-rule-table',
            order: [[3, 'desc'], [2, 'desc']],
            aoColumns: [
                {
                    mData: 'id',
                    title: '<div class="checkbox checkbox-primary checkbox-inline" title="{{\'common.entity.detail.select_all\' | translate}}">' +
                        '<input type="checkbox" id="selectAll"><label for="selectAll"></label>' +
                        '</div>',
                    className: 'text-center',
                    width: '10%',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        //取出所有规则分类
                        if (vm.views.categoryList.indexOf(row.category) < 0) {
                            vm.views.categoryList.push(row.category);
                        }

                        var rule = encodeURI(angular.toJson(row));
                        var checkedStr = ' ';
                        if (hasSelected(rule)) {
                            checkedStr = ' checked="true" ';
                        }
                        //TODO 外部代码中，ng-click函数的文本类型参数不能包含单引号，否则angularjs $compile时会报错。
                        // 临时解决方案为把参数文本作为dom元素属性，点击事件获取此属性
                        // 合理的解决方案是ng-click事件传递对象id，js根据id查找对应记录
                        var actionHtml = '<div class="checkbox checkbox-inline" >' +
                            '<input type="checkbox" class="checkboxRule" title="' + data + '"' + checkedStr + ' rule="' + rule +
                            '" ng-click="cacTemplateRuleVm.views.selectRecord($event)" id="' + meta.row + '"><label for="' + meta.row + '"></label>' +
                            '</div>';
                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                },
                {
                    mData: 'ruleName',
                    title: $translate.instant('cac.rule.detail.name'),
                    width: "180px",
                    className: 'cac-text-overflow',
                    render: function (data) {
                        var actionHtml = '<span style="overflow:hidden;text-overflow: ellipsis;" class="cac-text-overflow" title=\'' + data + '\' >' + data + '</span>';
                        return actionHtml;
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                },
                {mData: 'createdAt', title: $translate.instant('common.entity.detail.create_at'), visible: false, order: 'desc'},
                {mData: 'updatedAt', title: $translate.instant('common.entity.detail.update_at'), visible: false, order: 'desc'},
                {
                    mData: 'ruleExpression',
                    title: $translate.instant('cac.rule.detail.expr'),
                    className: 'cac-text-overflow',
                    render: function (data) {
                        var actionHtml = '<span style="overflow:hidden;text-overflow: ellipsis;" class="cac-text-overflow" title=\'' + data + '\' >' + data + '</span>';
                        return actionHtml;
                    },
                    createdCell: function (nTd) {
                        $compile(nTd)($scope);
                    }
                }
            ]
        };

        //默认选择的页码为1，换页时判断页面是否一致，修改全选框checked的状态
        var selectedPage = 1;

        function init() {
            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     tableOption.ajax = {
            //         url: 'app/modules/cac/api/rule.json',
            //         dataSrc: "aaData"
            //     };
            // } else {
                $http({
                    url: window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/rules'
                }).success(function (ciList, status, header, config, statusText) {
                    tableOption.ajax = function (data, callback, settings) {
                        callback(
                            filterRule(ciList, vm.views.category, vm.views.label)
                        );
                    };

                    $timeout(function () {
                        cacService.prepareDatatable(".cac-template-rule-dialog .cac-template-rule-table", tableOption);
                        //为全选框绑定单击事件
                        angular.element("#selectAll").on("click", function () {
                            //被点击时，改变全选状态
                            vm.views.selectAll = !vm.views.selectAll;
                            //获取当前页码的数据行的复选框
                            var checkList = angular.element(".checkboxRule");
                            for (var i = 0; i < checkList.length; i++) {
                                //设置数据复选框与全选框勾选状态一致
                                checkList[i].checked = vm.views.selectAll;
                                var rule = checkList[i].getAttribute("rule");
                                if (vm.views.selectAll == true && !hasSelected(rule)) {
                                    //全选时且当前规则选择状态为false时
                                    selectRecord(rule);
                                } else if (vm.views.selectAll == false && hasSelected(rule)) {
                                    //取消全选，且当前规则选择状态为true时
                                    selectRecord(rule);
                                }
                            }
                        });
                        //给表格页码选择组件绑定单击事件
                        angular.element("#cac-template-rule-table_paginate").click(function () {
                            //获取页码按钮列表
                            var list = angular.element("#cac-template-rule-table_paginate").find(" >.pagination > .paginate_button");
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].getAttribute("class") == "paginate_button active") {
                                    //获取当前激活状态的页码按钮的页码
                                    var newPage = list[i].children[0].getAttribute("data-dt-idx");
                                    if (selectedPage != newPage) {
                                        //当页码变化时，全选框默认状态设置为true，遍历表格当前页面数据勾选状态，若存在非勾选状态的数据，则改变全选框状态为false
                                        angular.element("#selectAll").prop("checked", true);
                                        vm.views.selectAll = true;
                                        var checkList = angular.element(".checkboxRule");
                                        for (var i = 0; i < checkList.length; i++) {
                                            if (!checkList[i].checked) {
                                                angular.element("#selectAll").prop("checked", false);
                                                vm.views.selectAll = false;
                                                break;
                                            }
                                        }
                                        //修改新页码为当前选择页码
                                        selectedPage = newPage;
                                    }
                                }
                            }
                        });
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
