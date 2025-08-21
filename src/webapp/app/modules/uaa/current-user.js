/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/16/2017
 */
(function () {
    'use strict';

    angular.module('oplus.uaa').service('currentUser', currentUser);
    angular.module('oplus.uaa').run(['customFunctions', 'currentUser', function (cf, currentUser) {
        cf.defineFunction('currentUser', {
            func: function () {
                return currentUser;
            },
            group: 'data',
            sample: 'currentUser()',
            desc: ""
        });
    }]);

    currentUser.$inject = ['$localStorage', '$sessionStorage', 'permissionResolver', 'uaaService'];

    /**
     * @ngdoc service
     * @name currentUser
     * @description
     * A singleton service to save current user info and handle user login/logout.
     * Permission format: appid.domain:action:target
     * Call `currentUser.setUserInfo()` after successful login
     * Call `current.clearUserInfo()` after logout
     *
     * @param $localStorage
     * @param $sessionStorage
     * @param {uaaService} uaaService
     * @param {permissionResolver} permissionResolver
     */
    function currentUser($localStorage, $sessionStorage, permissionResolver, uaaService) {
        var that = this;
        var STORAGE_KEY = 'uaa';
        // var TOKEN_KEY = 'authToken';
        // var TENANT_ID = 'tenantId';
        // var LATEST_REQUEST_TIME_KEY = 'latestRequestTime';
        // var REMEMBER_ME_KEY = 'rememberMe';
        // var PREVIOUS_STATE_KEY = 'previousState';
        var BUILD_IN_ADMIN = "admin";

        this.roles = [];
        this.permissions = [];
        /**
         * Key is applet code, value is array of user roles
         * @type {{}}
         */
        var appletRoles = {};

        /**
         *  ID
         * @type {string}
         * TODO: what's the purpose of id?
         */
        this.id = undefined;

        /**
         * Tenant user ID
         * @type {string}
         * TODO: what's the purpose of tenantUserId?
         */
        this.tenantUserId = undefined;

        /**
         * Tenant ID
         * @type {string}
         */
        this.tenantId = undefined;

        /**
         * Authentication token
         * @type {string}
         */
        this.authToken = undefined;

        /**
         * Login ID
         * @type {string}
         */
        this.loginId = undefined;
        /**
         * Avatar URL
         * @type {string}
         */
        this.avatar = undefined;
        /**
         * User department
         * @type {string}
         */
        this.department = undefined;
        /**
         * User display name
         * @type {string}
         */
        this.displayName = undefined;

        /**
         * If user is authenticated.
         * @type {boolean}
         */
        this.isAuthenticated = undefined;

        /**
         * If user is login with remember me.
         * @type {boolean}
         */
        this.rememberMe = undefined;
        this.hasPermission = hasPermission;
        this.hasAnyPermission = hasAnyPermission;
        this.hasRole = hasRole;
        this.hasAnyRole = hasAnyRole;
        // this.hasOperationPermisson = hasOperationPermisson;
        this.setUserInfo = setUserInfo;
        this.clearUserInfo = clearUserInfo;
        this.isSameUser = isSameUser;
        this.setUserInfoFromJhipster = setUserInfoFromJhipster;
        this.readLocalUserInfo = readLocalUserInfo;
        this.updateLocalUserInfo = updateLocalUserInfo;
        this.setRememberMe = setRememberMe;
        this.basicUserInfo = basicUserInfo;
        this.setAppletRoles = setAppletRoles;
        this.getAppletRoles = getAppletRoles;

        /**
         * Set current user roles in an applet
         * @param {string} appletCode
         * @param {[string]} roles
         */
        function setAppletRoles(appletCode, roles) {
            appletRoles[appletCode] = roles;
        }

        /**
         * Get current user roles in an applet
         * @param {string} appletCode
         * @return {[string]}
         */
        function getAppletRoles(appletCode) {
            return appletRoles[appletCode] || [];
        }

        /**
         * Get basic user information.
         * @return {{loginId: string, displayName: string, avatar: string, token: string}}
         */
        function basicUserInfo() {
            return {
                // id:that.id,
                loginId: that.loginId,
                displayName: that.displayName,
                authToken: that.authToken,
                avatar: that.avatar,
                token: that.authToken,
                department: that.department
            };
        }

        /**
         * set remember me after login
         * TODO: need refactor
         * @param rememberMe
         */
        function setRememberMe(rememberMe) {
            // var storageKey = getStorageKey(REMEMBER_ME_KEY);
            // console.log("setRememberMe [rememberMe = " + rememberMe + "]");
            that.rememberMe = rememberMe;
            // if (rememberMe) {
            //     $localStorage[storageKey] = rememberMe;
            // } else {
            //     $sessionStorage[storageKey] = rememberMe;
            // }

            // console.log("setRememberMe [this.rememberMe = " + this.rememberMe + "]");
        }

        /**
         * Every tenant has it's own data
         * the truly storage key is  tenantCode + "-" + key
         * @param key
         * @returns {string}
         */
        function getTenantStorageKey(key) {
            var tenantCode = window.$oplus.appConfig.tenantCode || '';
            return tenantCode + "-" + key;
        }

        /**
         * Init user info from account
         * @param account
         * @param expTimestamp
         */
        function setUserInfoFromJhipster(account, expTimestamp) {
            console.log('%c[CurrentUser]%c 设置用户信息，登录ID:', 'color:purple', '', account.login);
            console.log('%c[CurrentUser]%c 用户显示名:', 'color:purple', '', account.fullName);
            var userInfo = new UserInfoRef(account);
            userInfo.loginId = account.login;
            userInfo.avatar = account.imageUrl;
            userInfo.displayName = account.fullName;
            setUserInfo(userInfo, expTimestamp);
            console.log('%c[CurrentUser]%c 用户信息设置完成，认证状态:', 'color:purple', '', that.isAuthenticated);
        }

        /**
         * Set user information in local cache.
         * This method should be called after successful login.
         * @param {UserInfoRef} info User info
         * @param {number} expTimestamp Timestamp in milliseconds to expire local cache
         */
        function setUserInfo(info, expTimestamp) {
            _assignInternalUserInfo(info);
            updateLocalUserInfo(expTimestamp);
            permissionResolver.setPermissions(info.permissions || []);
        }


        /**
         * clear user information.
         * This method should be called after successful logout.
         */
        function clearUserInfo() {
            _assignInternalUserInfo({authToken: null});
            var keys = [STORAGE_KEY/*, TOKEN_KEY, TENANT_ID, LATEST_REQUEST_TIME_KEY, REMEMBER_ME_KEY, PREVIOUS_STATE_KEY*/];
            keys.forEach(function (key) {
                var storageKey = getTenantStorageKey(key);
                delete $localStorage[storageKey];
                delete $sessionStorage[storageKey];
            });
            permissionResolver.setPermissions([]);
        }

        function isSameUser(username) {
            return that.loginId && that.loginId === username;
        }

        function hasRole(role) {
            return that.roles.indexOf(role) >= 0 || isSuperAdmin();
        }

        /**
         *
         * @param {[string]} allowedRoles
         * @param {string=} appletCode
         * @return {boolean}
         */
        function hasAnyRole(allowedRoles, appletCode) {
            var userRoles = that.roles;
            if (appletCode) {
                userRoles = getAppletRoles(appletCode);
                // console.log('hasAnyRole:appletCode=%s,userRoles=%o,allowedRoles=%o', appletCode, userRoles, allowedRoles);
            }
            for (var i in allowedRoles) {
                if (userRoles.indexOf(allowedRoles[i]) > -1) {
                    return true;
                }
            }
            return isSuperAdmin();
        }

        // function hasOperationPermisson(perm, oper) {
        //     perm = perm || "";
        //     return isSuperAdmin() || perm.indexOf(oper) != -1;
        // }

        function hasPermission(perm) {
            return permissionResolver.hasPermission(perm) || isSuperAdmin();
        }

        function hasAnyPermission(perms) {
            for (var i in perms) {
                if (permissionResolver.hasPermission(perms[i])) {
                    return true;
                }
            }
            return isSuperAdmin();
        }

        function isSuperAdmin() {
            return BUILD_IN_ADMIN === that.loginId;
        }

        /**
         * Save currentUser to local cache.
         * @param {number} expires Date time to expire the cache
         */
        function updateLocalUserInfo(expires) {
            var userInfoRef = new UserInfoRef(that);
            if (expires) {
                userInfoRef._expires = expires;
            }
            var storageKey = getTenantStorageKey(STORAGE_KEY);
            if (that.rememberMe) {
                $localStorage[storageKey] = userInfoRef;
            } else {
                $sessionStorage[storageKey] = userInfoRef;
            }
        }

        /**
         * Try read user info from localStorage then sessionStorage and assign to currentUser
         * If local user expires, it will clear user info.
         */
        function readLocalUserInfo() {
            var storageKey = getTenantStorageKey(STORAGE_KEY);
            var info = $localStorage[storageKey];
            if (!info) {
                info = $sessionStorage[storageKey];
            }
            if (info && info.loginId) {
                var isExpired = Date.now() > (info._expires || 0);
                if (isExpired) {
                    console.warn('User session expired');
                    clearUserInfo();
                } else {
                    _assignInternalUserInfo(info);
                    permissionResolver.setPermissions(info.permissions || []);
                }
            }
        }

        /**
         * Set user info from object
         * @param {UserInfoRef} info
         * @private
         */
        function _assignInternalUserInfo(info) {
            var obj;
            if (info instanceof UserInfoRef) {
                obj = info;
            } else {
                obj = new UserInfoRef(info);
            }
            Object.keys(obj).forEach(function (key) {
                that[key] = obj[key];
            });
            that.isAuthenticated = !!that.loginId;
        }
    }

    /**
     *
     * @param {{loginId:string,displayName:string,avatar:string,department:string,roles:[string],permissions:[string],authToken:string}} info
     * @constructor
     */
    function UserInfoRef(info) {
        if (!info) {
            info = {};
        }
        this.loginId = info.loginId;
        this.displayName = info.displayName;
        /**
         * URL of avatar image
         * @type {string}
         */
        this.avatar = info.avatar;
        this.department = info.department;
        this.roles = info.roles || [];
        this.permissions = info.permissions || [];
        //TODO: what's purpose?
        this.tenantId = info.tenantId;
        //TODO: what's purpose?
        this.tenantUserId = info.tenantUserId;
        //TODO: what's purpose?
        // this.apiKey = info.apiKey;
        //TODO: what's purpose?
        this._expires = info._expires;
        if (angular.isDefined(info.authToken)) {
            this.authToken = info.authToken;
        }
    }
})();

