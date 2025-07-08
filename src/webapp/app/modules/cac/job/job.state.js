/**
 * @Auther: zml
 * @Date: 2018/5/24
 */

(function () {
    'use strict';

    angular.module('oplus.cac').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        /***********************************************巡检任务************************************************/
            .state('app.cac.job', {
                url: '/job',
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/job/job-index.html',
                        controller: 'CacJobCtrl',
                        controllerAs: 'cacJobCtrlVm'
                    }
                }

            })
            .state('app.cac.job_add', {
                url: '/job/:templateId/add',
                params: {
                    "job": null,
                    "jobStatus": "adding"
                },
                views: {
                    'cacList': {
                        templateUrl: 'app/modules/cac/job/job-run.html',
                        controller: 'CacJobRunCtrl',
                        controllerAs: 'cacJobRunCtrlVm'
                    }
                }

            })
            .state('app.cac.job.list', {
                url: '/jobList/:templateId',
                views: {
                    'jobList': {
                        templateUrl: 'app/modules/cac/job/job-list.html',
                        controller: 'CacJobListCtrl',
                        controllerAs: 'cacJobListCtrlVm'
                    }
                }

            })
        ;
    }])
    ;
})
();
