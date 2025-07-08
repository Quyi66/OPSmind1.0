(function () {
    'use strict';

    angular.module('oplus.uaa')
        .controller('LicenseRegisterCtrl', LicenseRegisterCtrl);

    LicenseRegisterCtrl.$inject = ['$scope', '$uibModal', 'messageService','licenseService', 'msg'];

    function LicenseRegisterCtrl($scope, $uibModal, messageService,licenseService, msg) {

        var that = this;
        that.register = register;
        that.close = close;
        that.cancel = cancel;
        that.msg = msg;

        that.ngf = {
            pattern: '', maxSize: '1MB'
        };

        that.fileInfo = {};

        function register() {
            licenseService.register(that.fileInfo.file).then(function (data) {
                messageService.toast("success", "软件激活成功！");
                close();
            },function (error) {
                that.msg = error.title;
            });
        }

        function close() {
            $scope.modalInstance.close("close");
        }

        function cancel() {
            $scope.modalInstance.dismiss("cancel");
        }

    }

})();
