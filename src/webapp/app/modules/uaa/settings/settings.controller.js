(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['$scope', 'Account', 'Auth', 'i18nService', '$translate', '$timeout', 'currentUser', 'User', 'messageService', '$uibModal', 'OpUpload'];

    function SettingsController($scope, Account, Auth, i18nService, $translate, $timeout, currentUser, User, messageService, $uibModal, OpUpload) {
        var vm = this;

        vm.save = save;
        vm.settingsAccount = null;
        vm.avatarPath;
        vm.uploadAvatar = uploadAvatar;
        vm.changePassword = changePassword;
        vm.showQRCode = showQRCode;


        /**
         * Store the "settings account" in a separate variable, and not in the shared "account" variable.
         */
        var copyAccount = function (account) {
            var tempAccount = {
                activated: account.activated,
                email: account.email,
                fullName: account.fullName,
                photo: account.photo,
                department: account.department,
                mobile: account.mobile,
                telephoneNumber: account.telephoneNumber,
                langKey: account.langKey,
                lastName: account.lastName,
                login: account.login,
                avatar: account.imageUrl,
                imageUrl: account.imageUrl
            };

            vm.authMode = account.authMode;
            return tempAccount;
        };

        queryAccount(function (account) {
            vm.settingsAccount = copyAccount(account);
            vm.qrcodeUrl = account.qrcodeImagePath? window.$oplus.appConfig.apiBaseUrls.upload+account.qrcodeImagePath:null;

            setAvatarPath(vm.settingsAccount.avatar);
            // console.log("account = " + JSON.stringify(account));
        });

        function queryAccount(callback) {
            var cb = callback || angular.noop;

            Account.get().$promise
                .then(function (result) {
                    var account = result.data;
                    cb(account);
                })
                .catch(function (e) {
                    console.log("Fail to get current account!");
                });
        }

        function save() {
            if (vm.settingsAccount.imageUrl == vm.settingsAccount.avatar) {
                doSave();
            } else {
                OpUpload.confirm("portal", "avatar", [tempAvatarFileId]).then(function (result) {
                    refreshAvatar(result.data[0].path);
                    doSave();
                });
            }

        }

        function doSave() {
            Auth.updateAccount(vm.settingsAccount).then(function () {
                messageService.toast("success", "用户信息保存成功");

                queryAccount(function (account) {
                    //LEO@20180329
                    currentUser.setUserInfoFromJhipster(account);
                    vm.settingsAccount = copyAccount(account);
                });

                i18nService.getUserLastUsedLanguage().then(function (current) {
                    if (vm.settingsAccount.langKey !== current) {
                        $translate.use(vm.settingsAccount.langKey);
                    }
                });
            }).catch(function () {
                messageService.alertError("错误", "用户信息保存失败");
            });
        }

        //设置头像路径
        function setAvatarPath(path) {
            if (path) {
                vm.avatarPath = window.$oplus.appConfig.apiBaseUrls.upload + path;
            } else {
                vm.avatarPath = "content/images/logo-default.png";
            }
        }

        //上传用户头像
        var tempAvatarFileId;//used for confirm avatar file
        function uploadAvatar(file) {
            if (file != null) {
                if (file.size > 20000 * 1024) {//图片大小不能超过2000kb
                    messageService.confirm("Picture overrun", "Picture size cannot exceed 20MB", function () {
                    });
                    return;
                }

                OpUpload.preUpload("portal", "avatar", [file]).then(function (result) {
                    if("success" === result.status){
                        var filePath = result.data[0].path;
                        tempAvatarFileId = result.data[0].id;
                        messageService.toast("success", "Image uploaded successfully");
                        refreshAvatar(filePath, true);
                    }else{
                        //将错误信息放进name中显示
                        messageService.toast("error", result.data[0].name);
                    }
                }).catch(function (e) {
                    console.error('Failed to upload pictures  describe: ' + e.message);
                });
            }
        }

        function refreshAvatar(filePath, isTemp) {
            vm.avatarPath = undefined;
            $timeout(function () {
                if (isTemp) {
                    setAvatarPath('/temp' + filePath);
                } else {
                    setAvatarPath(filePath);
                    currentUser.avatar=filePath;
                    currentUser.updateLocalUserInfo();
                }

                vm.settingsAccount.imageUrl = filePath;
            }, 0);
        }

        function changePassword() {
            $uibModal.open({
                templateUrl: 'app/modules/uaa/password/password.html',
                controller: 'PasswordController',
                controllerAs: 'passwordVm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('password');
                    //     return $translate.refresh();
                    // }]
                }
            }).result.then(function (result) {

            }, function () {

            });
        }

        function showQRCode() {
            $uibModal.open({
                templateUrl: 'app/modules/uaa/qrcode/qrcode.html',
                controller: 'QRCodeController',
                controllerAs: 'qrcodeVm',
                backdrop: 'static',
                size: 'sm',
                resolve: {
                    qrcodeUrl:function () { return vm.qrcodeUrl}
                }
            }).result.then(function (result) {
                vm.qrcodeUrl = result.qrcodeUrl
                console.log(result)
            }, function () {

            });
        }
    }
})();
