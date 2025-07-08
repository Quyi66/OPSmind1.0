/**
 * @Auther: zml
 * @Date: 2018/4/21
 */
(function () {
    var cacModule = angular.module('oplus.cac');

    //模板主机模型控制器
    cacModule.controller('CacTemplateHostCtrl', CacTemplateHostCtrl);
    CacTemplateHostCtrl.$inject = ['$scope', '$timeout', 'entity', 'cacService', '$compile', '$uibModalInstance', '$http', 'cacHostService','$translate'];

    function CacTemplateHostCtrl($scope, $timeout, entity, cacService, $compile, $uibModalInstance, $http, cacHostService,$translate) {
        var vm = this;

        vm.views = {
            tableInstance: null,
            categoryName: "",
            category: "",//分类
            existingHosts: entity.hosts,//编辑时，从模板页面传过来的主机。用于点击取消按钮时的回显
            checkedHosts: [],//已选主机用于回显，默认等于模板页面传过来的主机。总的已选的主机
            categoryCheckedHosts: [],//每个组已选主机
            allHosts: [],//数据库中总的主机列表,第一次表格数据的时候就保存起来，当刷新表格的时候，如果allHosts中有数据，则保持之前的数据不变,
            tableHosts: [],//表格中的数据
            index: entity.index,
            selectAll: false,//是否全选
            checkAllHosts: false,//"全部"按钮是否全选
            old_category: "",//上一次category的值
            allCategory: [],
            selectRecord: selectRecord,
            cancel: cancel,
            save: save,
            refreshTableByCategory: refreshTableByCategory,
            checkCategory: checkCategory
        };

        initDefaultCheckHost();

        function initDefaultCheckHost() {
            if (vm.views.existingHosts) {
                for (var i in vm.views.existingHosts) {
                    var host = vm.views.existingHosts[i];
                    vm.views.checkedHosts.push(host);
                }
            }
        }

        function cancel() {
            $uibModalInstance.close({
                action: "cancel",
                selectedHosts: vm.views.existingHosts,
                index: vm.views.index
            });
        }

        //初始化创建表格
        var tableOption = {
            id: 'cac-template-host-table',
            order: [[1, 'asc']],
            aoColumns: [
                {
                    mData: 'id',
                    width: '3rem',
                    title: '<div class="checkbox checkbox-inline checkbox-primary" title="'+$translate.instant('common.entity.detail.select_all')+'"><input type="checkbox" id="selectAllTableHosts"><label for="selectAllTableHosts"></label></div>',
                    className: 'text-center',
                    searchable: false,
                    orderable: false,
                    render: function (data, type, row, meta) {
                        var checkedStr = "";
                        var host = encodeURI(angular.toJson(row));
                        //addAllHosts(host);
                        if (hasSelected(host)) {
                            checkedStr = ' checked="true" ';
                        }
                        actionHtml = '<div class="checkbox checkbox-inline">' +
                            '<input id="check_' + meta.row + '" type="checkbox" ' + checkedStr + ' class="checkboxHost" host = "' + host + '" ng-click="cacTemplateHostVm.views.selectRecord(\'' + host + '\')">' +
                            '<label for="check_' + meta.row + '"></label></div>';

                        return actionHtml;
                    },
                    createdCell: function (nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                },
                {mData: 'hostName', title: $translate.instant('app_pms.common.header.hostname')},
                {mData: 'hostKey', title: 'IP'},
                // {mData: 'hostUser', title: '主机用户名'},
                {mData: 'category', title: $translate.instant('cac.template.group')}
                // {mData: 'hostPassword', title: '密码', visible: false}
            ],
            //每一次绘datatables时候调用的方法
            fnPreDrawCallback: function (oSettings) {
                // debugger
            }//,
            /* fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                 debugger
             }*/
        };

        //获取全部的主机类别
        getAllCategory();


        function getAllCategory() {
            cacHostService.getAllCategory().then(function (data) {
                vm.views.allCategory = data;
            }).catch(function (err) {
                throw err;
            });
        }

        init();

        //默认选择的页码为1，换页时判断页面是否一致，修改全选框checked的状态
        var selectedPage = 1;

        function init() {

            // if (window.$oplus.appConfig.modules.cac.useLocalDb) {
            //     tableOption.ajax = {
            //         url: 'app/modules/cac/api/host.json',
            //         dataSrc: "aaData"
            //     };
            // } else {
                $http({
                    url: window.$oplus.appConfig.apiBaseUrls.cac + '/api/cac/audit/hosts/getHostListByCategory/' + vm.views.category
                }).success(function (ciList, status, header, config, statusText) {
                    vm.views.tableHosts = ciList;
                    if (vm.views.category == "") {
                        vm.views.allHosts = ciList;
                    }
                    tableOption.ajax = function (data, callback, settings) {
                        callback(
                            cacService.assembleTable(ciList)
                        );
                    };

                    $timeout(function () {
                        vm.views.tableInstance = cacService.prepareDatatable(".cac-template-host-dialog .cac-template-host-table", tableOption);

                        if (vm.views.category != "") {
                            if (vm.views.tableHosts.length > 0 && vm.views.tableHosts.length == vm.views.categoryCheckedHosts.length) {
                                vm.views.selectAll = true;
                                angular.element("#selectAllTableHosts").prop("checked", true);
                            }
                        }
                        //为全选框绑定单击事件
                        angular.element("#selectAllTableHosts").on("click", function () {
                            //被点击时，改变全选状态
                            vm.views.selectAll = !vm.views.selectAll;
                            //获取当前页码的数据行的复选框
                            var checkList = angular.element(".checkboxHost");
                            for (var i = 0; i < checkList.length; i++) {
                                //设置数据复选框与全选框勾选状态一致
                                checkList[i].checked = vm.views.selectAll;
                                var host = checkList[i].getAttribute("host");
                                if (vm.views.selectAll == true && !hasSelected(host)) {
                                    //全选时且当前主机选择状态为false时
                                    selectRecord(host);
                                } else if (vm.views.selectAll == false && hasSelected(host)) {
                                    //取消全选，且当前主机选择状态为true时
                                    selectRecord(host);
                                }
                            }
                        });

                        //给表格页码选择组件绑定单击事件
                        angular.element("#cac-template-host-table_paginate").click(function () {
                            //获取页码按钮列表
                            var list = angular.element("#cac-template-host-table_paginate").find(" >.pagination > .paginate_button");
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].getAttribute("class") == "paginate_button active") {
                                    //获取当前激活状态的页码按钮的页码
                                    var newPage = list[i].children[0].getAttribute("data-dt-idx");
                                    if (selectedPage != newPage) {
                                        //当页码变化时，全选框默认状态设置为true，遍历表格当前页面数据勾选状态，若存在非勾选状态的数据，则改变全选框状态为false
                                        angular.element("#selectAllTableHosts").prop("checked", true);
                                        vm.views.selectAll = true;
                                        var checkList = angular.element(".checkboxHost");
                                        for (var i = 0; i < checkList.length; i++) {
                                            if (!checkList[i].checked) {
                                                angular.element("#selectAllTableHosts").prop("checked", false);
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


        /**
         * 根据主机分组名，刷新表格数据
         *      如果是全部主机，并且是全新。
         *          则保持每个分组的全选
         *          否则切换到分组时，不保存全选
         * @param category
         */
        function refreshTableByCategory(category) {
            vm.views.category = category;
            if (vm.views.old_category != category) {
                $(".cac-template-host-dialog .cac-template-host-table").dataTable().fnDestroy();
                vm.views.categoryCheckedHosts = [];
                vm.views.selectAll = false;
                angular.element("#selectAllTableHosts").prop("checked", false);
                init();
                if (category == "" && vm.views.checkedHosts.length == vm.views.allHosts.length) {
                    vm.views.selectAll = true;
                    angular.element("#selectAllTableHosts").prop("checked", true);
                } else if (category != "" && vm.views.categoryCheckedHosts.length == vm.views.tableHosts) {
                    vm.views.selectAll = true;
                    angular.element("#selectAllTableHosts").prop("checked", true);
                }
                vm.views.old_category = category;
            }
        }


        /**
         *  li 主机分组菜单栏点击事件
         * @param category
         */
        function checkCategory(category) {
            vm.views.category = category;
            if (vm.views.old_category != category) {
                $(".cac-template-host-dialog .cac-template-host-table").dataTable().fnDestroy();
                vm.views.allHosts = [];
                init();
                vm.views.old_category = category;
            }
        }


        /**
         *  根据checkbox input属性host的值，判断是选择该主机还是取消选则该主机
         * @param event 表格中checkbox input框设定的属性
         */
        function selectRecord(event) {

            var hostAttr = '';
            if ($(event.currentTarget).attr("host") == undefined) {
                hostAttr = event;
            } else {
                hostAttr = $(event.currentTarget).attr("host");
            }
            var host = decodeURI(hostAttr);
            host = angular.fromJson(host);

            if (vm.views.checkedHosts == null) {
                vm.views.checkedHosts = [];
            }
            var hasFound = false;
            for (var i in vm.views.checkedHosts) {
                if (vm.views.checkedHosts[i].id == host.id) {
                    hasFound = true;
                    vm.views.checkedHosts.splice(i, 1);//已选定的行，再次点击时取消选定
                    //设置为非全选样式
                    vm.views.checkAllHosts = false;
                    angular.element("#selectAllTableHosts").prop("checked", false);
                }
            }

            if (!hasFound) {
                vm.views.checkedHosts.push(host);
                if (vm.views.checkedHosts.length == vm.views.allHosts.length) {
                    // vm.views.selectAll = true;
                    vm.views.checkAllHosts = true;
                    angular.element("#selectAllTableHosts").prop("checked", true);
                }
            }

            var categoryFound = false;
            //分组时，已选中的数据,每次分组的时候都要置空，并且循环总的数据，如果存在该分组的数据，就将该数据存放到categoryCheckedHosts中
            for (var i in vm.views.categoryCheckedHosts) {
                if (vm.views.categoryCheckedHosts[i].id == host.id) {
                    categoryFound = true;
                    vm.views.categoryCheckedHosts.splice(i, 1);//已选定的行，再次点击时取消选定
                    //设置为非全选样式
                    vm.views.selectAll = false;
                    angular.element("#selectAllTableHosts").prop("checked", false);
                }
            }

            if (!categoryFound) {
                vm.views.categoryCheckedHosts.push(host);
                if (vm.views.categoryCheckedHosts.length == vm.views.tableHosts.length) {
                    vm.views.selectAll = true;
                    angular.element("#selectAllTableHosts").prop("checked", true);
                }
            }
        }

        /**
         * 回显已选中主机
         * 初始化表格的时候，判断主机host是否已经被选（是否存在于vm.views.checkedHosts中）
         * 将已选中的主机放入该分组的已选主机中，如果该分组的已选主机等于该分组总的主机，则全选
         * host ： 被编码后的json字符串
         * vm.views.checkedHosts : 表示已选中的数据
         * vm.views.existingHosts : 表示模板页面传递过来的主机
         *
         * */
        function hasSelected(host) {
            var host = decodeURI(host);
            host = angular.fromJson(host);
            var result = false;
            for (var i in vm.views.checkedHosts) {
                if (host.id == vm.views.checkedHosts[i].id) {
                    result = true;

                    var index = vm.views.categoryCheckedHosts.findIndex(function (v) {
                        return host.id === v.id;
                    });

                    if (index < 0) {
                        vm.views.categoryCheckedHosts.push(host);
                    }

                }
            }
            return result;
        }


        //保存选择
        function save() {
            $uibModalInstance.close({
                action: "confirm",
                selectedHosts: vm.views.checkedHosts,
                index: vm.views.index
            });
        }


        /**
         * datatable全选。
         *  1、首先将全部数据放入allHosts中
         *  2、绑定全选的点击事件，判断是否是全选
         *      2.1、全选，循环allHosts，将未选中的数据选中
         *      2.2、取消全选，循环allHosts，将已选中的数据取消选中
         *      2.3、将表格销毁在重建
         * */
        function addAllHosts(host) {
            var host = angular.fromJson(decodeURI(host));
            var isExit = false;
            for (var i = 0; i < vm.views.allHosts.length; i++) {
                if (vm.views.allHosts[i].id == host.id) {
                    isExit = true;
                    break;
                }
            }
            if (!isExit) {
                vm.views.allHosts.push(host);
            }
        }


    }


})
();
