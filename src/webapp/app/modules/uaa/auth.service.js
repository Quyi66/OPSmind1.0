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
