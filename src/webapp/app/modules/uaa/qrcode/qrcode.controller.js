(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .controller('QRCodeController', QRCodeController);

    QRCodeController.$inject = ['Auth', '$uibModalInstance', 'messageService', 'qrcodeUrl', '$timeout', 'User'];

    function QRCodeController(Auth, $uibModalInstance, messageService, qrcodeUrl, $timeout, User) {
        var vm = this;

        vm.generateQRCode = generateQRCode;
        vm.cancel = cancel;
        vm.qrcodeUrl = qrcodeUrl;
        vm.qrcodeStatus = "generating";
        $timeout(initQRCodeStatus(), 0);

        function generateQRCode() {
            vm.qrcodeStatus = "generating";
            User.generateQRCode().then(function (user) {
                vm.qrcodeUrl = window.$oplus.appConfig.apiBaseUrls.upload + user.qrcodeImagePath;
                vm.qrcodeStatus = "existed";
            })
        }

        function initQRCodeStatus() {
            if (!vm.qrcodeUrl) {
                vm.qrcodeStatus = "unexisted"
            } else {
                var image = new Image();
                image.src = vm.qrcodeUrl;
                image.onload = function () {
                    vm.qrcodeStatus = "existed"
                };
                image.onerror = function () {
                    vm.qrcodeStatus = "unexisted"
                }
            }
        }

        //取消
        function cancel() {
            $uibModalInstance.close({action: "cancel", qrcodeUrl: vm.qrcodeUrl});
        }
    }
})();
