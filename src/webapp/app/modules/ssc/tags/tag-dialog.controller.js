/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('udpTagDialogController', udpTagDialogController);

    udpTagDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'udpTagsService', 'entity'];

    function udpTagDialogController($timeout, $scope, $stateParams, $uibModalInstance, udpTagsService, entity) {
        var vm = this;
        vm.clear = clear;
        vm.tag = entity;
        var id = entity.id;
        vm.save = save;
        $timeout(function () {
            angular.element('.form-group:eq(0)>input').focus();
        });


        function clear() {
            $uibModalInstance.close({action: "cancel"});
            $uibModalInstance.dismiss({action: "cancel"});
        }

        function save() {
            vm.isSaving = true;
            udpTagsService.saveTag(vm.tag).then(function (result) {
                onSaveSuccess(result);
                onSaveError();
            }).catch(function (err) {
                onSaveError();
                throw err;
            });
        }

        function onSaveSuccess(result) {
            $uibModalInstance.close({action: "save"});
            vm.isSaving = false;
        }

        function onSaveError() {
            vm.isSaving = false;
        }
    }
})();
