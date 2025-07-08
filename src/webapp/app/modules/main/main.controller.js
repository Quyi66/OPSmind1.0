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
