/**
 * @ Author: chy
 * @ Create Time: 2022-11-28 17:05:57
 * @ Description:  
 */

flowEditDialogCtrl.$inject = ['$uibModalInstance', 'title', 'mode', 'data'];
export default function flowEditDialogCtrl($uibModalInstance, title, mode, data) {
  var that = this;
  
  that.title = title;
  that.mode = mode;
  that.data = data;

  that.cancel = function () {
    $uibModalInstance.dismiss();
  };

  that.confirm = function () {
    $uibModalInstance.close(that.data);
  }
}