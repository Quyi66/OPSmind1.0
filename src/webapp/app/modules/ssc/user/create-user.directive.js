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
     * @name createUser
     * @description  show user link dialog when click the directive
     * parameter of onUpdate can be null(cancel) or User objects(save)
     * ```html
     * <xxx
     * link-tenant-user
     * tenant-id="${tenantId}"
     * onUpdate="${onUpdateCallback}">
     * ```
     */
    angular.module('oplus.ssc').directive('createUser', function () {
        return {
            restrict: 'A',
            scope: {
                tenantId: '@',//租户用户id
                onUpdate: '<'//更新回调
            },
            controller: ['$scope', '$element', '$uibModal', CreateUserCtrl],
            controllerAs: 'createUserVm'
        }
    });

    //任务协作人选择控制器
    function CreateUserCtrl($scope, $element, $uibModal) {
        var vm = this;

        function init() {
            // console.log('tenantId', $scope.tenantId);
            angular.element($element).click(function () {
                $uibModal.open({
                    templateUrl: 'app/modules/ssc/user/user-management-edit.html',
                    controller: 'UserManagementEditController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        tenantId: function () {
                            return $scope.tenantId;
                        },
                        entity: function () {
                            //firstName: null, lastName: null,
                            return {
                                id: null,
                                tenantId: $scope.tenantId,
                                login: null,
                                fullName: null,
                                email: null,
                                authMode: 'LOCAL',
                                activated: true,
                                langKey: null,
                                createdBy: null,
                                createdDate: null,
                                lastModifiedBy: null,
                                lastModifiedDate: null,
                                resetDate: null,
                                resetKey: null,
                                roles: null
                            };
                        },
                        viewType: function () {
                            return 'directive-create';
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


