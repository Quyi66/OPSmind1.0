/**
 *
 */
(function () {
    'use strict';
    angular.module('oplus.uaa').service('uaaUserService', uaaUserService);

    uaaUserService.$inject = ['$q','$http', '$uibModal'];

    function uaaUserService($q,$http,$uibModal) {
        /**
         * 双人复核弹出框
         *
         *
         */
        this.openUserDoubleReviewDialog = function () {
            var deferred = $q.defer();
            $uibModal.open({
                templateUrl: 'app/modules/uaa/user/user-double-review-dialog.html',
                controller: 'UserDoubleReviewController',
                controllerAs: 'userDoubleReviewVm',
                backdrop: 'static',
                size: 'md'
            }).result.then(function (result) {
                if (result.action != "cancel") {
                    deferred.resolve(result);
                }
            }, function () {
                deferred.reject();
            });
            return deferred.promise;
        }

        /**
         * 检查用户密码/一次性密码是否正确
         * @param type 密码类型，account/otp
         * @param login 用户登录名
         * @param password 密码
         * @returns {*}
         */
        this.validatePassword = function (type,login, password) {
            var deferred = $q.defer();//声明承诺
            $http.post("api/users/validate-password", {type: type, login: login,password:password})
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        this.getTenantUsers = function (tenantId) {
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
    }
})();