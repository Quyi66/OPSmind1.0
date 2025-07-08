(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('SubordinateConfigController', SubordinateConfigController);

    SubordinateConfigController.$inject = ['$state', '$timeout', 'Subordinate', 'messageService'];

    function SubordinateConfigController($state, $timeout, Subordinate, messageService) {

        var vm = this;

        vm.views = {
            currentLeader: null,
            currentLeaders: [],
            selectedUsers: [],
            disabledUsers: [],
            onLeaderChosen: onLeaderChosen,
            onUserChosen: onUserChosen,
            save: save,
            cancel: cancel
        };


        function onLeaderChosen(users) {
            // console.log("Users = " + JSON.stringify(users));
            if (users != null && users.length > 0) {
                vm.views.currentLeader = users[0];
                vm.views.disabledUsers = users;
                $timeout(function () {
                    getSubordinate(vm.views.currentLeader.id)
                });
            } else {
                // console.log("currentLeader is null");
                vm.views.currentLeader = null;
                $timeout(function () {
                    vm.views.disabledUsers = [];
                    vm.views.selectedUsers = [];
                });
            }
        }

        function onUserChosen(users) {
            // console.log("onUserChosen Users = " + JSON.stringify(users));
            vm.views.selectedUsers = users;
        }

        //query user by leader
        function getSubordinate(leaderLogin) {
            vm.views.selectedUsers = [];
            Subordinate.getUserByLeader(leaderLogin).then(function (result) {
                // console.log("result = " + JSON.stringify(result.data));

                vm.views.selectedUsers = result.data;
            });
            // relationships: ['Subordinate', function (Subordinate) {
            //     return Subordinate.query().$promise;
            // }],
        }

        function save() {
            if (vm.views.currentLeader != null) {
                vm.isSaving = true;

                var userIds = [];
                var selectedUsers = vm.views.selectedUsers;
                if (selectedUsers != null && selectedUsers.length > 0) {
                    for (var i in selectedUsers) {
                        var selectedUser = selectedUsers[i];
                        userIds.push(selectedUser.id);
                    }
                }

                var updateParam = {leaderId: vm.views.currentLeader.id, userIds: userIds};

                Subordinate.update(updateParam, function () {
                    vm.isSaving = false;
                    messageService.toast("success", "保存成功");
                });
            }
        }

        function cancel() {
            $state.go("subordinate");
        }
    }
})();
