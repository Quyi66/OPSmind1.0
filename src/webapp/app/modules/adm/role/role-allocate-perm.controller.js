(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('RoleAllocatePermController', RoleAllocatePermController);

    RoleAllocatePermController.$inject = ['$scope', '$state', '$q', 'User', 'Role', 'Permission', 'currentUser', 'opDatatable', 'messageService'];

    function RoleAllocatePermController($scope, $state, $q, User, Role, Permission, currentUser, opDatatable, messageService) {
        var vm = this;
        vm.roles = {};

        vm.save = save;
        vm.clear = clear;

        function constructCheckboxHtml(roleId, permissionName) {
            var roleIdWrap = "'" + roleId + "'";
            var permissionNameWrap = "'" + permissionName + "'";
            var dataPath = 'allocatePermVm.roles[' + roleIdWrap + '][' + permissionNameWrap + ']';
            var html =
                '<div class="checkbox checkbox-inline checkbox-primary">' +
                '    <input type="checkbox" name="' + roleId + '-' + permissionName + '"' +
                '           ng-checked="' + dataPath + '"' +
                '           ng-click="' + dataPath + '=!' + dataPath + ';"/>' +
                '<label></label>' +
                '</div>';
            return html;
        }

        function init() {
            prepareColumn().then(function (permissionNames) {
                var tableColumnConfig = [{data: 'permission', title: '权限'}];
                prepareTableData(permissionNames).then(function (data) {
                    vm.dataList = [];
                    permissionNames.forEach(function (permission) {
                        var dataMap = {};
                        dataMap['permission'] = permission;
                        data.forEach(function (role) {
                            dataMap[role.id] = role[permission];
                            vm.roles[role.id] = role;
                        });
                        vm.dataList.push(dataMap);
                    });

                    vm.rolesBackup = _.cloneDeep(vm.roles);

                    data.forEach(function (role) {
                        tableColumnConfig.push({
                            data: role.id, title: role.name, class: 'text-center', orderable: false,
                            render: function (data, type, row, meta) {
                                return constructCheckboxHtml(role.id, row.permission);
                            }
                        });
                    });

                    vm.tableConfig = {
                        data: vm.dataList,
                        columns: tableColumnConfig
                    }

                    // console.dir(permissionNames);
                    // console.dir(tableColumnConfig);
                    // console.dir(data);
                    /*opDatatable.buildTable('.role-perm-table', $scope)
                        .fromData(vm.dataList)
                        .withColumn(tableColumnConfig)
                        .withOption('fixedColumns', {
                            leftColumns: 1
                        })
                        .withOption('scrollY', '350px')
                        .withOption('scrollX', true)
                        .withOption('scrollCollapse', true)
                        .withOption('paging', false)
                        .render();*/
                });
            });
        }

        init();

        function prepareTableData(permissionNames) {
            return Role.query({isWithPermission: true}).$promise.then(function (result) {
                var roles = [];

                for (var i in result) {
                    var role = result[i];
                    if (role.id) {
                        var rowData = {
                            id: role.id
                        };
                        fillRowDataByPermissionName(rowData, permissionNames, role.permissions);
                        rowData.name = role.description;
                        rowData.description = role.description;

                        roles.push(rowData);
                    }
                }

                return roles;
            });
        }

        function fillRowDataByPermissionName(row, allPermissionNames, rolePermissions) {
            for (var i in allPermissionNames) {
                row[allPermissionNames[i]] = false;
            }

            if (rolePermissions) {
                for (var i in rolePermissions) {
                    row[getPermissionName(rolePermissions[i])] = true;
                }
            }
        }

        var permissionMap = {};

        function prepareColumn() {
            var defer = $q.defer();
            Permission.query(function (permissions) {
                var permissionsNames = permissions.map(function (permission) {
                    var name = getPermissionName(permission);
                    permissionMap[name] = permission;
                    return name;
                });

                defer.resolve(permissionsNames);
            });

            return defer.promise;
        }


        function getPermissionName(permission) {
            return permission.domain + ':' + permission.action + ':' + permission.target
        }

        function save() {
            var changedRoles = collectChangeRole();
            if (changedRoles.length) {
                var toUpdateRoles = [];
                changedRoles.forEach(function (role) {
                    var toUpdateRole = {id: role.id, permissions: []};
                    toUpdateRoles.push(toUpdateRole);
                    for (var key in role) {
                        if (key.indexOf(':') != -1 && role[key]) {
                            toUpdateRole.permissions.push(permissionMap[key]);
                        }
                    }
                });
                console.dir(toUpdateRoles);

                Role.updateRolePermissions(toUpdateRoles).then(function () {
                    messageService.toast('success', '保存成功.');
                    $state.go('^', {}, {reload: true});
                }).catch(function () {
                    messageService.toast('error', '保存失败.');
                });
            } else {
                messageService.toast('warning', '没有需要保存的记录.');
            }
            // console.dir(changedUsers)
        }

        function collectChangeRole() {
            var changedRoles = [];
            for (var i in vm.rolesBackup) {
                if (isRoleChanged(vm.rolesBackup[i], vm.roles[i])) {
                    changedRoles.push(vm.roles[i]);
                }
            }

            return changedRoles;
        }

        /**
         * is any property value change
         * @param before
         * @param after
         * @returns {boolean}
         */
        function isRoleChanged(before, after) {
            for (var i in before) {
                if (before[i] !== after[i]) {
                    return true;
                }
            }

            return false;
        }

        function clear() {
            $state.go('^');
        }

    }
})();
