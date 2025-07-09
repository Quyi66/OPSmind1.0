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
                    }
                    apiServer = location.origin;
                }
                return apiServer;
            }
        }
    }
})();

(function () {

    'use strict';
    angular.module('OplusApp', ['oplus.main']);
    angular.module('oplus.main', [
        'ui.router',
        'ui.router.state.events',
        'ui.bootstrap',
        'ngResource',
        'ngStorage',
        'ngCookies',
        'ngAnimate',
        'ngSanitize',
        'ngCacheBuster',
        'ngAria',
        'ngLocale',
        'tmh.dynamicLocale',
        'pascalprecht.translate',
        'ngFileUpload',
        'infinite-scroll',
        'angular-loading-bar',
        // 'angulartics',
        // 'angulartics.piwik',
        'oplus.layout',
        'oplus.commons',
        'oplus.dev',
        'oplus.uaa',
        'oplus.dts',
        'oplus.udp',
        'oplus.jao',
        'oplus.acm',
        'oplus.gfs',
        'oplus.cac',
        'oplus.app',
        'oplus.adm',
        'oplus.ssc',
        'oplus.mac',
        'oplus.search',
        'oplus.flow',
        'oplus.os'
    ]);
    angular.module('oplus.main').config(['commonsConfigProvider', function (commonsConfigProvider) {
        var value = _.get(window.$oplus.appConfig, 'modules.udp.dataEx.defaultUnresolvedVar');
        // console.log('window.$oplus.appConfig.modules.udp.dataEx.defaultUnresolvedVar="'+value+'"');
        commonsConfigProvider.setDataExDefaultUnresolvedVar(value);
    }]);
    angular.module('oplus.main').run(['mainInit', function (mainInit) {
        mainInit.init();
    }]);
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/23, moved from oplus-portal-web and massive code refactor
 */
(function () {
    angular.module('oplus.main').service('tenantConfigInit', ['$log', '$q', '$http', '$state', '$sessionStorage', 'currentUser', 'Auth', 'messageService', tenantConfigInit]);

    /**
     * @ngdoc service
     * @name tenantConfigInit
     * @description
     * Config application with distribution profile and tenant information.
     *
     * Logic:
     * 1. Read app config of dist env and merge with appConfig
     * 2. Parse app running mode from location URL. `/oplus/<tenantCode>` for normal mode, `/oplus-admin` for system admin mode
     * 3. If this is normal mode:
     *    1) Load all tenants info.
     *    2) If tenant not exists or not activated, throw error
     *    3) Otherwise, merge tenant config with appConfig
     * 4. Change browser title and icon with env config
     * @param {$log} $log
     * @param $q
     * @param $http
     * @param $state
     * @param $sessionStorage
     * @param {currentUser} currentUser
     * @param Auth
     * @param {messageService} messageService
     * @constructor
     */
    function tenantConfigInit($log, $q, $http, $state, $sessionStorage, currentUser, Auth, messageService) {
        var NORMAL_MODE = 'NORMAL';
        var SYSADMIN_MODE = 'SYSADMIN';
        this.initDynamicAppConfig = initDynamicAppConfig;

        /**
         * Load tenant config from DB and merge with appConfig.
         * @return {Promise}
         */
        function initDynamicAppConfig() {
            var d = $q.defer();
            var result = detectRunningMode();
            if (result.runningMode === NORMAL_MODE) {
                var tenantCode = result.tenantCode;
                mergeDynamicTenantConfig(window.$oplus.appConfig, tenantCode).then(function () {
                    // console.log('%c[AppConfig]%c app config ready %o', 'color:teal', '', window.$oplus.appConfig);
                    updateTitleAndLogo();
                    d.resolve();
                }).catch(function (err) {
                    d.reject(err);
                });
            } else if (result.runningMode === SYSADMIN_MODE) {
                updateTitleAndLogo();
                d.resolve();
            } else {
                d.reject(new Error('Invalid URL ' + window.location.href));
            }
            return d.promise;
        }

        /**
         * Load tenant config from DB and merge with app config object.
         * This is async call.
         * @param {{tenantId:string,tenantCode:string}} config Config to merge. Extra fields of `tenantId` and `tenantCode` will be added.
         * @param {string} tenantCode
         * @return {Promise<>}
         */
        function mergeDynamicTenantConfig(config, tenantCode) {
            var d = $q.defer();
            loadAllTenants().then(function (tenants) {
                var tenant = _.find(tenants, {code: tenantCode});
                if (!tenant) {
                    d.reject(new Error('TenantNotFound: ' + tenantCode));
                    return;
                }
                if (!tenant.activated) {
                    d.reject(new Error('TenantNotActivated: ' + tenantCode));
                    return;
                }
                config.tenantCode = tenant.code;
                config.tenantId = tenant.id;
                _.merge(config, tenant.config);
                d.resolve();
            }).catch(function (err) {
                d.reject(err);
            });
            return d.promise;
        }

        /**
         * set app name and app icon
         */
        function updateTitleAndLogo() {
            if (document.getElementById("oplusAppName")) {
                document.getElementById("oplusAppName").innerHTML = window.$oplus.appConfig.name;
                document.getElementById("oplusAppIcon").setAttribute('href', window.$oplus.appConfig.ui.logo);
            }
        }

        /**
         *
         * @return {{runningMode: string, tenantCode: string}}
         */
        function detectRunningMode() {
            var result = {runningMode: '', tenantCode: ''};
            var pathname = window.location.pathname;
            var match = pathname.match(/\/oplus\/(.*?)\//);
            if (match) {
                result.runningMode = NORMAL_MODE;
                result.tenantCode = match[1];
            } else {
                match = pathname.match(/\/oplus-admin/);
                if (match) {
                    result.runningMode = SYSADMIN_MODE;
                }
            }
            return result;
        }

        /**
         * Load all tenant infos from DB
         * @returns {Promise<[{id:string,accessToken:string,name:string,code:string,config:{},activated:boolean}]>}
         */
        function loadAllTenants() {
            var d = $q.defer();
            //TODO: change to restUtils
            $http.get(window.$oplus.appConfig.apiBaseUrls.portal + "/api/tenants/all").then(function (resp) {
                var dbTenants = resp.data;
                d.resolve(_.map(dbTenants, function (t) {
                    var parsed = {
                        id: t.id,
                        tenantId: t.id,
                        code: t.code,
                        activated: t.activated,
                        accessToken: t.accessToken,
                        config: {}
                    };
                    if (t.config) {
                        try {
                            parsed.config = JSON.parse(t.config);
                        } catch (e) {
                            console.error('Fail to parse tenant [' + t.code + '] config json: ' + t.config);
                        }
                    }
                    return parsed;
                }));
            }, function onError(resp) {
                d.reject(resp.data); //请求失败
            });
            return d.promise;
        }
    }
})();

/**
 * @author Leo Liao(leoliaolei@gmail.com), 2021/12/27, created
 */
(function () {
    'use strict';
    angular.module('oplus.main').service('mainInit',['messageService', 'tenantConfigInit', 'windowInit', 'i18nService', 'currentUser', mainInit]);

    /**
     * @ngdoc service
     * @name mainInit
     * @description
     * Main bootstrap to init the application.
     * @param {messageService} messageService
     * @param {tenantConfigInit} tenantConfigInit
     * @param {windowInit} windowInit
     * @param {i18nService} i18nService
     * @param {currentUser} currentUser
     */
    function mainInit(messageService, tenantConfigInit, windowInit, i18nService, currentUser) {
        this.init = init;

        function init() {
            tenantConfigInit.initDynamicAppConfig().then(function () {
                var appConfig = window.$oplus.appConfig;
                console.log('%c[MainRunInit]%c AppConfig:', 'color:teal', '', {
                    profile: appConfig.profileId,
                    tenantCode: appConfig.tenantCode,
                    tenantId: appConfig.tenantId
                });
                currentUser.readLocalUserInfo();
                console.log('%c[MainRunInit]%c Local User: %s', 'color:teal', '', currentUser.basicUserInfo().loginId);
                return i18nService.initLanguage();
            }).then(function (lang) {
                console.log('%c[MainRunInit]%c User Language: %s', 'color:teal', '', lang);
                return windowInit.initRun();
            }).then(function (changes) {
                console.log('%c[MainRunInit]%c Applet Routers: %d updated', 'color:teal', '', changes.length);
                console.log('%c[MainRunInit]%c COMPLETED', 'color:teal', '');
            }).catch(function (err) {
                var match = /^(TenantNotFound|TenantNotActivated):(.*)/.exec(err.message);
                if (match) {
                    var tenantCode = match[2].trim();
                    messageService.alertError('Error', 'Invalid tenant "' + tenantCode + '". Please check the URL is correct. ' + err.message);
                } else {
                    console.error(err);
                    throw err;
                }
            });
        }
    }
})();

'use strict';

angular.module('oplus.main').config(['$stateProvider', '$urlRouterProvider', 'tenantUtilProvider',
        /**
         *
         * @param $stateProvider
         * @param $urlRouterProvider
         * @param {tenantUtilProvider} tenantUtilProvider
         */
        function ($stateProvider, $urlRouterProvider, tenantUtilProvider) {
            var homeContent;
            if (tenantUtilProvider.isTenantAdminUI()) {
                homeContent = {
                    templateUrl: 'app/modules/layout/home/admin/home.html'
                }
            } else {
                homeContent = {
                    template: '<div ui-view="mainView" class="h-100"></div>'
                }
            }
            homeContent.controller = ['$rootScope', '$state', 'currentUser', function ($rootScope, $state, currentUser) {
                if (!currentUser.isAuthenticated) {
                    console.log('%cRedirect from home to login because user has not logged in', 'color:orange');
                    $state.go('app.login_main');
                }
            }];
            $stateProvider.state('app', {
                abstract: true,
                views: {
                    'navbar@': {
                        template: '<op-taskbar></op-taskbar>'
                    },
                    'content@': {
                        template: '<div ui-view="mainView" class="h-100"></div>'
                    }
                }/*,
                resolve: {
                    //TODO: problem! it will execute multiple times
                    tenantLoader: ['tenantConfigInit', function (tenantConfigInit) {
                        console.warn('%cTenantConfig: Init only once...','color:yellow');
                        return tenantConfigInit.initDynamicAppConfig();
                    }]
                }*/
            });
            $stateProvider.state('app.home', {
                url: '/home',
                views: {
                    'content@': homeContent
                }
            });
            $urlRouterProvider.otherwise('/home');
        }
    ]
);
(function () {
    'use strict';

    angular.module('oplus.main')
        // .config(['AppConfigProvider', function (AppConfigProvider) {
        //     AppConfigProvider.init();
        // }])
        // .config(['restUtilsProvider', function (restUtilsProvider) {
        //     Object.keys(window.$oplus.appConfig.apiBaseUrls).forEach(function (module) {
        //         restUtilsProvider.registerModuleApi(module, window.$oplus.appConfig.apiBaseUrls[module]);
        //     });
        // }])
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push(['$q', function ($q) {
                return {
                    'request': function (config) {
                        var url = config.url;
                        // Intercept jhipster API
                        if (url.indexOf('management/') === 0 ||
                            (url.indexOf('api/') === 0 && url.indexOf('api/data') !== 0)) {
                            // var baseUrl = window.$oplus.appConfig.apiBaseUrls.portal;
                            // config.url = baseUrl + '/' + config.url;
                            // console.log(url);
                            return config || $q.when(config);
                        } else {
                            return config;
                        }
                    }
                }
            }])
        }])
        .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
        }])
        .config(['$uibModalProvider', function ($uibModalProvider) {
            // https://stackoverflow.com/questions/39626752/disabling-animation-for-angular-ui-bootstrap-modals-completely
            $uibModalProvider.options.animation = false;
        }]);

})();

