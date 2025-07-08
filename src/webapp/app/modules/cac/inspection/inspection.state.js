
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac3.inspection', {
                url: '/inspection',
                views: {
                    'cac3List': {
                        templateUrl: 'app/modules/cac/inspection/inspection.html',
                        controller: 'CacInspectionController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac3.inspection.list', {
                url: '/list',
                views: {
                    'inspection-view': {
                        templateUrl: 'app/modules/cac/inspection/inspection-list.html',
                        controller: 'CacInspectionListController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac3.inspection.add', {
                url: '/add',
                views: {
                    'inspection-view': {
                        templateUrl: 'app/modules/cac/inspection/inspection-edit.html',
                        controller: 'CacInspectionEditController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('app.cac3.inspection.edit', {
                url: '/:id/edit',
                views: {
                    'inspection-view': {
                        templateUrl: 'app/modules/cac/inspection/inspection-edit.html',
                        controller: 'CacInspectionEditController',
                        controllerAs: 'vm'
                    }
                }
            })

    }])

})
();