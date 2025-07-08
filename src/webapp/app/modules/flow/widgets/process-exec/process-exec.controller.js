/**
 * @ Author: chy
 * @ Create Time: 2022-07-08 10:49:01
 * @ Description:  
 */

flowProcessExecCtrl.$inject = ['$stateParams'];
export default function flowProcessExecCtrl($stateParams) {
  var that = this;

  that.processId = $stateParams.processId;
  that.detailId = $stateParams.detailId;
}