(function () {
    'use strict';

    angular.module('oplus.main').controller('MainCtrl', ['$scope', '$interval', '$rootScope', '$localStorage', '$window', 'userPref', 'currentUser', 'devel', 'tenantUtil', MainCtrl]);

    /**
     * @ngdoc controller
     * @name MainCtrl
     * @description Main controller.
     * @param $scope
     * @param $interval
     * @param $rootScope
     * @param $localStorage
     * @param $window
     * @param {userPref} userPref
     * @param {currentUser} currentUser
     * @param {devel} devel
     * @param {tenantUtil} tenantUtil
     * @constructor
     */
    function MainCtrl($scope, $interval, $rootScope, $localStorage, $window, userPref, currentUser, devel, tenantUtil) {
        var that = this;
        var imageUrls;
        var wallpaperTimer;
        this.toasterOptions = {
            'position-class': 'toast-top-right',
            'close-button': true,
            'time-out': {'toast-success': 500},
            limit: 1
        };
        this.uiConfig = {
            useWindowUI:window.$oplus.appConfig.useWindowUI,
            backgroundColor: window.$oplus.appConfig.ui.backgroundColor,
            backgroundImage: 'none'
        }
        this.$onInit = onInit;

        function onInit() {
            initGlobalEvent($scope);
            if (window.$oplus.appConfig.ui.wallpaperEnabled) {
                var wallpapers = [].concat(window.$oplus.appConfig.ui.wallpapers);
                var pathPrefix = 'content/images/wallpaper/';
                imageUrls = _.map(wallpapers, function (path) {
                    return 'url(\'' + pathPrefix + path + '\')'
                })
                if (imageUrls) {
                    wallpaperTimer = $interval(function () {
                        changeWallpaper();
                    }, window.$oplus.appConfig.ui.wallpaperChangeInterval * 1000);
                }
                changeWallpaper();
            }

            $rootScope.$global = {
                isAdminUI: tenantUtil.isOplusAdminUI(),
                userPref: userPref.load(),
                currentUser: currentUser,
                viewMode: devel.needMobileView() ? 'mobile' : '',
                settings: {
                    homeBg: '',
                    asideFolded: false,
                    asideDock: false
                }
            };

            // save settings to local storage
            // if (angular.isDefined($localStorage.settings)) {
            //     $rootScope.$global.settings = $localStorage.settings;
            // } else {
            //     $localStorage.settings = $rootScope.$global.settings;
            // }
            $scope.$watch('$global.settings', function () {
                // save to local storage
                // $localStorage.settings = $scope.$global.settings;
            }, true);
            $scope.$on('$destroy', function () {
                if (wallpaperTimer) {
                    $interval.cancel(wallpaperTimer);
                    wallpaperTimer = undefined;
                }
            });
            $rootScope.$watch('$global.userPref', function (newVal, oldVal) {
                userPref.merge(newVal);
            }, true);
        }


        function changeWallpaper() {
            that.uiConfig.backgroundImage = imageUrls[_.random(0, imageUrls.length - 1)];
        }

        //TODO: where to put global jquery event?
        function initGlobalEvent($scope) {
            var $body = $('body');
            $body.on('click.udp', '.udp-linelimit', function () {
                var elem = $(this);
                elem.toggleClass('expanded');
                // If in a table row, toggle the whole row
                elem.closest('tr').find('.udp-linelimit').not(this).toggleClass('expanded');
            });
            $scope.$on('$destroy', function () {
                $body.off('click.udp');
            });
        }
    }
})();

