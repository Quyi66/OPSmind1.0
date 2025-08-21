(function () {
    'use strict';

    angular.module('oplus.uaa')
        .service('tokenUrlHandler', TokenUrlHandler);

    TokenUrlHandler.$inject = ['$location', '$q', '$timeout', 'Auth', 'currentUser', 'Account', 'jwtAuthService'];

    /**
     * Token URL处理服务
     * 用于处理从Vue主应用传递过来的token参数，实现统一的token登录入口
     * 
     * @param {object} $location Angular location服务
     * @param {object} $q Promise服务
     * @param {object} $timeout Timeout服务
     * @param {Auth} Auth 认证服务
     * @param {currentUser} currentUser 当前用户服务
     * @param {Account} Account 账户服务
     * @param {jwtAuthService} jwtAuthService JWT认证服务
     */
    function TokenUrlHandler($location, $q, $timeout, Auth, currentUser, Account, jwtAuthService) {
        var LOG_PREFIX = '[TokenUrlHandler]';
        var TOKEN_PARAM_NAME = 'token';
        var processedTokens = new Set(); // 缓存已处理的token，避免重复处理

        this.checkAndProcessToken = checkAndProcessToken;
        this.hasTokenInUrl = hasTokenInUrl;
        this.getTokenFromUrl = getTokenFromUrl;
        this.clearTokenFromUrl = clearTokenFromUrl;
        this.processTokenLogin = processTokenLogin;
        this.isTokenProcessed = isTokenProcessed;
        this.markTokenAsProcessed = markTokenAsProcessed;

        /**
         * 检查URL中是否有来自Vue主应用的token参数并处理
         * @returns {Promise} 返回处理结果的Promise
         */
        function checkAndProcessToken() {
            var deferred = $q.defer();

            try {
                var token = getTokenFromUrl();

                if (token) {
                    // 检查token是否已经处理过
                    if (isTokenProcessed(token)) {
                        console.log(LOG_PREFIX + ' Token已处理过，跳过重复处理');
                        clearTokenFromUrl();
                        deferred.resolve({
                            hasToken: true,
                            alreadyProcessed: true,
                            message: 'Token already processed, skipped'
                        });
                        return deferred.promise;
                    }

                    console.log(LOG_PREFIX + ' 检测到Vue主应用token，开始处理');
                    processTokenLogin(token).then(function(result) {
                        console.log(LOG_PREFIX + ' Token处理完成');
                        // 标记token为已处理
                        markTokenAsProcessed(token);
                        deferred.resolve(result);
                    }).catch(function(error) {
                        console.error(LOG_PREFIX + ' Token处理失败:', error);
                        deferred.reject(error);
                    });
                } else {
                    deferred.resolve({hasToken: false, message: 'No token found in URL, use normal login flow'});
                }
            } catch (error) {
                console.error(LOG_PREFIX + ' 处理token时发生错误:', error);
                deferred.reject(error);
            }

            return deferred.promise;
        }

        /**
         * 检查URL中是否包含token参数
         * @returns {boolean} 是否包含token
         */
        function hasTokenInUrl() {
            var searchParams = $location.search();
            var hasToken = !!(searchParams && searchParams[TOKEN_PARAM_NAME]);
            console.log(LOG_PREFIX + ' 检查URL token参数:', hasToken);
            return hasToken;
        }

        /**
         * 从URL中获取token参数
         * @returns {string|null} token值或null
         */
        function getTokenFromUrl() {
            var searchParams = $location.search();
            var token = searchParams && searchParams[TOKEN_PARAM_NAME] ? searchParams[TOKEN_PARAM_NAME] : null;

            return token;
        }

        /**
         * 从URL中清除token参数
         * 登录成功后清除URL中的敏感信息
         */
        function clearTokenFromUrl() {
            var searchParams = $location.search();
            if (searchParams && searchParams[TOKEN_PARAM_NAME]) {
                delete searchParams[TOKEN_PARAM_NAME];
                $location.search(searchParams);
            }
        }

        /**
         * 处理来自Vue主应用的token（已登录状态的token）
         * @param {string} token JWT token - 来自Vue主应用的已登录token
         * @returns {Promise} 处理结果Promise
         */
        function processTokenLogin(token) {
            var deferred = $q.defer();

            if (!token || typeof token !== 'string' || token.trim().length === 0) {
                var error = 'Invalid token provided';
                console.error(LOG_PREFIX + ' ' + error);
                deferred.reject(new Error(error));
                return deferred.promise;
            }

            // 使用默认的rememberMe设置（通常为false，使用sessionStorage）
            var rememberMe = false;

            // 检查用户是否已经登录
            if (currentUser.isAuthenticated) {
                // 检查是否为同一个token
                if (currentUser.authToken === token.trim()) {
                    clearTokenFromUrl();
                    deferred.resolve({hasToken: true, sameToken: true, message: 'Same token, no action needed'});
                    return deferred.promise;
                } else {
                    // 设置默认rememberMe
                    currentUser.setRememberMe(rememberMe);
                    // 更新当前的认证token
                    currentUser.authToken = token.trim();
                    // 更新本地缓存
                    currentUser.updateLocalUserInfo();
                    clearTokenFromUrl();
                    deferred.resolve({hasToken: true, tokenUpdated: true, message: 'Token updated for authenticated user'});
                    return deferred.promise;
                }
            }

            try {
                // 设置rememberMe，用于确定缓存策略
                currentUser.setRememberMe(rememberMe);

                // 直接设置认证token，不发送登录请求
                currentUser.authToken = token.trim();

                // 使用$timeout确保token设置完成后再调用API
                $timeout(function() {

                    // 直接调用Account服务获取用户信息
                    Account.get().$promise.then(function(result) {
                        // Account服务返回的是response对象，需要取.data
                        var account = result.data;

                        // 处理角色信息（与正常登录流程保持一致）
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

                        // 设置完整的用户信息
                        account.authorities = roleNames;
                        account.roles = roleNames;
                        account.permissions = permissions;

                        // 获取JWT token的过期时间
                        var expireTimestamp = null;
                        try {
                            expireTimestamp = jwtAuthService.getExpireTimestamp();
                        } catch (e) {
                            console.warn(LOG_PREFIX + ' 无法解析JWT过期时间:', e.message);
                        }

                        // 使用标准方法设置用户信息（包含过期时间）
                        currentUser.setUserInfoFromJhipster(account, expireTimestamp);

                        // 清除URL中的token参数
                        $timeout(function() {
                            clearTokenFromUrl();
                        }, 100);

                        deferred.resolve({
                            hasToken: true,
                            tokenSet: true,
                            userInfoLoaded: true,
                            user: currentUser.basicUserInfo(),
                            roles: currentUser.roles,
                            permissions: currentUser.permissions ? currentUser.permissions.length : 0,
                            message: 'Vue app token processed, user info loaded'
                        });

                }).catch(function(error) {
                    console.error(LOG_PREFIX + ' 获取用户信息失败:', error);

                    // 如果获取用户信息失败，至少保持token认证状态
                    var basicUserInfo = {
                        loginId: 'vue-user',
                        displayName: 'Vue用户',
                        authToken: token.trim(),
                        roles: [],
                        permissions: []
                    };

                    // 获取JWT token的过期时间
                    var expireTimestamp = null;
                    try {
                        expireTimestamp = jwtAuthService.getExpireTimestamp();
                    } catch (e) {
                        console.warn(LOG_PREFIX + ' 无法解析JWT过期时间:', e.message);
                    }

                    // 设置基本用户信息并保存到缓存
                    currentUser.setUserInfoFromJhipster(basicUserInfo, expireTimestamp);

                    // 清除URL中的token参数
                    $timeout(function() {
                        clearTokenFromUrl();
                    }, 100);

                    deferred.resolve({
                        hasToken: true,
                        tokenSet: true,
                        userInfoLoaded: false,
                        user: currentUser.basicUserInfo(),
                        message: 'Vue app token processed with basic auth (failed to load user info)'
                    });
                    });
                }, 50); // 延迟50ms确保token设置完成

            } catch (error) {
                console.error(LOG_PREFIX + ' 处理token时发生错误:', error);
                deferred.reject(error);
            }

            return deferred.promise;
        }



        /**
         * 检查token是否已经处理过
         * @param {string} token JWT token
         * @returns {boolean} 是否已处理
         */
        function isTokenProcessed(token) {
            if (!token) return false;

            // 生成token的简短哈希用于比较（避免存储完整token）
            var tokenHash = generateTokenHash(token);
            var isProcessed = processedTokens.has(tokenHash);

            return isProcessed;
        }

        /**
         * 标记token为已处理
         * @param {string} token JWT token
         */
        function markTokenAsProcessed(token) {
            if (!token) return;

            var tokenHash = generateTokenHash(token);
            processedTokens.add(tokenHash);

            // 限制缓存大小，避免内存泄漏
            if (processedTokens.size > 100) {
                var firstItem = processedTokens.values().next().value;
                processedTokens.delete(firstItem);
            }
        }

        /**
         * 生成token的简短哈希
         * @param {string} token JWT token
         * @returns {string} token哈希
         */
        function generateTokenHash(token) {
            // 简单的哈希算法，用于生成token的唯一标识
            var hash = 0;
            if (token.length === 0) return hash.toString();

            for (var i = 0; i < token.length; i++) {
                var char = token.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // 转换为32位整数
            }

            return Math.abs(hash).toString(36);
        }
    }
})();
