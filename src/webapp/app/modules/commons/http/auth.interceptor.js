(function () {
    'use strict';

    angular
        .module('oplus.commons')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$q', 'currentUser', '$injector'];

    function authInterceptor($q, currentUser, $injector) {
        // 使用 $injector 延迟加载 $translate，避免循环依赖
        var $translate;
        var service = {
            request: request
        };

        return service;

        function request(config) {
            if (!config || !config.url) return config;
            config.headers = config.headers || {};

            // LEO@20180108
            // The API URLs in jHipster shipped code are relative path starting with `api` or `management`
            var isJhipsterShippedUrl = /^(api)|(management)\//.test(config.url);
            // var isModuleApi = /(api\/tm\/)|(api\/cm\/)|(api\/cac\/)|(api\/udp\/)|(api\/dts\/)|(api\/pms\/)/.test(config.url);
            var isModuleApi = /(?!^)(\/api\/)/.test(config.url);//非开始位置匹配"api/"
            // console.log(config.url + ' [isPortalApi = ' + isPortalApi + ']  [isModuleApi = ' + isModuleApi + "]");

            var tenantId = window.$oplus.appConfig.tenantId;
            if (tenantId) {
                config.headers['Tenant-Id'] = tenantId;
                // 延迟加载 $translate，避免循环依赖
                if (!$translate) {
                    $translate = $injector.get('$translate');
                }
                config.headers['Language'] = $translate.use();
            }
            // 目前暂时没有对请求参数签名校验，只是简单的防止重放攻击
            var timestamp = Date.now();
            config.headers['Timestamp'] = timestamp;
            // 生成字符串随机数，防止重复攻击
            config.headers['Nonce'] = "oplus-" + Math.random().toString(36).substr(2) + "-" + timestamp;
            // config.headers['Sign'] = generateApiSignature("oplus", "Oplus@2022!sys", {}).signature;
            // console.log("authInterceptor get tenant id is " + tenantId);

            if (isJhipsterShippedUrl) {
                config.url = window.$oplus.appConfig.apiBaseUrls.portal + '/' + config.url;
            } else if (!isModuleApi) {
                //TODO: is this local url like request of webserver JS/HTML/JSON?
                return config;
            }
            if (currentUser.isAuthenticated && config.url.indexOf("api/authenticate/refresh") > -1) {
                //update latest request time for every request
                currentUser.latestRequestTime = Date.now();
            }

            var URLS_WITHOUT_AUTH_TOKEN = [/api\/tenants\/all/, /api\/licenses\/verify/, /api\/authenticate\/otp/, /api\/authenticate/];
            var ignoreAuthToken = _.find(URLS_WITHOUT_AUTH_TOKEN, function (regex) {
                return regex.test(config.url);
            })
            if (ignoreAuthToken) {
                return config;
            }

            var token = currentUser.authToken;
            if (token) {
                // console.log("Run authInterceptor set token for  " + config.url　);
                config.headers.Authorization = 'Bearer ' + token;
            } else {
                console.warn("auth.interceptor: cannot find token...", config.url);
            }

            return config;
        }
    }

    // function generateRandomString(length) {
    //     var result = '';
    //     var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     for (var i = 0; i < length; i++) {
    //         result += characters.charAt(Math.floor(Math.random() * characters.length));
    //     }
    //     return result;
    // }
    //
    // function generateApiSignature(apiKey, apiSecret, params) {
    //     // 生成随机字符串作为 nonce
    //     var nonce = generateRandomString(16);
    //
    //     // 按照字典序对参数进行排序
    //     var keys = Object.keys(params).sort();
    //
    //     // 拼接参数和值
    //     var data = '';
    //     for (var i = 0; i < keys.length; i++) {
    //         data += keys[i] + params[keys[i]];
    //     }
    //
    //     // 计算 HMAC-SHA256 签名
    //     var shaObj = new jsSHA('SHA-256', 'TEXT');
    //     shaObj.setHMACKey(apiSecret, 'TEXT');
    //     shaObj.update(apiKey + nonce + data);
    //     var hmac = shaObj.getHMAC('HEX');
    //
    //     // 返回 API 签名
    //     return {
    //         apiKey: apiKey,
    //         nonce: nonce,
    //         signature: hmac
    //     };
    // }

})();
