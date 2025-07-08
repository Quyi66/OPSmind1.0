/*!
 *
 *
 * 租户用户列表
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 01/05/2021
 */

(function () {

    /**
     * @ngdoc component
     * @name tenantUserList
     * @description show user of per tenant
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
     */
    angular.module('oplus.ssc').component('tenantUserList', {
        templateUrl: 'app/modules/ssc/user/tenant-user-list-component.html',
        replace: true,
        controller: ['$scope', 'currentUser', 'User',  'restUtils','$translate', TenantUserListCtrl],
        controllerAs: 'tenantUserListVm',
        bindings: {
            tenantId: '<',//租户id
            onUpdate: '&'//更新回调
        }
    });

    /**
     *
     * @param $scope
     * @param currentUser
     * @param User
     * @param {restUtils} restUtils
     * @constructor
     */
    function TenantUserListCtrl($scope, currentUser, User,  restUtils,$translate) {
        var vm = this;

        vm.$onInit = function () {
            // initTable(vm.tenantId);

            $scope.$on('TENANT-USER:LINKED', function (event) {
                vm.tableConfig.reloadData();
            });
        };


        vm.onUpdateUser = function (user) {
            if (user) {
                vm.tableConfig.reloadData();
            }
        };

        // var tableOptions;
        var tableColumnConfig = [
            {data: 'login', title: $translate.instant("sys_userManagement.login")},
            {data: 'fullName', title:  $translate.instant("sys_userManagement.fullName")},
            {data: 'department', title:  $translate.instant("sys_userManagement.department")},
            {
                data: 'roles', title: $translate.instant("sys_userManagement.roles"),
                render: function (data, type, user, meta) {
                    var roleContent = "";
                    angular.forEach(user.roles, function (role) {
                        roleContent += '【' + role.description + '】 '
                    });
                    return '<span style="white-space: normal;">' + roleContent + '</span>';
                }
            },
            {
                data: 'authMode', title: $translate.instant("sys_userManagement.authMode"),
                render: function (data, type, user, meta) {
                    var authModeBtn;
                    if (user.authMode == 'AD') {
                        authModeBtn = '<span class="badge bg-info">' + $translate.instant("sys_userManagement.tenantUserList.domainAccount") + '</span>';
                    } else if (user.authMode == 'MIX') {
                        authModeBtn = '<span class="badge bg-info">' + $translate.instant("sys_userManagement.tenantUserList.blend") + '</span>';
                    } else if (user.authMode === 'UN') {
                        authModeBtn = '<span class="badge bg-info">' + $translate.instant("sys_userManagement.tenantUserList.unifiedAuthentication") + '</span>';
                    } else {
                        authModeBtn = '<span class="badge bg-info" >' + $translate.instant("sys_userManagement.tenantUserList.local") + '</span>';
                    }
                    return authModeBtn;
                }
            },
            {data: 'lastModifiedDate', title: $translate.instant("sys_userManagement.lastModificationTime")},
            {
                data: 'id', title: $translate.instant("common.action.action"),
                class: 'text-center',
                searchable: false,
                orderable: false,
                render: function (data, type, user, meta) {
                    return '<div class="btn-group">' +
                        '    <button class="btn btn-default btn-sm" type="button"  view-tenant-user tenant-user-id="' + user.tenantUserId + '">' +
                        '        <span class="hidden-xs hidden-sm" data-translate="common.action.view"></span>' +
                        '    </button>' +
                        '    <button class="btn btn-default btn-sm"  type="button" edit-tenant-user tenant-user-id="' + user.tenantUserId + '" on-update="tenantUserListVm.onUpdateUser">' +
                        '        <span class="hidden-xs hidden-sm" data-translate="common.action.edit"></span>' +
                        '    </button>' +
                        '    <button class="btn btn-danger btn-sm" type="button" delete-tenant-user tenant-user-id="' + user.tenantUserId + '" on-delete="tenantUserListVm.onUpdateUser"' +
                        '            ng-disabled=' + (currentUser.loginId === user.login) + '>' +
                        '        <span class="hidden-xs hidden-sm" data-translate="common.action.delete"></span>' +
                        '    </button>' +
                        '</div>'
                }
            }
        ];
        this.tableConfig = {
            data: function () {
                return restUtils.callAjax('GET', window.$oplus.appConfig.apiBaseUrls.portal + "/api/users" + (vm.tenantId ? ("?tenantId=" + vm.tenantId) : ""));
            },
            columns: tableColumnConfig
        }
    }
})();


