(function () {
    'use strict';

    var oplusAppModule = angular.module('oplus.layout');

    oplusAppModule.controller('AdminHomeCtrl', AdminHomeCtrl);
    AdminHomeCtrl.$inject = ['$scope', 'currentUser', '$state', '$timeout', 'messageService', 'tenantUtil'];

    function AdminHomeCtrl($scope, currentUser, $state, $timeout, messageService, tenantUtil) {
        var vm = this;

        vm.isLoading = true;
        vm.homeType = window.$oplus.appConfig.ui.homeType;
        vm.pageCode = window.$oplus.appConfig.ui.homePageCode;
        vm.isTenantAdminUI = tenantUtil.isTenantAdminUI();

        //等待租户配置准备完成
        $timeout(function () {
            // console.dir(window.$oplus.appConfig.ui);
            if (currentUser.isAuthenticated) {
                //同一自定义页面没办法在管理系统和租户系统复用
                if (vm.isTenantAdminUI) {
                    vm.homeType = 'default';
                }

                vm.isLoading = false;
            }
        });
    }
})();
