(function () {
    'use strict';
    /**
     * @ngdoc component
     * @name appletContent
     * @description
     * Applet window layout.
     * ```
     * <applet-content the-applet="object" on-close="function">
     * ```
     */
    angular.module('oplus.commons').component('appletContent', {
        bindings: {
            theApplet: '<',
            onClose: '&'
        },
        templateUrl: 'app/modules/app/window/applet-content.component.html',
        controller: ['$timeout', '$rootScope', '$element', '$state', '$translate', 'messageService', 'appletRunman', 'runningState', 'appletRouter', AppletContentCtrl]
    });

    /**
     *
     * @param $timeout
     * @param {$rootScope} $rootScope
     * @param $element
     * @param $state
     * @param $translate
     * @param {messageService} messageService
     * @param {appletRunman} appletRunman
     * @param {runningState} runningState
     * @param {appletRouter} appletRouter
     * @constructor
     */
    function AppletContentCtrl($timeout, $rootScope, $element, $state, $translate, messageService, appletRunman, runningState, appletRouter) {
        var that = this;
        this.applet = this.theApplet;
        this.appletCode = this.applet.code || this.applet.name;
        this.useWindowUI = window.$oplus.appConfig.useWindowUI;
        this.menuItems = [];
        this.uiView = appletRouter.getAppletWindowUiView(this.applet.code);
        this.$onInit = onInit;
        this.navTo = navTo;

        function onInit() {
            $element.addClass('js-applet-content').attr('data-applet-code', that.applet.code);
            if (that.applet.entry.type === 'InternalState') {
                return;
            }
            for (let i = 0; i < that.applet.setting.nav.items.length; i++) {
                let item = that.applet.setting.nav.items[i];
                if (item.hide)
                    continue;
                let state = appletRouter.getAppletState(that.applet.code, 'open_menu');
                let menu = {
                    icon: item.icon,
                    title: item.name,
                    entry: item.entry,
                    url: $state.href(state, {pageId: item.entry}),
                    // https://github.com/angular-ui/ui-router/issues/2944#issuecomment-242780318
                    // ui-sref doesn't watch the state expression for perf reasons.
                    // We added a ui-state and ui-state-params directives to allow dynamic links:
                    // sref: (that.useDynamicState ? ('app.applet_view_' + that.applet.code + '.menu') : 'app.applet_view.open_menu')
                    state: state
                }
                that.menuItems.push(menu);
            }

            detectIfShowMainEntry();

            /**
             * If press F5 at open_menu or open_page state, it should not load main entry page defined in template.
             */
            function detectIfShowMainEntry() {
                that.showMainEntry = false;
                // NOTE: If no $timeout, the $state.current.name is empty
                $timeout(function () {
                    var appletMainState = appletRouter.getAppletState(that.applet.code);
                    // console.log('onInit: currentState=%s, appletMainState=%s', $state.current.name, appletMainState);
                    if ($state.current.name === appletMainState) {
                        that.showMainEntry = true;
                    }
                }, 100);
            }
        }

        function navTo(menuItem) {
            that.menuItems.forEach(function (o) {
                o.active = false;
            });
            menuItem.active = true;
            $state.go(menuItem.state, {pageId: menuItem.entry});
        }
    }
})();
