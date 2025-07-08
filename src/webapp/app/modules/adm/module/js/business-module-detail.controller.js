(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('BusinessModuleDetailController', BusinessModuleDetailController);

    BusinessModuleDetailController.$inject = ['$scope', 'entity'];

    function BusinessModuleDetailController($scope, entity) {
        var vm = this;

        vm.businessModule = entity;
    }
})();
