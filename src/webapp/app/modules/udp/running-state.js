/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 11/22/2017
 */
(function () {
    'use strict';

    angular.module('oplus.udp').service('runningState', runningState);

    runningState.$inject = ['$location', '$state'];

    /**
     * @ngdoc service
     * @name runningState
     * @description
     * Keep udp page or applet states like history, breadcrumbs.
     * Udp page view history. Only continuous page view will be saved in history.
     * @param {$location} $location
     * @param {$state} $state
     */
    function runningState($location, $state) {
        var that = this;
        var MAX_HISTORY_ITEMS = 10;
        // Old for single page mode (not window mode UI)
        var spaHistory = [];
        /**
         * Keep opened applet information.
         * @type {[{code:string,title:string,icon:string,color:string,url:string,history:[{title:string,url:string}]}]}
         */
        var runningApplets = [];
        this.addAppletToRunning = addAppletToRunning;
        this.removeAppletFromRunning = removeAppletFromRunning;
        this.findRunningApplet = findRunningApplet;
        this.allRunningApplets = allRunningApplets;
        this.activeAppletCode = undefined;
        /**
         *
         * Keep URL including query parameter invoked by widget interaction
         * @type {undefined}
         */
        this.urlByWidgetInteraction = undefined;

        // Applet breadcrumbs
        this.pushBreadcrumb = pushBreadcrumb;
        this.updateBreadcrumb = updateBreadcrumb;
        this.emptyBreadcrumb = emptyBreadcrumb;
        this.getBreadcrumbs = getBreadcrumbs;

        // Old page history
        var codeForSinglePage = '$SPA$';
        this.pushHistory = pushHistory;
        this.allHistory = allHistory;
        this.emptyHistory = emptyHistory;
        this.goBack = goBack;
        this.childGoBack = childGoBack;
        this.getCurrentPage = getCurrentPage;

        function allRunningApplets() {
            return _.filter(runningApplets, function (o) {
                return o.code !== codeForSinglePage;
            });
        }

        function findRunningApplet(appletCode) {
            return _.find(runningApplets, {code: appletCode});
        }

        function removeAppletFromRunning(appletCode) {
            _.remove(runningApplets, {code: appletCode});
        }

        /**
         * Set an applet state as running
         * @param {{code:string,title:string,icon:string,color:string}} applet
         */
        function addAppletToRunning(applet) {
            // console.log('addAppletToRunning');
            var appletCode = applet.code || applet.name;
            var item = _.find(runningApplets, {code: appletCode});
            if (!item) {
                item = {};
                // console.log('addAppletToRunning!!!', item);
                runningApplets.push(item);
            }
            _.extend(item, {
                code: appletCode,
                title: applet.title,
                icon: applet.icon,
                color: applet.color
            });
            // console.log('runningApplets', runningApplets);
        }

        // function getRunningApplets() {
        //     return runningApplets;
        // }

        /**
         *
         * @param {string} appletCode
         * @param {{title:string,url:string}} item
         */
        function pushBreadcrumb(appletCode, item) {
            // console.log('pushBreadcrumb');
            var items = getBreadcrumbs(appletCode);
            items.push(item);
        }

        /**
         *
         * @param appletCode
         * @param {{title:string, url:string}} item
         */
        function updateBreadcrumb(appletCode, item) {
            if (!item) {
                return;
            }
            var applet = _.find(runningApplets, {code: appletCode});
            if (!applet) {
                return;
            }
            // console.log('updateBreadcrumb');
            var items = getBreadcrumbs(appletCode);
            if (items) {
                var last = items[items.length - 1];
                _.extend(last, item);
            }
        }

        function emptyBreadcrumb(appletCode) {
            // console.log('emptyBreadcrumb', appletCode);
            var items = getBreadcrumbs(appletCode)
            items.length = 0;
        }

        function getBreadcrumbs(appletCode) {
            // console.log('getBreadcrumbs');
            var applet = _.find(runningApplets, {code: appletCode});
            if (!applet) {
                applet = {code: appletCode, history: []};
                console.warn('add running applet for breadcrumbs....', appletCode);
                runningApplets.push(applet);
            } else {
                if (!applet.history) {
                    applet.history = [];
                }
            }
            return applet.history;
        }

        function getCurrentPage() {
            return spaHistory[spaHistory.length - 1];
        }

        /**
         * Get streak page view history including current.
         * @returns {Array}
         */
        function allHistory() {
            return spaHistory;
        }

        function childGoBack(el) {
            var previous = el.closest('.udp-openpage-container');
            var thisPage = el.closest('udp-page-view');
            if (thisPage.siblings().length > 0) {
                // Can only go back if has previous content
                thisPage.remove();
                var previousContent = previous.children();
                // Float actions in previous page
                var previousActions = previousContent.closest('udp-page-view').find('.udp-float-actions');
                previousActions.show();
                previousContent.show();
            } else {
                // TODO: a temp solution to restore the display of nav as child page...
                el.closest('udp-page-view').find('.udp-float-actions').show();
            }
        }

        function go(index) {
            if (index > -1 && index <= spaHistory.length - 1) {
                var page = spaHistory[index];
                $location.url(page.url);
                spaHistory.splice(index);
            }
        }

        function goBack() {
            go(spaHistory.length - 2);
        }

        function pushHistory(title, url) {
            // Detect if user click browser back button
            var previous, current;
            current = {/*pageId: pageId, params: params,*/ title: title, url: url};
            if (spaHistory.length > 1) {
                previous = spaHistory[spaHistory.length - 2];
                if (_.isEqual(previous, current)) {
                    spaHistory.splice(spaHistory.length - 1);
                    // console.log('User click back button', history.length);
                    return;
                }
            }
            if (spaHistory.length >= MAX_HISTORY_ITEMS) {
                spaHistory.splice(0, 1);
            }
            spaHistory.push(current);
        }

        function emptyHistory() {
            // console.warn('runningState.emptyHistory.....');
            spaHistory = [];
        }
    }
})();
