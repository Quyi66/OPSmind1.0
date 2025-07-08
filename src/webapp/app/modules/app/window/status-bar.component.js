/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), 2021/12/18, extracted from header.component
 */
(function () {
    'use strict';

    angular.module('oplus.udp').component('opStatusBar', {
        templateUrl: 'app/modules/app/window/status-bar.component.html',
        controller: ['$scope', '$rootScope', '$uibModal', '$state', 'Auth', 'LoginService', 'UserHabit', 'messageService', 'currentUser', 'tenantUtil', '$translate', 'appletRunman', 'appletRegistry', StatusBarCtrl]
    });


    /**
     *
     * @param $scope
     * @param $rootScope
     * @param $uibModal
     * @param $state
     * @param Auth
     * @param LoginService
     * @param UserHabit
     * @param {messageService} messageService
     * @param {currentUser} currentUser
     * @param {tenantUtil} tenantUtil
     * @param $translate
     * @param {appletRunman} appletRunman
     * @param {appletRegistry} appletRegistry
     * @constructor
     */
    function StatusBarCtrl($scope, $rootScope, $uibModal, $state, Auth, LoginService, UserHabit, messageService, currentUser, tenantUtil, $translate, appletRunman, appletRegistry) {
        var that = this;
        this.currentUser = currentUser;
        this.$onInit = onInit;
        this.admMenuItems = [
            {name: 'app.nav.adm_appres', sref: 'app.ssc.appres', faIcon: 'fa-boxes'},
            {name: 'app.nav.adm_dts', sref: 'app.ssc.dts', faIcon: 'fa-chart-network'},
            {name: 'app.nav.adm_config', sref: 'app.ssc.config', faIcon: 'fa-sliders-h'}];
        $rootScope.hideAside = this.isTenantCmb || this.isTenantAdminUI;
        this.avatarRefreshFlags = [];
        this.isAdminUI = tenantUtil.isOplusAdminUI();
        this.isTenantAdminUI = tenantUtil.isTenantAdminUI();
        this.openSsc = openSsc;
        this.openSearch = openSearch;
        this.login = login;
        this.logout = logout;
        this.about = about;
        this.getAvatarUrl = getAvatarUrl;
        this.version = function () {
            $uibModal.open({
                template: '<div class="modal-body p-0"><sysinfo></sysinfo></div>',
                windowClass: 'op-modal-borderless'
            });
        };

        function onInit() {
            $scope.$on('authenticationSuccess', function () {
                // console.log("Receive authenticationSuccess nav");
                refreshAvatar();
            });

            $scope.$watch("vm.currentUser.avatar", function () {
                // console.log("avatar changed");
                refreshAvatar();
            });
        }

        function openSsc() {
            appletRunman.openApplet(appletRegistry.CODE_DEFINED_APPLET_CODE_PREFIX + 'ssc');
        }

        function openSearch() {
            appletRunman.openApplet(appletRegistry.CODE_DEFINED_APPLET_CODE_PREFIX + 'search');
        }

        function login() {
            collapseNavBar();
            LoginService.openLoginModal();
        }

        function logout() {
            // collapseNavBar();
            // swtichMode("user");
            Auth.logout().then(function () {
                $scope.$broadcast('destroy-poll-messages');
                //console.log('logout: completed and go to login');
            }).catch(function (err) {
                console.error(err);
            }).finally(function () {
                $state.go('app.login_main');
            });
            // refreshAvatar();
        }

        function toggleSetting() {
            $(".settings").toggleClass("active");
        }

        function collapseNavBar() {
            that.isNavbarCollapsed = true;
        }


        /**
         */
        function getAvatarUrl() {
            var imageUrl = that.currentUser.avatar;
            // console.log("Run getAvatarUrl and avatarRefreshFlags length = " + vm.avatarRefreshFlags.length + "  imageUrl = " + imageUrl);
            if (imageUrl == null || imageUrl.length === 0) {
                return "content/images/avatar-dark.png";
            } else {
                return window.$oplus.appConfig.apiBaseUrls.upload + imageUrl;
            }
        }

        /**
         */
        function refreshAvatar() {
            if (that.avatarRefreshFlags.length === 0) {
                that.avatarRefreshFlags.push(0);
            } else {
                that.avatarRefreshFlags[0] = that.avatarRefreshFlags[0] + 1;
            }
        }

        function about() {
            $uibModal.open({
                template: '<div class="modal-body p-0"><sysinfo></sysinfo></div>',
                windowClass: 'op-modal-borderless'
            });
        }
    }
})();
