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
