/**
 *
 * @author wuqiang@famessoft.com, created on 2020/08/13
 */
(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('tenantParamDetailController', tenantParamDetailController);

    tenantParamDetailController.$inject = ['$scope','$stateParams','paramService','entity','$uibModalInstance'];

    function tenantParamDetailController($scope,$stateParams,paramService,entity,$uibModalInstance) {
        var vm = this;
        vm.clear = clear;
        vm.param = entity;
        var id = entity.id;

        vm.detailSign = true;//标记为详情

        if (id !== null) {
            findById(id);
        }

        function findById(id) {
            paramService.findParamById(id).then(function (data) {
                vm.param = data;
            }).catch(function (err) {
                throw err;
            });
        }

        function clear() {
            $uibModalInstance.close({action: "cancel"});
            $uibModalInstance.dismiss({action: "cancel"});
        }
    }
})();
