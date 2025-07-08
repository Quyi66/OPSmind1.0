(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .controller('PasswordController', PasswordController);

    PasswordController.$inject = ['Auth', '$uibModalInstance', 'messageService','$scope','$translate'];

    function PasswordController(Auth, $uibModalInstance, messageService,$scope,$translate) {
        var vm = this;

        vm.changePassword = changePassword;
        vm.cancel = cancel;
        vm.doNotMatch = null;
        vm.error = null;
        vm.success = null;
        vm.qualifiedPswd = true;

        $scope.$watch('passwordVm.password', function (newVal, oldVal) {
            var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*><_.-]).{8,32}$/,
                str = newVal;
            if(pattern.test(str)){
                vm.qualifiedPswd = false;
            }else{
                vm.qualifiedPswd = true;
            }
        }, true);

        function changePassword() {
            if(vm.qualifiedPswd){
                messageService.alert($translate.instant('common.color.warning'), $translate.instant('global.messages.validate.newpassword.qualified'));
                return;
            }

            if (vm.password !== vm.confirmPassword) {
                vm.error = null;
                vm.success = null;
                vm.doNotMatch = 'ERROR';
            } else {
                vm.doNotMatch = null;
                Auth.changePassword(vm.password).then(function () {
                    vm.error = null;
                    vm.success = 'OK';

                    messageService.toast("success", "密码修改成功");
                    $uibModalInstance.close({action: "save"});
                }).catch(function () {
                    vm.success = null;
                    vm.error = 'ERROR';
                });
            }
        }


        //取消
        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }
    }
})();
