(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .service('LoginService', LoginService);

    LoginService.$inject = ['modalHelper'];

    function LoginService(modalHelper) {
        this.openLoginModal = openLoginModal;
        var modalInstance = null;
        var resetModal = function () {
            modalInstance = null;
        };

        function openLoginModal() {
            if (modalInstance !== null) return;
            modalInstance = modalHelper.openModal({
                template: '<div class="modal-header">\n' +
                    '<h4 class="modal-title" data-translate="jhi_login.title">Sign in</h4>\n' +
                    '<button type="button" class="btn-close" data-dismiss="modal" aria-hidden="true" ng-click="$ctrl.cancel()"></button>\n' +
                    '</div>\n' +
                    '<div class="modal-body">\n' +
                    '<op-login as-modal="true"></op-login>\n' +
                    '</div>',
                size: 'sm',
                position: 'center',
                controller: [function () {
                    this.cancel = function () {
                        modalInstance.dismiss();
                    }
                }],
                controllerAs: '$ctrl'
            });
            modalInstance.result.then(
                resetModal,
                resetModal
            );
        }
    }
})();
