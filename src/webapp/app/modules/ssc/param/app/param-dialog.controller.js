/**
 *
 * @author wuqiang@famessoft.com, created on 2020/08/12
 */
(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('tenantParamDialogController', tenantParamDialogController);

    tenantParamDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'paramService', 'entity'];

    function tenantParamDialogController($timeout, $scope, $stateParams, $uibModalInstance, paramService, entity) {
        var vm = this;
        vm.clear = clear;
        vm.param = entity;
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
            paramService.saveParam(vm.param).then(function (result) {
                onSaveSuccess(result);
                onSaveError();
            }).catch(function (err) {
                onSaveError();
                throw err;
            });
        }

        if (id !== null) {
            paramService.findParamById(id).then(function (data) {
                return vm.param = data;
            }).catch(function (err) {
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
