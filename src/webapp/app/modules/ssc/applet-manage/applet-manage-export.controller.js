/**
 *
 * @author yangbin@famessoft.com, created on 2023/10/08
 */
(function () {
    'use strict';

    angular.module('oplus.ssc').controller('appletManageExportCtrl', appletManageExportCtrl);

    appletManageExportCtrl.$inject = ['$scope',
         '$uibModalInstance',  'messageService',
         'appletManageService',  '$filter', 'ids'];

    function appletManageExportCtrl($scope, $uibModalInstance, messageService,
                                     appletManageService, $filter, ids) {
        var vm = this;
        vm.doExport = doExport;
        vm.cancelExport = cancelExport;
        vm.containsScript = false;

        function cancelExport() {
            $uibModalInstance.dismiss();
        }
        function doExport() {
            var appletVm = {
                "appletIds": ids,
                "containsScript":  vm.containsScript
            }
            var currentTime = $filter('date')(new Date(), "yyyyMMddHHmmss");
            appletManageService.exportAppletByIds(appletVm , currentTime);
            $uibModalInstance.close(true);
        }
    }
})();
