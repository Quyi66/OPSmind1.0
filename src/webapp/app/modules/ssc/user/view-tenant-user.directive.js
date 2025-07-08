/*!
 *
 *
 * 编辑租户用户
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 01/05/2021
 */

(function () {

    /**
     * @ngdoc component
     * @name viewTenantUser
     * @description  show user detail dialog when click the directive
     * ```html
     * <xxx
     * view-tenant-user
     * tenant-user-id="${tenantUserId}"
     * onCancel="${onCancelCallback}">
     * ```
     */
    angular.module('oplus.ssc').directive('viewTenantUser', function () {
        return {
            restrict: 'A',
            scope: {
                tenantUserId: '@',//租户用户id
                onUpdate: '<'//更新回调
            },
            controller: ['$scope', '$element', '$uibModal', 'User', ViewTenantUserCtrl],
            controllerAs: 'viewTenantUserVm'
        }
    });

    //任务协作人选择控制器
    function ViewTenantUserCtrl($scope, $element, $uibModal, User) {
        var vm = this;

        function init() {
            // console.log('tenantUserId', $scope.tenantUserId);
            angular.element($element).click(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/ssc/user/user-management-detail.html',
                    controller: 'UserManagementDetailController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['User', function (User) {
                            return User.get({tenantUserId: $scope.tenantUserId}).$promise;
                        }]
                    }
                }).result.then(function (user) {
                    onCancel(user || {});
                }, function () {
                    onCancel();
                });
            });
        }

        init();

        function onCancel(user) {
            $scope.onCancel && $scope.onCancel(user);
        }
    }
})();


