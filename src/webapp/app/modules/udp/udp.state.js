/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 6/16/2017.
 */
(function () {
    'use strict';

    angular.module('oplus.udp').config(['$stateProvider',
        function ($stateProvider) {
            configRoutes($stateProvider);
            configRoutesInDev($stateProvider);
        }]);

    function configRoutes($stateProvider) {
        //TODO: do not use resolve
        function pageResolve(viewMode) {
            return {
                pageId: ['$stateParams', 'pageService', '$q', function ($stateParams, pageService, $q) {
                    var pageId = $stateParams.pageId;
                    return pageId;
                }],
                pageParams: [function () {
                    return {};
                }]
            }
        }

        $stateProvider
            .state('app.udp', {
                url: '/udp/pages',
                views: {
                    'mainView': {
                        templateUrl: function () {
                            return 'app/modules/udp/page-list.html';
                        }
                        // controller: 'PageFolderCtrl',
                        // controllerAs: '$pl'
                    }
                }
            })
            .state('app.udp_pageview', {
                url: '/udp/page/{pageId}',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/udp/page-view-normal.html',
                        controller: 'PageViewCtrl'
                    }
                },
                resolve: pageResolve('normal')
            })
            .state('app.udp_pageview_full', {
                url: '/udp/page/:pageId/full',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/udp/page-view-full.html',
                        controller: 'PageViewCtrl'
                    }
                },
                resolve: pageResolve('full')
            })
            .state('app.udp_pageview_print', {
                url: '/udp/page/:pageId/print',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/udp/page-view-print.html',
                        controller: 'PageViewCtrl'
                    }
                },
                resolve: pageResolve('print')
            })
            .state('app.udp_config', {
                url: '/udp/config',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/udp/udp-config.html',
                        controller: 'UdpConfigCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
        ;
    }

    function configRoutesInDev($stateProvider) {
        $stateProvider
            // .state('app.udp_pageedit.configWidget', {
            .state('app.appman.page.edit.configWidget', {
                url: '/w/:widgetId',
                views: {
                    'widget_config_model': {
                        controller: ['$stateParams', '$state', '$interval', 'widgetConfigHelper', ConfigWidgetCtrl]
                    }
                }
            });

        /**
         *
         * @param $stateParams
         * @param $state
         * @param {$interval} $interval
         * @param {widgetConfigHelper} widgetConfigHelper
         */
        function ConfigWidgetCtrl($stateParams, $state, $interval, widgetConfigHelper) {
            var wid = $stateParams.widgetId;
            // Use interval to wait DOM rendering, delay 300ms and try up to 30 times
            // $interval(fn, delay, [count], [invokeApply], [Pass]);
            var timer = $interval(function checkElem() {
                //LEO@20220105: Must include #pd-canvas-zone.
                // In multiple window mode, #wid is not enough because user may view the same page while editing it.
                var widget = $('#pd-canvas-zone #' + wid);
                if (widget.length > 0) {
                    $interval.cancel(timer);
                    // var widgetScope = angular.element(widget).scope();
                    // console.log('configWidget', widgetScope, pageDataUtil.findPageScope(widgetScope),widget.prop('outerHTML'));
                    widgetConfigHelper.showConfigModal(widget, null).then(function () {
                        // When modal closed (confirm or cancel), go back parent state.
                        $state.go('^');
                    });
                }
            }, 300, 30);
        }
    }
})();
