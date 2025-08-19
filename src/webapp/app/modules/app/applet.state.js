/**
 * @author Joker Liu (qdjoker@126.com), created on 04/27/2020
 */

(function () {
    'use strict';
    angular.module('oplus.app').config(appletStates);
    appletStates.$inject = ['$stateProvider', '$urlRouterProvider'];

    /**
     *
     * @param {$stateProvider} $stateProvider
     * @param {$urlRouterProvider} $urlRouterProvider
     */
    function appletStates($stateProvider, $urlRouterProvider) {
        appletMgmtStates();
        appletCrudStates();
        if (!window.$oplus.appConfig.useWindowUI) {
            appletViewStatesForNormalMode();
        }

        $stateProvider
            .state('app.applet_help', {
                url: '/applets/{appletCode}/help',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/app/applet-help.html',
                        controller: 'AppletHelpCtrl',
                        controllerAs: 'appHelpVm'
                    }
                }
            });

        function appletViewStatesForNormalMode() {
            $stateProvider
                .state('app.applet_view', {
                    url: '/applets/{appletCode}',
                    views: {
                        'mainView': {
                            template: '<applet-content the-applet="theApplet"></applet-content>',
                            //TODO: optimize with ui-router and component?
                            controller: ['$scope', 'theApplet', function ($scope, theApplet) {
                                $scope.theApplet = theApplet;
                            }]
                        }
                    },
                    resolve: {
                        theApplet: ['$stateParams', 'appletRunman', function ($stateParams, appletRunman) {
                            //console.log('app.applet_view')
                            return appletRunman.prepareAppletWindowContent($stateParams.appletCode);
                        }]
                    }
                })
                .state('app.applet_view.open_menu', {
                    url: '/menu/:pageId?:p',
                    views: {
                        // Use root
                        //https://github.com/angular-ui/ui-router/wiki/Multiple-Named-Views
                        // 'mainView@app': {
                        'applet_main_view': {
                            templateUrl: 'app/modules/udp/page-view-applet.html',
                            controller: 'PageViewCtrl'
                        }
                    },
                    resolve: {
                        pageId: ['$stateParams', function ($stateParams) {
                            return $stateParams.pageId;
                        }],
                        pageParams: [function () {
                            return {};
                        }]
                    }
                })
                .state('app.applet_view.open_page', {
                    url: '/page/:pageId?:p',
                    views: {
                        // Use root
                        //https://github.com/angular-ui/ui-router/wiki/Multiple-Named-Views
                        // 'mainView@app': {
                        'applet_main_view': {
                            templateUrl: 'app/modules/udp/page-view-applet.html',
                            controller: 'PageViewCtrl'
                        }
                    },
                    resolve: {
                        pageId: ['$stateParams', function ($stateParams) {
                            return $stateParams.pageId;
                        }],
                        pageParams: [function () {
                            return {};
                        }]
                    }
                });
        }

        function appletCrudStates() {
            $stateProvider
                .state('app.applist', {
                    url: '/applets',
                    views: {
                        'mainView': {
                            template: '<div ui-view="applist_main_view" class="h-100"><applet-list></applet-list></div>'
                        }
                    },
                    useAsApplet: {
                        code: 'applets',
                        type: 'PrivateTool',
                        title: 'app.nav.applet',
                        icon: 'fa-oplus-applet',
                        color: '#2196F3',
                        showIn: {desktop: 100},
                        windowSize: 'full'
                    }
                })
                // .state('app.applist.list', {
                //     url: '/list',
                //     views: {
                //         'applist_main_view': {
                //             template: '<applet-list></applet-list>'
                //         }
                //     }
                // })
                .state('app.applist.create', {
                    url: '/create',
                    views: {
                        'applist_main_view': {
                            templateUrl: 'app/modules/app/applet-setting.html',
                            controller: 'AppletSettingCtrl',
                            controllerAs: 'appSettingVm'
                        }
                    }
                });
            // .state('app.applet_edit', {
            //     url: '/applets/{appletCode}/edit',
            //     views: {
            //         'applist_main_view': {
            //             templateUrl: 'app/modules/app/applet-setting.html',
            //             controller: 'AppletSettingCtrl',
            //             controllerAs: 'appSettingVm'
            //         }
            //     }
            // });

        }

        function appletMgmtStates() {
            $stateProvider
                .state('app.appman', {
                    url: '/applets/{appletCode}/mgmt',
                    useAsApplet: {
                        type: 'PrivateTool',
                        code: 'appeditor',
                        title: 'Applet Editor',
                        icon: 'fa-magic',
                        color: '#00739D',
                        windowSize: 'full'
                    },
                    views: {
                        'mainView': {
                            templateUrl: 'app/modules/app/applet-mgmt.html',
                            controller: 'AppletSettingCtrl',
                            controllerAs: 'appSettingVm'
                        }
                    }
                })
                .state('app.appman.setting', {
                    url: '/setting',
                    views: {
                        'appman_main_view': {
                            templateUrl: 'app/modules/app/applet-setting.html',
                            controller: 'AppletSettingCtrl',
                            controllerAs: 'appSettingVm'
                        }
                    }
                })
                .state('app.appman.page', {
                    url: '/pages',
                    views: {
                        'appman_main_view': {
                            templateUrl: 'app/modules/app/applet-mgmt-pages.html',
                            controller: 'AppletMgmtPagesCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.page.create', {
                    url: '/new',
                    views: {
                        // 'content@': {
                        // 'app_mgmt_page_view': {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/udp/page-designer.html',
                            controller: 'PageDesignerCtrl'
                        }
                    }
                })
                .state('app.appman.page.edit', {
                    url: '/:pageId/edit',
                    views: {
                        // 'app_mgmt_page_view': {
                        // 'content@': {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/udp/page-designer.html',
                            controller: 'PageDesignerCtrl'
                        }
                    }
                })
                .state('app.appman.dataset', {
                    url: '/dataset',
                    views: {
                        'appman_main_view': {
                            templateUrl: 'app/modules/app/applet-mgmt-datasets.html'
                        }
                    }
                })
                .state('app.appman.dataset.create', {
                    url: '/new',
                    views: {
                        'dts_dataset_list': {
                            templateUrl: 'app/modules/app/applet-mgmt-datasets-edit.html',
                            controller: 'AppletMgmtDatasetsEditCtrl'
                        }
                    }
                })
                .state('app.appman.dataset.edit', {
                    url: '/:id/edit',
                    views: {
                        'dts_dataset_list': {
                            templateUrl: 'app/modules/app/applet-mgmt-datasets-edit.html',
                            controller: 'AppletMgmtDatasetsEditCtrl'
                        }
                    },
                    cache: false
                })
                .state('app.appman.job', {
                    url: '/jobs',
                    views: {
                        'appman_main_view': {
                            templateUrl: 'app/modules/app/applet-mgmt-jobs.html',
                            controller: 'AppletMgmtJobsCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.job.view', {
                    url: '/jobs/{id}/view',
                    views: {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/jao/job-edit.html',
                            controller: 'jaoJobEditCtrl',
                            controllerAs: '$ctrl'
                        }
                    },
                    cache: false
                })
                .state('app.appman.job.edit', {
                    url: '/jobs/{id}/edit',
                    views: {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/jao/job-edit.html',
                            controller: 'jaoJobEditCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.job.create', {
                    url: '/jobs/new/{type}',
                    views: {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/jao/job-edit.html',
                            controller: 'jaoJobEditCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.datamodel', {
                    url: '/data/models',
                    views: {
                        'appman_main_view': {
                            templateUrl: 'app/modules/app/applet-mgmt-datamodels.html',
                            controller: 'AppletMgmtDataModelsCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.datamodel.create', {
                    url: '/data/model/add/{id}',
                    views: {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/jao/datamodel/dc-data-add.html',
                            controller: 'jaodcDataCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.datamodel.edit', {
                    url: '/data/model/edit/{id}',
                    views: {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/jao/datamodel/dc-data-add.html',
                            controller: 'jaodcDataCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.appman.datamodel.view', {
                    url: '/data/model/view/{id}',
                    views: {
                        'appman_main_view@^.^': {
                            templateUrl: 'app/modules/jao/datamodel/dc-data-add.html',
                            controller: 'jaodcDataCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                });
        }
    }
})();
