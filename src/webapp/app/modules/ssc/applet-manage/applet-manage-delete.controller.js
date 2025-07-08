/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('appletManageDeleteCtrl', appletManageDeleteCtrl);

    appletManageDeleteCtrl.$inject = ['$scope', '$state', '$stateParams', '$uibModalInstance', '$translate', 'messageService', 'appletManageService', 'entity'];

    function appletManageDeleteCtrl($scope, $state, $stateParams, $uibModalInstance, $translate, messageService, appletManageService, entity) {
        var vm = this;

        vm.applet = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            appletManageService.deleteAppletById(id).then(function () {
                messageService.toast("success", $translate.instant("adm.content.delete_success"));
                $uibModalInstance.close(true);
            }).catch(function (err) {
                messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                $uibModalInstance.close(true);
                throw err;
            });
        }
    }
})();
