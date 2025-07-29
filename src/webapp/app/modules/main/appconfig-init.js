/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/23, moved from oplus-portal-web and massive code refactor
 */
(function () {
    initStaticAppConfig(window['@oplus/init']);
    delete window['@oplus/init'];

    /**
     * Init app config from static defined configurations.
     * @param {object} init Init config
     * @param {string} init.DIST_PROFILE ID of dist profile
     * @param {string} init.API_GATEWAY_URL API server in format of 'http://api-gateway-host[:port][/path/prefix]'
     * @param {[{profileId:string,name:string}]} init.profiles Definitions of dist profile
     */
    function initStaticAppConfig(init) {
        var profileId = init.DIST_PROFILE;
        var distEnvDefs = init.profiles;
        var defaultProfile = _.find(distEnvDefs, {profileId: '$DEFAULT_PROFILE$'});
        var specProfile = _.find(distEnvDefs, {profileId: profileId});
        window.$oplus = {appConfig: _.merge({}, defaultProfile, specProfile)};
        completeApiUrls(window.$oplus.appConfig.apiBaseUrls);

        /**
         *
         * @param {object} apiBaseUrls Key is module name, value is API base url of this module
         */
        function completeApiUrls(apiBaseUrls) {
            var apiServer = determineApiServer();
            for (var module in apiBaseUrls) {
                var apiUlr = apiBaseUrls[module];
                if (!apiUlr.match(/^http[s]?:\/\//)) {
                    apiBaseUrls[module] = apiServer + apiUlr;
                }
            }

            function determineApiServer() {
                var apiServer;
                if (init.API_GATEWAY_URL && /^http(s)?:\/\//.test(init.API_GATEWAY_URL)) {
                    apiServer = init.API_GATEWAY_URL;
                } else {
                    var location = window.location;
                    if (!location.origin) {
                        apiServer = location.protocol + "//" + location.hostname + (location.port ? ':' + location.port : '');
                    } else {
                        apiServer = location.origin;
                    }
                }
                return apiServer;
            }
        }
    }
})();
