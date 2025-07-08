(function () {
    'use strict';

    angular
        .module('oplus.ssc')
        .controller('TeamDeleteController', TeamDeleteController);

    TeamDeleteController.$inject = ['$uibModalInstance', 'entity', 'Team', '$translate', 'messageService'];

    function TeamDeleteController($uibModalInstance, entity, Team, $translate, messageService) {
        var vm = this;

        vm.team = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete(id) {
            Team.deleteTeamById(id).then(function () {
                messageService.toast("success", $translate.instant('team.deleted'));
                $uibModalInstance.close(true);
            }).catch(function (err) {
                messageService.alertWarning($translate.instant("adm.content.warning"), $translate.instant("adm.content.error"));
                $uibModalInstance.close(true);
                throw err;
            });
        }
    }
})();
