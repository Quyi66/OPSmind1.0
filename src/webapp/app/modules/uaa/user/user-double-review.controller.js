(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .controller('UserDoubleReviewController', UserDoubleReviewController);

    UserDoubleReviewController.$inject = [ '$uibModalInstance','currentUser','uaaUserService'];

    function UserDoubleReviewController($uibModalInstance,currentUser,uaaUserService) {
        var vm = this;
        vm.reviewType = "account";
        vm.reviewUsers = [];
        vm.cancel = cancel;
        vm.validate = validate;
        vm.authenticationError = false;
        initReviewUsers();
        function initReviewUsers () {
            uaaUserService.getTenantUsers(currentUser.tenantId).then(function(result){
                vm.reviewUsers = _.filter(result,function(u){ return u.login != currentUser.loginId});
            });
        }

        function validate () {
            uaaUserService.validatePassword(vm.reviewType,vm.reviewUser,vm.password).then(function(result){
                if (result.pass) {
                    $uibModalInstance.close({action:'confirm',reviewUser:vm.reviewUser});
                }
                else {
                    vm.authenticationError = true;
                }
            });
        }

        //取消
        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }
    }
})();
