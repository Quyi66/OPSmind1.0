/**
 * @Auther: zml
 * @Date: 2018/5/3
 */
(function () {
    var cacModule = angular.module('oplus.cac');
    cacModule.controller('CacResultOutputLogCtrl', CacResultOutputLogCtrl);
    CacResultOutputLogCtrl.$inject = ['cacService', 'cacResultService', 'entity', '$uibModal', '$uibModalInstance'];

    function CacResultOutputLogCtrl(cacService, cacResultService, entity, $uibModal, $uibModalInstance) {

        var vm = this;

        vm.views = {
            id: entity.id,
            cancel: cancel,
            output: {}
        };


        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        function init() {
            cacResultService.queryOutput(vm.views.id).then(function (data) {
                vm.views.output = data;
                /*if (vm.views.output.jobResult == null || vm.views.job.jobResult == "") {
                    vm.views.isResult = true;
                }*/
            }).catch(function (err) {
                throw err;
            });

        }

        init();
    }
})
();
