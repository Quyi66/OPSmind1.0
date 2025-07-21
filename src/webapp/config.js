(function () {
    window['@oplus/init'] = {
        // API_GATEWAY_URL is the URL of API gateway. 
        // If its value is blank or not in format of `http(s)://`, application will regard gateway is the same as web server.
        // API_GATEWAY_URL: window.location.protocol + "//" + 'test.oplus.com',
        // 在开发环境下，让前端使用当前域名和端口，这样请求会被 webpack dev server 代理
        API_GATEWAY_URL: '',
        // The ID of distribution profile. Profiles defined in profiles.js.
        DIST_PROFILE: 'prod'
    };
})();