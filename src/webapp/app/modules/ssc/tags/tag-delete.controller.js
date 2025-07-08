/**
 *
 * @author yangbin@famessoft.com, created on 2022/07/27
 */
(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('udpTagDeleteController', udpTagDeleteController);

    udpTagDeleteController.$inject = ['$uibModalInstance', 'entity', 'messageService','udpTagsService','$translate'];

    function udpTagDeleteController($uibModalInstance, entity, messageService,udpTagsService,$translate) {
        var vm = this;

        vm.tag = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            udpTagsService.deleteTagById(id).then(function () {
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
