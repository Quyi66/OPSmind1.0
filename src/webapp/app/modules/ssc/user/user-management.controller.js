(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('UserManagementController', UserManagementController);

    UserManagementController.$inject = ['$scope', 'currentUser', 'User', 'Ldap', 'messageService', 'tenantUtil', 'restUtils','$translate'];

    /**
     *
     * @param $scope
     * @param currentUser
     * @param User
     * @param Ldap
     * @param messageService
     * @param tenantUtil
     * @param {restUtils} restUtils
     * @constructor
     */
    function UserManagementController($scope, currentUser, User, Ldap, messageService, tenantUtil, restUtils,$translate) {
        var vm = this;

        vm.isLdapSyncing = false;
        vm.enableSyncLdapUser = window.$oplus.appConfig.modules.uaa && window.$oplus.appConfig.modules.uaa.enableAdLogin && currentUser.hasPermission("sysadmin:*");
        vm.tenantId = currentUser.tenantId;
        vm.isAdminUI = tenantUtil.isOplusAdminUI();

        vm.syncLdapUsers = syncLdapUsers;
        vm.activeUser = activeUser;
        vm.onAddUser = onAddUser;

        var tableColumnConfig = [
            {data: 'login', title: $translate.instant("sys_userManagement.login")},
            {data: 'fullName', title:  $translate.instant("sys_userManagement.fullName")},
            {data: 'department', title:  $translate.instant("sys_userManagement.department")},
            {
                data: 'tenantCodes', title: $translate.instant("adm.tenantName"), bVisible: tenantUtil.isTenantAdminUI(),
                render: function (data, type, user, meta) {
                    var tenantContent = '';
                    if (tenantUtil.isTenantAdminUI()) {
                        var codes = data.split(',');
                        // console.log('code:', data, user.login);
                        angular.forEach(codes, function (code) {
                            if (code !== 'default') {
                                tenantContent = tenantContent + '<a class="badge bg-info text-white me-3">' + code + '</a>';
                            }
                        });
                    }
                    return tenantContent;
                }
            },

            {
                data: 'activated', title: $translate.instant("sys_userManagement.state"), class: 'text-center',
                render: function (data, type, user, meta) {
                    var isDisabled = (currentUser.loginId === user.login);

                    return '<button class="btn btn-danger btn-sm" ng-click=vm.activeUser("' + encodeURI(JSON.stringify(user)) + '",true) ng-show=' + !user.activated + ' data-translate="sys_userManagement.deactivated">' +
                        'Deactivated' +
                        '</button>' +
                        '<button class="btn btn-success btn-sm"  ng-click=vm.activeUser("' + encodeURI(JSON.stringify(user)) + '",false)  ng-show=' + user.activated + ' ng-disabled=' + isDisabled + ' data-translate="sys_userManagement.activated">' +
                        'Activated' +
                        '</button>';
                }
            },
            {
                data: 'authMode', title: $translate.instant("sys_userManagement.authMode"),
                render: function (data, type, user, meta) {
                    var authModeBtn;
                    if (user.authMode === 'AD') {
                        authModeBtn = '<span class="badge bg-info"  data-translate="sys_userManagement.authModeOption.ad">Active Directory</span>';
                    } else if (user.authMode === 'MIX') {
                        authModeBtn = '<span class="badge bg-dark" data-translate="sys_userManagement.authModeOption.adAndLocal">Mixed</span>';
                    } else if (user.authMode === 'UN') {
                        authModeBtn = '<span class="badge bg-warning" data-translate="sys_userManagement.unifiedAuthentication">Unified Authentication</span>';
                    } else {
                        authModeBtn = '<span class="badge bg-info"  data-translate="sys_userManagement.authModeOption.local">Local</span>';
                    }
                    return authModeBtn;
                }
            },
            {
                data: 'roles', title: $translate.instant("sys_userManagement.roles"),
                render: function (data, type, user, meta) {
                    var roleContent = "";
                    angular.forEach(user.roles, function (role) {
                        roleContent += '<label class="badge bg-secondary me-2">' + role.description + '</label>'
                    });
                    return '<span style="white-space: normal;">' + roleContent + '</span>';
                }
            },
            {data: 'lastModifiedDate', title: $translate.instant("sys_userManagement.lastModificationTime")},
            {
                data: 'id', title: $translate.instant("common.action.action"),
                searchable: false,
                render: function (data, type, user, meta) {

                    var param = angular.toJson({tenantUserId: user.tenantUserId,viewType: 'edit'});
                    var param2 = angular.toJson({tenantUserId: user.tenantUserId,viewType: 'detail'});
                    var isDisableDelete = (currentUser.loginId == user.login);
                    return '    <button type="submit"\n' +
                        '            ui-sref=app.ssc.user.edit(' + param2 + ')' +
                        '            class="btn btn-default btn-sm"><i class="fa fa-view"></i>' +
                        '        <span class="hidden-xs hidden-sm" data-translate="common.action.view"></span>' +
                        '    </button>\n' +
                        '    <button type="submit"\n' +
                        '            ui-sref=app.ssc.user.edit(' + param + ')' +
                        '            class="btn btn-default btn-sm">' +
                        '        <span class="hidden-xs hidden-sm" data-translate="common.action.edit"></span>' +
                        '    </button>\n' +
                        '    <button type="submit"' +
                        '            ui-sref=app.ssc.user.delete(' + param + ')' +
                        '            class="btn btn-danger btn-sm"\n' +
                        '            ng-disabled=' + isDisableDelete + '>' +
                        '        <span class="hidden-xs hidden-sm" data-translate="common.action.delete"></span>' +
                        '    </button>';
                }
            }
        ];
        vm.tableConfig = {
            data: function () {
                var tenantId = currentUser.tenantId;
                var countByTenant = tenantUtil.isTenantAdminUI();
                return restUtils.callAjax('GET', window.$oplus.appConfig.apiBaseUrls.portal + "/api/users"
                    + (tenantId ? ("?tenantId=" + tenantId) : "")
                    + (countByTenant ? ((tenantId ? '&' : '?') + "statistics=true") : ""))
            },
            columns: tableColumnConfig
        }

        function onAddUser(users) {
            if (users) {
                reloadTable();
            }
        }

        function reloadTable() {
            vm.tableConfig.reloadData();
        }

        function activeUser(stringUser, isActivated) {
            var user = JSON.parse(decodeURI(stringUser));
            user.activated = isActivated;
            User.update(user, function () {
                reloadTable();
            });
        }

        function syncLdapUsers() {
            messageService.confirm($translate.instant("sys_userManagement.operationConfirm"), $translate.instant("sys_userManagement.confirmSynchronizing"), function () {
                vm.isLdapSyncing = true;
                Ldap.syncLdapUsers(function (data) {
                    messageService.toast('success', $translate.instant("sys_userManagement.synchronizingSuccess"));
                    vm.isLdapSyncing = false;
                    reloadTable();
                }, function (error) {
                    vm.isLdapSyncing = false;
                    messageService.alertError($translate.instant("sys_userManagement.error"), angular.toJson(error.data));
                })
            });
        }
    }
})();
