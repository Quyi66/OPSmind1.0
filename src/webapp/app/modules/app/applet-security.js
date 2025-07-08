/**
 * @author Leo Liao(leoliaolei@gmail.com), 2022/2/18, created
 */
(function () {
    'use strict';
    angular.module('oplus.commons').service('appletSecurity', ['currentUser', appletSecurity]);

    /**
     * @ngdoc service
     * @name appletSecurity
     * @param {currentUser} currentUser
     * @description
     */
    function appletSecurity(currentUser) {
        // Access control
        this.canViewAppletList = canViewAppletList;
        this.canCreateApplet = canCreateApplet;
        this.canUpdateApplet = canUpdateApplet;
        this.canModifyAppletResource = canModifyAppletResource;
        this.canDevelopApplet = canDevelopApplet;
        this.canDeleteApplet = canDeleteApplet;
        this.canPublishApplet = canPublishApplet;
        this.canUseApplet = canUseApplet;

        function canViewAppletList() {
            return currentUser.isAuthenticated;
        }

        function canCreateApplet(appletCode) {
            return currentUser.hasPermission('app:edit:*');
        }

        function canUpdateApplet(appletCode) {
            return currentUser.hasAnyRole(['ROLE_DEVELOPER', 'ROLE_ADMIN'], appletCode);
        }

        function canModifyAppletResource(appletCode) {
            return canUpdateApplet(appletCode);
        }

        function canDevelopApplet(appletCode) {
            return currentUser.hasAnyRole(['ROLE_DEVELOPER'], appletCode);
        }

        function canDeleteApplet(appletCode, appletOwnerId) {
            return currentUser.loginId === appletOwnerId || currentUser.hasAnyRole(['ROLE_ADMIN','ROLE_PRIVUSER','ROLE_DEVELOPER'], appletCode);
        }

        function canPublishApplet(appletCode, appletOwnerId) {
            return canDeleteApplet(appletCode, appletOwnerId);
        }

        function canUseApplet(appletCode) {
            return currentUser.hasAnyRole(['ROLE_USER'], appletCode);
        }
    }
})();
