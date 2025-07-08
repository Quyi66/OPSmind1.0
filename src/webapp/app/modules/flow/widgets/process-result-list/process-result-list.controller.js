/**
 * @ Author: chy
 * @ Create Time: 2022-07-07 10:42:10
 * @ Description:
 */

flowProcessResultListCtrl.$inject = ['$translate', 'flow.Service', '$state', '$scope', 'messageService'];
export default function flowProcessResultListCtrl($translate, flowService, $state, $scope, messageService) {
  var that = this;

  that.options = that.options || {
    inPage: false
  }

  flowService.fetchProcesses().then(res => {
    that.processList = res;
  })

  that.changeActiveProcess = (process) => {
    that.activeProcess = process.id;

    if (that.options.inPage) {
      var viewName = 'flow_process_result_list_table_view';

      var stateName = $state.current.name.indexOf(viewName) === -1 ? `${$state.current.name}.${viewName}` : $state.current.name;
      var stateUrl = `${$state.current.url}/result/list/{processId}`;

      if (!$state.router.stateRegistry.states[stateName]) {
        $state.router.stateProvider.state(stateName, {
          url: stateUrl,
          params: {
            options: that.options
          },
          views: {
            'flowViewTable': {
              templateUrl: 'app/modules/flow/widgets/process-result-list/process-result-list-table.html',
              controller: 'flowProcessResultListTableCtrl',
              controllerAs: '$ctrl'
            }
          }
        })
      }

      $state.go(stateName, {
        options: that.options,
        pageId: $scope.$parent.$widget.$pageScope.page.id,
        processId: process.id
      })
    }
    else {
      $state.go('app.flow.result_list.table', {
        processId: process.id
      })
    }
  }

  that.terminateAll = function () {
    messageService.confirm(
      $translate.instant('common.messages.operation.title', {operation: $translate.instant('jao.common.terminate')}),
      $translate.instant('flow.process.terminate_all_confirm'),
      res => {
        flowService.terminateAll().then(res => {
          messageService.toast("success", $translate.instant('common.messages.operation.success', {
            operation: $translate.instant('jao.common.terminate')
          }));

          if (that.activeProcess)
            $scope.$broadcast('refreshRunDetailList.opflow'); 
        });
      })
  }
}