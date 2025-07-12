/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/16/2017
 */
(function () {
    'use strict';
    angular.module('oplus.uaa', ['ngPasswordMeter']);
})();
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
            var userInfo = new UserInfoRef(account);
            userInfo.loginId = account.login;
            userInfo.avatar = account.imageUrl;
            userInfo.displayName = account.fullName;
            setUserInfo(userInfo, expTimestamp);
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


(function (moduleName) {
    'use strict';

    angular.module(moduleName)
        .run(['$interval', '$location', 'currentUser', 'Auth', '$log', function ($interval, $location, currentUser, Auth, $log) {
            accessTokenLogin();
            refreshJWTToken();

            //oplus's url was embedded by 3rd party system and contains two parameter :oplusUserName and oplusTenantAccessToken
            function accessTokenLogin() {
                if (window.$oplus.appConfig.modules.uaa && window.$oplus.appConfig.modules.uaa.enableAccessTokenLogin && !currentUser.isAuthenticated) {
                    var login = $location.search().oplusUserName;
                    var accessToken = $location.search().oplusTenantAccessToken;
                    if (login !== undefined && login.length > 0 && accessToken !== undefined && accessToken.length > 0) {
                        console.log("Start to login by access token.");
                        Auth.accessTokenLogin({
                            username: login,
                            password: "none",
                            rememberMe: false,
                            accessToken: accessToken,
                            refer: "fromUrl"
                        }, function () {
                            console.log("Login by access token success.");
                        });
                    }
                }
            }

            function refreshJWTToken() {
                //try to refresh jwt token every 30 minutes,for every jwt token has expire time
                $interval(function () {
                    // console.log("Refresh jwt token interval ");
                    if (currentUser.isAuthenticated) {
                        var lastRequestTime = currentUser.latestRequestTime;
                        if (lastRequestTime != null) {
                            var timePast = ((new Date()).getTime() - lastRequestTime) / (1000 * 60);
                            // console.log("latestRequestTime past(minute) " + timePast);
                            if (timePast < 10) {//user is considered active if the latest interaction  within 12 minutes
                                currentUser.latestRequestTime = null;
                                Auth.reloadAuthorizeToken();
                            }
                        }
                    }
                }, 30 * 60 * 1000);
            }
        }]);
})('oplus.uaa');

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/23/2017
 */
(function () {
    'use strict';

    angular.module('oplus.uaa').service('permissionResolver', permissionResolver);

    permissionResolver.$inject = [];

    /**
     * @ngdoc
     * @name permissionResolver
     */
    function permissionResolver() {
        var permissions = [];
        this.hasPermission = hasPermission;
        this.setPermissions = setPermissions;

        function resolvePermissions(permissionsStringArray) {
            permissions.length = 0;
            for (var i = 0; i < permissionsStringArray.length; ++i) {
                var permission = new WildcardPermission(permissionsStringArray[i]);
                permissions.push(permission);
            }
        }

        /**
         *
         * @param {string[]} permissionsStringArray
         */
        function setPermissions(permissionsStringArray) {
            resolvePermissions(permissionsStringArray);
        }

        /**
         *
         * @param {string} permissionString String in shiro format of "domain:action:target"
         * @returns {boolean}
         */
        function hasPermission(permissionString) {
            if (!permissionString) {
                return false;
            }
            var permission = new WildcardPermission(permissionString);
            for (var i = 0; i < permissions.length; ++i) {
                if (permissions[i].implies(permission)) {
                    return true;
                }
            }
            return false;
        }
    }

    function toParts(permissionString) {
        var parts = [];
        var levels = permissionString.split(':');

        for (var i = 0; i < levels.length; ++i) {
            parts.push(levels[i].split(','));
        }
        return parts;
    }

    function containsAll(source, vals) {
        for (var i = 0; i < vals.length; ++i) {
            if (source.indexOf(vals[i]) === -1) {
                return false;
            }
        }
        return true;
    }


    function WildcardPermission(permissionString) {
        var parts = toParts(permissionString);
        this.asParts = function () {
            return parts;
        };
        this.implies = function (other) {
            var i;
            for (i = 0; i < other.asParts().length; ++i) {
                if (parts.length - 1 < i) {
                    return true;
                } else {

                    if (parts[i].indexOf('*') === -1 && !containsAll(parts[i], other.asParts()[i])) {
                        return false;
                    }
                }
            }

            for (; i < parts.length; ++i) {
                if (parts[i].indexOf('*') === -1) {
                    return false;
                }
            }
            return true;
        };
    }
})();

/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/23/2017
 */
(function () {
    'use strict';
    angular.module('oplus.uaa').provider('uaaService', uaaServiceProvider);

    function uaaServiceProvider() {
        var disabled = false;
        this.disableUaa = function () {
            disabled = true;
        };
        this.$get = [function () {
            return {
                isDisabled: function () {
                    return disabled;
                }
            };
        }];
    }
})();
(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .directive('uaaHasRole', hasRole);

    hasRole.$inject = ['currentUser', 'uaaService'];

    function hasRole(currentUser, uaaService) {
        return {
            restrict: 'A',
            link: linkFunc
        };

        function linkFunc(scope, element, attrs) {
            if (uaaService.isDisabled()) {
                return;
            }

            var role = attrs.uaaHasRole.replace(/\s+/g, '');

            var isDenyDisable = element.attr("uaa-deny-disable") !== undefined;
            var setVisible = function () {
                    if (isDenyDisable) {
                        element.removeAttr("disabled");
                    } else {
                        element.removeClass('hidden');
                    }
                },
                setHidden = function () {
                    if (isDenyDisable) {
                        element.attr("disabled", "disabled");
                    } else {
                        element.addClass('hidden');
                    }
                },
                defineVisibility = function (reset) {

                    if (reset) {
                        setVisible();
                    }

                    if (currentUser.hasRole(role)) {
                        setVisible();
                    } else {
                        setHidden();
                    }
                };

            if (role.length > 0) {
                defineVisibility(true);

                scope.$watch(function () {
                    return currentUser.isAuthenticated;
                }, function () {
                    defineVisibility(true);
                });
            }
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .directive('uaaHasAnyRole', hasAnyRole);

    hasAnyRole.$inject = ['currentUser', 'uaaService'];

    function hasAnyRole(currentUser, uaaService) {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs) {
            if (uaaService.isDisabled()) {
                return;
            }

            var roles = attrs.uaaHasAnyRole.replace(/\s+/g, '').split(',');

            var isDenyDisable = element.attr("uaa-deny-disable") != undefined;
            var setVisible = function () {
                    if (isDenyDisable) {
                        element.removeAttr("disabled");
                    } else {
                        element.removeClass('hidden');
                    }
                },
                setHidden = function () {
                    if (isDenyDisable) {
                        element.attr("disabled", "disabled");
                    } else {
                        element.addClass('hidden');
                    }
                },
                defineVisibility = function (reset) {
                    if (reset) {
                        setVisible();
                    }

                    if (currentUser.hasAnyRole(roles)) {
                        setVisible();
                    } else {
                        setHidden();
                    }
                };

            if (roles.length > 0) {
                defineVisibility(true);

                scope.$watch(function () {
                    return currentUser.isAuthenticated;
                }, function () {
                    defineVisibility(true);
                });
            }
        }
    }
})();

