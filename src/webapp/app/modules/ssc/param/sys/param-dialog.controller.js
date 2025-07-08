(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('SscParamDialogController', ParamDialogController);

    ParamDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Param'];

    function ParamDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, Param) {
        var vm = this;

        vm.param = entity;
        vm.clear = clear;
        vm.save = save;

        $timeout(function () {
            angular.element('.form-group:eq(0)>input').focus();

            if (vm.param.useJsonEditor) {
                // create the editor
                var container = angular.element("#jsoneditor")
                vm.editor = new JSONEditor(container[0], {
                    sensitiveDataLabel: vm.param.sensitiveFields.split(','),
                    enableSort: false,
                    enableTransform: false,
                    limitDragging: true,
                })
                vm.editor.set(angular.fromJson(vm.param.value))
            }
            

        });

        if (vm.param.id && 1 === vm.param.isEncrypt) {
            $scope.secret = 1;
        } else if (!vm.param.id) {
            vm.param.isEncrypt = 0;
        }

        function clear() {
            $uibModalInstance.dismiss({action: "cancel"});
        }

        function save() {

            vm.isSaving = true;

            // get json
            if (vm.param.useJsonEditor) {
                vm.param.value = angular.toJson(vm.editor.get());
            }
            
            if (vm.param.id !== null) {
                Param.update(vm.param, onSaveSuccess, onSaveError);
            } else {
                Param.save(vm.param, onSaveSuccess, onSaveError);
            }
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
