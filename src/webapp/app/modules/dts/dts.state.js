/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 7/30/2017.
 */
(function () {
    'use strict';
    angular.module('oplus.dts').config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('app.dts', {
                    url: '/dts',
                    views: {
                        'mainView': {
                            templateUrl: 'app/modules/dts/dts-index.html'
                        }
                    }
                })
                .state('app.dts.datasource', {
                    url: '/datasource',
                    views: {
                        'dts_main': {
                            template: '<datasource-list></datasource-list>'
                        }
                    }
                })
                .state('app.dts.datasource.edit', {
                    url: '/:id/edit',
                    views: {
                        'dts_main_datasource_content': {
                            controller: 'DatasourceEditCtrl',
                            templateUrl: 'app/modules/dts/datasource-edit.html'
                        }
                    }
                })
                .state('app.dts.dataset', {
                    url: '/dataset',
                    views: {
                        'dts_main': {
                            templateUrl: 'app/modules/dts/dataset-list.html'
                            // controller: 'DatasetListCtrl'
                        }
                    }
                })
                .state('app.dts_datasource_new', {
                    url: '/dts/datasources/new',
                    views: {
                        'mainView': {
                            templateUrl: 'app/modules/dts/datasource-new.html',
                            controller: 'DatasourceNewCtrl',
                            controllerAs: 'ctrl'
                        }
                    }
                })
                .state('app.dts_datasource_new.type', {
                    url: '/:type',
                    templateUrl: 'app/modules/dts/datasource-edit.html',
                    controller: 'DatasourceEditCtrl'
                })

                .state('app.dts.datasource_datasets', {
                    url: '/:tempType/datasources/:datasourceName',
                    views: {
                        'dataset_list': {
                            templateUrl: 'app/modules/dts/dataset-list.html',
                            // controller: 'DatasetListCtrl'
                        }
                    }
                })

            ;
        }]);
})();