(function () {
    'use strict';
    angular.module('oplus.main')
        .provider('tenantUtil', tenantUtil);

    tenantUtil.$inject = [];

    /**
     * @ngdoc provider
     * @name tenantUtilProvider
     */
    function tenantUtil() {

        /**
         * 是否是多租户环境
         * @returns {boolean}
         */
        function useMultiTenantEnv() {
            return window.$oplus.appConfig.useMultiTenant;
        }

        /**
         * 是否是多租户系统管理界面
         *
         * @returns {boolean}
         */
        function isTenantAdminUI() {
            return this.useMultiTenantEnv() && !!window.location.href.match(/\/oplus-admin\//);
        }

        /**
         * 当前环境是否是 oplus-admin
         * 非多租户可能部署在更目录下
         * 不区分是否是多租户模式
         *
         * @returns {boolean}
         */
        function isOplusAdminUI() {
            return !!window.location.href.match(/\/oplus-admin\//) || !window.location.href.match(/\/oplus\//);
        }

        var service = {
            useMultiTenantEnv: useMultiTenantEnv,
            isTenantAdminUI: isTenantAdminUI,
            isOplusAdminUI: isOplusAdminUI,
        };

        this.useMultiTenantEnv = useMultiTenantEnv;
        this.isTenantAdminUI = isTenantAdminUI;
        this.isOplusAdminUI = isOplusAdminUI;

        this.$get = function () {
            return service;
        }
    }
})();

(function () {
    'use strict';

    angular.module('oplus.main')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('app.error', {
                // parent: 'app',
                url: '/error?errorMessage&hideHeader',
                views: {
                    'navbar@': {template: ''},
                    'content@': {
                        templateUrl: 'app/modules/main/error.html',
                        controller: 'ErrorController',
                        controllerAs: 'errorVm'
                    }
                },
                data: {
                    hideDesktop: true
                },
                resolve: {
                    entity: ['$stateParams', function ($stateParams) {
                        return {hideHeader: $stateParams.hideHeader, errorMessage: $stateParams.errorMessage}
                    }]
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('error');
                    //     return $translate.refresh();
                    // }]
                }
            })
            .state('app.accessdenied', {
                url: '/accessdenied',
                data: {
                    authorities: []
                },
                views: {
                    'master@': {
                        templateUrl: 'app/modules/main/accessdenied.html'
                    }
                },
                resolve: {
                    // translatePartialLoader: ['$translate', function ($translate) {
                    //     $translatePartialLoader.addPart('error');
                    //     return $translate.refresh();
                    // }]
                }
            });
    }
})();

(function () {
    'use strict';

    angular.module('oplus.main').controller('ErrorController', ErrorController);
    ErrorController.$inject = ['$rootScope', 'entity'];

    function ErrorController($rootScope, entity) {
        this.errorMessage = entity.errorMessage;
    }
})();
