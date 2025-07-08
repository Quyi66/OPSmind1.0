/**
 * @Auther: zml
 * @Date: 2018/5/24
 */
(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.cac.result', {
                url: '/result/:jobId',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/result/job-result-overview.html',
                        controller: 'JobResultOverviewCtrl',
                        controllerAs: 'jobResultOverviewCtrlVm'
                    }
                }

            })
            .state('app.cac.structural_diagram', {
                url: '/:jobId/structural_diagram',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/result/structural-diagram.html',
                        controller: 'structuralDiagramCtrl',
                        controllerAs: 'structuralDiagramCtrlVm'
                    }
                }
            })
            .state('app.cac.data_driven', {
                url: '/:jobId/data_driven',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/result/data-driven.html',
                        controller: 'dataDrivenCtrl',
                        controllerAs: 'dataDrivenCtrlVm'
                    }
                }

            })
            .state('app.cac.result.list', {
                url: '/:scriptType/list',
                views: {
                    'cacResult': {
                        templateUrl: 'app/modules/cac/result/result-list.html',
                        controller: 'CacResultListCtrl',
                        controllerAs: 'cacResultListCtrlVm'
                    }
                }

            })
            .state('app.cac.result.output', {
                url: '/:jobId/:taskId/:templateId/output',
                views: {
                    'cacResult': {
                        templateUrl: 'app/modules/cac/result/result-output-list.html',
                        controller: 'CacResultOutputListCtrl',
                        controllerAs: 'cacResultOutputListCtrlVm'
                    }
                }
            })
            .state('app.cac.result.view', {
                url: '/statistics/view',
                // params: {
                //     job_id: ''
                // },
                views: {
                    // 'profileView': {
                    //     template:
                    //         '<udp-page-view class="flex-fill scroll-y"' +
                    //         ' page-id="\'/cac/assets/udp/cac-results\'" page-source="file" page-params="{\'job_id\':\'ff8080817dbda18e017dbe271bf70018\'}" uaa-has-permission="cac:view:*" uaa-deny-message="{{\'common.uaa.no_permission\' | translate}}"></udp-page-view>' +
                    //         '</div>'
                    // }
                    'profileView': {
                        templateUrl: 'app/modules/cac/result/job-result-statistics-view.html',
                        controller: 'JobResultStatisticsOverviewCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
        ;
    }])
    ;
})();
