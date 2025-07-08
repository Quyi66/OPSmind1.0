/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020/04/28.
 */

(function () {
    'use strict';
    angular.module('oplus.udp').service('udpModuleConfig', udpModuleConfig);

    udpModuleConfig.$inject = ['$state'];

    /**
     * @ngdoc service
     * @name udpModuleConfig
     * @description
     * Define configurable options for UDP module. Since the configuration is optional, the values of options shall be `false` be default
     * @param $state
     */
    function udpModuleConfig($state) {
        var module = 'udp';
        var storageKey = 'oplus.' + module;
        var config = this;
        this.restrictedMode = false;
        this.devMode = false;
        this.$update = $update;
        readConfig(storageKey);

        function readConfig(key) {
            _.extend(config, JSON.parse(localStorage.getItem(key) || '{}'));
        }

        function $update() {
            localStorage.setItem(storageKey, JSON.stringify(config));
        }
    }

    angular.module('oplus.udp').controller('UdpConfigCtrl', UdpConfigCtrl);

    UdpConfigCtrl.$inject = ['$scope', 'udpModuleConfig'];

    /**
     *
     * @param $scope
     * @param {udpModuleConfig} udpModuleConfig
     */
    function UdpConfigCtrl($scope, udpModuleConfig) {
        this.config = udpModuleConfig;
        $scope.$watch('$ctrl.config', function (newVal, oldVal) {
            if (newVal === oldVal) return;
            udpModuleConfig.$update();
        }, true);
    }
})();
