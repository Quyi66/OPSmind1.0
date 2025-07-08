/**
 * @author chy, created on 2022-06-28.
 */

flowState.$inject = ['$stateProvider']
export default function flowState($stateProvider) {
    $stateProvider
        .state('app.flow', {
            url: '/flow',
            views: {
                'mainView': {
                    templateUrl: 'app/modules/flow/flow-index.html',
                    controller: 'flowController',
                    controllerAs: '$ctrl'
                }
            }
        })
        .state('app.flow.list', {
            url: '/list',
            views: {
                'flowView': {
                    templateUrl: 'app/modules/flow/widgets/process-list/process-list.html',
                    controller: 'flowProcessListCtrl',
                    controllerAs: '$ctrl'
                }
            }
        })
        .state('app.flow.history', {
            url: '/{processId}/history',
            params: {
                processName: null,
            },
            views: {
                'flowView': {
                    templateUrl: 'app/modules/flow/widgets/process-history/process-history.html',
                    controller: 'flowProcessHistoryCtrl',
                    controllerAs: '$ctrl'
                }
            }
        })
        .state('app.flow.design', {
            url: '/design?processId',
            params: {
                type: null,
                processId: null,
                detailId: null,
                processName: null,
            },
            views: {
                'flowView': {
                    templateUrl: 'app/modules/flow/widgets/process-design/process-design.html',
                    controller: 'flowProcessDesignCtrl',
                    controllerAs: '$ctrl'
                }
            }
        })
        .state('app.flow.exec', {
            url: '/exec?processId',
            params: {
                processId: null,
                detailId: null
            },
            views: {
                'flowView': {
                    templateUrl: 'app/modules/flow/widgets/process-exec/process-exec.html',
                    controller: 'flowProcessExecCtrl',
                    controllerAs: '$ctrl'
                }
            }
        })
        .state('app.flow.result_list', {
            url: '/result/list',
            views: {
                'flowView': {
                    templateUrl: 'app/modules/flow/widgets/process-result-list/process-result-list.html',
                    controller: 'flowProcessResultListCtrl',
                    controllerAs: '$ctrl'
                }
            }
        })
        .state('app.flow.result_list.table', {
            url: '/result/list/{processId}',
            views: {
                'flowViewTable': {
                    templateUrl: 'app/modules/flow/widgets/process-result-list/process-result-list-table.html',
                    controller: 'flowProcessResultListTableCtrl',
                    controllerAs: '$ctrl'
                }
            }
        })
        .state('app.flow.result_detail', {
            url: '/result/detail?processId&instanceId&detailId',
            params: {
                processId: null,
                instanceId: null,
                detailId: null,
            },
            views: {
                'flowView': {
                    templateUrl: 'app/modules/flow/widgets/process-result/process-result.html',
                    controller: 'flowProcessResultCtrl',
                    controllerAs: '$ctrl'
                }
            }
        })
        ;
}