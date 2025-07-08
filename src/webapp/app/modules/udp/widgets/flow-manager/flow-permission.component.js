(function () {
    'use strict';

    angular.module('oplus.udp').component('flowPermission', {
        bindings: {
            appletCode: '=appletCode'
        },
        templateUrl: 'app/modules/udp/widgets/flow-manager/flow-permission.html',
        controller: ['$scope', '$element', '$http', 'restUtils', '$state', 'messageService', 'jaoFlowService', '$translate', FlowPermissionCtrl]
    });

    FlowPermissionCtrl.$inject = ['$scope', '$element', '$http', 'restUtils', '$state', 'messageService', 'jaoFlowService', '$translate'];


    function FlowPermissionCtrl($scope, $element, $http, restUtils, $state, messageService, jaoFlowService, $translate) {
        var that = this;
        that.appModule = this.appletCode ? this.appletCode : "FLOW";
        that.showPermissionRWX = ['r','w','x'];

        that.$onInit = onInit;

        function onInit() {
            jaoFlowService.findAllFlowsByPermission(that.appModule).then(function (result) {
                that.moduleData = result;
            });
        }

        $scope.$on("assginFlow", function (event, data) {
            that.appModule = data;
            onInit();
        });
    }
})();
