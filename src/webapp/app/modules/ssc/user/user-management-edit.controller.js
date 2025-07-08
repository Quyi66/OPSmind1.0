(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('UserManagementEditController', UserManagementEditController);

    UserManagementEditController.$inject = ['$stateParams', '$uibModal', '$uibModalInstance', 'User', 'Role', 'Tenant', 'ApiKey', 'appletService', 'tenantUtil', 'messageService', 'currentUser', 'entity', '$translate', 'viewType', '$timeout', '$q', '$scope'];

    function UserManagementEditController($stateParams, $uibModal, $uibModalInstance, User, Role, Tenant, ApiKey, appletService, tenantUtil, messageService, currentUser, entity, $translate, viewType, $timeout, $q, $scope) {
        var vm = this;

        vm.roles = [];
        vm.tenants = [];
        vm.permissions = [];
        vm.applets = [];
        vm.isShowRole = isShowRole;
        vm.qualifiedPswd = true;

        // OTP二维码
        vm.generateQRCode = generateQRCode;
        vm.cancel = cancel;
        vm.userId = entity.id;
        vm.qrcodeUrl = window.$oplus.appConfig.apiBaseUrls.upload + entity.qrcodeImagePath;
        vm.qrcodeStatus = "generating";
        $timeout(initQRCodeStatus(), 0);


        $scope.$watch('vm.user.password', function (newVal, oldVal) {
            var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*><_.-]).{8,32}$/,
                str = newVal;
            if (pattern.test(str)) {
                vm.qualifiedPswd = false;
            } else {
                vm.qualifiedPswd = true;
            }
        }, true);

        function generateQRCode() {
            vm.qrcodeStatus = "generating";
            User.generateQRCode(vm.userId).then(function (user) {
                vm.qrcodeUrl = window.$oplus.appConfig.apiBaseUrls.upload + user.qrcodeImagePath;
                vm.qrcodeStatus = "existed";
            })
        }

        function initQRCodeStatus() {
            if (!vm.qrcodeUrl) {
                vm.qrcodeStatus = "unexisted"
            } else {
                var image = new Image();
                image.src = vm.qrcodeUrl;
                image.onload = function () {
                    vm.qrcodeStatus = "existed"
                };
                image.onerror = function () {
                    vm.qrcodeStatus = "unexisted"
                }
            }
        }

        function initUserApplet(tenantUserId, login) {
            if (!tenantUserId) {
                tenantUserId = "";
            }
            if (!login) {
                login = "";
            }
            appletService.findAppletsByTenantUser(tenantUserId, login).then(function (applets) {
                vm.applets = applets;
            }).catch(function (err) {
                throw err;
            });
        }

        function cancel() {
            $uibModalInstance.close({action: "cancel", qrcodeUrl: vm.qrcodeUrl});
        }

        vm.detailSign = viewType == 'detail' ? true : false;
        console.log("What type? ===", viewType, "---- result Value? ===", vm.detailSign)

        vm.user = entity;
        vm.editPassword = true;
        vm.user.authMode = vm.user.authMode == null ? 'LOCAL' : vm.user.authMode;
        vm.isTenantAdminUI = tenantUtil.isTenantAdminUI();

        if (vm.user.id) {
            vm.editPassword = false;
        }

        vm.clear = clear;
        vm.save = save;


        function init() {
            //Query role and init permissions
            Role.query({isWithPermission: true}, function (roles) {
                if (entity.roles != null && entity.roles.length > 0) {
                    var allRoleMap = {};
                    for (var i in roles) {
                        allRoleMap[roles[i].id] = roles[i];
                    }

                    for (var i in entity.roles) {
                        if (allRoleMap[entity.roles[i].id]) {
                            allRoleMap[entity.roles[i].id].isChecked = true;
                        }
                    }
                }

                vm.roles = roles;
                vm.permissions = collectPermissions(roles);
            });
            initUserApplet(entity.tenantUserId, entity.login);
            //Query tenants
            if (vm.isTenantAdminUI) {
                Tenant.query(null, function (result) {
                    vm.tenants = result;
                });
            }
            // vm.apiKeyTableConfig.reloadData();
        }

        init();


        //超级管理员ROLE_ADMIN不允许分配给租户用户
        function isShowRole(role) {
            if (role.name != "ROLE_ADMIN") {
                return true;
            }

            return entity.tenantId == "$default";
        }

        function collectPermissions(roles) {
            var permissions = [];
            var permissionMap = {};
            for (var i in roles) {
                var role = roles[i];
                if (role.isChecked && role.permissions != null && role.permissions.length > 0) {
                    for (var j in role.permissions) {
                        var permission = role.permissions[j];
                        if (permissionMap[permission.id] == null) {
                            permissions.push(permission);
                            permissionMap[permission.id] = permission;
                        }
                    }
                }
            }

            return permissions;
        }


        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function onSaveSuccess(result) {
            var tenantUserId;
            if (_.isArray(result)) {
                tenantUserId = _.find(result, function(o) { return o.tenantId === currentUser.tenantId; }).tenantUserId;
            } else {
                tenantUserId = result.tenantUserId;
            }
            appletService.saveAppletsByTenantUser(vm.applets, tenantUserId);
            vm.isSaving = false;
            $uibModalInstance.close(result);
            messageService.toast("success", $translate.instant("sys_userManagement.operationSuccess"));
        }

        function onSaveError(result) {
            vm.isSaving = false;
            // console.log(JSON.stringify(result));
            messageService.toast("error", $translate.instant("sys_userManagement.operationError", {msg: result.data.title}));
        }

        function save() {
            if (vm.qualifiedPswd && vm.editPassword) {
                messageService.alert($translate.instant('common.color.warning'), $translate.instant('global.messages.validate.newpassword.qualified'));
                return;
            }

            if (vm.user.password !== vm.confirmPassword) {
                vm.doNotMatch = 'ERROR';
                return;
            }

            // console.log("save vm.user.roles = " + JSON.stringify(vm.user.roles));
            vm.isSaving = true;

            //collect all selected roles
            var selectedRoles = [];
            for (var i in vm.roles) {
                if (vm.roles[i].isChecked) {
                    selectedRoles.push(vm.roles[i]);
                }
            }
            vm.user.roles = selectedRoles;

            if (vm.user.id !== null) {
                User.update(vm.user, onSaveSuccess, onSaveError);
            } else {
                vm.user.tenantIds = vm.tenants.filter(function (tenant) {
                    return tenant.isChecked
                }).map(function (tenant) {
                    return tenant.id
                });
                User.save(vm.user, onSaveSuccess, onSaveError);
            }
        }

        var apiKeyTableColumnConfig = [
            // { data: 'key', title: 'Key' },
            {data: 'name', title: $translate.instant('common.entity.detail.name')},
            {
                data: 'targetApi',
                title: $translate.instant('sys_userManagement.apikey.target_api'),
                render: function (data) {
                    return data.split(',').map(m => {
                        return `<span class="badge bg-secondary">${m}</span>`
                    }).join("</br>")
                }
            },
            {data: 'expireCount', title: $translate.instant("sys_userManagement.apikey.expire_count")},
            {
                data: 'expireTime',
                title: $translate.instant('app_um.user.expired_date'),
                render: function (data) {
                    return !isNaN(Date.parse(data)) ? $$.formatDate(data, 'YYYY-MM-DD HH:mm:ss') : (data === 'expired') ? $translate.instant('jao.approve.detail.expired') : '-----';
                }
            },
            {
                title: $translate.instant('common.action.action'),
                render: function (data, type, row, meta) {
                    var html = ''
                        + '<button type="button" class="btn btn-outline-success rounded-pill btn-sm" ng-click="vm.generateApiKey(\'' + row.id + '\')" title="{{\'jao.job.id_gen.re_generate\'|translate}}"><i class="fa fa-edit"></i> {{\'jao.job.id_gen.re_generate\' | translate}}</button>'
                        + '<button type="button" class="btn btn-outline-secondary rounded-pill btn-sm" ng-click="vm.editApiKey(\'' + row.id + '\')" title="{{\'common.action.edit\'|translate}}"><i class="fa fa-edit"></i> {{\'common.action.edit\' | translate}}</button>'
                        + '<button type="button" ng-if="' + !row.enabled + '" class="btn btn-outline-primary rounded-pill btn-sm ml-1" ng-click="vm.enableApiKey(\'' + row.id + '\')" title="{{\'common.entity.action.enable\'|translate}}"><i class="fa fa-pencil-ruler"></i> {{\'common.entity.action.enable\' | translate}}</button>'
                        + '<button type="button" ng-if="' + row.enabled + '" class="btn btn-outline-warning rounded-pill btn-sm ml-1" ng-click="vm.discardApiKey(\'' + row.id + '\')" title="{{\'common.entity.action.disable\'|translate}}"><i class="fa fa-play-circle"></i> {{\'common.entity.action.disable\' | translate}}</button>'
                        + '<button type="button" class="btn btn-outline-danger rounded-pill btn-sm ml-1" ng-click="vm.deleteApiKey(\'' + row.id + '\')" title="{{\'common.action.delete\'|translate}}"><i class="fa fa-play-circle"></i> {{\'common.action.delete\' | translate}}</button>';
                    return html;
                }
            }
        ]

        vm.apiKeyTableConfig = {
            data: [getPromise],
            columns: apiKeyTableColumnConfig,
            // order: [[1, 'desc']],
            buttons: ['reload']
        }

        function getPromise() {
            var deferred = $q.defer();
            ApiKey.query({id: entity.tenantUserId}, function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        }


        function saveApiKey(id) {
            var row = vm.apiKeyTableConfig.getTableData().find(function (f) {
                return f.id === id
            });

            var modal = $uibModal.open({
                templateUrl: 'app/modules/ssc/user/api-key/api-key-edit-dialog.html',
                controller: 'apiKeyEditDialogCtrl',
                controllerAs: '$ctrl',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    apiKey: [function () {
                        if (id && row) return row;
                        return {
                            tenantUserId: entity.tenantUserId,
                            isEternal: true
                        };
                    }]
                }
            });

            modal.result.then(
                (result) => {
                    if (id && row)
                        ApiKey.update(result, res => {
                            messageService.toast('success', $translate.instant('sys_userManagement.operationSuccess'))
                            vm.apiKeyTableConfig.reloadData()
                        });
                    else
                        ApiKey.save(result, res => {
                            vm.alertKey(Object.values(res.toJSON()).join(''))
                            vm.apiKeyTableConfig.reloadData()
                        });
                }, () => {
                }
            );
        }

        vm.generateApiKey = function (id) {
            ApiKey.generateApiKey(id).then(res => {
                vm.alertKey(res)
            });
        }

        vm.alertKey = function (appkey) {
            messageService.alertSuccess('Success',
                'Please remember your key.</br>' +
                '<code style="word-break: break-all">' + appkey + '</code>'
            );
        }

        vm.applyApiKey = function () {
            saveApiKey()
        }

        vm.editApiKey = function (id) {
            saveApiKey(id)
        }

        vm.deleteApiKey = function (id) {
            messageService.confirmDanger(
                $translate.instant('common.messages.operation.title', {operation: $translate.instant('common.entity.action.delete')}),
                $translate.instant('common.messages.operation.body', {
                    operation: $translate.instant('common.entity.action.delete'),
                    obj: 'ApiKey'
                }),
                function () {
                    ApiKey.delete({id: id}, res => {
                        messageService.toast('success', $translate.instant('sys_userManagement.operationSuccess'))
                        vm.apiKeyTableConfig.reloadData()
                    })
                },
                null,
                $translate.instant('common.messages.operation.ok_label', {operation: $translate.instant('common.entity.action.delete')})
            );

        }

        vm.enableApiKey = function (id) {
            ApiKey.enableApiKey(id).then(res => {
                messageService.toast('success', $translate.instant('sys_userManagement.operationSuccess'))
                vm.apiKeyTableConfig.reloadData()
            })
        }

        vm.discardApiKey = function (id) {
            ApiKey.discardApiKey(id).then(res => {
                messageService.toast('success', $translate.instant('sys_userManagement.operationSuccess'))
                vm.apiKeyTableConfig.reloadData()
            })
        }
    }

})();
