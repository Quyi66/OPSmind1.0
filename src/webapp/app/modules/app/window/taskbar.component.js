/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/23/2017
 * @author Leo Liao (leoliaolei@gmail.com), 2021/12/18, extracted from header.component
 */
(function () {
    'use strict';

    angular.module('oplus.udp').component('opTaskbar', {
        templateUrl: 'app/modules/app/window/taskbar.component.html',
        controller: ['$scope', '$compile', '$timeout', TaskbarCtrl]
    });

    /**
     *
     * @param $scope
     * @param {$compile} $compile
     * @param $timeout
     */
    function TaskbarCtrl($scope, $compile, $timeout) {
        this.useWindowUI = window.$oplus.appConfig.useWindowUI;
        this.logoNavbarPath = window.$oplus.appConfig.ui.headerLogo;
        this.barBackgroundColor = window.$oplus.appConfig.ui.barBackgroundColor;
    }
})();
