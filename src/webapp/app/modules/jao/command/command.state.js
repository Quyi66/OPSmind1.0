/**
 * @author wuqiang@famessoft.com , created on 2021-03-17.
 */
(function () {
    'use strict';

    angular.module('oplus.jao').config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('app.jao_cmd', {
                    url: '/cmd',
                    views: {
                        'mainView': {
                            templateUrl: 'app/modules/jao/command/command-index.html',
                            controller:['$state',function($state){
                                if ($state.current.name==='app.jao_cmd'){
                                    $state.go('app.jao_cmd.command_list');
                                }
                            }]
                        }
                    },
                    useAsApplet: {
                        code: 'cmd',
                        title: 'app.nav.cmd',
                        icon: 'fa-oplus-cmd',
                        color: '#212529',
                        showIn: {desktop: 1, dock: 1},
                        windowSize:'md'
                    }
                });
            $stateProvider
                .state('app.jao_cmd.command_list', {
                    url: '/commands',
                    views: {
                        'cmd_main_view': {
                            templateUrl: 'app/modules/jao/command/command-list.html',
                            controller: 'JaoCommandCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.jao_cmd.command_new', {
                    url: '/new',
                    views: {
                        'cmd_main_view': {
                            templateUrl: 'app/modules/jao/command/command-edit.html',
                            controller: 'CommandAddController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.jao_cmd.command_edit', {
                    url: '/{id}/edit',
                    views: {
                        'cmd_main_view': {
                            templateUrl: 'app/modules/jao/command/command-edit.html',
                            controller: 'CommandAddController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.jao_cmd.command_view', {
                    url: '/{id}/view',
                    views: {
                        'cmd_main_view': {
                            templateUrl: 'app/modules/jao/command/command-edit.html',
                            controller: 'CommandAddController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('app.jao_cmd.command_review', {
                    url: '/review',
                    views: {
                        'cmd_main_view': {
                            templateUrl: function () {
                                return 'app/modules/jao/command/command-approve-list.html';
                            },
                            controller: 'CommandApproveCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                //command job.
                .state('app.jao_cmd.job_list', {
                    url: '/jobs/{type}',
                    views: {
                        'cmd_main_view': {
                            templateUrl: 'app/modules/jao/command/command-job-list.html',
                            controller: 'jaoJobCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.jao_cmd.job_list.create', {
                    url: '/new',
                    views: {
                        'jaoJobDetailView': {
                            templateUrl: 'app/modules/jao/command/command-job-edit.html',
                            controller: 'commandJobEditCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.jao_cmd.job_list.edit', {
                    url: '/{id}/edit',
                    views: {
                        'jaoJobDetailView': {
                            templateUrl: 'app/modules/jao/command/command-job-edit.html',
                            controller: 'commandJobEditCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.jao_cmd.job_list.view', {
                    url: '/{id}/view',
                    views: {
                        'jaoJobDetailView': {
                            templateUrl: 'app/modules/jao/command/command-job-edit.html',
                            controller: 'commandJobEditCtrl',
                            controllerAs: '$ctrl'
                        }
                    }
                })
                .state('app.jao_cmd.logs', {
                    url: '/logs',
                    views: {
                        'cmd_main_view': {
                            templateUrl: 'app/modules/jao/command/command-logs.html'
                        }
                    }

                })
                .state('app.jao_cmd.console', {
                    url: '/console',
                    views: {
                        'cmd_main_view': {
                            templateUrl: 'app/modules/jao/command/command-console.html',
                            controller: 'CommandConsoleController',
                            controllerAs: 'vm'
                        }
                    }
                });
        }]);
})();
