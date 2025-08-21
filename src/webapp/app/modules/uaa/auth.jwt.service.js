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
            console.log('%c[JwtAuthService]%c 发送登录请求到:', 'color:green', '', url);
            console.log('%c[JwtAuthService]%c 租户ID:', 'color:green', '', credentials.tenantId);
            if (credentials.accessToken) {
                console.log('%c[JwtAuthService]%c AccessToken长度:', 'color:green', '', credentials.accessToken.length);
            }
            var promise = $http.post(url, data);
            promise.then(function successCallback(resp) {
                console.log('%c[JwtAuthService]%c 登录请求成功，状态码:', 'color:green', '', resp.status);
                saveAuthToken(resp.data, resp.status, resp.headers, credentials.rememberMe)
                d.resolve();
            }, function errorCallback(resp) {
                console.error('%c[JwtAuthService]%c 登录请求失败，状态码:', 'color:green', '', resp.status, resp.data);
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
