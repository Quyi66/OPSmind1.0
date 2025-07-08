(function() {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('PermissionDetailController', PermissionDetailController);

    PermissionDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Permission', 'Role'];

    function PermissionDetailController($scope, $rootScope, $stateParams, previousState, entity, Permission, Role) {
        var vm = this;

        vm.permission = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('oplusApp:permissionUpdate', function(event, result) {
            vm.permission = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
