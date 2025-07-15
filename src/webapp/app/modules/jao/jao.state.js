/**
 * @author Leo Liao (leoliaolei@gmail.com), created on 2020-02-15.
 */
(function () {
    'use strict';

    angular.module('oplus.jao').config(['$stateProvider',
        function ($stateProvider) {
            configRoutes($stateProvider);
        }]);

    function configRoutes($stateProvider) {
        $stateProvider
            .state('app.jao', {
                url: '/jao',
                // data: {
                useAsApplet: {
                    code: 'jao',
                    title: 'app.nav.jao',
                    icon: 'fa-oplus-jao',
                    color: '#212529',
                    showIn: {desktop: 3, dock: 3}
                    // }
                },
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/jao/jao-index.html'
                        // controller: 'jaoJobCtrl',
                        // controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.jao.job_list_v2', {
                url: '/jobs/list',
                views: {
                    'jaoMainView': {
                        templateUrl: 'app/modules/jao/job-list.html'
                    }
                }
            })
            .state('app.jao.job_list', {
                url: '/jobs/{type}',
                views: {
                    'jaoMainView': {
                        templateUrl: 'app/modules/jao/job-list-v1.html',
                        controller: 'jaoJobCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.jao.flow_list', {
                url: '/flows',
                views: {
                    'jaoMainView': {
                        templateUrl: 'app/modules/jao/flow/flow-list.html',
                        controller: 'jaoFlowCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.jao.flow_list.flow_edit', {
                url: '/{id}/edit',
                views: {
                    'jaoFlowDetailView': {
                        templateUrl: 'app/modules/jao/flow/flow-edit.html',
                        controller: 'jaoFlowEditCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.jao.flow_list.instance', {
                url: '/{id}/instance/create',
                views: {
                    'jaoFlowDetailView': {
                        templateUrl: 'app/modules/jao/flow/flow-edit.html',
                        controller: 'jaoFlowEditCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.jao.flow_list.instance_list', {
                url: '/{id}/instances/list',
                views: {
                    'jaoFlowDetailView': {
                        templateUrl: 'app/modules/jao/flow/flow-instance-list.html',
                        controller: 'jaoFlowInstanceListCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.jao.flow_list.instance_view', {
                url: '/instance/{id}/view',
                views: {
                    'jaoFlowDetailView': {
                        templateUrl: 'app/modules/jao/flow/flow-instance-view.html',
                        controller: 'jaoFlowInstanceViewCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.jao.flow_list.step', {
                url: '/instance/{instanceId}/step/{stepId}/run',
                views: {
                    'jaoFlowDetailView': {
                        templateUrl: 'app/modules/jao/flow/flow-step.html',
                        controller: 'jaoFlowStepCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.jao.flow_list.flow_new', {
                url: '/new',
                views: {
                    'jaoFlowDetailView': {
                        templateUrl: 'app/modules/jao/flow/flow-edit.html',
                        controller: 'jaoFlowEditCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.jao.job_list.job_edit', {
                url: '/{id}/edit',
                views: {
                    'jaoJobDetailView': {
                        templateUrl: 'app/modules/jao/job-edit.html',
                        controller: 'jaoJobEditCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.jao.job_list.job_view', {
                url: '/{id}/view',
                views: {
                    'jaoJobDetailView': {
                        templateUrl: 'app/modules/jao/job-edit.html',
                        controller: 'jaoJobEditCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.jao.job_list.job_new', {
                url: '/new',
                views: {
                    'jaoJobDetailView': {
                        templateUrl: 'app/modules/jao/job-edit.html',
                        controller: 'jaoJobEditCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.jao.myApprove', {
                url: '/approve/my',
                views: {
                    'jaoMainView': {
                        templateUrl: 'app/modules/jao/approve/approve-my-list.html',
                    }
                }
            })
            .state('app.jao.jobApprove', {
                url: '/approve/list',
                views: {
                    'jaoMainView': {
                        templateUrl: 'app/modules/jao/approve/approve-list.html',
                    }
                }
            })
            .state('app.jao.runlogs', {
                url: '/runlogs',
                views: {
                    'jaoMainView': {
                        // templateUrl: 'app/modules/jao/logs/runlogs.html',
                        template: '<div class="opx-layout-vflex h-full">' +
                            '<nav class="navbar navbar-light">' +
                            '<div class="opx-navbar-title">{{\'jao.index.run_logs\' | translate}}</div> ' +
                            '<div class="ms-auto" uaa-has-permission="adm:edit:*">\n' +
                            '            <button class="btn btn-outline-primary" ui-sref="app.jao.runlogs.clean">\n' +
                            '                <span class="fa fa-broom"></span> <span>{{\'jao.job.runlogs.clean.confirm.title\' | translate}} </span>\n' +
                            '            </button>\n' +
                            '        </div>' +
                            ' </nav>' +
                            '<udp-page-view class="flex-fill scroll-y"' +
                            ' page-id="\'/jao/assets/udp/runlogs\'" page-source="file" uaa-has-permission="jao:view:*" uaa-deny-message="{{\'common.uaa.no_permission\' | translate}}"></udp-page-view>' +
                            '</div>'
                    }
                }
            })

            .state('app.jao.runlogs.clean', {
                url: '/runlogs/clean',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/modules/jao/logs/clean-log.html',
                        controller: 'CleanLogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'sm'
                    }).result.then(function (result) {
                        $state.go('^', {}, {reload: result.action !== "cancel"});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('app.jao.stats', {
                url: '/stats',
                views: {
                    'jaoMainView': {
                        template: '<udp-page-view page-id="\'/jao/assets/udp/stats\'" page-source="file" uaa-has-permission="jao:view:*" uaa-deny-message="{{\'common.uaa.no_permission\' | translate}}"></udp-page-view>'
                    }
                }
            })
            .state('app.jao.cron_job', {
                url: '/cron-list',
                views: {
                    'jaoMainView': {
                        templateUrl: 'app/modules/jao/cronJob/cron-job-list.html',
                        controller: 'CronJobController',
                        controllerAs: '$ctrl'
                    }
                }
            })
        ;
    }
})();
