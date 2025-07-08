/*!
 *
 *
 * 关联基础用户到租户
 *
 * @author Joker liu (qdjoker@hpcmb.com), created on 01/05/2021
 */

(function () {

    /**
     * @ngdoc component
     * @name linkTenantUser
     * @description  show user link dialog when click the directive
     * parameter of onUpdate can be null(cancel) or User objects(save)
     * ```html
     * <xxx
     * link-tenant-user
     * tenant-id="${tenantId}"
     * onUpdate="${onUpdateCallback}">
     * ```
     */
    angular.module('oplus.ssc').directive('linkTenantUser', function () {
        return {
            restrict: 'A',
            scope: {
                tenantId: '@',//租户用户id
                onUpdate: '<'//更新回调
            },
            controller: ['$scope', '$element', '$uibModal', 'User',  LinkTenantUserCtrl],
            controllerAs: 'linkTenantUserVm'
        }
    });

    //任务协作人选择控制器
    function LinkTenantUserCtrl($scope, $element, $uibModal, User ) {
        var vm = this;

        function init() {
            // console.log('tenantId', $scope.tenantId);
            angular.element($element).click(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/ssc/user/user-management-link-tenant-user.html',
                    controller: 'LinkTenantUserController',
                    controllerAs: 'addTenantUserVm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tenantId: function () {
                            return $scope.tenantId;
                        },
                        onAddUser: function () {
                            return onUpdate;
                        }
                    }
                }).result.then(function (users) {
                    onUpdate(users || []);
                }, function () {
                    onUpdate();
                });
            });
        }

        init();

        function onUpdate(users) {
            $scope.onUpdate && $scope.onUpdate(users);
        }
    }
})();


