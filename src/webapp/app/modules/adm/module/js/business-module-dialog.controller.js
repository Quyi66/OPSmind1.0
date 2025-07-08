(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('BusinessModuleDialogController', BusinessModuleDialogController);

    BusinessModuleDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'BusinessModule'];

    function BusinessModuleDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, BusinessModule) {
        var vm = this;

        vm.businessModule = entity;
        vm.clear = clear;
        vm.save = save;

        $timeout(function () {
            angular.element('.form-group:eq(0)>input').focus();
        });

        function init() {
        }

        init();

        function clear() {
            $uibModalInstance.dismiss({action: "cancel"});
        }

        function save() {

            vm.isSaving = true;

            // console.log("businessModule = " + JSON.stringify(vm.businessModule));
            var allElements = vm.businessModule.elements;
            if (allElements != undefined && allElements.length > 0) {
                var activeElements = [];
                allElements.filter(function (element) {
                    return !!element.isRemoved;
                });
                vm.businessModule.elements = activeElements;
            }

            if (vm.businessModule.id !== null) {
                BusinessModule.update(vm.businessModule, onSaveSuccess, onSaveError);
            } else {
                BusinessModule.save(vm.businessModule, onSaveSuccess, onSaveError);
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
