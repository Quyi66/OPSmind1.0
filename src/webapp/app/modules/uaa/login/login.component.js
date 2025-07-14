(function () {
    'use strict';

    angular.module('oplus.uaa')
        .component('opLogin', {
            templateUrl: 'app/modules/uaa/login/login.component.html',
            controller: ['$scope', '$rootScope', '$state', '$timeout', 'Auth', '$uibModalStack', '$uibModal', 'licenseService', 'windowInit','$translate', 'tenantUtil', LoginController],
            bindings: {
                asModal: '<'
            }
        });

    /**
     *
     * @param $scope
     * @param $rootScope
     * @param $state
     * @param $timeout
     * @param {Auth} Auth
     * @param $uibModalStack
     * @param $uibModal
     * @param {licenseService} licenseService
     * @param {windowInit} windowInit
     * @param $translate
     * @param {tenantUtil} tenantUtil
     * @constructor
     */
    function LoginController($scope, $rootScope, $state, $timeout, Auth, $uibModalStack, $uibModal, licenseService, windowInit,$translate, tenantUtil) {
        var that = this;
        var asModal = that.asModal;
        that.authenticationError = false;
        that.hasLoggedIn = false;
        that.credentials = {};
        that.username = null;
        that.password = null;
        that.otpCode = null;
        that.rememberMe = false;
        that.cancel = cancel;
        that.login = login;
        that.register = register;
        that.requestResetPassword = requestResetPassword;
        that.checkOTP = checkOTP;
        this.$onInit = onInit;

        function onInit() {
            $timeout(function () {
                angular.element('#username').focus();
            });
            if (!asModal) {
                // toggleNav(false);
                verifyLicense();
            }
            checkOTP();
        }

        function cancel() {
            that.credentials = {
                username: null,
                password: null,
                rememberMe: false
            };
            that.authenticationError = false;
            dismissModal();
        }

        //验证license是否有效
        function verifyLicense() {
            licenseService.verify().then(function (data) {
            }, function (error) {
                if (error.status === 504) {
                    registerLicense(error.message);
                }
            });
        }

        //是否开启OTP认证
        function checkOTP() {
            Auth.checkOTP().then(function (data) {
                if (data) {
                    that.showOTP = true;
                }
            }, function (error) {
            });
        }

        function login(event) {
            // console.log('LoginController.login', {hasLoggedIn: that.hasLoggedIn});
            if (that.hasLoggedIn) {
                return;
            }

            if ($scope.loginForm.$invalid) {
                that.authenticationError = true;
                that.errorMessage = $translate.instant('jhi_login.form.login_info_error');
                return;
            }

            that.hasLoggedIn = true;
            event.preventDefault();
            Auth.login({
                username: that.username,
                password: that.password,
                rememberMe: that.rememberMe,
                otpCode: that.otpCode,
                tenantId: window.$oplus.appConfig.tenantId
            }).then(function () {
                that.authenticationError = false;
                closeModal();
                windowInit.initAppletDefsAndRouters().then(function () {
                    $state.go('app.home');
                    $rootScope.$global.hideHeader = false;
                    that.hasLoggedIn = false;
                }).catch(function (err) {
                    throw err;
                });
            }).catch(function (err) {
                //TODO: move to Auth.login
                if (err.status === 504) {
                    that.hasLoggedIn = false;
                    registerLicense(err.message);
                } else {
                    that.authenticationError = true;
                    that.hasLoggedIn = false;
                    that.errorMessage = $translate.instant('jhi_login.form.login_info_error');
                    if (err.code === 'UnknownAccount') {
                        // that.errorMessage = '用户不存在。';
                        that.errorMessage = $translate.instant('jhi_login.form.udne_or_pdne');
                    } else if (err.code === 'UnknownTenantAccount') {
                        that.errorMessage = $translate.instant('jhi_login.form.user_not_register_tenant');
                    } else if (err.code === 'IncorrectCredentials') {
                        // that.errorMessage = '请确认您的密码再试。';
                        that.errorMessage = $translate.instant('jhi_login.form.udne_or_pdne');
                    } else if (err.code === 'InvalidAccount') {
                        that.errorMessage = $translate.instant('jhi_login.form.user_invalid');
                    } else if (err.code === "OTPCertFailed") {
                        that.errorMessage = $translate.instant('jhi_login.form.confirm_otp');
                    } else if (err.code === 'LOCKED') {
                        //that.errorMessage = $translate.instant('jhi_login.form.error_five_times_lock');
                        that.errorMessage =err.message;
                    }
                }
            });
        }

        function register() {
            dismissModal();
            $state.go('register');
        }

        function requestResetPassword() {
            dismissModal();
            $state.go('requestReset');
        }

        function dismissModal() {
            var modal = $uibModalStack.getTop();
            if (modal) $uibModalStack.dismiss(modal.key);
        }

        function closeModal() {
            var modal = $uibModalStack.getTop();
            if (modal) $uibModalStack.close(modal.key);
        }

        function toggleNav(shown) {
            if (shown) {
                angular.element(".navbar-inverse, .aside-wrap").show();
            } else {
                angular.element(".navbar-inverse, .aside-wrap").hide();
            }
        }

        function registerLicense(msg) {
            var modalScope = $scope.$new();
            var modal = $uibModal.open({
                templateUrl: 'app/modules/uaa/login/license-register-modal.html',
                size: 'md',
                controllerAs: '$ctrl',
                controller: 'LicenseRegisterCtrl',
                backdrop: 'static',
                scope: modalScope,
                resolve: {
                    msg: function () {
                        return msg;
                    }
                }
            });
            modalScope.modalInstance = modal;

            modal.result.then(function close(result) {
            }, function dismiss() {
            });
        }

    }
})();
