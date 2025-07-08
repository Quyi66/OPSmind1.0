(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('User', User);

    User.$inject = ['$resource', 'OpUpload', '$q', '$http', '$uibModal'];

    function User($resource, OpUpload, $q, $http, $uibModal) {
        var service = $resource('api/users/:tenantUserId', {}, {
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'save': {method: 'POST', isArray: true},
            'update': {method: 'PUT'},
            'delete': {method: 'DELETE'}
        });

        service.getUserTree = function () {
            var deferred = $q.defer();//声明承诺
            $http.get("api/users/department-tree")
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        service.updateAvatar = function (file, path) {
            // console.log("Run updateAvatar");
            var deferred = $q.defer();//声明承诺
            OpUpload.uploadOrReplace({
                module: 'portal',
                category: 'avatar',
                files: [file],
                path: path,
                updateName: true
            }).then(function (result) {
                var avatarPath = result.data[0].path;

                if (path == undefined || path != avatarPath) {
                    $http.post("api/users/avatar?path=" + avatarPath, {})
                        .success(function (data) {
                            deferred.resolve(avatarPath);//请求成功
                        })
                        .error(function (result) {
                            deferred.reject(result);//请求失败
                        });
                } else {
                    deferred.resolve(avatarPath);//请求成功
                }
            }, function (result) {
                deferred.reject(result);//请求成功
            });

            return deferred.promise;   // 返回承诺
        };

        service.getAllUsersBasicInfo = function (tenantId) {
            var deferred = $q.defer();//声明承诺
            $http.get("api/users/basic" + (tenantId == undefined ? "" : ("?tenantId=" + tenantId)))
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        service.getTenantUsers = function (tenantId) {
            var deferred = $q.defer();//声明承诺
            $http.get("api/users" + (tenantId == undefined || tenantId == null ? "" : ("?tenantId=" + tenantId)))
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };


        service.getNotAssociatedTenantUsers = function (tenantId) {
            var deferred = $q.defer();//声明承诺
            $http.get("api/users/not-associated" + (tenantId == undefined || tenantId == null ? "" : ("?tenantId=" + tenantId)))
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        service.associatedTenantUsers = function (tenantId, userIds) {
            var deferred = $q.defer();//声明承诺
            $http.post("api/users/associate", {tenantId: tenantId, userIds: userIds})
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };


        service.updateTenantUserRoles = function (users) {
            var deferred = $q.defer();//声明承诺
            $http.put("api/users/roles", users)
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };


        /**
         * @description jump an dialog for select user, you can be noticed on every user selection or on dialog closing
         *
         *
         * @param options {object}
         * {
         *  title: {string} 弹出框标题
         *  checkType: {string} checkbox/radio/none,默认值checkbox
         *  filterType: {string} inner/outer/none,过滤方式,默认值inner
         *  default: {Array<User>} 默认选中用户列表，默认值[]，根据User.tenantUserId匹配用户
         *  disabled: {Array<User>} 默认禁止用户列表，默认值[]，根据User.tenantUserId匹配用户
         *  excludeLogin: {boolean} 是否排除当前登录用户，默认值false
         *  expandAll: {boolean} 是否默认展开所有目录，默认值true
         *  onUserSelected: {function(currentSelect:User, totalSelected:Array<User>)} 当选中任意节点时调用此参数
         *}
         *
         *
         * @returns {promise} promise promise.resolve result : {users: {Array<User>}, ids:  {Array<string>}, selectedUser: {User}}.
         * User format {tenantUserId:{string}, name:{string},fullName:{string}}
         *
         * @example
         *
         *  User.openSelectUserDialog({checkType: "radio", title: "选择用户"}).then(function (result) {
         *      var selectedUser = result.selectedUser;
         *      vm.views.selectedUser = selectedUser != null ? selectedUser : vm.views.selectedUser;
         *      queryRoles();
         *  });

         */
        service.openSelectUserDialog = function (options) {
            var deferred = $q.defer();

            $uibModal.open({
                templateUrl: 'app/modules/adm/user/user-select-dialog.html',
                controller: 'OpUserSelectDialogCtrl',
                controllerAs: 'userSelectDialogVm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    params: function () {
                        return options;
                    }
                }
            }).result.then(function (result) {
                if (result.action != "cancel") {
                    deferred.resolve(result);
                }
            }, function () {
                deferred.reject();
            });

            return deferred.promise;
        };

        /**
         * 生成当前用户的qrcode
         * @returns {*}
         */
        service.generateQRCode = function (userId) {
            var deferred = $q.defer();//声明承诺
            $http.patch("api/users/qrcode/" + userId)
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };
        return service;
    }
})();
