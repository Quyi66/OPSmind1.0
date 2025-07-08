/**
 * @author  yangbin@famaessoft.com
 * created by  2022/08/17
 */
(function () {
    'use strict';

    angular.module('oplus.os').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.os', {
                url: '/os',
                views: {
                    'mainView': {
                        templateUrl: 'app/modules/os/os-index.html',
                        controller: 'osCtrl',
                        controllerAs: 'osVm'
                    }
                }
            })
            .state('app.os.list', {
                url: '/list',
                views: {
                    'osMainView': {
                        templateUrl: 'app/modules/os/os-list.html'
                    }
                }
            })
            .state('app.os.flow_list', {
                url: '/flow/list',
                views: {
                    'osMainView': {
                        templateUrl: 'app/modules/os/flow/flow-list.html',
                        controller: 'flowCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.os.flow_list.flow_new', {
                url: '/new',
                views: {
                    'flowDetailView': {
                        templateUrl: 'app/modules/os/flow/flow-edit.html',
                        controller: 'flowEditCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.os.flow_list.flow_edit', {
                url: '/{id}/edit',
                views: {
                    'flowDetailView': {
                        templateUrl: 'app/modules/os/flow/flow-edit.html',
                        controller: 'flowEditCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.os.flow_list.instance', {
                url: '/{id}/instance/create',
                views: {
                    'flowDetailView': {
                        templateUrl: 'app/modules/os/flow/flow-edit.html',
                        controller: 'flowEditCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.os.flow_list.instance_list', {
                url: '/{id}/instances/list',
                views: {
                    'flowDetailView': {
                        templateUrl: 'app/modules/os/flow/flow-instance-list.html',
                        controller: 'flowInstanceListCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.os.flow_list.instance_view', {
                url: '/instance/{id}/view',
                views: {
                    'flowDetailView': {
                        templateUrl: 'app/modules/os/flow/flow-instance-view.html',
                        controller: 'flowInstanceViewCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.os.flow_list.step', {
                url: '/instance/{instanceId}/step/{stepId}/run',
                views: {
                    'flowDetailView': {
                        templateUrl: 'app/modules/os/flow/flow-step.html',
                        controller: 'flowStepCtrl',
                        controllerAs: '$ctrl'
                    }
                }
            })
            .state('app.os.runlogs', {
                url: '/runlogs',
                views: {
                    'osMainView': {
                        template: '<div class="opx-layout-vflex h-full"><nav class="navbar navbar-light"><div class="opx-navbar-title">{{\'jao.index.run_logs\' | translate}}</div></nav>' +
                            '<udp-page-view class="flex-fill scroll-y"' +
                            ' page-id="\'/os/assets/runlogs\'" page-source="file" uaa-has-permission="jao:view:*" uaa-deny-message="{{\'common.uaa.no_permission\' | translate}}"></udp-page-view>' +
                            '</div>'
                    }
                }
            })
        ;
    }])
    ;
})();
