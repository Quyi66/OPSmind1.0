/*!
 *
 *
 * 删除租户用户
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 01/05/2021
 */

(function () {

    /**
     * @ngdoc component
     * @name deleteTenantUser
     * @description  show user delete dialog when click the directive
     * ```html
     * <xxx
     * delete-tenant-user
     * tenant-user-id="${tenantUserId}"
     * onDelete="${onDeleteCallback}">
     * ```
     */
    angular.module('oplus.ssc').directive('deleteTenantUser', function () {
        return {
            restrict: 'A',
            scope: {
                tenantUserId: '@',//租户用户id
                onDelete: '<'//更新回调
            },
            controller: ['$scope', '$element', '$uibModal', 'User',  DeleteTenantUserCtrl],
            controllerAs: 'deleteTenantUserVm'
        }
    });

    //任务协作人选择控制器
    function DeleteTenantUserCtrl($scope, $element, $uibModal, User ) {
        var vm = this;

        function init() {
            // console.log('tenantUserId', $scope.tenantUserId);
            angular.element($element).click(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/ssc/user/user-management-delete.html',
                    controller: 'UserManagementDeleteController',
                    controllerAs: 'vm',
                    size: 'sm',
                    resolve: {
                        entity: ['User', function (User) {
                            return User.get({tenantUserId: $scope.tenantUserId}).$promise;
                        }]
                    }
                }).result.then(function (user) {
                    onDelete(user || {});
                }, function () {
                    onDelete();
                });
            });
        }

        init();

        function onDelete(user) {
            $scope.onDelete && $scope.onDelete(user);
        }
    }
})();


