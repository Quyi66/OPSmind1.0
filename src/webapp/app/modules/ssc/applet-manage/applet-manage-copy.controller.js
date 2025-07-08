/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('appletManageCopyCtrl', appletManageCopyCtrl);

    appletManageCopyCtrl.$inject = ['$scope', '$state', '$stateParams', '$uibModalInstance', '$translate', 'messageService', 'appletManageService', 'entity', 'currentUser'];

    function appletManageCopyCtrl($scope, $state, $stateParams, $uibModalInstance, $translate, messageService, appletManageService, entity, currentUser) {
        var vm = this;

        vm.applet = entity;
        vm.clear = clear;
        vm.confirmCopy = confirmCopy;

        vm.applet.title = vm.applet.title + ' Copy';
        vm.applet.name = vm.applet.name + 'Copy';

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmCopy() {
            var data = {
                id: vm.applet.id, 
                title: vm.applet.title,
                name: vm.applet.name,
                author: currentUser.displayName,
                createdBy: currentUser.loginId,
                createdName: currentUser.displayName,
                modifiedBy: currentUser.loginId,
                modifiedName: currentUser.displayName,
            }

            appletManageService.copyApplet(data).then(function () {
                messageService.toast("success", $translate.instant("gfs.common.operation_success"));
                $uibModalInstance.close(true);
            }).catch(function (err) {
                messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                $uibModalInstance.close(true);
                throw err;
            });
        }
    }
})();
