(function () {
    window['@oplus/init'] = {
        // API_GATEWAY_URL is the URL of API gateway. 
        // If its value is blank or not in format of `http(s)://`, application will regard gateway is the same as web server.
        // API_GATEWAY_URL: window.location.protocol + "//" + 'oplus.famessoft.com',
        API_GATEWAY_URL: window.location.protocol + "//" + 'localhost',
        // The ID of distribution profile. Profiles defined in profiles.js.
        DIST_PROFILE: 'prod'
    };
})();