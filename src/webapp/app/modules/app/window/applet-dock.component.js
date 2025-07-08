/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/23/2017
 * @author Leo Liao (leoliaolei@gmail.com), 2021/12/18, extracted from header.component
 */
(function () {
    'use strict';

    angular.module('oplus.udp').component('opAppletDock', {
        templateUrl: 'app/modules/app/window/applet-dock.component.html',
        controller: ['$scope', '$state', 'appletRunman', 'appletRegistry', 'runningState', AppletDockCtrl]
    });

    /**
     *
     * @param $scope
     * @param $state
     * @param {appletRunman} appletRunman
     * @param {appletRegistry} appletRegistry
     * @param {runningState} runningState
     */
    function AppletDockCtrl($scope, $state, appletRunman, appletRegistry, runningState) {
        var that = this;
        /**
         *
         * @type {[DockApplet]}
         */
        this.dockApplets = [];
        this.openApplet = appletRunman.openApplet;
        this.$onInit = onInit;

        function onInit() {
            $scope.$watch(function () {
                return appletRegistry.getAppletDefs();
            }, function (newVal, oldVal) {
                if (newVal && newVal.length > 0) {
                    initTaskbarApplet();
                }
            });
            $scope.$watch(function () {
                return runningState.allRunningApplets();
            }, function (newVal, oldVal) {
                if (appletRegistry.getAppletDefs()) {
                    initTaskbarApplet();
                }
            }, true);

            // initTaskbarApplet(that.runningApplets);

            function initTaskbarApplet() {
                var runningApplets = runningState.allRunningApplets();
                // console.log('initTaskbarApplet: ', {
                //     running: runningApplets,
                //     dockApplets: appletRegistry.getDockApplets()
                // });
                that.dockApplets = [];
                appletRegistry.getDockApplets().forEach(function (applet) {
                    updateTaskbarApplet(applet.code);
                });
                if (runningApplets) {
                    runningApplets.forEach(function (app) {
                        updateTaskbarApplet(app.code, true, app.active, app.url);
                    });
                }
            }

            function updateTaskbarApplet(appletCode, running, active, url) {
                if (!window.$oplus.appConfig.useWindowUI) return;
                var docked = _.find(that.dockApplets, {code: appletCode});
                if (docked) {
                    _.merge(docked, {running: running, active: active, url: url});
                    // docked.running = running;
                    // docked.active = active;
                } else {
                    var def = appletRegistry.findAppletDef(appletCode);
                    if (def) {
                        // applet = {
                        //     code: def.code,
                        //     title: def.title,
                        //     icon: def.icon,
                        //     color: def.color,
                        //     active: active,
                        //     running: running,
                        //     url: url
                        // }
                        docked = new DockApplet(def);
                        _.merge(docked, {active: active, running: running, url: url});
                        that.dockApplets.push(docked);
                    }
                }
            }
        }

        /**
         *
         * @constructor
         */
        function DockApplet(obj) {
            obj = obj || {};
            this.code = obj.code;
            this.title = obj.title;
            this.icon = obj.icon;
            this.color = obj.color;
            this.active = obj.active;
            this.running = obj.running;
            this.url = obj.url;

        }
    }
})();
