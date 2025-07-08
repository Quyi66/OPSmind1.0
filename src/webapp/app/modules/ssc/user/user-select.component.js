/*!
 * 用户树，按照用户部门层级关系组织。
 * 支持单选和多选
 * 支持选中通知和主动获取当前已选择
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 03/05/2018
 */

(function () {

    /**
     * @ngdoc component
     * @name opUserSelectTree
     * @description Organize all users in a tree structure, you can select in single or multiple way.
     * you can be noticed on every select action. Or proactively get the currently selected users.
     *
     * ```html
     * <op-user-select-tree
     * checkType="checkbox"
     * filterType="inner"
     * default="vm.defaultSelected"
     * disabled="vm.defaultDisabled"
     * excludeLogin=false
     * expandAll=false
     * onSelect="vm.onUserSelect"
     * getSelectedHook="vm.getSelectedUsers">
     * ```
     * ```js
     * function onUserSelect(currentSelect, totalSelected){
     *
     * }
     *
     * function getSelectedUsers(getUserFn){
     *
     *     //{ids: selectedUserIds, users: selectedUsers, selectedUser: selectedUsers[0]}
     *     //selectedUser property is used for single select to get the selected user quickly
     *     var currentSelectObj = getUserFn();
     * }
     * ```
     */
    angular.module('oplus.ssc').component('opUserSelectTree', {
        templateUrl: 'app/modules/ssc/user/user-select-component.html',
        replace: true,
        controller: ['$scope', 'currentUser', 'User', UserSelectCtrl],
        controllerAs: 'opUserSelectVm',
        bindings: {
            checkType: '<',//checkbox(多选)/radio(单选)/none(不做选择)，默认值checkbox
            filterType: '<',//过滤方式：inner/outer/none，默认值inner
            filterContent: "<",//外部过滤条件，filterType='outer'生效
            default: '<',//默认选中用户列表，默认值[]
            disabled: '<',//默认禁止用户列表，默认值[]
            excludeLogin: '<',//是否排除当前登录用户，默认值false
            expandAll: '<',//是否展开所有，默认值true
            onSelect: '&',//任意节点被选中后，执行此函数， onSelect(currentSelect, totalSelected)
            getSelectedHook: '&'//函数的包装函数，用于主动获取当前已选元素 return {ids:xxx, users:xxx};
        }
    });

    //任务协作人选择控制器
    function UserSelectCtrl($scope, currentUser, User) {
        var vm = this;

        vm.views = {
            filterContent: '',
            departmentTreeId: "opUserSelectTree" + new Date().getMilliseconds(),
            filterUser: filterUser
        };

        var treeSelector = "#" + vm.views.departmentTreeId;
        var userList = null;//后端返回的原始数据
        var allUserMapping = {};//用户id和用户的映射
        var selectedUserIds = [];//已选用户,默认选中
        var disabledUserIds = {};//禁止用户不能勾选
        var excludeUserIds = [];//被排除用户，不会显示
        var isReloading = false;//标志是否正在重载，避免重复
        var isMultiTenant = window.$oplus.appConfig.useMultiTenant;

        vm.$onInit = function () {
            // console.log("Run opUserSelectTree $onInit");

            vm.checkType = vm.checkType == undefined ? "checkbox" : vm.checkType;
            vm.filterType = vm.filterType == undefined ? "inner" : vm.filterType;
            vm.expandAll = !!vm.expandAll;
            vm.default = vm.default || [];
            vm.disabled = vm.disabled || [];

            if (vm.excludeLogin) {
                excludeUserIds.push(isMultiTenant ? currentUser.tenantUserId : currentUser.id);
            }

            selectedUserIds = vm.default.map(function (user) {
                return isMultiTenant ? user.tenantUserId : user.id;
            });

            console.log("selectedUserIds = " + JSON.stringify(selectedUserIds));
            disabledUserIds = vm.disabled.map(function (user) {
                return isMultiTenant ? user.tenantUserId : user.id;
            });

            initTree();

            if (vm.filterType == "outer") {
                $scope.$watch("opUserSelectVm.filterContent", function () {
                    if (vm.filterContent != undefined) {
                        filterUser();
                    }
                });
            }

            vm.getSelectedHook()(getSelectedUsers);
        };

        var treeOption = {
            checkbox: true,
            extensions: ["glyph", "wide", "filter"],
            source: [],
            selectMode: 3,
            glyph: {
                preset: "awesome5",
                map: {
                    folder: "far fa-folder",
                    folderOpen: "far fa-folder-open",
                    doc: "far fa-user",
                    docOpen: "fas fa-user"
                }
            },
            filter: {  // override default settings
                counter: false, // No counter badges
                mode: "hide",  // "dimm": Grayout unmatched nodes, "hide": remove unmatched nodes
                autoExpand: true,
                leavesOnly: true
            },
            select: function (event, data) {//选择或取消选择
                $scope.$apply(function () {
                    vm.onSelect()(data.node.data, getSelectedUsers().users);
                });
            }
        };

        function initTree() {
            // console.log("Run initTree");
            if (vm.checkType == 'checkbox') {
                treeOption.checkbox = true;
                treeOption.selectMode = 3;
            } else if (vm.checkType == 'radio') {
                treeOption.checkbox = 'radio';
                treeOption.selectMode = 1;
            } else if (vm.checkType == 'none') {
                treeOption.checkbox = false;
            }

            User.getUserTree().then(function (result) {
                userList = result;
                treeOption.source = convertTreeData(result);
                $(treeSelector).fancytree(treeOption);
            });
        }


        //重新渲染树
        function reloadTree() {
            if (isReloading) {
                return;
            }
            isReloading = true;

            selectedUserIds = vm.default.map(function (user) {
                return isMultiTenant ? user.tenantUserId : user.id;
            });

            disabledUserIds = vm.disabled.map(function (user) {
                return isMultiTenant ? user.tenantUserId : user.id;
            });

            //重新生成tree data
            treeOption.source = convertTreeData(userList);

            var tree = $(treeSelector).fancytree("getTree");
            //取消已选
            tree.visit(function (node) {
                node.setSelected(false);
            });
            tree.reload(treeOption.source);
            // console.log("..............   Run reloadTree start   ..............");

            isReloading = false;
        }

        //过滤用户
        function filterUser() {
            $(treeSelector).fancytree("getTree").filterNodes(vm.views.filterContent);
        }

        //嵌套转换，初始化数据
        function convertTreeData(rawData) {
            // console.log("Run convertTreeData");
            var nodeList = [];
            rawData.forEach(function (user) {
                var tenantUserId = isMultiTenant ? user.tenantUserId : user.id;
                if (_.indexOf(excludeUserIds, tenantUserId) == -1) {//跳过排除用户
                    var node = {
                        key: tenantUserId,
                        type: user.type,
                        selected: _.indexOf(selectedUserIds, tenantUserId) != -1,
                        unselectable: _.indexOf(disabledUserIds, tenantUserId) != -1,
                        title: user.type == "folder" ? user.name : user.fullName,
                        data: user
                    };

                    //收集所有用户
                    allUserMapping[tenantUserId] = user;
                    nodeList.push(node);

                    //处理文件夹
                    if (user.type == "folder") {
                        node.folder = true;
                        node.expanded = vm.expandAll;
                        if (vm.checkType == 'radio') {
                            node.checkbox = false;
                        }

                        var children = [];
                        if (user.children != null && user.children.length > 0) {
                            // console.log("Parent Node name = " + user.name);
                            node.children = convertTreeData(user.children);
                        }
                    }
                }
            });

            return nodeList;
        }

        function getSelectedUsers() {
            var selectedUsers = [];
            $(treeSelector).fancytree("getTree").findAll(function (node) {
                if (node.isSelected()) {
                    selectedUsers.push(node.data);
                }
            });

            selectedUserIds = selectedUsers.map(function (user) {
                return isMultiTenant ? user.tenantUserId : user.id;
            });
            // console.log("selectedUserIds = " + selectedUserIds.length);
            return {ids: selectedUserIds, users: selectedUsers, selectedUser: selectedUsers[0]};
        }
    }
})();