(function () {
    'use strict';
    /**
     * @ngdoc
     * @name uaaHasPermission
     */
    angular.module('oplus.uaa').directive('uaaHasPermission', hasPermission);

    hasPermission.$inject = ['$compile','currentUser', 'uaaService'];

    function hasPermission($compile,currentUser, uaaService) {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs) {
            if (uaaService.isDisabled()) {
                return;
            }

            var permission = attrs.uaaHasPermission.replace(/\s+/g, '');

            var isDenyDisable = element.attr("uaa-deny-disable") != undefined;
            var denyMessage = element.attr("uaa-deny-message");
            var setVisible = function () {
                    if (denyMessage != undefined) {
                        removeMessage();
                    }

                    if (isDenyDisable) {
                        element.removeAttr("disabled");
                    } else {
                        element.removeClass('hidden');
                    }
                },
                setHidden = function () {
                    if (denyMessage != undefined) {
                        showMessage(denyMessage);
                    }

                    if (isDenyDisable) {
                        element.attr("disabled", "disabled");
                    } else {
                        element.addClass('hidden');
                    }
                },
                showMessage = function () {
                    var message = denyMessage.length > 0 ? denyMessage : "User not has permission " + permission + "!";
                    element.after($compile("<div class='uaa-has-permission-message text-center p-3'><i class='fa fa-key'></i> " + message + "</div>")(scope));

                },
                removeMessage = function () {
                    element.siblings(".uaa-has-permission-message").remove();
                },
                defineVisibility = function (reset) {
                    if (reset) {
                        setVisible();
                    }

                    if (currentUser.hasPermission(permission)) {
                        setVisible();
                    } else {
                        setHidden();
                    }
                };

            if (permission.length > 0) {
                defineVisibility(true);

                scope.$watch(function () {
                    return currentUser.isAuthenticated;
                }, function () {
                    defineVisibility(true);
                });
            }
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .directive('uaaHasAnyPermission', hasAnyPermission);

    hasAnyPermission.$inject = ['$compile','currentUser', 'uaaService'];

    function hasAnyPermission($compile,currentUser, uaaService) {
        var directive = {
            restrict: 'A',
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs) {
            if (uaaService.isDisabled()) {
                return;
            }

            var permissions = attrs.uaaHasAnyPermission.replace(/\s+/g, '').split(',');

            var isDenyDisable = element.attr("uaa-deny-disable") != undefined;
            var denyMessage = element.attr("uaa-deny-message");
            var setVisible = function () {
                    if (denyMessage != undefined) {
                        removeMessage();
                    }

                    if (isDenyDisable) {
                        element.removeAttr("disabled");
                    } else {
                        element.removeClass('hidden');
                    }

                },
                setHidden = function () {
                    if (denyMessage != undefined) {
                        showMessage(denyMessage);
                    }

                    if (isDenyDisable) {
                        element.attr("disabled", "disabled");
                    } else {
                        element.addClass('hidden');
                    }
                },
                showMessage = function () {
                    var message = denyMessage.length > 0 ? denyMessage : "User not has permissions " + permissions + "!";
                    element.after($compile("<h3 class='uaa-has-any-permission-message text-center'>" + message + "</h3>")(scope));
                },
                removeMessage = function () {
                    element.siblings(".uaa-has-any-permission-message").remove();
                },
                defineVisibility = function (reset) {
                    if (reset) {
                        setVisible();
                    }

                    if (currentUser.hasAnyPermission(permissions)) {
                        setVisible();
                    } else {
                        setHidden();
                    }
                };

            if (permissions.length > 0) {
                defineVisibility(true);

                scope.$watch(function () {
                    return currentUser.isAuthenticated;
                }, function () {
                    defineVisibility(true);
                });
            }
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .directive('uaaDataHasPermission', hasPermission);

    hasPermission.$inject = ['$compile', 'currentUser', 'uaaService'];

    function hasPermission($compile, currentUser, uaaService) {
        var directive = {
            restrict: 'A',
            scope: {
                uaaDataHasPermission: '@'
            },
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element, attrs) {
            if (uaaService.isDisabled()) {
                return;
            }

            var permissionObj, isDenyDisable, denyMessage,
                totalPermissions = [];


            var init = function () {
                    var permissionStr = attrs.uaaDataHasPermission.replace(/\s+/g, '');
                    isDenyDisable = element.attr("uaa-deny-disable") != undefined;
                    denyMessage = element.attr("uaa-deny-message");
                    if (permissionStr) {
                        permissionObj = JSON.parse(permissionStr);

                        //total can be empty if the permission not ready before directive compile
                        if (permissionObj.total) {
                            totalPermissions = permissionObj.total.split(",");
                        }
                    } else {
                        console.log("Value of attribute uaa-data-has-permission should not be empty.");
                    }
                },
                setVisible = function () {
                    if (denyMessage != undefined) {
                        removeMessage();
                    }

                    if (isDenyDisable) {
                        element.removeAttr("disabled");
                    } else {
                        element.removeClass('hidden');
                    }
                },
                setHidden = function () {
                    if (denyMessage != undefined) {
                        showMessage(denyMessage);
                    }

                    if (isDenyDisable) {
                        element.attr("disabled", "disabled");
                    } else {
                        element.addClass('hidden');
                    }
                },
                showMessage = function () {
                    var message = denyMessage.length > 0 ? denyMessage : "User not has data permission " + permissionObj.target + "!";
                    element.after($compile("<h3 class='uaa-data-has-permission-message text-center'>" + message + "</h3>"))(scope);
                },
                removeMessage = function () {
                    element.siblings(".uaa-data-has-permission-message").remove();
                },
                defineVisibility = function (reset) {
                    if (reset) {
                        setVisible();
                    }

                    if (_.includes(totalPermissions, permissionObj.target)) {
                        setVisible();
                    } else {
                        setHidden();
                    }
                };

            init();
            if (permissionObj != undefined) {
                defineVisibility(true);

                scope.$watch(function () {
                    return currentUser.isAuthenticated;
                }, function () {
                    defineVisibility(true);
                });


                //support permission data not ready before directive compile
                if (totalPermissions.length === 0) {
                    // console.log("Start watch");
                    scope.$watch(function () {
                        return scope.uaaDataHasPermission;
                    }, function () {
                        init();
                        defineVisibility(true);
                    });
                }
            }
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .directive('uaaIsAuthenticated', isAuthenticated);

    isAuthenticated.$inject = ['$compile', 'currentUser', 'uaaService'];

    /**
     * @ngdoc directive
     * @name uaaIsAuthenticated
     * @param $compile
     * @param currentUser
     * @param uaaService
     * @return {{link: linkFunc, restrict: string}}
     */
    function isAuthenticated($compile, currentUser, uaaService) {
        return {
            restrict: 'A',
            link: linkFunc
        };

        function linkFunc(scope, element, attrs) {
            if (uaaService.isDisabled()) {
                return;
            }
            //TODO: change element.attr with attrs?
            var denyToDisable = angular.isDefined(element.attr("uaa-deny-disable"));
            var denyWithMessage = element.attr("uaa-deny-message");
            // determineStatus();
            scope.$watch(function () {
                return currentUser.isAuthenticated;
            }, function () {
                var isDenied = !currentUser.isAuthenticated;
                configMessageOfDenial(isDenied);
                configDisabledOfDenial(isDenied);
            });

            function configDisabledOfDenial(isDenied) {
                if (denyToDisable) {
                    if (isDenied) {
                        element.attr("disabled", "disabled");
                    } else {
                        element.removeAttr("disabled");
                    }
                } else {
                    if (isDenied) {
                        element.addClass('hidden');
                    } else {
                        element.removeClass('hidden');
                    }
                }
            }

            function configMessageOfDenial(isDenied) {
                if (!angular.isDefined(denyWithMessage)) return;
                if (isDenied) {
                    var message = denyWithMessage.length > 0 ? denyWithMessage : "User is not authenticated";
                    var el = $compile('<div class="js-uaa-denied-message text-center p-3"><i class="fa fa-ban"></i> ' + message + '</div>')(scope);
                    element.after(el);
                } else {
                    element.siblings(".js-uaa-denied-message").remove();
                }
            }
        }
    }
})();

/**
 *
 */
(function () {
    'use strict';
    angular.module('oplus.uaa').service('uaaUserService', uaaUserService);

    uaaUserService.$inject = ['$q','$http', '$uibModal'];

    function uaaUserService($q,$http,$uibModal) {
        /**
         * 双人复核弹出框
         *
         *
         */
        this.openUserDoubleReviewDialog = function () {
            var deferred = $q.defer();
            $uibModal.open({
                templateUrl: 'app/modules/uaa/user/user-double-review-dialog.html',
                controller: 'UserDoubleReviewController',
                controllerAs: 'userDoubleReviewVm',
                backdrop: 'static',
                size: 'md'
            }).result.then(function (result) {
                if (result.action != "cancel") {
                    deferred.resolve(result);
                }
            }, function () {
                deferred.reject();
            });
            return deferred.promise;
        }

        /**
         * 检查用户密码/一次性密码是否正确
         * @param type 密码类型，account/otp
         * @param login 用户登录名
         * @param password 密码
         * @returns {*}
         */
        this.validatePassword = function (type,login, password) {
            var deferred = $q.defer();//声明承诺
            $http.post("api/users/validate-password", {type: type, login: login,password:password})
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        this.getTenantUsers = function (tenantId) {
            var deferred = $q.defer();//声明承诺
            $http.get("api/users" + (tenantId == undefined || tenantId == null ? "" : ("?tenantId=" + tenantId)))
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };
    }
})();
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

(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('User', User);

    User.$inject = ['$resource', 'OpUpload', '$q', '$http', '$uibModal'];

    function User($resource, OpUpload, $q, $http, $uibModal) {
        var service = $resource('api/users/:tenantUserId', {}, {
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'save': {method: 'POST', isArray: true},
            'update': {method: 'PUT'},
            'delete': {method: 'DELETE'}
        });

        service.getUserTree = function () {
            var deferred = $q.defer();//声明承诺
            $http.get("api/users/department-tree")
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        service.updateAvatar = function (file, path) {
            // console.log("Run updateAvatar");
            var deferred = $q.defer();//声明承诺
            OpUpload.uploadOrReplace({
                module: 'portal',
                category: 'avatar',
                files: [file],
                path: path,
                updateName: true
            }).then(function (result) {
                var avatarPath = result.data[0].path;

                if (path == undefined || path != avatarPath) {
                    $http.post("api/users/avatar?path=" + avatarPath, {})
                        .success(function (data) {
                            deferred.resolve(avatarPath);//请求成功
                        })
                        .error(function (result) {
                            deferred.reject(result);//请求失败
                        });
                } else {
                    deferred.resolve(avatarPath);//请求成功
                }
            }, function (result) {
                deferred.reject(result);//请求成功
            });

            return deferred.promise;   // 返回承诺
        };

        service.getAllUsersBasicInfo = function (tenantId) {
            var deferred = $q.defer();//声明承诺
            $http.get("api/users/basic" + (tenantId == undefined ? "" : ("?tenantId=" + tenantId)))
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        service.getTenantUsers = function (tenantId) {
            var deferred = $q.defer();//声明承诺
            $http.get("api/users" + (tenantId == undefined || tenantId == null ? "" : ("?tenantId=" + tenantId)))
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };


        service.getNotAssociatedTenantUsers = function (tenantId) {
            var deferred = $q.defer();//声明承诺
            $http.get("api/users/not-associated" + (tenantId == undefined || tenantId == null ? "" : ("?tenantId=" + tenantId)))
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };

        service.associatedTenantUsers = function (tenantId, userIds) {
            var deferred = $q.defer();//声明承诺
            $http.post("api/users/associate", {tenantId: tenantId, userIds: userIds})
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };


        service.updateTenantUserRoles = function (users) {
            var deferred = $q.defer();//声明承诺
            $http.put("api/users/roles", users)
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };


        /**
         * @description jump an dialog for select user, you can be noticed on every user selection or on dialog closing
         *
         *
         * @param options {object}
         * {
         *  title: {string} 弹出框标题
         *  checkType: {string} checkbox/radio/none,默认值checkbox
         *  filterType: {string} inner/outer/none,过滤方式,默认值inner
         *  default: {Array<User>} 默认选中用户列表，默认值[]，根据User.tenantUserId匹配用户
         *  disabled: {Array<User>} 默认禁止用户列表，默认值[]，根据User.tenantUserId匹配用户
         *  excludeLogin: {boolean} 是否排除当前登录用户，默认值false
         *  expandAll: {boolean} 是否默认展开所有目录，默认值true
         *  onUserSelected: {function(currentSelect:User, totalSelected:Array<User>)} 当选中任意节点时调用此参数
         *}
         *
         *
         * @returns {promise} promise promise.resolve result : {users: {Array<User>}, ids:  {Array<string>}, selectedUser: {User}}.
         * User format {tenantUserId:{string}, name:{string},fullName:{string}}
         *
         * @example
         *
         *  User.openSelectUserDialog({checkType: "radio", title: "选择用户"}).then(function (result) {
         *      var selectedUser = result.selectedUser;
         *      vm.views.selectedUser = selectedUser != null ? selectedUser : vm.views.selectedUser;
         *      queryRoles();
         *  });

         */
        service.openSelectUserDialog = function (options) {
            var deferred = $q.defer();

            $uibModal.open({
                templateUrl: 'app/modules/adm/user/user-select-dialog.html',
                controller: 'OpUserSelectDialogCtrl',
                controllerAs: 'userSelectDialogVm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    params: function () {
                        return options;
                    }
                }
            }).result.then(function (result) {
                if (result.action != "cancel") {
                    deferred.resolve(result);
                }
            }, function () {
                deferred.reject();
            });

            return deferred.promise;
        };

        /**
         * 生成当前用户的qrcode
         * @returns {*}
         */
        service.generateQRCode = function (userId) {
            var deferred = $q.defer();//声明承诺
            $http.patch("api/users/qrcode/" + userId)
                .success(function (data) {
                    deferred.resolve(data);//请求成功
                })
                .error(function (data) {
                    deferred.reject(data);//请求成功
                });
            return deferred.promise;   // 返回承诺
        };
        return service;
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('Ldap', Ldap);

    Ldap.$inject = ['$resource'];

    function Ldap ($resource) {
        var service = $resource('api/users/sync', {}, {
            'syncLdapUsers': {
                method: 'GET',
                isArray: true
            }
        });
        return service;
    }
})();

(function () {
    'use strict';
    angular
        .module('oplus.uaa')
        .factory('UserHabit', UserHabit);

    UserHabit.$inject = ['$resource', '$q', '$http', 'currentUser'];

    function UserHabit($resource, $q, $http, currentUser) {
        var resourceUrl = 'api/userHabits/:id';

        var resource = $resource(resourceUrl, {}, {
            'query': {method: 'GET', isArray: true},
            'update': {method: 'PUT'}
        });


        function getUserHabit(module, _function) {
            var deferred = $q.defer();

            $http.get('api/userHabits/' + currentUser.loginId + '?module=' + module + '&function=' + _function).then(function (response) {
                deferred.resolve(response);
            });

            return deferred.promise;
        }

        return {
            query: resource.query,
            get: resource.get,
            save: resource.save,
            update: resource.update,
            getUserHabit: getUserHabit
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('Register', Register);

    Register.$inject = ['$resource'];

    function Register ($resource) {
        return $resource('api/register', {}, {});
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('Principal', Principal);

    Principal.$inject = ['$q', 'Account'];

    function Principal($q, Account) {
        var _identity,
            _authenticated = false;

        var service = {
            authenticate: authenticate,
            hasAnyAuthority: hasAnyAuthority,
            hasAuthority: hasAuthority,
            identity: identity,
            isAuthenticated: isAuthenticated,
            isIdentityResolved: isIdentityResolved
        };

        return service;

        function authenticate(identity) {
            _identity = identity;
            _authenticated = identity !== null;
        }

        function hasAnyAuthority(authorities) {
            if (!_authenticated || !_identity || !_identity.authorities) {
                return false;
            }

            for (var i = 0; i < authorities.length; i++) {
                if (_identity.authorities.indexOf(authorities[i]) !== -1) {
                    return true;
                }
            }

            return false;
        }

        function hasAuthority(authority) {
            if (!_authenticated) {
                return $q.when(false);
            }

            return this.identity().then(function (_id) {
                return _id.authorities && _id.authorities.indexOf(authority) !== -1;
            }, function () {
                return false;
            });
        }

        function identity(force) {
            var deferred = $q.defer();

            if (force === true) {
                _identity = undefined;
            }

            // check and see if we have retrieved the identity data from the server.
            // if we have, reuse it by immediately resolving
            if (angular.isDefined(_identity)) {
                deferred.resolve(_identity);

                return deferred.promise;
            }

            // retrieve the identity data from the server, update the identity object, and then resolve.
            Account.get().$promise
                .then(getAccountThen)
                .catch(getAccountCatch);

            return deferred.promise;

            function getAccountThen(account) {
                _identity = account.data;
                var roles = _identity.roles;
                var permissions = [];
                var roleNames = [];
                if (roles != null && roles.length > 0) {
                    for (var i in roles) {
                        var roleObj = roles[i];
                        var rolePermissions = roleObj.permissions;
                        roleNames.push(roleObj.name);
                        if (rolePermissions != null && rolePermissions.length > 0) {
                            for (var j in rolePermissions) {
                                var rolePermission = rolePermissions[j];
                                var permissionStr = rolePermission.domain + ":" + rolePermission.action + ":" + rolePermission.target;
                                if (permissions.indexOf(permissionStr) == -1) {
                                    permissions.push(permissionStr);
                                }
                            }
                        }
                    }
                }

                _identity.authorities = roleNames;
                _identity.roles = roleNames;
                _identity.permissions = permissions;

                _authenticated = true;
                deferred.resolve(_identity);
            }

            function getAccountCatch() {
                _identity = null;
                _authenticated = false;
                deferred.resolve(_identity);
            }
        }

        function isAuthenticated() {
            return _authenticated;
        }

        function isIdentityResolved() {
            return angular.isDefined(_identity);
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('PasswordResetInit', PasswordResetInit);

    PasswordResetInit.$inject = ['$resource'];

    function PasswordResetInit($resource) {
        var service = $resource('api/account/reset-password/init', {}, {});

        return service;
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('PasswordResetFinish', PasswordResetFinish);

    PasswordResetFinish.$inject = ['$resource'];

    function PasswordResetFinish($resource) {
        var service = $resource('api/account/reset-password/finish', {}, {});

        return service;
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('Password', Password);

    Password.$inject = ['$resource'];

    function Password($resource) {
        var service = $resource('api/account/change-password', {}, {});

        return service;
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('licenseService', licenseService);

    licenseService.$inject = ['$resource', '$http', '$q', 'Upload'];

    function licenseService($resource, $http, $q, Upload) {

        var service = {
            register: register,
            verify: verify,
            license: license,
            isEnabled: isEnabled
        };
        return service;

        function register(licenseFile) {
            var deferred = $q.defer();//声明承诺
            Upload.upload({
                url: 'api/licenses/activate/v2',
                file: licenseFile
            }).then(function successCallback(response) {
                deferred.resolve(response.data);//请求成功
            }, function errorCallback(response) {
                deferred.reject(response.data);//请求成功
            });

            return deferred.promise;   // 返回承诺
        }

        function verify() {
            var deferred = $q.defer();//声明承诺
            var url = 'api/licenses/verify';
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                deferred.resolve(response.data);//请求成功
            }, function errorCallback(response) {
                deferred.reject(response.data);//请求成功
            });
            return deferred.promise;   // 返回承诺
        }


        function license() {
            var deferred = $q.defer();//声明承诺
            var url = 'api/licenses/license';
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                deferred.resolve(response.data);//请求成功
            }, function errorCallback(response) {
                deferred.reject(response.data);//请求成功
            });
            return deferred.promise;   // 返回承诺
        }

        function isEnabled() {
            var deferred = $q.defer();//声明承诺
            var url = 'api/licenses/enabled';
            $http({
                method: 'GET',
                url: url
            }).then(function successCallback(response) {
                deferred.resolve(response.data);//请求成功
            }, function errorCallback(response) {
                deferred.reject(response.data);//请求成功
            });
            return deferred.promise;   // 返回承诺
        }

    }
})();

(function () {
    'use strict';

    angular.module('oplus.uaa')
        .service('Auth', Auth);

    Auth.$inject = ['$rootScope', '$state', '$sessionStorage', '$q', '$translate', 'jwtAuthService', 'Account', 'LoginService', 'Register', 'Activate', 'Password', 'PasswordResetInit', 'PasswordResetFinish', 'currentUser', '$timeout'];

    function Auth($rootScope, $state, $sessionStorage, $q, $translate, jwtAuthService, Account, LoginService, Register, Activate, Password, PasswordResetInit, PasswordResetFinish, currentUser, $timeout) {
        this.createAccount = createAccount;
        this.updateAccount = updateAccount;
        this.activateAccount = activateAccount;
        this.login = login;
        this.logout = logout;
        this.safeLogin = safeLogin;
        this.accessTokenLogin = accessTokenLogin;
        this.reloadAuthorizeToken = reloadAuthorizeToken;
        this.changePassword = changePassword;
        this.resetPasswordInit = resetPasswordInit;
        this.resetPasswordFinish = resetPasswordFinish;
        this.checkOTP = checkOTP;

        function activateAccount(key, callback) {
            var cb = callback || angular.noop;
            return Activate.get(key,
                function (response) {
                    return cb(response);
                },
                function (err) {
                    return cb(err);
                }.bind(this)).$promise;
        }

        function changePassword(newPassword, callback) {
            var cb = callback || angular.noop;
            return Password.save(newPassword, function () {
                return cb();
            }, function (err) {
                return cb(err);
            }).$promise;
        }

        function createAccount(account, callback) {
            var cb = callback || angular.noop;
            return Register.save(account,
                function () {
                    return cb(account);
                },
                function (err) {
                    logout();
                    return cb(err);
                }.bind(this)).$promise;
        }

        /**
         * login by login name
         *
         * @param credentials
         * @param callback
         * @returns {*}
         */
        function safeLogin(credentials, callback) {
            var cb = callback || angular.noop;
            credentials.isSafe = true;
            return login(credentials, cb);
        }

        /**
         * login by login name and access token
         *
         * @param credentials
         * @param callback
         * @returns {*}
         */
        function accessTokenLogin(credentials, callback) {
            var cb = callback || angular.noop;
            return login(credentials, cb);
        }

        /**
         *
         * @param credentials
         * @param callback
         * @return {Promise<Error?>}
         */
        function login(credentials, callback) {
            var cb = callback || angular.noop;
            var d = $q.defer();

            currentUser.setRememberMe(credentials.rememberMe);

            jwtAuthService.doLogin(credentials).then(function () {
                getAccountInfo(d);
                cb();
            }).catch(function (err) {
                d.reject(err);
                return cb(err);
            });
            return d.promise;
        }

        function checkOTP() {
           return jwtAuthService.checkOTP();
        }

        function reloadAuthorizeToken(callback) {
            var cb = callback || angular.noop;
            var deferred = $q.defer();

            jwtAuthService.reloadAuthorizeToken(callback)
                .then(function (data) {
                    getAccountInfo(deferred);
                    cb();
                })
                .catch(function (err) {
                    logout();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));

            return deferred.promise;
        }


        /**
         * query and cookie user info
         * @param deferred
         */
        function getAccountInfo(deferred) {
            Account.get().$promise.then(getAccountThen)
                .catch(function (e) {
                    currentUser.setUserInfoFromJhipster({});
                    deferred.reject(e);
                });

            function getAccountThen(result) {
                var account = result.data;
                var roles = account.roles;
                var permissions = [];
                var roleNames = [];
                if (roles != null && roles.length > 0) {
                    for (var i in roles) {
                        var roleObj = roles[i];
                        var rolePermissions = roleObj.permissions;
                        roleNames.push(roleObj.name);
                        if (rolePermissions != null && rolePermissions.length > 0) {
                            for (var j in rolePermissions) {
                                var rolePermission = rolePermissions[j];
                                var permissionStr = rolePermission.domain + ":" + rolePermission.action + ":" + rolePermission.target;
                                if (permissions.indexOf(permissionStr) < 0) {
                                    permissions.push(permissionStr);
                                }
                            }
                        }
                    }
                }

                account.authorities = roleNames;
                account.roles = roleNames;
                account.permissions = permissions;

                currentUser.setUserInfoFromJhipster(account, jwtAuthService.getExpireTimestamp());
                deferred.resolve();
            }
        }

        /**
         *
         * @return {Promise}
         */
        function logout() {
            var d = $q.defer();
            jwtAuthService.doLogout().then(function () {
                d.resolve();
            }).catch(function (err) {
                console.error(err);
                d.reject(err);
            }).finally(function () {
                currentUser.clearUserInfo();
            });
            return d.promise;
        }

        function resetPasswordFinish(keyAndPassword, callback) {
            var cb = callback || angular.noop;

            return PasswordResetFinish.save(keyAndPassword, function () {
                return cb();
            }, function (err) {
                return cb(err);
            }).$promise;
        }

        function resetPasswordInit(mail, callback) {
            var cb = callback || angular.noop;

            return PasswordResetInit.save(mail, function () {
                return cb();
            }, function (err) {
                return cb(err);
            }).$promise;
        }

        function updateAccount(account, callback) {
            var cb = callback || angular.noop;

            return Account.save(account,
                function () {
                    return cb(account);
                },
                function (err) {
                    return cb(err);
                }.bind(this)).$promise;
        }
    }
})();

(function () {
    'use strict';

    angular.module('oplus.uaa')
        .service('jwtAuthService', jwtAuthService);

    jwtAuthService.$inject = ['$q', '$http', '$localStorage', '$sessionStorage', '$state', 'restUtils', 'currentUser', 'securityUtils'];

    //TODO: change $http call to restUtils
    /**
     *
     * @param $q
     * @param $http
     * @param $localStorage
     * @param $sessionStorage
     * @param $state
     * @param {restUtils} restUtils
     * @param {currentUser} currentUser
     * @param securityUtils
     */
    function jwtAuthService($q, $http, $localStorage, $sessionStorage, $state, restUtils, currentUser, securityUtils) {
        this.doLogin = doLogin;
        this.doLogout = doLogout;
        this.getExpireTimestamp = getExpireTimestamp;
        this.reloadAuthorizeToken = reloadAuthorizeToken;
        this.checkOTP = checkOTP;

        function getExpireTimestamp() {
            var token = parseJwt(currentUser.authToken);
            return token.exp * 1000;
        }

        function parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
        }

        function checkOTP() {
            return restUtils.callApi('portal', 'GET', '/api/authenticate/otp', null, null);
        }

        /**
         * do not catch exception in the method
         * @param credentials
         * @returns {Promise<Error?>}
         */
        function doLogin(credentials) {
            var d = $q.defer();
            //TODO: why so many data?
            var data = {
                username: securityUtils.encrypt(credentials.username),
                password: securityUtils.encrypt(credentials.password),
                rememberMe: credentials.rememberMe,
                tenantId: credentials.tenantId,
                accessToken: credentials.accessToken,
                refer: credentials.refer,
                fullName: credentials.fullName,
                mobile: credentials.mobile,
                department: credentials.department,
                authMode: credentials.authMode,
                otpCode: securityUtils.encrypt(credentials.otpCode)
            };
            var url = credentials.accessToken ? 'api/authenticate/accessToken' : (credentials.isSafe ? 'api/authenticate/safe' : 'api/authenticate');
            // console.log('Login to tenant [' + credentials.tenantId + '] with URL: ' + url);
            var promise = $http.post(url, data);
            promise.then(function successCallback(resp) {
                saveAuthToken(resp.data, resp.status, resp.headers, credentials.rememberMe)
                d.resolve();
            }, function errorCallback(resp) {
                d.reject(resp.data.error || resp.data);
            });
            return d.promise;
        }


        function reloadAuthorizeToken() {
            if (currentUser.authToken) {
                console.log("Try to refresh jwt token");
                return $http.get('api/authenticate/refresh').then(function (resp) {
                    saveAuthToken(resp.data, resp.status, resp.headers);
                });
            }
        }

        function saveAuthToken(data, status, headers) {
            var authToken;
            var headerAuth = headers('Authorization');
            if (headerAuth) {
                // Remove 'Bearer '
                authToken = headerAuth.substr(7);
            } else {
                authToken = data.id_token;
            }
            if (authToken) {
                currentUser.authToken = authToken;
            }
        }

        /**
         *
         * @return {Promise}
         */
        function doLogout() {
            return restUtils.callApi('portal', 'GET', '/api/logout', null, null);
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('Activate', Activate);

    Activate.$inject = ['$resource'];

    function Activate ($resource) {
        var service = $resource('api/activate', {}, {
            'get': { method: 'GET', params: {}, isArray: false}
        });

        return service;
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .factory('Account', Account);

    Account.$inject = ['$resource'];

    function Account ($resource) {
        var service = $resource('api/account', {}, {
            'get': { method: 'GET', params: {}, isArray: false,
                interceptor: {
                    response: function(response) {
                        // expose response
                        return response;
                    }
                }
            }
        });

        return service;
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('settings', {
            parent: 'account',
            url: '/settings',
            data: {
                authorities: [],
                pageTitle: 'global.menu.account.settings'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/uaa/settings/settings.html',
                    controller: 'SettingsController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('settings');
                //     return $translate.refresh();
                // }]
            }
        });
    }
})();

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

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('requestReset', {
            parent: 'account',
            url: '/reset/request',
            data: {
                authorities: []
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/uaa/reset/request/reset.request.html',
                    controller: 'RequestResetController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('reset');
                //     return $translate.refresh();
                // }]
            }
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .controller('RequestResetController', RequestResetController);

    RequestResetController.$inject = ['$timeout', 'Auth', 'errorConstants'];

    function RequestResetController ($timeout, Auth, errorConstants) {
        var vm = this;

        vm.error = null;
        vm.errorEmailNotExists = null;
        vm.requestReset = requestReset;
        vm.resetAccount = {};
        vm.success = null;

        $timeout(function (){angular.element('#email').focus();});

        function requestReset () {

            vm.error = null;
            vm.errorEmailNotExists = null;

            Auth.resetPasswordInit(vm.resetAccount.email).then(function () {
                vm.success = 'OK';
            }).catch(function (response) {
                vm.success = null;
                if (response.status === 400 && angular.fromJson(response.data).type === errorConstants.EMAIL_NOT_FOUND_TYPE) {
                    vm.errorEmailNotExists = 'ERROR';
                } else {
                    vm.error = 'ERROR';
                }
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('finishReset', {
            parent: 'account',
            url: '/reset/finish?key',
            data: {
                authorities: []
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/uaa/reset/finish/reset.finish.html',
                    controller: 'ResetFinishController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('reset');
                //     return $translate.refresh();
                // }]
            }
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .controller('ResetFinishController', ResetFinishController);

    ResetFinishController.$inject = ['$stateParams', '$timeout', 'Auth', 'LoginService'];

    function ResetFinishController ($stateParams, $timeout, Auth, LoginService) {
        var vm = this;

        vm.keyMissing = angular.isUndefined($stateParams.key);
        vm.confirmPassword = null;
        vm.doNotMatch = null;
        vm.error = null;
        vm.finishReset = finishReset;
        vm.login = LoginService.open;
        vm.resetAccount = {};
        vm.success = null;

        $timeout(function (){angular.element('#password').focus();});

        function finishReset() {
            vm.doNotMatch = null;
            vm.error = null;
            if (vm.resetAccount.password !== vm.confirmPassword) {
                vm.doNotMatch = 'ERROR';
            } else {
                Auth.resetPasswordFinish({key: $stateParams.key, newPassword: vm.resetAccount.password}).then(function () {
                    vm.success = 'OK';
                }).catch(function () {
                    vm.success = null;
                    vm.error = 'ERROR';
                });
            }
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('register', {
            parent: 'account',
            url: '/register',
            data: {
                authorities: [],
                pageTitle: 'register.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/uaa/register/register.html',
                    controller: 'RegisterController',
                    controllerAs: 'vm'
                }
            },
            // resolve: {
            //     translatePartialLoader: ['$translate', function ($translate) {
            //         $translatePartialLoader.addPart('register');
            //         return $translate.refresh();
            //     }]
            // }
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .controller('RegisterController', RegisterController);


    RegisterController.$inject = ['$translate', '$timeout', 'Auth', 'LoginService', 'errorConstants'];

    function RegisterController ($translate, $timeout, Auth, LoginService, errorConstants) {
        var vm = this;

        vm.doNotMatch = null;
        vm.error = null;
        vm.errorUserExists = null;
        vm.login = LoginService.open;
        vm.register = register;
        vm.registerAccount = {};
        vm.success = null;

        $timeout(function (){angular.element('#login').focus();});

        function register () {
            if (vm.registerAccount.password !== vm.confirmPassword) {
                vm.doNotMatch = 'ERROR';
            } else {
                vm.registerAccount.langKey = $translate.use();
                vm.doNotMatch = null;
                vm.error = null;
                vm.errorUserExists = null;
                vm.errorEmailExists = null;

                Auth.createAccount(vm.registerAccount).then(function () {
                    vm.success = 'OK';
                }).catch(function (response) {
                    vm.success = null;
                    if (response.status === 400 && angular.fromJson(response.data).type === errorConstants.LOGIN_ALREADY_USED_TYPE) {
                        vm.errorUserExists = 'ERROR';
                    } else if (response.status === 400 && angular.fromJson(response.data).type === errorConstants.EMAIL_ALREADY_USED_TYPE) {
                        vm.errorEmailExists = 'ERROR';
                    } else {
                        vm.error = 'ERROR';
                    }
                });
            }
        }
    }
})();

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

/* globals $ */
(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .directive('passwordStrengthBar', passwordStrengthBar);

    function passwordStrengthBar () {
        var directive = {
            replace: true,
            restrict: 'E',
            template: '<div id="strength">' +
                '<small data-translate="global.messages.validate.newpassword.strength">Password strength:</small>' +
                '<ul id="strengthBar">' +
                '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>' +
                '</ul>' +
                '</div>',
            scope: {
                passwordToCheck: '='
            },
            link: linkFunc
        };

        return directive;

        /* private helper methods*/

        function linkFunc(scope, iElement) {
            var strength = {
                colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
                mesureStrength: function (p) {

                    var _force = 0;
                    var _regex = /[$-/:-?{-~!"^_`\[\]]/g; // "

                    var _lowerLetters = /[a-z]+/.test(p);
                    var _upperLetters = /[A-Z]+/.test(p);
                    var _numbers = /[0-9]+/.test(p);
                    var _symbols = _regex.test(p);

                    var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
                    var _passedMatches = $.grep(_flags, function (el) {
                        return el === true;
                    }).length;

                    _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
                    _force += _passedMatches * 10;

                    // penalty (short password)
                    _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

                    // penalty (poor variety of characters)
                    _force = (_passedMatches === 1) ? Math.min(_force, 10) : _force;
                    _force = (_passedMatches === 2) ? Math.min(_force, 20) : _force;
                    _force = (_passedMatches === 3) ? Math.min(_force, 40) : _force;

                    return _force;

                },
                getColor: function (s) {

                    var idx;
                    if (s <= 10) {
                        idx = 0;
                    }
                    else if (s <= 20) {
                        idx = 1;
                    }
                    else if (s <= 30) {
                        idx = 2;
                    }
                    else if (s <= 40) {
                        idx = 3;
                    }
                    else {
                        idx = 4;
                    }

                    return { idx: idx + 1, col: this.colors[idx] };
                }
            };
            scope.$watch('passwordToCheck', function (password) {
                if (password) {
                    var c = strength.getColor(strength.mesureStrength(password));
                    iElement.removeClass('ng-hide');
                    iElement.find('ul').children('li')
                        .css({ 'background-color': '#DDD' })
                        .slice(0, c.idx)
                        .css({ 'background-color': c.col });
                }
            });
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('password', {
            parent: 'account',
            url: '/password',
            data: {
                authorities: [],
                pageTitle: 'global.menu.account.password'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/uaa/password/password.html',
                    controller: 'PasswordController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                // translatePartialLoader: ['$translate', function ($translate) {
                //     $translatePartialLoader.addPart('password');
                //     return $translate.refresh();
                // }]
            }
        });
    }
})();

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

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('activate', {
            parent: 'account',
            url: '/activate?key',
            data: {
                authorities: [],
                pageTitle: 'activate.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/modules/uaa/activate/activate.html',
                    controller: 'ActivationController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .controller('ActivationController', ActivationController);

    ActivationController.$inject = ['$stateParams', 'Auth', 'LoginService'];

    function ActivationController ($stateParams, Auth, LoginService) {
        var vm = this;

        Auth.activateAccount({key: $stateParams.key}).then(function () {
            vm.error = null;
            vm.success = 'OK';
        }).catch(function () {
            vm.success = null;
            vm.error = 'ERROR';
        });

        vm.login = LoginService.open;
    }
})();

(function() {
    'use strict';

    angular
        .module('oplus.uaa')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('account', {
            abstract: true,
            parent: 'app'
        });
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .controller('LoginMainController', LoginMainController);

    LoginMainController.$inject = ['$rootScope', '$state'];

    function LoginMainController($rootScope, $state) {
        var that = this;
        this.logoNavbarPath = window.$oplus.appConfig.ui.headerLogo;
        $rootScope.$global.hideHeader = true;
        $rootScope.$global.settings.navigationMode = 'usermode';
        //Recommended version to support flexbox: https://caniuse.com/flexbox-gap
        //Minimum version to support ES6: https://caniuse.com/es6
        this.browsers = {
            chrome: {icon: 'fa-chrome', version: '84', min: '60'},
            firefox: {icon: 'fa-firefox', version: '63', min: '60'},
            edge: {icon: 'edge', version: '84', min: '16'},
            safari: {icon: 'safari', version: '14.1', min: '12'}
        };


        // vm.browerSupport = Object.keys(window.$oplus.appConfig.supportBrowser).map(function (value) {
        //     var version = window.$oplus.appConfig.supportBrowser[value].latestVersion;
        //     return value + (version === '0' ? '' : (' ' + version + '+'));
        // }).join(', ');
    }
})();

(function () {
    'use strict';

    angular
        .module('oplus.uaa')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('app.login_main', {
                url: '/login',
                data: {
                    hideDesktop: true
                },
                views: {
                    'navbar@': {template: ''},
                    'content@': {
                        templateUrl: 'app/modules/uaa/login/login-main.html',
                        controller: 'LoginMainController',
                        controllerAs: 'loginMainVm'
                    }
                }
            })
            .state('app.login_certification', {
                animation: true,
                url: '/login-certification?code&state',
                views: {
                    'navbar@': {template: ''},
                    'content@': {
                        templateUrl: 'app/modules/uaa/login/login-certification.html',
                        controller: 'LoginCertController',
                        controllerAs: 'loginCertVm'
                    }
                }
            });
    }
})();


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

(function () {
    'use strict';

    angular.module('oplus.uaa')
        .component('opLogin', {
            templateUrl: 'app/modules/uaa/login/login.component.html',
            controller: ['$scope', '$rootScope', '$state', '$timeout', 'Auth', '$uibModalStack', '$uibModal', 'licenseService', 'windowInit','$translate', LoginController],
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
     * @constructor
     */
    function LoginController($scope, $rootScope, $state, $timeout, Auth, $uibModalStack, $uibModal, licenseService, windowInit,$translate) {
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
