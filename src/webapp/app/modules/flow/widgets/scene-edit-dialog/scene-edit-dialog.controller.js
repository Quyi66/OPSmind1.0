/**
 * @ Author: chy
 * @ Create Time: 2023-04-19 19:13:51
 * @ Description:  
 */

flowSceneEditDialogCtrl.$inject = ['$translate', '$uibModalInstance', 'mode', 'scene', 'allChecked'];
export default function flowSceneEditDialogCtrl($translate, $uibModalInstance, mode, scene, allChecked) {
  var that = this;
  
  that.sceneMode = {
    add: 'add',
    edit: 'edit'
  }

  if (scene) that.scene = scene;
  that.mode = mode || that.sceneMode.add;
  that.allChecked = allChecked || false;

  that.cancel = function () {
    $uibModalInstance.dismiss();
  };

  that.confirm = function () {
    $uibModalInstance.close(that.scene);
  }
}