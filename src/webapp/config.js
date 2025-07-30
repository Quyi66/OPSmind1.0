(function () {
    window['@oplus/init'] = {
        // API_GATEWAY_URL is the URL of API gateway. 
        // If its value is blank or not in format of `http(s)://`, application will regard gateway is the same as web server.
        // API_GATEWAY_URL: window.location.protocol + "//" + 'test.oplus.com',
        // 强制使用当前服务器作为API网关，确保API请求通过代理
        API_GATEWAY_URL: window.location.origin,
        // The ID of distribution profile. Profiles defined in profiles.js.
        DIST_PROFILE: 'csdc'
    };
})();