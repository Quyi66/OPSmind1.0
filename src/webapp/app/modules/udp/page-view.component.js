/**
 *
 * @author Leo Liao (leoliaolei@gmail.com), created on 8/23/2017
 */
(function () {
        'use strict';

        /**
         * @ngdoc component
         * @name udpPageView
         * @description
         * Display page content
         * ```
         * <udp-page-view page-id="string" page-params="object" page-source="@string" options="string" is-designer="string">
         * ```
         *
         * ### Usage 1: Page is created with visual page designer and loaded from database
         * ```html
         * <udp-page-view page-id="string" page-params="object">
         * ```
         *
         * ### Usage 2: Page is created with visual page designer and saved as local JSON file.
         * ```html
         * <udp-page-view page-id="'/jao/assets/udp/runlogs'" page-source="file" page-params="{type:'command'}">
         * ```
         *
         * ### Usage 3: Page is manually written with transclude content.
         * ```html
         * <udp-page-view page-id="'$CUSTOM_PAGE$'" page-source="code" udp-page-data="$ctrl.udpPageData" udp-callback-on-loaded="$ctrl.callbackOnLoaded">
         *     <div>custom content here, support uwidget...</div>
         * </udp-page-view>
         * ```
         *
         * ### Usage 4: Page is loaded as object
         * ```html
         * <udp-page-view page="{html:string}">
         * ```
         * @param {string} pageSource
         * - `file`: Load page definition from file under `app/modules`. The `pageId` is a string in format of "path/to/page-json".
         * - `code`: page is defined with code. In this case, a special page id is $CUSTOM_PAGE$ used for hand writing udp.
         * @param {boolean} isDesigner `true` for display in designer
         * @param {string} pageId  Page ID.
         * @param {{id:string,html:string,title:string}} page Page ID、Page Code or page object (for compatible with old version)
         * @param {{pageParams:*}} udpPageData Expose page params to external. Used with `pageSource=code`
         * @param {function($scope)} udpCallbackOnLoaded Callback function when page loaded. Argument is scope. Used with `pageSource=code`
         * @param {object=} options
         * @param {boolean=} options.print true for print mode
         * @param {boolean=} options.navbar true to show navbar
         * @param {string=} reloadPage Expression of page html to watch. When it changes, the page will be reloaded.
         */
        angular.module('oplus.udp').component('udpPageView', {
            transclude: true,
            templateUrl: 'app/modules/udp/page-view.html',
            bindings: {
                pageSource: '@',
                page: '<',
                pageId: '<',
                pageCode: '<', //deprecated
                pageParams: '<',
                options: '<',
                isDesigner: '<',
                reloadPage: '<',
                udpPageData: '<',
                udpCallbackOnLoaded: '<'
            },
            controller: ['$q', '$scope', '$rootScope', '$timeout', '$state', '$location', '$element', '$compile', 'runningState', 'pageService', 'pageDataUtil', 'widgetDnd', 'currentUser', 'devel', 'messageService', 'appletRouter', 'widgetSecurity',
                PageContentCtrl]
        });

        /**
         *
         * @param $q
         * @param $scope
         * @param $rootScope
         * @param $timeout
         * @param $state
         * @param $location
         * @param $element
         * @param $compile
         * @param runningState {runningState}
         * @param pageService {pageService}
         * @param {pageDataUtil} pageDataUtil
         * @param widgetDnd {widgetDnd}
         * @param {currentUser} currentUser
         * @param {devel} devel
         * @param messageService
         * @constructor
         */
        function PageContentCtrl($q, $scope, $rootScope, $timeout, $state, $location, $element, $compile, runningState, pageService, pageDataUtil, widgetDnd, currentUser, devel, messageService, appletRouter, widgetSecurity) {
            var MODE_NORMAL = 'normal',
                MODE_BROWSER = 'browser',
                MODE_DIALOG = 'dialog';
            var that = this;
            var pageContainer = $(pageService.PAGE_WRAPPER_SELECTOR, $element);
            // if (this.pageSource === 'file') {
            //     this.pageId = this.localPage;
            // }
            this.$onInit = $onInit;
            // Do not remove onDestroy
            this.$onDestroy = $onDestroy;
            this.pageInfo = {id: this.pageId, title: undefined, url: undefined, action: undefined};
            this.isOnInitedPageInfo = false;
            this.options = this.options || {};
            this.pageStyle = {};
            this.goBack = goBack;
            // $(window).on('resize', function (e) {
            //https://alvarotrigo.com/blog/firing-resize-event-only-once-when-resizing-is-finished/
            // TODO: when there is scroll bar, this event will triger during drag. We need trigger when resize stop
            // $scope.$broadcast('WIDGET_RESIZE', {from: 'RESIZE_BROWSER', reHeight: false});
            // });

            function $onInit() {
                var displayCss = devel.needMobileView() ? 'udp-on-mobile' : 'udp-on-desktop';
                $element.addClass('udp-page-view').addClass(displayCss);
                // $element.find('> .navbar')
                $scope.$watch('page.setting', watchPageSettingChange, true);
                if (that.pageId) {
                    $element.attr('data-debug', JSON.stringify({pageId: that.pageId}));
                    $element.attr('data-page-id', that.pageId);
                }

                function tryLoadPage(forceLoad) {
                    pageService[that.pageId ? 'findPage' : 'findPageByCode'](that.pageId || that.pageCode).then(function (page) {
                        initPageOnce(page, forceLoad);
                    }).catch(function (err) {
                        throw err;
                    });
                }

                if (that.pageId || that.pageCode) {
                    if (that.pageId === '$CUSTOM_PAGE$') {
                        initPageOnce();
                    } else {
                        tryLoadPage();
                    }
                } else if (that.page) {
                    initPageOnce(that.page);
                } else {
                    var unregister = $scope.$watch('$ctrl.page', function (newVal, oldVal) {
                        if (newVal) {
                            initPageOnce(newVal);
                            unregister();
                        }
                    });
                }
                if (that.isDesigner) {
                    $scope.$watch('$ctrl.reloadPage', function (newVal, oldVal) {
                        if (newVal === oldVal || !that.page) return;
                        that.page.html = newVal;
                        loadContent(that.page);
                    });
                }

                function initPageOnce(page, forceLoad) {
                    initPageScopeParams();
                    if (!page && !forceLoad) {
                        return;
                    }
                    // 临时解决加载页面时，"Cannot read property 'setting' of undefined"  --update by libobing
                    $scope.page = page;
                    that.page = page;

                    angular.extend(that.pageInfo, {
                        id: page.id,
                        title: getPageTitle(page.title),
                        url: pageDataUtil.constructUrl(that.pageId, that.pageParams, true),
                        action: page.action
                    });
                    that.isOnInitedPageInfo = true;
                    loadContent(page);

                    function initPageScopeParams() {
                        // To identify this is page scope. It is used to find page scope.
                        $scope._THIS_IS_PAGE_ = true;
                        $scope.globalParams = pageDataUtil.getGlobalValues();
                        // Search query in URL
                        var search = $location.search();
                        $scope.pageParams = angular.extend({}, search, that.pageParams);
                        // console.log('pageParams', JSON.stringify(that.pageParams), that.pageParams);
                        if (that.pageSource === 'code' && that.udpPageData) {
                            that.udpPageData.pageParams = $scope.pageParams;
                            if (that.udpCallbackOnLoaded) {
                                that.udpCallbackOnLoaded($scope);
                            }
                        }
                    }
                }
            }

            function $onDestroy() {
                $(window).off('resize');
            }

            function watchPageSettingChange(newVal, oldVal) {
                var setting = newVal;
                if (angular.isUndefined(setting)) {
                    return;
                }
                var themeId = setting.theme;
                var darkTheme = pageService.isDarkTheme(themeId);
                var pageCss = darkTheme ? 'op-theme-dark' : 'op-theme-light';
                $element.removeClassMatch(/op-theme-.*/).addClass(pageCss);
                if (darkTheme) {
                    $element.find('> .navbar').removeClass('navbar-light bg-light').addClass('navbar-dark');
                }
                if (themeId === '_CUSTOM') {
                    that.pageStyle['background-color'] = setting.backColor;
                    that.pageStyle['color'] = setting.fontColor;
                } else {
                    that.pageStyle = {};
                }
                if (setting.bgimage) {
                    pageContainer.css('background-image', 'url("' + setting.bgimage + '")')
                        .css('background-size', 'cover')
                        .css('background-repeat', 'no-repeat')
                        .css('background-position', 'center center');
                }
            }

            function goBack() {
                runningState.goBack();
            }

            function loadContent(page) {
                if (!page)
                    return;
                page.setting = page.setting || {};

                var isPass = true;
                if (!that.isDesigner && page.setting.accessControl && page.setting.accessControl.enabled) {
                    isPass = widgetSecurity.changeAccessState(pageContainer, page.setting.accessControl);
                    if (!isPass) {
                        $compile(pageContainer)($scope);
                    }
                }

                if (isPass) {
                    var html = pageService.tidyHtml(page.html, !that.isDesigner);
                
                    if (!that.isDesigner) {
                        createHistory(page);
                    }
                    // Use $compile to make angular directive in html work
                    // 20211015: compile after empty
                    // var el = $compile(html)($scope);
                    // pageContainer.empty().append(el);
                    var el = $(html);
                    pageContainer.empty().append(el);
                    $compile(el)($scope);
                }
                // if (page.setting.bgimage) {
                //     pageContainer.css('background-image', 'url("' + page.setting.bgimage + '")')
                //         .css('background-size', 'cover')
                //         .css('background-repeat', 'no-repeat')
                //         .css('background-position', 'center center');
                // }
                handlePrintMode();
                var viewMode = getViewMode();
                if (viewMode === MODE_DIALOG) {
                    $element.parent('.modal-body').parent().find('.modal-title').html(getPageTitle(that.page.title));
                }
                $scope.$emit('udpPageLoaded', {});

                function handlePrintMode() {
                    if (that.options.print === true) {
                        // In print mode, wait for async widget init
                        var pwt = getPageWaitSeconds();
                        $timeout(function () {
                            pageService.makePagePrintable({
                                modifySelf: true,
                                embedStyle: true,
                                // removeGrid: true,
                                fulldata: true
                            });
                        }, pwt * 1000);
                    }

                    function getPageWaitSeconds() {
                        var search = $location.search();
                        // Page wait timeout for print page
                        if (search && search.pwt) {
                            return parseInt(search.pwt);
                        }
                        return 10;
                    }
                }
            }

            function getViewMode() {
                var viewMode;
                if ($element.parents('.modal').length > 0) {
                    viewMode = MODE_DIALOG;
                } else if ($element.parents('udp-page-view').length === 0) {
                    viewMode = MODE_NORMAL;
                }
                return viewMode;
            }

            function getPageTitle(title) {
                if (!title) {
                    return title;
                }
                var matches = title.match(/\u3010.*?\u3011(.*)/);
                title = matches ? matches[1] : title;
                var parts = title.split('__');
                return parts[parts.length - 1];
            }

            //TODO: need refactor with history handle in appletRunman
            function createHistory(page) {
                if (window.$oplus.appConfig.useWindowUI) {
                    var state = appletRouter.detectIfCurrentStateIsApplet($state.current.name);
                    if (state) {
                        // console.log('updateBreadcrumb')
                        runningState.updateBreadcrumb(state.appletCode, {
                            title: getPageTitle(page.title),
                            url: $location.url()
                        });
                    }
                    return;
                }
                var viewMode = getViewMode();
                if (viewMode === MODE_BROWSER || angular.isDefined($scope.pageParams._nopagehist))
                    runningState.emptyHistory();
                if (viewMode === MODE_NORMAL || viewMode === MODE_BROWSER) {
                    runningState.pushHistory(/*page.id, $scope.pageParams,*/ getPageTitle(page.title), $location.url(), $state.current.name);
                    // console.log('pushHistory', runningState.allHistory().length,$state.current);
                    // Close existing modal, e.g. click view page from a open modal
                    //LEO@20211214:
                    // TODO: temp comment out dismissModal because in applet window mode, open an page directly will dismiss window modal.
                    // pageService.dismissModal();
                }
                that.history = runningState.allHistory();
                // console.log('createHistory', viewMode, that.history);
                if (that.history.length > 0)
                    that.current = that.history[that.history.length - 1];
            }
        }
    }

)();
