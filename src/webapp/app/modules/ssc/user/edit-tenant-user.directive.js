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
     * @name editTenantUser
     * @description  show user edit dialog when click the directive
     * parameter of onUpdate can be null(cancel) or User object(save)
     * ```html
     * <xxx
     * edit-tenant-user
     * tenant-user-id="${tenantUserId}"
     * onUpdate="${onUpdateCallback}">
     * ```
     */
    angular.module('oplus.ssc').directive('editTenantUser', function () {
        return {
            restrict: 'A',
            scope: {
                tenantUserId: '@',//租户用户id
                onUpdate: '<'//更新回调
            },
            controller: ['$scope', '$element', '$uibModal', 'User',  EditTenantUserCtrl],
            controllerAs: 'editTenantUserVm'
        }
    });

    //任务协作人选择控制器
    function EditTenantUserCtrl($scope, $element, $uibModal, User ) {
        var vm = this;

        function init() {
            // console.log('tenantUserId', $scope.tenantUserId);
            angular.element($element).click(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/ssc/user/user-management-edit.html',
                    controller: 'UserManagementEditController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entity: ['User', function (User) {
                            return User.get({tenantUserId: $scope.tenantUserId}).$promise;
                        }],
                        viewType: function () {
                            return 'directive-edit';
                        }
                    }
                }).result.then(function (user) {
                    onUpdate(user || {});
                }, function () {
                    onUpdate();
                });
            });
        }

        init();

        function onUpdate(user) {
            $scope.onUpdate && $scope.onUpdate(user);
        }
    }
})();


