/**
 * @author chy 2021-12-17
 */

(function () {
    'use strict';
    angular.module('oplus.ssc').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ssc', {
                url: '/ssc',
                useAsApplet: {
                    type:'PrivateTool',
                    code: 'ssc',
                    title: 'System Settings Center',
                    icon: 'fa-cog',
                    color: '#333'
                },
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/ssc/ssc-index.html'
                    }
                }
            })

            // AppRes
            .state('app.ssc.appres', {
                url: '/appres',
                views: {
                    'ssc_main': {
                        templateUrl: 'app/modules/ssc/appres/appres-index.html'
                    }
                }
            })
            .state('app.ssc.appres.job', {
                url: '/job',
                views: {
                    'appres_main_view': {
                        template: '<job-list show-applet="false" show-navigation="true" applet-code="$ctrl.appletCode" class="d-block h-100 scroll-y"></job-list>'
                    }
                }
            })
            .state('app.ssc.appres.page', {
                url: '/page',
                views: {
                    'appres_main_view': {
                        template: '<page-list show-applet="true" applet-code="$ctrl.appletCode" class="d-block h-100"></page-list>'
                    }
                }
            })
            .state('app.ssc.appres.dataset', {
                url: '/dataset',
                views: {
                    'appres_main_view': {
                        template: '<dataset-list show-applet="true"' +
                            ' ui-view-url="\'edit_dataset\'"' +
                            ' create-state="\'app.dts.datasource_datasets.dts_dataset_new\'"' +
                            ' edit-state="\'app.dts.datasource_datasets.dts_dataset_edit\'"' +
                            ' dataset-state="\'app.dts.datasource_datasets\'"></dataset-list>'
                    }
                }
            })


            // Datasource
            .state('app.ssc.datasource', {
                url: '/datasource',
                views: {
                    'ssc_main': {
                        template: '<datasource-list ' +
                            ' create-state="\'app.ssc.datasource_create\'" ' +
                            ' create-params="{type: \'ssc\'}" ' +
                            ' edit-state="\'app.ssc.datasource.edit\'" ' +
                            ' ></datasource-list> '
                    }
                }
            })
            .state('app.ssc.datasource_create', {
                url: '/datasource/create?type',
                views: {
                    'ssc_main': {
                        templateUrl: 'app/modules/dts/datasource-new.html',
                        controller: 'DatasourceNewCtrl',
                        controllerAs: 'ctrl'
                    }
                }
            })
            .state('app.ssc.datasource_create.type', {
                url: '/:type',
                templateUrl: 'app/modules/dts/datasource-edit.html',
                controller: 'DatasourceEditCtrl'
            })
            .state('app.ssc.datasource.edit', {
                url: '/:id/edit',
                views: {
                    'dts_main_datasource_content': {
                        controller: 'DatasourceEditCtrl',
                        templateUrl: 'app/modules/dts/datasource-edit.html'
                    }
                }
            })

            // Config
            .state('app.ssc.config', {
                url: '/config',
                views: {
                    'ssc_main': {
                        template: '<div ui-view="ssc_config"></div>'
                    }
                }
            })
        ;
    }]);
})();
