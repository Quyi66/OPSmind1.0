/**
 * @ Author: chy
 * @ Create Time: 2022-07-08 10:49:01
 * @ Description:  
 */

flowProcessResultCtrl.$inject = ['$state', '$stateParams'];
export default function flowProcessResultCtrl($state, $stateParams) {
  var that = this;

  that.processId = $stateParams.processId;
  that.instanceId = $stateParams.instanceId;
  that.detailId = $stateParams.detailId;

  that.back = function () {
    $state.go('app.flow.result_list.table', {processId: that.processId});
  }
}