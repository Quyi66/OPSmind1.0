/*!
 * 用户选择弹出框
 * @author Joker liu (qdjoker@hpcmb.com), created on 03/05/2019
 */

(function () {
    var tmModule = angular.module('oplus.ssc');

    //值班人选择控制器
    tmModule.controller('OpUserSelectDialogCtrl', OpUserSelectDialogCtrl);
    OpUserSelectDialogCtrl.$inject = ['$uibModalInstance', "params"];

    function OpUserSelectDialogCtrl($uibModalInstance, params) {
        var vm = this;

        vm.views = {
            onUserSelected: onUserSelected,
            registerSelectedUserHook: registerSelectedUserHook,
            cancel: cancel,
            save: save
        };

        vm.params = params;
        var getSelectedUsersFn = null;

        //选中回调
        function onUserSelected(currentSelected, totalSelected) {
            if(vm.params.onUserSelected){
                vm.params.onUserSelected(currentSelected, totalSelected);
            }
        }

        function registerSelectedUserHook(hookFn) {
            getSelectedUsersFn = hookFn;
            // console.log("Run registerSelectedUserHook");
        }

        //取消
        function cancel() {
            $uibModalInstance.close({action: "cancel"});
        }

        //保存选择
        function save() {
            var selectedResult = getSelectedUsersFn();
            // console.log("selectedResult = " + JSON.stringify(selectedResult));
            $uibModalInstance.close({action: "confirm", users: selectedResult.users, ids: selectedResult.ids, selectedUser: selectedResult.selectedUser});
        }
    }
})();
