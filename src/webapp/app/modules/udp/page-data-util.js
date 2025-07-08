/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 12/05/2018.
 */

(function () {
        'use strict';
        var app = angular.module('oplus.udp');

        app.service('pageDataUtil', pageDataUtil);

        pageDataUtil.$inject = ['$state', 'currentUser'];

        /**
         * @ngdoc service
         * @name pageDataUtil
         * @param {$state} $state
         * @param {currentUser} currentUser
         */
        function pageDataUtil($state, currentUser) {
            this.findPageScope = findPageScope;
            this.findPageParams = findPageParams;
            this.constructUrl = constructUrl;
            this.getPageScopeValues = getPageScopeValues;
            this.getGlobalValues = getGlobalValues;

            function getGlobalValues() {
                return {
                    user: currentUser.basicUserInfo(),
                    token: currentUser.authToken,
                    tenantId: currentUser.tenantId
                }
            }

            /**
             *
             * @param scope
             * @return {null|object} Null if page scope not found
             */
            function findPageParams(scope) {
                var pageScope = findPageScope(scope);
                if (!pageScope) {
                    return null;
                }
                return pageScope.pageParams;
            }

            /**
             * Get page and global values and assign to specified object.
             * @param scope
             * @param {object=} assignTo If specified, the global values will be assigned to it.
             * @return {{'@':object,'#':object}} `@` for page params, `#` for global params.
             */
            function getPageScopeValues(scope, assignTo) {
                var data = assignTo || {};
                if (scope) {
                    var pageScope = findPageScope(scope);
                    if (pageScope) {
                        data['@'] = pageScope.pageParams;
                        data['#'] = pageScope.globalParams;
                    }
                }
                return data;
            }

            /**
             *
             * Construct URL for widget interaction to view a page
             * @param {string} pageId Page ID
             * @param {object} params Page parameters
             * @param {boolean=} asFullUrl Default is false. True to use full link including `http://host-port/and/path/to/index.html`
             * @returns {string} Full URL or URL hash
             */
            function constructUrl(pageId, params, asFullUrl) {
                // var url = $state.href('app.udp_pageview', {pageId: pageId});// + '?';
                var stateName = $state.current.name;
                // console.log('constructUrl', stateName);
                var url;
                // Applet has 3 states:
                // - `app.appletwindow_<code>` for main window
                // - `app.appletwindow_<code>.open_menu` for applet menu navigation
                // - `app.appletwindow_<code>.open_page` for page inside interaction
                // Widget interaction occurs only inside page, we need ensure the state is `app.appletwindow_<code>.open_page`
                var matches = /(app\.appletwindow_[^.]*)/.exec(stateName);
                if (matches) {
                    stateName = matches[1] + '.open_page';
                }
                // To compatible with old applet_view
                if (stateName==='app.applet_view' || stateName==='app.applet_view.open_menu'){
                    stateName = 'app.applet_view.open_page';
                }
                url = $state.href(stateName, {pageId: pageId});
                if (/^#\//.test(url)) {
                    url = url.substring(1);
                }
                if (!_.isEmpty(params)) {
                    url = url + '?';
                    Object.keys(params).forEach(function (name, index, array) {
                        var param = params[name];
                        if (index > 0) {
                            url += '&';
                        }
                        url += (name + '=' + (param || ''));
                    });
                }
                if (asFullUrl) {
                    url = window.location.origin + window.location.pathname + '#' + url;
                }
                // console.log('constructUrl', url, {pageId: pageId, params: params});
                return url;
            }


            /**
             * Find the scope of page where the widget in
             * @param {$scope} scope A child scope within udp-page-view
             * @returns {{pageParams:{},globalParams:{}}|$scope|null} null if not found
             */
            function findPageScope(scope) {
                if (!scope) {
                    console.warn('Parameter `scope` in findPageScope is null');
                    return null;
                }
                if (scope.hasOwnProperty('_THIS_IS_PAGE_')) {
                    return scope;
                }
                var parent = scope.$parent;
                while (parent) {
                    // if (parent.hasOwnProperty('openPage')) {
                    // console.log('ispage...',parent['_THIS_IS_PAGE_']);
                    if (parent.hasOwnProperty('_THIS_IS_PAGE_')) {
                        return parent;
                    }
                    parent = parent.$parent;
                }
                console.warn("Cannot find page scope. Maybe this is not a udp page?");
                return null;
            }
        }
    }
)();
