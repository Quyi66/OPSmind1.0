(function () {
    'use strict';

    angular
        .module('oplus.adm')
        .controller('ParamDetailController', ParamDetailController);

    ParamDetailController.$inject = ['$scope', '$rootScope', '$filter', '$timeout', 'previousState', 'entity'];

    function ParamDetailController($scope, $rootScope, $filter, $timeout, previousState, entity) {
        var vm = this;

        vm.param = entity;
        vm.previousState = previousState.name;
        // vm.param.configJson = $filter('json')(vm.param.config);

        $timeout(function () {
            if (vm.param.useJsonEditor) {
                // create the editor
                var container = angular.element("#jsoneditor")
                vm.editor = new JSONEditor(container[0], {
                    mode: 'view',
                    sensitiveDataLabel: vm.param.sensitiveFields.split(','),
                    enableSort: false,
                    enableTransform: false,
                    limitDragging: true,
                })
                vm.editor.set(angular.fromJson(vm.param.value))
            }
        });

        var unsubscribe = $rootScope.$on('oplusApp:paramUpdate', function (event, result) {
            vm.param = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
