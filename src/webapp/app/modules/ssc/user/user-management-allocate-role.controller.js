(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('UserManagementAllocateRoleController', UserManagementAllocateRoleController);

    UserManagementAllocateRoleController.$inject = ['$scope', '$state', '$q', 'User', 'Role', 'tenantUtil', 'currentUser', 'opDatatable', 'messageService', '$translate'];

    function UserManagementAllocateRoleController($scope, $state, $q, User, Role, tenantUtil, currentUser, opDatatable, messageService, $translate) {
        var vm = this;
        vm.users = {};

        vm.save = save;
        vm.clear = clear;

        function constructCheckboxHtml(tenantUserId, roleName) {
            var tenantUserIdWrap = "'" + tenantUserId + "'";
            var roleNameWrap = "'" + roleName + "'";
            var dataPath = 'allocateRoleVm.users[' + tenantUserIdWrap + '][' + roleNameWrap + ']';
            var html =
                '<div class="checkbox checkbox-inline checkbox-primary">' +
                '    <input type="checkbox" name="' + tenantUserId + '-' + roleName + '"' +
                '           ng-checked="' + dataPath + '"' +
                '           ng-click="' + dataPath + '=!' + dataPath + ';"/>' +
                '<label></label>' +
                '</div>';
            return html;
        }

        function init() {
            prepareColumn().then(function (roleNames) {
                var tableColumnConfig = [{data: 'fullName', title: $translate.instant("sys_userManagement.username")}];
                for (var i in roleNames) {
                    var name = roleNames[i];
                    //租户系统不允许分配管理员角色
                    if (name !== 'ROLE_ADMIN' || tenantUtil.isOplusAdminUI()) {
                        (function (name) {
                            tableColumnConfig.push({
                                data: name, title: roleMap[name].description, class: 'text-center', orderable: false,
                                render: function (data, type, user, meta) {

                                    return constructCheckboxHtml(user.tenantUserId, name);
                                }
                            });
                        })(name);
                    }
                }

                prepareTableData(roleNames).then(function (data) {
                    data.forEach(function (user) {
                        vm.users[user.tenantUserId] = user;
                    });
                    vm.usersBackup = _.cloneDeep(vm.users);

                    // console.dir(roleNames);
                    // console.dir(tableColumnConfig);
                    // console.dir(data);
                    vm.tableConfig = {
                        data: data,
                        columns: tableColumnConfig
                    }
                    // opDatatable.buildTable('.user-role-table', $scope)
                    //     .fromData(data)
                    //     .withColumn(tableColumnConfig)
                    //     .withOption('fixedColumns', {
                    //         leftColumns: 1
                    //     })
                    //     .withOption('scrollY', '350px')
                    //     .withOption('scrollX', true)
                    //     .withOption('scrollCollapse', true)
                    //     .withOption('paging', false)
                    //     .render();
                });
            });
        }

        init();

        function prepareTableData(roleNames) {
            return User.getTenantUsers(currentUser.tenantId).then(function (result) {
                var users = [];
                for (var i in result) {
                    var user = result[i];
                    var rowData = {
                        tenantUserId: user.tenantUserId
                    };
                    fillRowDataByRoleName(rowData, roleNames, user.roles);
                    rowData.login = user.login;
                    rowData.fullName = user.fullName;

                    users.push(rowData);
                }

                return users;
            });
        }

        function fillRowDataByRoleName(row, allRoleNames, userRoles) {
            for (var i in allRoleNames) {
                row[allRoleNames[i]] = false;
            }

            if (userRoles) {
                for (var i in userRoles) {
                    row[userRoles[i].name] = true;
                }
            }
        }

        var roleMap = {};

        function prepareColumn() {
            var defer = $q.defer();
            Role.query({}, function (roles) {
                var roleNames = roles.map(function (role) {
                    var name = role.name;
                    roleMap[name] = role;
                    return name;
                });

                defer.resolve(roleNames);
            });

            return defer.promise;
        }


        function save() {
            var changedUsers = collectChangeUser();
            if (changedUsers.length) {
                var toUpdateUsers = [];
                changedUsers.forEach(function (user) {
                    var toUpdateUser = {tenantUserId: user.tenantUserId, roles: []};
                    toUpdateUsers.push(toUpdateUser);
                    for (var key in user) {
                        if (key.indexOf('ROLE') != -1 && user[key]) {
                            toUpdateUser.roles.push(roleMap[key]);
                        }
                    }
                });

                console.dir(toUpdateUsers);

                User.updateTenantUserRoles(toUpdateUsers).then(function () {
                    messageService.toast('success', $translate.instant("sys_userManagement.preservationSuccess"));
                    $state.go('^', {}, {reload: true});
                }).catch(function () {
                    messageService.toast('error', $translate.instant("sys_userManagement.preservationError"));
                });
            } else {
                messageService.toast('warning', $translate.instant("sys_userManagement.notPreservation"));
            }
            // console.dir(changedUsers)
        }

        function collectChangeUser() {
            var changedUsers = [];
            for (var i in vm.usersBackup) {
                if (isUserChanged(vm.usersBackup[i], vm.users[i])) {
                    changedUsers.push(vm.users[i]);
                }
            }

            return changedUsers;
        }

        /**
         * is any property value change
         * @param before
         * @param after
         * @returns {boolean}
         */
        function isUserChanged(before, after) {
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
