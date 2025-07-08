(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('TenantDetailController', TenantDetailController);

    TenantDetailController.$inject = ['$scope', '$rootScope', '$filter', 'previousState', 'entity'];

    function TenantDetailController($scope, $rootScope, $filter, previousState, entity) {
        var vm = this;

        vm.tenant = entity;
        vm.previousState = previousState.name;
        // vm.tenant.configJson = $filter('json')(vm.tenant.config);


        var unsubscribe = $rootScope.$on('oplusApp:tenantUpdate', function (event, result) {
            vm.tenant = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
